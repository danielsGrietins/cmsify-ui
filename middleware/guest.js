export default async function guest({to, from, next, store}) {
    store.commit('setIsLoggedIn');
    const isLoggedIn = store.state.user.loggedIn;

    if (isLoggedIn && from.name !== 'admin') {
        return next({name: 'admin'});
    }

    return next();
}
