import $axios from './../../plugins/axios';

export default {
    state: {
        user: null,
        token: localStorage.getItem('token'),
        loggedIn: false
    },
    actions: {
        async logout({commit}) {
            commit('logout')
        },
        async getUser({commit}) {
            const token = localStorage.getItem('token')

            const {data} = await $axios({
                method: 'get',
                url: 'profile',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            commit('updateUser', data)
        }
    },
    mutations: {
        updateUser(state, user) {
            state.user = user
        },
        setIsLoggedIn(state) {
            const loginTimestamp = localStorage.getItem('loginTimestamp');
            const token = localStorage.getItem('token');
            let expires = localStorage.getItem('loginExpires');
            const currentTime = new Date();

            if (!token || !expires || !loginTimestamp || loginTimestamp === 'undefined' || token === 'undefined' || expires === 'undefined') {
                state.loggedIn = false;
                return;
            }

            expires = parseInt(expires) / 60 / 60;
            let expirationTime = new Date(parseInt(loginTimestamp));
            expirationTime.setHours(expirationTime.getHours() + expires);

            if (expirationTime < currentTime) {
                localStorage.removeItem('token');
                localStorage.removeItem('loginTimestamp');
                localStorage.removeItem('loginExpires');

                state.loggedIn = false;
                return;

            }

            state.loggedIn = true;
            return;

        },
        setNewToken(state, token) {
            state.token = token;
            $axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        },
        logout(state) {
            $axios({
                method: 'post',
                url: 'logout',
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            });

            localStorage.removeItem('token');
            localStorage.removeItem('loginTimestamp');
            localStorage.removeItem('loginExpires');
        }
    }
}

