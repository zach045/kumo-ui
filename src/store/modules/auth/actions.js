import axios from 'axios';
import router from '../../../router';

const url = 'http://localhost:4000/api/users';

function getAuthErrorMessage(error, action) {
  if (!error?.response) {
    return 'We couldn’t connect to Kumo. Make sure the API is running, then try again.';
  }

  const status = error.response.status;
  const serverMessage = error.response.data?.message;

  if (action === 'login' && (status === 401 || status === 403)) {
    return 'The email or password you entered is incorrect.';
  }

  if (action === 'register' && status === 409) {
    return 'An account with this email already exists. Try logging in instead.';
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

export default {
  async register({ commit }, { name, email, password }) {
    commit('SET_AUTH_ERROR', null);

    try {
      const response = await axios.post(
        url + '/register',
        { name, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      commit('SET_TOKEN', response.data.token);
      return { success: true };
    } catch (error) {
      const message = getAuthErrorMessage(error, 'register');
      commit('SET_AUTH_ERROR', message);
      return { success: false, error: message };
    }
  },

  async login({ commit, dispatch }, { email, password }) {
    commit('SET_AUTH_ERROR', null);

    try {
      const response = await axios.post(
        url + '/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      commit('SET_TOKEN', response.data.token);
      await dispatch('fetchUser');
      return { success: true };
    } catch (error) {
      const message = getAuthErrorMessage(error, 'login');
      commit('SET_AUTH_ERROR', message);
      return { success: false, error: message };
    }
  },

  async googleLogin({ commit, dispatch }, token) {
    commit('SET_AUTH_ERROR', null);

    try {
      const response = await axios.post(
        url + '/google-login',
        { token },
        { headers: { 'Content-Type': 'application/json' } }
      );

      commit('SET_TOKEN', response.data.token);
      await dispatch('fetchUser');
      return { success: true };
    } catch (error) {
      const message = getAuthErrorMessage(error, 'login');
      commit('SET_AUTH_ERROR', message);
      return { success: false, error: message };
    }
  },

  async autoLogin({ commit }) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('auth_user');

    if (token && user) {
      commit('SET_TOKEN', token);
    }
  },

  async fetchUser({ commit, state, dispatch }) {
    if (!state.token) return;

    try {
      const response = await axios.get(url + '/protected', {
        headers: { Authorization: `Bearer ${state.token}` }
      });

      commit('SET_USER', response.data.user ?? null);
      await dispatch('fetchInsights');
    } catch (error) {
      const message = getAuthErrorMessage(error, 'login');
      console.error('Error fetching user:', error);
      commit('CLEAR_TOKEN');
      commit('SET_AUTH_ERROR', message);
    }
  },

  logout({ commit }) {
    commit('CLEAR_TOKEN');
    commit('CLEAR_SITE');
    router.push('/');
  }
};
