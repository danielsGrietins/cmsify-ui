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
        async getUser({commit}, value) {
            // console.log(1233444);
            // const token = localStorage.getItem('token')
            // let { data } = await this.$axios.get('profile', {
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // })
            //
            // sessionStorage.setItem('user', JSON.stringify(data.data))
            // commit('updateUser', data.data)
            // return data.data
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
                localStorage.removeItem('user');

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
            localStorage.removeItem('user');
        }
    }
}

