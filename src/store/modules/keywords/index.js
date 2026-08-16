import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
  state: {
    keywords: [],
    isLoading: false,
    error: null,
  },
  getters,
  mutations,
  actions,
};
