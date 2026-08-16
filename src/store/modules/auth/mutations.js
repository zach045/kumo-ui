export default {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_AUTH_ERROR(state, error) {
    state.authError = error;
  },
};
