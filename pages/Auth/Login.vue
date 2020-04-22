<template>
    <div class="container login-container text-center">
        <h3 class="mb-5">Cmsify</h3>
        <div class="row h-100 justify-content-center">
            <div class="col-md-6 login-form">
                <div class="col-md-12 mt-3 mb-5 text-center">
                    <h4>Login</h4>
                </div>

                <div class="alert alert-danger" v-if="message">
                    {{ message }}
                </div>
                <form @submit.prevent="login" method="post">
                    <div class="form-group">
                        <i class="fa fa-user"></i>
                        <input type="email"
                               name="email"
                               v-model="email"
                               class="form-control"
                               placeholder="Email*"
                               required="required">
                    </div>
                    <div class="form-group">
                        <i class="fa fa-lock"></i>
                        <input type="password"
                               name="password"
                               v-model="password"
                               class="form-control"
                               placeholder="Password*"
                               required="required">
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary btn-block btn-lg" :disabled="isLoading">
                            <b-spinner label="Spinning" v-if="isLoading"></b-spinner>
                            <template v-if="!isLoading">
                                Login
                            </template>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isLoading: false,
                email: null,
                password: null,
                message: null
            };
        },
        methods: {
            async login() {
                this.isLoading = true;
                this.message = null;
                try {
                    let {data} = await this.$axios.post('/login', {
                        email: this.email,
                        password: this.password
                    });

                    this.$store.commit('setNewToken', data.access_token);
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('loginTimestamp', new Date().getTime());
                    localStorage.setItem('loginExpires', data.expires_in);
                    localStorage.setItem('user', data.user);
                    this.$store.commit('setIsLoggedIn');
                    this.isLoading = false;

                    await this.$router.push({name: 'admin'});
                } catch (e) {
                    this.isLoading = false;
                    const response = e.response;

                    if (response === undefined) {
                        return;
                    }

                    if (response.status !== undefined && response.status === 422) {
                        this.message = response.data.message;
                    }
                }
            }
        }
    }
</script>

<style>
    .login-container {
        margin-top: 5%;
        margin-bottom: 5%;
    }

    .login-container .login-form {
        padding: 5%;
        box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 9px 26px 0 rgba(0, 0, 0, 0.19);
    }
</style>
