<script setup lang="ts">
const { data: faculties } = await useFetch('http://127.0.0.1:8000/api/faculties')
const { data: anotherFills } = await useFetch('http://127.0.0.1:8000/api/table/fill')
const tableStore = useTableStore()
const { selectedTableFilling, isSelectedTableFilling, selectedTableFillingType } = storeToRefs(tableStore)

const emits = defineEmits(['close'])

const customEvent = ref({
  'event': {
    'name': '',
    'owner': '',
    'comment': ''
  }
})

const getFacultyColor = (faculty: object) => {
    return `background-color: ${faculty.color}`
}

const setActiveFacultyToFillable = (faculty: object) => {
  selectedTableFilling.value = faculty
  selectedTableFillingType.value = 'faculty'
  if (isSelectedTableFilling) {
    emits('close')
  }
}

const setActiveAnotherFillToFillable = (anotherFill: object) => {
  selectedTableFilling.value = anotherFill
  if (anotherFill.id === 6) selectedTableFillingType.value = 'empty'
  else selectedTableFillingType.value = 'another'
  if (isSelectedTableFilling) {
    emits('close')
  }
}
const setActiveEventToFillable = (anotherFill: object) => {
  const fillData = Object.assign(anotherFill, customEvent.value)

  selectedTableFilling.value = fillData
  selectedTableFillingType.value = 'event'
  if (isSelectedTableFilling) {
    emits('close')
  }
}
</script>

<template>
    <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>Заполнение таблицы</DialogTitle>
            <DialogDescription>
                Выберите факультет для заполнения.
            </DialogDescription>
        </DialogHeader>
        <div class="pb-4 max-h-[328px] overflow-y-auto">
            <div class="grid grid-cols-4 gap-4 ">
                <div v-for="faculty in faculties.data" class="border rounded-md cursor-pointer" @click="setActiveFacultyToFillable(faculty)">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <div class="w-full h-full flex flex-col justify-center items-center pt-5 py-3">
                                    <div class="rounded-md h-9 w-9 border" :style="getFacultyColor(faculty)" />
                                    <span class="text-sm">{{ faculty.short }}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{{ faculty.name }}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
        <Separator />
        <DialogDescription>
            Другие шаблоны для заполнения
        </DialogDescription>
        <div class="pb-4 max-h-[250px] overflow-y-auto">
            <div class="grid grid-cols-3 gap-4">
                <div v-for="anotherFill in anotherFills.data" class="border rounded-md cursor-pointer">
                    <Popover v-if="anotherFill.id === 7">
                      <PopoverTrigger asChild>
                        <div class="w-full h-full flex flex-col justify-center items-center pt-5 py-3 gap-y-2">
                          <div class="border rounded-sm p-2">
                            <Icon :name="anotherFill.icon" size="22" :color="anotherFill.icon_color" />
                          </div>
                          <p class="text-sm leading-4 text-center">{{ anotherFill.name }}</p>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div class="grid gap-y-2">
                          <div class="grid w-full max-w-sm items-center gap-1.5">
                            <Label for="name">Название</Label>
                            <Input id="name" type="text" placeholder="name" v-model="customEvent.event.name" />
                          </div>
                          <div class="grid w-full max-w-sm items-center gap-1.5">
                            <Label for="owner">Ответственный</Label>
                            <Input id="owner" type="text" placeholder="owner" v-model="customEvent.event.owner" />
                          </div>
                          <div class="grid w-full max-w-sm items-center gap-1.5">
                            <Label for="comment">Комментарий</Label>
                            <Input id="comment" type="text" placeholder="comment" v-model="customEvent.event.comment" />
                          </div>
                          <Button @click="setActiveEventToFillable(anotherFill)">Добавить</Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <div v-else class="w-full h-full flex flex-col justify-center items-center pt-5 py-3 gap-y-2" @click="setActiveAnotherFillToFillable(anotherFill)">
                      <div class="border rounded-sm p-2">
                        <Icon :name="anotherFill.icon" size="22" :color="anotherFill.icon_color" />
                      </div>
                      <p class="text-sm leading-4 text-center">{{ anotherFill.name }}</p>
                    </div>
                </div>
            </div>
        </div>
    </DialogContent>
</template>