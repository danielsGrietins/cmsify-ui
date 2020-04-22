<template>
    <div>
        <div class="d-flex justify-content-center mb-3" v-if="isLoading">
            <b-spinner style="width: 4rem; height: 4rem;" label="Loading..."></b-spinner>
        </div>

        <template v-if="!isLoading">
            <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>
            <b-row>
                <b-col>
                    <h2 class="w-25">Interface</h2>
                </b-col>
                <b-col>
                    <b-button variant="primary" size="sm" class="float-right mt-1">
                        <b-icon icon="plus" class="mr-1"></b-icon>
                        Create
                    </b-button>
                </b-col>
            </b-row>

            <component v-if="interface.components.length"
                       :is="component.component_name"
                       v-for="(component, index) in interface.components"
                       :key="index"
                       :data="component"
            >
            </component>
        </template>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                resource: this.$route.params.resource,
                interface: {},
                isLoading: true,
                breadcrumbs: [
                    {
                        text: 'Dashboard',
                        href: '#'
                    },
                    {
                        text: 'Articles',
                        href: '#'
                    },
                    {
                        text: 'Create',
                        active: true
                    }
                ]
            }
        },

        async created() {
            this.interface = await this.getInterface();
        },

        methods: {
            async getInterface() {
                try {
                    let apiUri = this.resource;
                    // let apiUri = this.resource + '/1/edit';
                    let {data} = await this.$axios.get(apiUri);

                    this.isLoading = false;
                    return data;
                } catch (e) {
                    this.isLoading = false;
                }
            }
        }
    }
</script>
