<template>
    <div>
        <b-row class="mb-3">
            <b-col lg="3" class="ml-auto">
                <b-form-group
                    label="Filter"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="sm"
                    label-for="filterInput"
                    class="mb-0"
                >
                    <b-input-group size="sm">
                        <b-form-input
                            v-model="filter"
                            type="search"
                            id="filterInput"
                            placeholder="Type to Search"
                            debounce="500"
                        ></b-form-input>
                    </b-input-group>
                </b-form-group>
            </b-col>
        </b-row>
        <b-table bordered
                 show-empty
                 head-variant="dark"
                 :items="items"
                 :fields="fields"
                 :busy="isLoading"
                 class="mt-3"
                 outlined
                 :sort-by.sync="sortBy"
                 :sort-desc.sync="sortDesc"
                 no-local-sorting
                 responsive
                 hover>

            <template v-slot:cell(actions)="data">
                <router-link class="btn btn-sm btn-primary" :to="{ name: 'admin.resource.edit', params:{resource: 'articles',id: 1}}">Edit</router-link>
            </template>


            <template v-slot:cell()="data" v-for="field in fields">
                <span v-html="data.value"></span>
            </template>

            <template v-slot:table-busy>
                <div class="text-center my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                </div>
            </template>

            <template v-slot:table-caption>Showing from {{ pagination.from }} to {{ pagination.to }} of {{
                pagination.total }} entries.
            </template>
        </b-table>

        <b-pagination
            class="mt-n5"
            first-number
            v-if="!isLoading"
            v-model="currentPage"
            :total-rows="pagination.total"
            :per-page="pagination.per_page"
            aria-controls="my-table"
            last-number
            align="right"
        ></b-pagination>
    </div>
</template>
<script>
    export default {
        props: ['data'],
        data() {
            return {
                filter: '',
                currentPage: this.$route.query.page ? parseInt(this.$route.query.page) : 1,
                firstLoad: true,
                resource: this.$route.params.resource,
                sortBy: '',
                sortDesc: null,
                isLoading: true,
                fields: [],
                items: [],
                pagination: {}
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            async getData() {
                try {
                    let payload = {
                        page: this.currentPage
                    };
                    if (this.sortBy) {
                        payload['sortBy'] = this.sortBy;
                        payload['sortDirection'] = this.sortDesc ? 'desc' : 'asc';
                    }

                    if (this.filter !== '') {
                        payload['filter'] = this.filter;
                    }

                    const {data} = await this.$axios.get(this.resource + '/data-table', {
                        params: payload
                    });

                    this.isLoading = false;
                    this.fields = data.columns;
                    this.pagination = data.pagination;
                    this.items = this.pagination.data;

                    if (!this.sortBy || this.sortDesc === null) {
                        this.sortBy = data.sort.column;
                        this.sortDesc = data.sort.direction;
                    }

                } catch (e) {
                    console.log('Table', e);
                }
            },
        },
        watch: {
            filter() {
                this.isLoading = true;
                this.getData();
            },
            currentPage(page) {
                this.isLoading = true;
                this.$router.push({
                    path: '/admin/' + this.resource,
                    query: {
                        page: page
                    }
                });
                this.getData();
            },
            sortBy() {
                if (this.firstLoad) {
                    return;
                }
                this.isLoading = true;
                this.getData();
            },
            sortDesc() {
                if (this.firstLoad) {
                    this.firstLoad = false;
                    return;
                }
                this.isLoading = true;
                this.getData();
            }
        }
    }
</script>
