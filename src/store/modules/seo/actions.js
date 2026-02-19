import axios from "axios";

const url = "http://localhost:4000/api/snapshots";

export default {
    async analyzeSite({commit, dispatch}, {siteUrl, siteType}) {
        const token = localStorage.getItem('token');
        commit('SET_IS_LOADING', true);
        try {
            const res = await axios.post(url, JSON.stringify({url: siteUrl, webType: siteType, tok: token}), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const { title, description, header, wordCount, issues, seo_score, suggestions} = res.data;

            let site = {
                title,
                description,
                header,
                wordCount,
                issues,
                seo_score,
                suggestions
            }

            await dispatch('fetchAllSnapshots');
            commit('SET_IS_LOADING', false);
            //fetch updated dashboard insights
            await dispatch('fetchInsights');
        } catch(error) {
            console.error('Error analyzing site: ' + error);
            commit('SET_ERROR', error);
        }
    },

    async fetchAllSnapshots({commit}) {
        const token = localStorage.getItem('token');
        
        try {
            commit('SET_IS_LOADING', true);
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const returnedData = res.data;
            const sites = [];

            returnedData.forEach(element => {
                const site = {
                    id: element.id,
                    title: element.title,
                    description: element.description,
                    header: element.header,
                    wordCount: element.word_count,
                    issues: element.issues,
                    suggestions: element.suggestions_json,
                    score: element.seo_score,
                    status: element.status,
                    url: element.url
                };
                sites.push(site);
            });
            commit('SET_SITES', sites);
            commit('SET_IS_LOADING', false);
        } catch(error) {
            console.error(`Failed to fetch user's snapshots`);
            commit('SET_ERROR', error);
        }
    },

    async deleteSnapshot({commit, dispatch}, {snapId}) {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.delete(`${url}/${snapId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const deleted = res.data;
            
            if(deleted) {
                await dispatch('fetchAllSnapshots');
            }

        } catch(error) {
            console.error('Failed to delete snapshot');
            commit('SET_ERROR', error);
        }
    },
    
    async fetchSnapshotById({ commit }, { id }) {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${url}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const snapshot = {
                    id: res.data.id,
                    title: res.data.title,
                    description: res.data.description,
                    header: res.data.header,
                    wordCount: res.data.word_count,
                    issues: res.data.issues,
                    suggestions: res.data.suggestions_json,
                    score: res.data.seo_score,
                    status: res.data.status,
                    createdAt: res.data.created_at,
                    url: res.data.url
                };
            commit('SET_SELECTED_SNAPSHOT', snapshot);
        } catch (err) {
            console.error('Failed to fetch snapshot', err);
            commit('SET_ERROR', err);
        }
    },

    async fetchInsights({ commit }) {
        const token = localStorage.getItem('token');

        try {
            const res = await axios.get(`${url}/insights`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const returnedData = res.data;
            const last_snapshot = {
                id: returnedData.last_snapshot.id,
                title: returnedData.last_snapshot.title,
                description: returnedData.last_snapshot.description,
                header: returnedData.last_snapshot.header,
                wordCount: returnedData.last_snapshot.word_count,
                issues: returnedData.last_snapshot.issues,
                suggestions: returnedData.last_snapshot.suggestions_json,
                score: returnedData.last_snapshot.seo_score,
                status: returnedData.last_snapshot.status,
                createdAt: returnedData.last_snapshot.created_at.substring(0,10)
            }
            const insight = {
                snapshotCount: returnedData.snapshot_count,
                scoreAverage: Math.round(returnedData.score_avg),
                wordCountAverage: Math.round(returnedData.word_count_avg),
                lastSnapshot: last_snapshot
            };
            commit('SET_INSIGHTS', insight);

        } catch (err) {
            console.error('Failed to fetch insights.');
            commit('SET_ERROR', err);
        }
    }

}