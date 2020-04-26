<template>
    <div>
        <b-navbar toggleable="lg" class="top-navbar">
            <b-button class="mr-3" variant="dark" @click="setNavBarState">
                <b-icon icon="layout-sidebar"></b-icon>
            </b-button>
            <b-navbar-brand href="#">Cmsify</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto mr-3">
                    <b-nav-item-dropdown right>
                        <!-- Using 'button-content' slot -->
                        <template v-slot:button-content>
                            <b-avatar variant="primary" :text="user.initials" class="mr-3"></b-avatar>

                            {{ user.name }}
                        </template>
                        <b-dropdown-item href="javascript:;" @click="logout">Sign Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <div class="wrapper">
            <!-- Sidebar  -->
            <aside :class="{active: isSidebarActive}">
                <b-nav vertical>
                    <b-nav-item :to="{ name: 'admin.dashboard' }">Dashboard</b-nav-item>
                    <template v-for="(item, index) in menuItems">
                        <b-nav-item :to="item.url"
                                    :key="index"
                                    exact
                        >{{ item.name }}
                        </b-nav-item>
                    </template>
                </b-nav>
            </aside>
            <main>
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>

<script>
    export default {

        data() {
            return {
                menuItems: [],
                isSidebarActive: this.getNavBarState(),
                user: this.getUser()
            }
        },

        created() {
            this.getMenuItems();
        },

        methods: {
            async getUser() {
                if (!this.user) {
                    await this.$store.dispatch('getUser');
                }
                this.user = this.$store.state.user.user;
            },
            async getMenuItems() {
                let {data} = await this.$axios.get('/resource-routes');

                data.forEach(this.appendMenuItem);
            },

            appendMenuItem(route) {
                this.menuItems.push({
                    name: route.name,
                    url: '/admin/' + route.url,
                });
            },
            async logout() {
                try {
                    await this.$store.dispatch('logout');
                    await this.$router.push({name: 'login'});

                } catch (e) {
                    console.log(e);
                }
            },
            getNavBarState() {
                if(localStorage.getItem('navBarState')) {
                    return localStorage.getItem('navBarState') === 'true';
                }

                return true;
            },
            setNavBarState() {
                localStorage.setItem('navBarState', !this.isSidebarActive);
                this.isSidebarActive = !this.isSidebarActive
            }
        }
    }
</script>
