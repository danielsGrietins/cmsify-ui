export default function auth({to, from, next, store}) {
    store.commit('setIsLoggedIn');
    const isLoggedIn = store.state.user.loggedIn;

    if (isLoggedIn === false && from.name !== 'login') {
        return next({name: 'login'});
    }

    return next();
}
