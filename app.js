import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes/index';
import store from './store/index';
import ScrollTo from "vue-scrollto";
import VueSimpleAlert from "vue-simple-alert";
import NProgress from "nprogress";

// plugins
import axios from './plugins/axios';


Vue.prototype.$axios = axios;


Vue.component('custom-form', require('./components/FormElements/Form').default);
Vue.component('hidden-input', require('./components/FormElements/HiddenInput').default);
Vue.component('text-input', require('./components/FormElements/TextInput').default);
Vue.component('textarea-input', require('./components/FormElements/TextareaInput').default);
Vue.component('has-many', require('./components/Relations/HasMany').default);
Vue.component('cmsify-table', require('./components/Table').default);

import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'

// Install BootstrapVue
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.use(VueRouter);
Vue.use(ScrollTo);
Vue.use(VueSimpleAlert);

let router = new VueRouter(routes);

router.beforeEach( async (to, from, next) => {
    // refresh token

    const currentTime = new Date();
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    let expires = localStorage.getItem('loginExpires');
    expires = parseInt(expires) / 60 / 60;
    let expirationTime = new Date(parseInt(loginTimestamp));
    expirationTime.setHours(expirationTime.getHours() + expires);
    if (expirationTime < currentTime) {
        localStorage.removeItem('token');
        localStorage.removeItem('loginTimestamp');
        localStorage.removeItem('loginExpires');
        localStorage.removeItem('user');

    }

    const diffMs = (expirationTime - currentTime); // milliseconds between now & Christmas
    const diffMinutes = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    if (diffMinutes <= 10 && diffMinutes > 0) {
        let {data} = await axios({
            method: 'post',
            url: 'refresh-token',
            headers: {
                Authorization: `Bearer ${store.state.user.token}`
            }
        });
        store.commit('setNewToken', data.access_token);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('loginTimestamp', new Date().getTime());
        localStorage.setItem('loginExpires', data.expires_in);
        localStorage.setItem('user', data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.user.token}`;
    }

    const middleware = to.meta.middleware;

    if (!middleware) {
        return next()
    }

    const context = {
        to,
        from,
        next,
        store
    };
    return middleware[0]({
        ...context
    });
});

router.beforeResolve((to, from, next) => {
    // If this isn't an initial page load.
    if (to.name) {
        // Start the route progress bar.
        NProgress.start();
    }
    next()
});

router.afterEach((to, from) => {
    // Complete the animation of the route progress bar.
    NProgress.done();
});

let app = new Vue({
    el: '#app',
    router: router,
    store: store,
    created() {
        const token = this.$store.state.user.token;
        if (token) {
            this.$axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }
});
