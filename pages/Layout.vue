<template>
    <div>
        <b-navbar toggleable="lg" class="top-navbar">
            <b-button class="mr-3" variant="dark" @click="isSidebarActive = !isSidebarActive">
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
                            <b-avatar variant="primary" text="DG" class="mr-3"></b-avatar>

                            Daniels Grietiņš
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

        <!--        <main class="d-flex">-->
        <!--            <aside class="w-25">-->
        <!--                <section class="mb-6">-->
        <!--                    <h6 class="text-uppercase font-weight-bold mb-4">Main menu</h6>-->
        <!--                    <ul class="list-unstyled">-->
        <!--                        <li>-->
        <!--                            <router-link :to="{ name: 'admin.dashboard' }" class="ml-2">Dashboard</router-link>-->
        <!--                        </li>-->
        <!--                        <li v-for="(item, index) in menuItems">-->
        <!--                            <router-link :to="item.url" class="ml-2" exact v-text="item.name"></router-link>-->
        <!--                        </li>-->
        <!--                    </ul>-->
        <!--                </section>-->

        <!--                <section class="mb-6">-->
        <!--                    <h6 class="text-uppercase font-weight-bold mb-4">Secondary menu</h6>-->
        <!--                    <ul class="list-unstyled">-->
        <!--                        <li>-->
        <!--                            <router-link to="#" class="ml-2">Settings</router-link>-->
        <!--                        </li>-->
        <!--                        <li>-->
        <!--                            <a href="javascript:;" class="ml-2" @click.prevent="logout">Log out</a>-->
        <!--                        </li>-->
        <!--                    </ul>-->
        <!--                </section>-->
        <!--            </aside>-->
        <!--            <div class="col-md-12">-->
        <!--                <router-view></router-view>-->
        <!--            </div>-->
        <!--        </main>-->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                menuItems: [],
                isSidebarActive: false
            }
        },

        created() {
            this.getMenuItems();
        },

        methods: {
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
            }
        }
    }
</script>
