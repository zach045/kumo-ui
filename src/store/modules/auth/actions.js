import axios from 'axios';
import router from '../../../router';

const url = 'http://localhost:4000/api/users';

export default {
    async register({ commit }, { name, email, password }) {
        try {
          const res = await axios.post(url + '/register', JSON.stringify({ name, email, password }),
          {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          commit('SET_TOKEN', res.data.token);
          commit('SET_AUTH_ERROR', null);
        } catch (error) {
          commit('SET_AUTH_ERROR', error.response.data.message || 'Registration failed');
        }
      },
      async login({ commit, state, dispatch }, { email, password }) {
        try {
          const res = await axios.post('http://localhost:4000/api/users/login',JSON.stringify({ email, password }),
          {
              headers: {
                  'Content-Type': 'application/json'
              }
          });
            commit('SET_TOKEN', res.data.token);
            commit('SET_AUTH_ERROR', null);
            //Get user info
            await dispatch('fetchUser');
          } catch (error) {
            commit('SET_AUTH_ERROR', error || 'Login failed');
          }
        },
      async googleLogin({ commit, dispatch }, token) {
        try {
          const res = await axios.post('http://localhost:4000/api/users/google-login', 
            { token },
            { headers: {'Content-Type': 'application/json'}}
          );
          commit('SET_TOKEN', token);
          commit('SET_AUTH_ERROR', null);
          await dispatch('fetchUser');
        } catch (error) {
          commit('SET_AUTH_ERROR', error.message || 'Google Sign-In failed');
        }
      },
      async autoLogin({ commit, state }) {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('auth_user');
        if(token && user) {
          store.commit('SET_TOKEN')
        }
      },
      async fetchUser({ commit, state, dispatch }) {
        if (!state.token) return;
        const token = state.token;
  
        try {
          const res = await axios.get('http://localhost:4000/api/users/protected', {
            headers: { Authorization : `Bearer ${token}` }
          });
          res.data.user == null ? user = null : commit('SET_USER', res.data.user);
          //Get dashboard insights
          await dispatch('fetchInsights');
        } catch (error) {
          console.error('Error fetching user:', error);
          commit('SET_TOKEN', null);
          commit('SET_USER', null);
          commit('SET_AUTH_ERROR', error);
          localStorage.removeItem('token');
        }
      },
      logout({ commit }) {
        commit('CLEAR_TOKEN');
        commit('SET_USER', null);
        commit('CLEAR_SITE');
        router.push('/');
      }
}
