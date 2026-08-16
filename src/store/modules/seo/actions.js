import api from '../../../services/api';

const normalizeSuggestions = (value) => {
  if (!value) return null;
  if (typeof value === 'object') return value;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const mapSnapshot = (snapshot) => ({
  id: snapshot.id,
  title: snapshot.title,
  description: snapshot.description,
  header: snapshot.header,
  wordCount: snapshot.word_count,
  issues: snapshot.issues || [],
  suggestions: normalizeSuggestions(snapshot.suggestions_json),
  score: snapshot.seo_score,
  status: snapshot.status,
  createdAt: snapshot.created_at,
  url: snapshot.url,
});

export default {
  async analyzeSite({ commit, dispatch }, { siteUrl, siteType }) {
    commit('SET_IS_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await api.post('/snapshots', {
        url: siteUrl,
        webType: siteType,
      });

      await dispatch('fetchAllSnapshots');
      await dispatch('fetchInsights');
      return { success: true, snapshot: response.data };
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'The website could not be analyzed.');
      return { success: false };
    } finally {
      commit('SET_IS_LOADING', false);
    }
  },

  async fetchAllSnapshots({ commit }) {
    commit('SET_IS_LOADING', true);

    try {
      const response = await api.get('/snapshots');
      commit('SET_SITES', response.data.map(mapSnapshot));
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch snapshots.');
      return { success: false };
    } finally {
      commit('SET_IS_LOADING', false);
    }
  },

  async deleteSnapshot({ commit, dispatch }, { snapId }) {
    try {
      await api.delete(`/snapshots/${snapId}`);
      await dispatch('fetchAllSnapshots');
      await dispatch('fetchInsights');
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to delete snapshot.');
      return { success: false };
    }
  },

  async fetchSnapshotById({ commit }, { id }) {
    try {
      const response = await api.get(`/snapshots/${id}`);
      commit('SET_SELECTED_SNAPSHOT', mapSnapshot(response.data));
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch snapshot.');
      return { success: false };
    }
  },

  async fetchInsights({ commit }) {
    try {
      const response = await api.get('/snapshots/insights');
      const data = response.data || {};
      const lastSnapshot = data.last_snapshot ? mapSnapshot(data.last_snapshot) : null;

      commit('SET_INSIGHTS', {
        snapshotCount: Number(data.snapshot_count || 0),
        scoreAverage: Math.round(Number(data.score_avg || 0)),
        wordCountAverage: Math.round(Number(data.word_count_avg || 0)),
        lastSnapshot,
      });

      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch insights.');
      return { success: false };
    }
  },
};
