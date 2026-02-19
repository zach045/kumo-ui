import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
    state: {
        sites: null,
        error: null,
        isLoading: false,
        insights: null,
        selectedSnapshot: null
    },
    getters,
    mutations,
    actions
}