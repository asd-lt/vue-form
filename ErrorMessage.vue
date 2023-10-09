<script setup>

import { computed, defineExpose, inject } from 'vue';

const formErrors = inject('form-errors');

const props = defineProps({
    name: String,
})

const hasError = computed(() => {
    return formErrors.value && formErrors.value.errors && formErrors.value.errors[props.name] && formErrors.value.errors[props.name].length;
});

const parsedErrorMessage = computed(() => {
    return formErrors.value.errors[props.name][0];
});

defineExpose({hasError});

</script>
<template>
    <div class="invalid-feedback" v-if="hasError">
        {{ parsedErrorMessage }}
    </div>
</template>
