import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
  state: {
    keywords: [],
    analyses: {},
    isLoading: false,
    error: null,
  },
  getters,
  mutations,
  actions,
};
