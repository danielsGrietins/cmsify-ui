<template>
    <div class="form-group">
        <label :for="data.input_name">{{ data.label }}</label>
        <textarea v-model="data.value" class="form-control" v-bind="data.attributes"></textarea>
    </div>
</template>
<script>

    export default {
        props: ['data'],
    }
</script>
