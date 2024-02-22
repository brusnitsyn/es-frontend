<script setup lang="ts">
import type {ColumnFiltersState, SortingState, VisibilityState,} from '@tanstack/vue-table'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable
} from '@tanstack/vue-table'
import {useDateFormat} from '@vueuse/core'
import {format} from 'date-fns'
import {ru} from 'date-fns/locale'


import {cn} from '@/utils'
import {Calendar as CalendarIcon} from 'lucide-vue-next'
import CustomCell from '@/components/Cell.vue'
import AuditoryHeader from "@/components/AuditoryHeader.vue"

const tableStore = useTableStore()
const { selectedTableFilling, isSelectedTableFilling, selectedTableFillingType } = storeToRefs(tableStore)

const columnHelper = createColumnHelper()

const { data: corpuses } = await useFetch('http://127.0.0.1:8000/api/corpus')
const selectedCorpus = ref('1')

const { data: defaultTableData, error: defaultTableDataError } = await useAsyncData(
  'defaultTableData',
  () => $fetch(`http://127.0.0.1:8000/api/table/default`)
)

const { data: auditories, error: auditoriesError } = await useAsyncData<{data:[]}>(
  'auditories',
  () => $fetch(`http://127.0.0.1:8000/api/audiences`, {
    params: {
      "filter[corpus_id]": selectedCorpus.value
    }
  }), {
  watch: [
    selectedCorpus,
  ]
}
)

const getNextWork = (date: Date) => {
  let day = date.getDay(), add = 0
  if (day === 0) {
    add = 1
    date.setDate(date.getDate() + add)
  }

  return date;
};

const date = ref<Date>(getNextWork(new Date()))
const textDay = computed(() => useDateFormat(date.value, 'dddd'))
const queryDate = computed(() => format(date.value, "y-MM-dd"))
const disabledDates = ref([
  {
    repeat: {
      weekdays: [1],
    },
  },
]);

const { data: tableData, error: tableError } = await useAsyncData(
  'table',
  () => $fetch(`http://127.0.0.1:8000/api/table`, {
    params: {
      date: queryDate.value,
    }
  }), {
  watch: [
    date,
  ]
}
)

const isOpenedFillableDialog = ref(false)

const columns = ref([])

const getDefaultColumns = () => {
  const auditoryColumns = auditories.value?.data.map((item: object) => {
    return columnHelper.accessor(item.number, {
      header: h(AuditoryHeader, { auditory: item }),
      footer: props => props.column.id,
      cell: props => h(CustomCell, { item: item, cell: props.cell.getValue(), row: props.row, date: queryDate.value }),
    })
  })

  const defaultColumns = [
    {
      accessorKey: 'position',
      header: '№',
    },
    {
      accessorKey: 'interval',
      header: 'Время'
    },
  ]

  return defaultColumns.concat(auditoryColumns)
}

watch(auditories, value => {
  columns.value = getDefaultColumns()
})

const table = useVueTable({
  get data() {
    if (tableData.value.data.length !== 0) {
      return tableData.value.data
    } else {
      return defaultTableData.value.data
    }
  },
  get columns() {
    if (columns.value.length === 0) {
      columns.value = getDefaultColumns()
    }
    return columns.value
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})

definePageMeta({
    layout: 'workspace'
})
</script>

<template>
    <div class="w-full">
      <div class="flex gap-2 justify-between items-center py-4 flex-col md:flex-row">
        <div class="flex w-full md:w-auto items-center md:justify-center gap-x-2">
          <Popover>
            <PopoverTrigger as-child>
              <Button :variant="'outline'" :class="cn(
                'w-[280px] justify-start text-left font-normal',
                !date && 'text-muted-foreground',
              )">
                <CalendarIcon class="mr-2 h-4 w-4" />
                <span>{{ date ? format(date, "PPP", { locale: ru }) : "Выберите день" }}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar v-model="date" mode="date" :disabled-dates="disabledDates" />
            </PopoverContent>
          </Popover>
          <p class="text-lg shrink-0 text-start capitalize">{{ textDay }}</p>
        </div>

        <div class="flex gap-x-2 w-full max-w-sm">
          <Dialog v-model:open="isOpenedFillableDialog">
            <DialogTrigger as-child>
              <Button @click="isOpenedFillableDialog = true">
                Заполнить
              </Button>
            </DialogTrigger>
            <DialogFillableTable @close="isOpenedFillableDialog = false" />
          </Dialog>

          <Select :model-value="selectedCorpus" @update:model-value="(value) => selectedCorpus = value">
            <SelectTrigger>
              <SelectValue placeholder="Выберите корпус" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="corpus in corpuses.data" :value="corpus.id.toString()">
                  {{ corpus.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

      </div>
      <div class="rounded-md border">
        <ClientOnly>
          <Table>
            <TableHeader>
              <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                <TableHead v-for="header in headerGroup.headers" :key="header.id">
                  <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                    :props="header.getContext()" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="table.getRowModel().rows?.length">
                <TableRow v-for="row in table.getRowModel().rows" :key="row.id"
                  :data-state="row.getIsSelected() && 'selected'">
                  <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                  </TableCell>
                </TableRow>
              </template>

              <TableRow v-else>
                <TableCell class="h-24 text-center">
                  Нет данных.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ClientOnly>
      </div>

      <div v-if="isSelectedTableFilling" class="flex items-center justify-end space-x-2 py-4">
        <div class="flex-1 flex-col text-sm text-muted-foreground">
          <span>Выбрано для заполнения:</span>
          <div v-if="selectedTableFillingType === 'faculty'" class="flex items-center space-x-2">
            <div :style="[`background-color: ${selectedTableFilling.color}`]" class="w-6 h-6 border rounded-md" />
            <span class="text-black">{{ selectedTableFilling.name }} ({{ selectedTableFilling.short }})</span>
            <button @click="tableStore.$reset()">
              <Icon name="i-tabler-trash" size="16" />
            </button>
          </div>
          <div v-else class="flex items-center space-x-2">
            <div class="w-6 h-6 border rounded-md flex items-center justify-center">
              <Icon :name="selectedTableFilling.icon" :color="selectedTableFilling.icon_color" />
            </div>
            <span class="text-black">{{ selectedTableFilling.name }}</span>
            <button @click="tableStore.$reset()">
              <Icon name="i-tabler-trash" size="16" />
            </button>
          </div>
        </div>
      </div>

    </div>
</template>