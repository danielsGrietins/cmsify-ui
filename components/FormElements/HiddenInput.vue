<template>
    <input type="hidden" v-model="data.value" v-bind="data.attributes">
</template>
<script>
    import {mapMutations} from 'vuex';

    export default {
        props: ['data'],

        methods: {
            ...mapMutations(['saveInput']),
        },

        watch: {
            'data.value': {
                immediate: true,
                handler() {
                    this.saveInput({
                        form: this.data.form,
                        name: this.data.input_name,
                        value: this.data.value
                    });
                }
            }
        }
    }
</script>
