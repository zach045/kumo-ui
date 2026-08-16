export default {
  getKeywords: (state) => state.keywords,
  getKeywordAnalysis: (state) => (id) => state.analyses[id] || null,
  getKeywordsLoading: (state) => state.isLoading,
  getKeywordsError: (state) => state.error,
};
