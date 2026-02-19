export default {
    SET_SITES(state, siteData) {
        state.sites = siteData;
      },
    SET_ERROR(state, error) {
        state.error = error;
    },
    CLEAR_SITE(state) {
        state.siteData = null;
    },
    SET_IS_LOADING(state, val) {
        state.isLoading = val;
    },
    UPDATE_SNAPSHOT(state, updatedSnapshot) {
        const index = state.sites.findIndex(s => s.id === updatedSnapshot.id);
        if (index !== -1) {
            state.sites.splice(index, 1, updatedSnapshot);
        }
    },
    SET_INSIGHTS(state, insightData) {
        state.insights = insightData;
    },
    SET_SELECTED_SNAPSHOT(state, snapshot) {
        state.selectedSnapshot = snapshot;
    }


}