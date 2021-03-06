import InterfaceLayout from './../pages/Layout';
import Dashboard from './../pages/Dashboard';
import Login from './../pages/Auth/Login';
import Interface from "../pages/Interface";
import auth from './../middleware/auth';
import guest from './../middleware/guest';
// import NotFound from './views/NotFound';
// let NotFound = () => import(/* webpackChunkName: "not-found" */ './../pages/NotFound'); // lazy loading

export default {
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        if (to.hash) {
            return {
                selector: to.hash
            }
        }
        return {x: 0, y: 0}

    },

    linkActiveClass: 'active',

    routes: [
        {
            path: '/admin/login',
            component: Login,
            name: 'login',
            meta: {
                middleware: [guest],
            },
        },
        {
            path: '/admin',
            name: 'admin',
            // meta: { middleware: [auth] },
            redirect: {
                name: 'admin.dashboard'
            },
            component: InterfaceLayout,
            children: [
                {
                    name: 'admin.dashboard',
                    path: 'dashboard',
                    meta: {middleware: [auth]},
                    component: Dashboard
                },
                {
                    name: 'admin.resource',
                    path: ':resource', // index
                    meta: {middleware: [auth]},
                    component: Interface
                },
                {
                    name: 'admin.resource.edit',
                    path: ':resource/:id/edit', // edit
                    meta: {middleware: [auth]},
                    component: Interface
                }
            ]
        },
    ],
}
