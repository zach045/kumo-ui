import router from '../../../router';
import api from '../../../services/api';

function getAuthErrorMessage(error, action) {
  if (!error?.response) {
    return 'We couldn’t connect to Kumo. Make sure the API is running, then try again.';
  }

  const status = error.response.status;
  const serverMessage = error.response.data?.message;

  if (status === 429) {
    return serverMessage || 'Too many attempts. Please wait before trying again.';
  }

  if (action === 'login' && (status === 401 || status === 403)) {
    return serverMessage || 'The email or password you entered is incorrect.';
  }

  if (action === 'register' && status === 409) {
    return serverMessage || 'An account with this email already exists. Try logging in instead.';
  }

  if (status === 400 && serverMessage) {
    return serverMessage;
  }

  if (status >= 500) {
    return 'Kumo is having trouble right now. Please try again in a moment.';
  }

  return serverMessage || (
    action === 'register'
      ? 'We couldn’t create your account. Please check your information and try again.'
      : 'We couldn’t log you in. Please try again.'
  );
}

const establishAuthenticatedUser = (commit, response) => {
  const user = response.data?.user || null;
  commit('SET_USER', user);
  return user;
};

export default {
  async register({ commit }, { name, email, password }) {
    commit('SET_AUTH_ERROR', null);

    try {
      const response = await api.post('/users/register', { name, email, password });
      establishAuthenticatedUser(commit, response);
      return { success: true };
    } catch (error) {
      const message = getAuthErrorMessage(error, 'register');
      commit('SET_AUTH_ERROR', message);
      return { success: false, error: message };
    }
  },

  async login({ commit }, { email, password }) {
    commit('SET_AUTH_ERROR', null);

    try {
      const response = await api.post('/users/login', { email, password });
      establishAuthenticatedUser(commit, response);
      return { success: true };
    } catch (error) {
      const message = getAuthErrorMessage(error, 'login');
      commit('SET_AUTH_ERROR', message);
      return { success: false, error: message };
    }
  },

  async googleLogin({ commit }, token) {
    commit('SET_AUTH_ERROR', null);

    try {
      const response = await api.post('/users/google-login', { token });
      establishAuthenticatedUser(commit, response);
      return { success: true };
    } catch (error) {
      const message = getAuthErrorMessage(error, 'login');
      commit('SET_AUTH_ERROR', message);
      return { success: false, error: message };
    }
  },

  async fetchUser({ commit }) {
    try {
      const response = await api.get('/users/protected');
      commit('SET_USER', response.data.user ?? null);
      commit('SET_AUTH_ERROR', null);
      return { success: true };
    } catch (error) {
      commit('SET_USER', null);

      if (error.response?.status !== 401) {
        const message = getAuthErrorMessage(error, 'login');
        commit('SET_AUTH_ERROR', message);
      }

      return { success: false };
    }
  },

  async logout({ commit }) {
    try {
      await api.post('/users/logout');
    } finally {
      commit('SET_USER', null);
      commit('CLEAR_SITE');
      router.push('/');
    }
  },
};
