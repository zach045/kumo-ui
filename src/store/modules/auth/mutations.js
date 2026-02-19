export default {
    SET_TOKEN(state, token) {
        state.token = token;
        localStorage.setItem('token', token);
      },
      CLEAR_TOKEN(state) {
        state.token = null;
        localStorage.removeItem('token');
        state.user = null;
        localStorage.removeItem('auth_user');
      },
      SET_USER(state, user) {
        state.user = user;
        localStorage.setItem('auth_user', user)

      },
      SET_AUTH_ERROR(state, error) {
        state.authError = error;
      }
}