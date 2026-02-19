import { createStore } from 'vuex';
import authModule from './modules/auth/index';
import seoModule from './modules/seo/index';

const store = createStore({
    modules: {
        authModule,
        seoModule
    },
    state: {
        collapsed: true
    },
    getters: {
        getCollapsed(state) {
            return state.collapsed;
        }
    },
    mutations: {
        toggleCollapsed(state) {
            state.collapsed = !state.collapsed;
        }
    },
    actions: {
        toggleCollapsed(context) {
            context.commit('toggleCollapsed');
        }
    }
});

export default store;