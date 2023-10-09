<script setup>
import ErrorMessage from './ErrorMessage.vue';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import { baseProps, baseComputed } from './base-input.js';
import vClickOutside from './click-outside.js';

const refSearchField = ref(null);
const refSearchPlaceholder = ref(false);
const isSearchBlockVisible = ref(false);
const searchString = ref(null);
const searchResults = ref([]);
const selectedItem = reactive({});

const fieldError = ref(null);
const formData = inject('form-data');

const props = defineProps(baseProps({
    keyId: {
        default: 'id',
        type: [String],
    },
    keyName: {
        default: 'name',
        type: [String],
    },
    url: {
        default: null,
        type: [String],
    },
    isStatic: {
        default: false,
        type: [Boolean],
    },
    options: {
        default: [],
        type: [Array],
    },
}));

const {
    parsedId,
    isLabelEnabled,
    parsedLabel,
    parsedPlaceholder,
    fieldValue
} = baseComputed(props, formData);

const parsedFieldClass = computed(() => {
    const parsedFieldClass = ['form-select'];

    if (fieldError.value && fieldError.value.hasError) {
        parsedFieldClass.push('is-invalid');
    }

    return parsedFieldClass;
});

const parsedValue = computed(() => {
    if (!fieldValue.value) {
        return parsedPlaceholder.value;
    } else {
        return (selectedItem.value && selectedItem.value[props.keyName]) || fieldValue.value;
    }
});

const searchValues = computed(() => {
    return filterResults(searchString.value);
});

onMounted(() => {
    queryResults().then(() => {
        if (fieldValue.value) {
            const item = findItemByKey(fieldValue.value);
            if (item) {
                selectItem(item);
            }
        }
    });
});

function queryResults(query = null) {
    if (props.isStatic && searchResults.value.length) {
        return filterResults(query)
    } else {
        return axios.get(props.url, {params: {query}}).then((response) => {
            if (props.isStatic) {
                searchResults.value = response.data;
                return filterResults(query)
            } else {
                return response.data;
            }
        });
    }
}

function filterResults(query) {
    return searchResults.value.filter((item) => {
        return query ? item[props.keyName].toLowerCase().includes(query.toLowerCase()) : true;
    });
}

function findItemByKey(query) {
    const results = searchResults.value.filter((item) => {
        return query ? item[props.keyName].toLowerCase().includes(query.toLowerCase()) : true;
    });

    return results.length ? results[0] : null;
}

function selectItem(item) {
    selectedItem.value = item;
    fieldValue.value = item[props.keyId];
    hideSearch();
}

function toggleSearch() {
    if (isSearchBlockVisible.value) {
        hideSearch();
    } else {
        showSearch();
    }
}

function hideSearch() {
    isSearchBlockVisible.value = false;
    searchString.value = null;
}

function showSearch() {
    isSearchBlockVisible.value = true;
    setTimeout(() => {
        refSearchField.value.focus();
    }, 50);
}

function clickOutside(e) {
    if (isSearchBlockVisible.value && !refSearchPlaceholder.value.contains(e.target)) {
        hideSearch();
    }
}

</script>
<template>
    <div class="mb-3">
        <input
            type="hidden"
            :name="props.name"
            v-model="fieldValue"
            :id="parsedId"
        />
        <label
            v-if="isLabelEnabled"
            class="form-label"
            :htmlFor="parsedId">
            {{ parsedLabel }}
        </label>
        <div
            ref="refSearchPlaceholder"
            :class="parsedFieldClass"
            @click="toggleSearch">
            {{ parsedValue || '&nbsp;' }}
        </div>
        <div
            v-click-outside="clickOutside"
            class="search-block shadow-sm"
            :class="{'search-block--visible': isSearchBlockVisible}">
            <ul class="list-group">
                <li class="search-box list-group-item px-2" aria-current="true">
                    <input
                        v-model="searchString"
                        ref="refSearchField"
                        type="text"
                        class="form-control"
                        placeholder="Search ...">
                </li>
                <li
                    v-for="item in searchValues"
                    class="list-group-item list-group-item-action"
                    @click="selectItem(item)">
                    {{ item[props.keyName] }}
                </li>
            </ul>
        </div>

        <ErrorMessage
            ref="fieldError"
            :name="props.name"
        />
    </div>
</template>
<style lang="scss">
.search-block {
    position: absolute;
    max-height: 200px;
    overflow-x: hidden;
    overflow-y: auto;
    display: none;
    border-radius: 6px;

    &--visible {
        display: block;
    }
}

.search-box {
    position: sticky;
    top: 0;
    z-index: 10;
}
</style>
