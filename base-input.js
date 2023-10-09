import { computed } from 'vue';

export function baseProps(props = {}) {
    return Object.assign({
        name: String,
        label: {
            default: null,
            type: [Boolean, String],
        },
        placeholder: {
            default: null,
            type: [Boolean, String],
        }
    }, props);
}

export function baseComputed(props, formData) {
    const parsedId = computed(() => {
        return 'field-' + props.name;
    });

    const isLabelEnabled = computed(() => {
        return props.label !== false;
    });

    const parsedLabel = computed(() => {
        return props.label;
    });

    const parsedPlaceholder = computed(() => {
        if (props.placeholder === false) {
            return null;
        }

        return props.placeholder;
    });

    const fieldValue = computed({
        get() {
            return formData.value && formData.value[props.name];
        },
        // setter
        set(value) {
            formData.value[props.name] = value;
        }
    })

    return {
        parsedId,
        isLabelEnabled,
        parsedLabel,
        parsedPlaceholder,
        fieldValue
    };
}
