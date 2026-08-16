import api from '../../../services/api';

const errorMessage = (error, fallback) =>
  error.response?.data?.message ||
  (error.code === 'ECONNABORTED'
    ? 'The keyword request timed out. Please try again.'
    : fallback);

export default {
  async fetchKeywords({ commit }, filters = {}) {
    commit('SET_KEYWORDS_LOADING', true);
    commit('SET_KEYWORDS_ERROR', null);

    try {
      const response = await api.get('/keywords', { params: filters });
      commit('SET_KEYWORDS', response.data || []);
      return { success: true };
    } catch (error) {
      const message = errorMessage(error, 'Failed to load tracked keywords.');
      commit('SET_KEYWORDS_ERROR', message);
      return { success: false, message };
    } finally {
      commit('SET_KEYWORDS_LOADING', false);
    }
  },

  async createKeyword({ commit }, keyword) {
    commit('SET_KEYWORDS_ERROR', null);

    try {
      const response = await api.post('/keywords', keyword);
      commit('ADD_KEYWORD', response.data);
      return { success: true, keyword: response.data };
    } catch (error) {
      const message = errorMessage(error, 'Failed to track the keyword.');
      commit('SET_KEYWORDS_ERROR', message);
      return { success: false, message };
    }
  },

  async updateKeyword({ commit }, { id, changes }) {
    commit('SET_KEYWORDS_ERROR', null);

    try {
      const response = await api.patch(`/keywords/${id}`, changes);
      commit('UPDATE_KEYWORD', response.data);
      return { success: true, keyword: response.data };
    } catch (error) {
      const message = errorMessage(error, 'Failed to update the keyword.');
      commit('SET_KEYWORDS_ERROR', message);
      return { success: false, message };
    }
  },

  async deleteKeyword({ commit }, id) {
    commit('SET_KEYWORDS_ERROR', null);

    try {
      await api.delete(`/keywords/${id}`);
      commit('REMOVE_KEYWORD', id);
      return { success: true };
    } catch (error) {
      const message = errorMessage(error, 'Failed to delete the keyword.');
      commit('SET_KEYWORDS_ERROR', message);
      return { success: false, message };
    }
  },
};
