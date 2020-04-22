<template>
    <div class="form-group">
        <label :for="data.element_id">{{ data.label }}</label>
        <input type="text" v-model="data.value" class="form-control"
               :class="{'is-invalid': data.error}"
               :id="data.element_id"
               @input="data.error = ''"
               v-bind="data.attributes">
        <div class="invalid-feedback" v-if="data.error">
            {{ data.error }}
        </div>
    </div>
</template>
<script>
    export default {
        props: ['data'],
    }
</script>
