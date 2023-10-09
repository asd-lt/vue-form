<script setup>
import ErrorMessage from './ErrorMessage.vue';
import { computed, inject, onMounted, ref } from 'vue';
import { baseProps, baseComputed } from './base-input.js';

const fieldError = ref(null);
const formData = inject('form-data');

const props = defineProps(baseProps({
    type: String,
}));

const {
    parsedId,
    isLabelEnabled,
    parsedLabel,
    parsedPlaceholder,
    fieldValue
} = baseComputed(props, formData);

const parsedType = computed(() => {
    return props.type || 'text';
});

const parsedFieldClass = computed(() => {
    const parsedFieldClass = ['form-control'];

    if (fieldError.value && fieldError.value.hasError) {
        parsedFieldClass.push('is-invalid');
    }

    return parsedFieldClass;
});

</script>
<template>
    <div>
        <label
            v-if="isLabelEnabled"
            class="form-label"
            :htmlFor="parsedId">
            {{ parsedLabel }}
        </label>
        <input
            :type="parsedType"
            :name="props.name"
            v-model="fieldValue"
            :class="parsedFieldClass"
            :id="parsedId"
            :placeholder="parsedPlaceholder"/>
        <ErrorMessage
            ref="fieldError"
            :name="props.name"
        />
    </div>
</template>
