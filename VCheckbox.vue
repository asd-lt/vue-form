<script setup>
import { baseComputed, baseProps } from './base-input.js';
import { inject, computed } from 'vue';

const props = defineProps(baseProps({
    switch: {
        type: Boolean,
        default: false,
    }
}));

const formData = inject('form-data');

const {
    parsedId,
    isLabelEnabled,
    parsedLabel,
    parsedPlaceholder,
    fieldValue,
} = baseComputed(props, formData);

const mainClass = computed(() => {
    const mainClass = ['form-check'];

    if (props.switch) {
        mainClass.push('form-switch');
    }

    return mainClass;
});
</script>
<template>
    <div :class="mainClass">
        <input
            v-model="fieldValue"
            class="form-check-input"
            type="checkbox"
            :name="props.name"
            :true-value="1"
            :false-value="0"
            :title="parsedLabel"
            :id="parsedId">
        <label
            v-if="isLabelEnabled"
            class="form-check-label"
            :for="parsedId">
            {{ parsedLabel }}
        </label>
    </div>
</template>
