export default {
    isAuthenticated: state => !!state.token,
    getUser: state => state.user,
    getAuthError: state => state.authError,
    getToken: state => state.token
}