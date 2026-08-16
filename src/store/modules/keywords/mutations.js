export default {
  SET_KEYWORDS(state, keywords) {
    state.keywords = keywords;
  },
  ADD_KEYWORD(state, keyword) {
    state.keywords.unshift(keyword);
  },
  UPDATE_KEYWORD(state, keyword) {
    const index = state.keywords.findIndex((item) => item.id === keyword.id);
    if (index !== -1) state.keywords.splice(index, 1, keyword);
  },
  REMOVE_KEYWORD(state, id) {
    state.keywords = state.keywords.filter((keyword) => keyword.id !== id);
    const analyses = { ...state.analyses };
    delete analyses[id];
    state.analyses = analyses;
  },
  SET_KEYWORD_ANALYSIS(state, { id, analysis }) {
    state.analyses = { ...state.analyses, [id]: analysis };
  },
  SET_KEYWORDS_LOADING(state, value) {
    state.isLoading = value;
  },
  SET_KEYWORDS_ERROR(state, error) {
    state.error = error;
  },
};
