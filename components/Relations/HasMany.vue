<template>
    <div>
        <h2 v-html="this.data.name"></h2>
        <template v-for="(item, itemIndex) in data.items" v-if="!item.config.is_deleted">
            <div class="row">
                <div class="col-md-12">
                    <div class="float-left">
                        <h3>{{ getEntryLabel(item) }}</h3>
                    </div>
                    <button class="btn btn-sm btn-danger float-right" @click.prevent="deleteItem(item)">Delete</button>
                    <button class="btn btn-sm btn-primary mr-1 float-right" @click.prevent="toggleVisibility(item)"
                            v-html="item.config.is_visible ? 'Hide' : 'Show'"></button>
                </div>
            </div>

            <transition-group name="slide">
                <template v-if="item.components.length && item.config.is_visible">
                    <component
                        :is="component.component_name"
                        v-for="(component, index) in item.components"
                        :key="itemIndex + '_' + index"
                        :data="component"
                    >
                    </component>
                </template>
            </transition-group>
            <hr>
        </template>
        <button class="btn btn-primary mb-1" @click.prevent="addItem">Add</button>

    </div>
</template>
<script>
    export default {
        props: ['data'],

        methods: {
            async deleteItem(item) {
                let deleteModal = await this.$fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                });

                if (deleteModal.value) {
                    item.config.is_deleted = true;
                    item.components.filter(component => {
                        if(component.input_name === 'delete') {
                            component.value = 1;
                        }
                    });
                }

            },
            addItem() {
                let template = JSON.parse(JSON.stringify(this.data.template));
                template.components.forEach(component => {
                    this.setComponentId(component);
                });

                this.data.items.push(template);

                setTimeout(() => {
                    template.config.is_visible = true;
                }, 100);
            },
            setComponentId(component) {
                const entryId = this.data.items.length;
                const inputName = component.full_input_name;
                const elementId = component.element_id;

                component.full_input_name = inputName.replace('_ID_', entryId);
                component.element_id = elementId.replace('_ID_', entryId);
            },
            toggleVisibility(item) {
                item.config.is_visible = !item.config.is_visible;
            },
            getEntryLabel(item) {
                const entryLabelInput = item.components.filter(component => {
                    return component.input_name == item.config.entry_label;
                });

                if (entryLabelInput.length && entryLabelInput[0].value) {
                    return entryLabelInput[0].value
                }

                return 'Entry';
            }
        }
    }
</script>
