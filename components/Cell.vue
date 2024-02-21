<script setup lang="ts">
const props = defineProps({
    item: Object,
    cell: Object,
    row: Object,
    date: String
})

const tableStore = useTableStore()
const { selectedTableFilling, isSelectedTableFilling, selectedTableFillingType } = storeToRefs(tableStore)

const color = computed(() => [
  props.cell?.isFaculty ? `border-color: ${props.cell?.faculty.color}` : 'border-color: transparent'
])

const isSheetOpen = ref(false)
const audienceFeature = ref(null)

const cellNotUndefined = computed(() => typeof props.cell !== 'undefined')

const openSheet = async () => {
  const { data, error: audienceFeatureError } = await useAsyncData(
    'audienceFeature',
    () => $fetch(`http://127.0.0.1:8000/api/audiences/feature`, {
      params: {
        audienceId: props.item?.id,
      }
    })
  )
  audienceFeature.value = data.value
  isSheetOpen.value = true
}
const addActivityToAudience = async () => {

  if (isSelectedTableFilling.value === false) {
    await openSheet()
    return
  }

  const audience = props.item
  const position = props.row.original
  const date = props.date

  let bodyCell = {
    'fill_type': selectedTableFillingType.value,
    'audience_id': audience.id,
    'base_table_content_id': position.id,
    'date': date,
  }

  if (selectedTableFillingType.value === 'faculty') {
    bodyCell = Object.assign(bodyCell, {
      'faculty_id':  selectedTableFilling.value.id
    }) // вообще должна быть 1 колонка в БД
  } else if (selectedTableFillingType.value === 'another') {
    bodyCell = Object.assign(bodyCell, {
      'table_another_fill_id':  selectedTableFilling.value.id
    }) // вообще должна быть 1 колонка в БД
  } else if (selectedTableFillingType.value === 'event') {
    bodyCell = Object.assign(bodyCell, { 'event': selectedTableFilling.value.event, 'table_another_fill_id':  selectedTableFilling.value.id }) // вообще должна быть 1 колонка в БД
  }

  await useAsyncData(
    'createdActivityAudience',
    () => $fetch(`http://127.0.0.1:8000/api/table`, {
      method: "POST",
      body: bodyCell
    }).then(() => {
      refreshNuxtData('table') // re-fetch key 'table'
    })
  )
}
</script>

<template>
  <div class="w-auto h-10 flex items-center justify-center border select-none" :style="[ color ]" @click="addActivityToAudience()">
    <div v-if="cellNotUndefined">
      <p v-if="cell.isFaculty" class="max-w-[45px] text-wrap leading-4">{{ cell?.faculty?.short }}</p>
      <Icon v-else-if="cell.isAnother" :name="cell.fill_type.icon" :color="cell.fill_type.icon_color" size="22" />
    </div>
  </div>
  <Sheet v-model:open="isSheetOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>
          <div class="flex flex-col items-start">
            {{ item.title }}
            <span class="font-normal text-sm p-1.5 bg-gray-100 rounded-md leading-3">{{ row.original.interval }}</span>
          </div>
        </SheetTitle>
        <SheetDescription>
          <div v-if="audienceFeature" class="flex flex-col gap-y-1.5">
            <div v-if="cell?.isFaculty">
              Закреплена: {{ cell.faculty.short }}
            </div>
            <div v-if="audienceFeature.data.capacity > 0">
              <span>Вместимость: {{ audienceFeature.data.capacity }}</span>
            </div>
            <div v-if="audienceFeature.data.computers_count > 0">
              <span>Количество компьютеров: {{ audienceFeature.data.computers_count }}</span>
            </div>
            <div v-if="audienceFeature.data.multimedia">
              <span>Наличие мультимедиа <Icon name="i-tabler-circle-check" /> </span>
            </div>
            <div v-if="audienceFeature.data.interact_board">
              <span>Наличие интерактивной доски <Icon name="i-tabler-circle-check" /> </span>
            </div>
            <div v-if="audienceFeature.data.features">
              <p>Особенности: <span class="font-bold">{{ audienceFeature.data.features }}</span> </p>
            </div>
            <div v-if="audienceFeature.data.boards?.length > 0">
              <span>Доски ({{ audienceFeature.data.boards.length }}):</span>
              <ul>
                <li v-for="board in audienceFeature.data.boards" class="first-letter:capitalize">
                  {{ board.name }}
                </li>
              </ul>
            </div>
          </div>
          <Separator v-if="cell?.isEvent && audienceFeature" class="my-3 mb-2" />
          <div v-if="cell?.isEvent" class="flex flex-col gap-y-1.5">
            <span class="font-bold text-lg text-black">{{ cell.event.name }}</span>
            <span>Ответственный: {{ cell.event.owner }}</span>
            <span v-if="cell.event.comment">Комментарий: {{ cell.event.comment }}</span>
          </div>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
  </template>