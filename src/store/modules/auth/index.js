import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
    state: {
        token: null,
        user: null,
        authError: null,
        //didAutoLogout: false
    },
    getters,
    mutations,
    actions
}