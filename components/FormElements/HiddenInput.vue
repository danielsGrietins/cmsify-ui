<template>
    <input type="hidden" v-model="data.value" v-bind="data.attributes">
</template>
<script>
    export default {
        props: ['data'],
    }
</script>
