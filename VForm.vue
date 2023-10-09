<script setup>
import { computed, defineExpose, provide, reactive, ref, onMounted } from 'vue';

const emit = defineEmits([
    'response',
    'loading',
    'update:modelValue',
])

const props = defineProps({
    action: String,
    method: String,
    modelValue: {
        type: [Object],
        default: () => {
            return reactive({});
        },
    },
});

const isLoading = ref(false);

const formData = computed({
    get: () => {
        return props.modelValue;
    },
    set: (value) => {
        emit('update:modelValue', value);
    }
});

provide('form-data', formData);

const formErrors = reactive({});
provide('form-errors', formErrors);

const formHasError = computed(() => {
    return formErrors.value && formErrors.value.errors && Object.keys(formErrors.value.errors).length;
});

const formClass = computed(() => {
    const formClass = [];

    if(isLoading.value) {
        formClass.push('is-loading');
    }

    if(formHasError.value) {
        formClass.push('needs-validation');
    }

    return formClass;
});

function startLoading() {
    isLoading.value = true;
    emit('loading', true);
}

function stopLoading() {
    isLoading.value = false;
    emit('loading', false);
}

function submitForm() {
    startLoading();
    formErrors.value = {};
    if(props.method) {
        formData.value._method = props.method;
    }
    axios.post(props.action, formData.value).then((response) => {
        emit('response', response.data);
    }, (error) => {
        if(error.response.data && error.response.data.errors) {
            formErrors.value = error.response.data;
        }
    }).finally(() => {
        stopLoading();
    });
}

function setData(data) {
    formData.value = data;
}

defineExpose({setData, formData});

</script>
<template>
    <form
        :class="formClass"
        :action="props.action"
        @submit="submitForm">
        <slot :submit-form="submitForm" :form-data="formData"></slot>
    </form>
</template>
