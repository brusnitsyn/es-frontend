import { defineStore } from 'pinia'
export const useTableStore = defineStore('table', () => {
    const selectedTableFilling = ref<object|null>(null)
    const isSelectedTableFilling = computed(() => selectedTableFilling.value !== null)
    const selectedTableFillingType = ref<string|null>(null)

    function $reset() {
        selectedTableFilling.value = null
        selectedTableFillingType.value = null
    }

    return {
        selectedTableFilling,
        isSelectedTableFilling,
        selectedTableFillingType,
        $reset,
    }
})