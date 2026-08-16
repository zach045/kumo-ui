export default {
  isAuthenticated: (state) => Boolean(state.user),
  getUser: (state) => state.user,
  getAuthError: (state) => state.authError,
};
