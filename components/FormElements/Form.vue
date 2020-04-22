<template>
    <form :action="data.url" :method="data.method" @submit.prevent="submit">
        <div class="alert alert-danger" v-if="Object.keys(alertErrors).length">
            <span v-for="(error, index) in alertErrors" v-html="error[0]">
                {{ error[0] }} <br v-if="index !== 0">
            </span>
        </div>
        <component v-if="data.components.length"
                   :is="component.component_name"
                   v-for="(component, index) in data.components"
                   :key="index"
                   :data="component"
        >
        </component>

        <div class="form-group" v-if="data.has_submit_button">
            <button class="btn btn-success">
                Save
            </button>
        </div>
    </form>
</template>
<script>
    import {mapState} from 'vuex';

    export default {
        props: ['data'],

        data() {
            return {
                workerList: {
                    'has-many': 'hasManyWorker'
                },
                preparedFormData: [],
                hasShownErrorMessage: false,
                alertErrors: {},
                scrollToElement: null
            }
        },

        computed: {
            ...mapState({
                forms: state => state.form.forms
            }),
        },

        methods: {
            async submit() {
                this.hasShownErrorMessage = false;
                this.alertErrors = {};

                try {
                    let preparedData = this.prepareData(this.data.components);
                    await axios({
                        method: this.data.method,
                        url: this.data.url,
                        data: preparedData
                    });

                } catch (e) {
                    const response = e.response;
                    if (response.status === 422) {
                        const errors = response.data.errors;
                        this.addErrorMessages(errors, this.data.components);

                        this.alertErrors = errors;

                        if(Object.keys(this.alertErrors).length) {
                            setTimeout(() => {
                                this.$scrollTo('.alert-danger', 500, {
                                    offset: -5
                                });
                            }, 100);

                            return;
                        }

                        if(this.scrollToElement) {
                            setTimeout(() => {
                                this.$scrollTo('#' + this.scrollToElement, 500, {
                                    offset: -35
                                });
                            }, 100);
                        }
                    }
                }
            },
            addErrorMessages(errors, components, config = null) {
                components.forEach(component => {
                    if (component.component_name === 'has-many') {
                        component.items.forEach(entry => {
                            this.addErrorMessages(errors, entry.components, entry.config);
                        });
                        return;
                    }

                    let inputErrors = errors[component.full_input_name];
                    if (inputErrors !== undefined) {

                        if (config) {
                            config.is_visible = true;
                        }
                        if (!this.hasShownErrorMessage) {
                            this.hasShownErrorMessage = true;
                            this.scrollToElement = component.element_id;
                        }
                        component.error = inputErrors[0];

                        delete errors[component.full_input_name];
                    }
                });
            },
            prepareData(data) {
                let preparedData = [];

                data.forEach(component => {
                    const workerName = this.workerList[component.component_name];
                    if (workerName !== undefined) {
                        prepared = this[workerName](component);
                        preparedData.push(prepared);

                        return;
                    }
                    let prepared = {
                        name: component.component_name,
                        input_name: component.input_name,
                        value: component.value,
                    };

                    preparedData.push(prepared);
                });

                return preparedData;
            },

            hasManyWorker(component) {
                let prepared = {
                    name: component.component_name,
                    relation: component.relation_name,
                };

                let preparedItems = [];
                component.items.forEach(item => {
                    preparedItems.push(this.prepareData(item.components));
                });

                prepared['entries'] = preparedItems;

                return prepared;
            }
        }
    }
</script>
