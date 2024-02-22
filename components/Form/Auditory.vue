<script setup lang="ts">
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const emits = defineEmits(['success'])

const {data: boardTypes} = useFetch('http://127.0.0.1:8000/api/audiences/board/types')
const {data: boardSizes} = useFetch('http://127.0.0.1:8000/api/audiences/board/sizes')

const selectedBoardSize = ref(1)
const selectedBoardType = ref(1)
const isOpenBoardDialog = ref(false)

const auditorySchema = toTypedSchema(z.object({
    title: z.string().min(2).max(240),
    number: z.string().min(1).max(10),
    corpus_id: z.number(),
    feature: z.object({
      capacity: z.number(),
      computers_count: z.number().default(0),
      multimedia: z.boolean().default(false),
      interact_board: z.boolean().default(false),
      features: z.string().max(240).optional(),
      boards: z.array(z.object({
        board_size_id: z.number().optional(),
        name_size: z.string().optional(),
        board_type_id: z.number().optional(),
        name_type: z.string().optional(),
      }).optional()).optional().default([])
    }),
}))

const form = useForm({
    validationSchema: auditorySchema,
})

const addNewBoard = () => {
  if (selectedBoardSize.value !== 0 &&
  selectedBoardType.value !== 0) {
    form.setValues({feature: { boards: [...<[]>form.values.feature.boards, { 'board_size_id': selectedBoardSize.value.id, 'board_type_id': selectedBoardType.value.id, name_size: selectedBoardSize.value.name, name_type: selectedBoardType.value.name }] }}, false)
    isOpenBoardDialog.value = false
    selectedBoardSize.value = 1
    selectedBoardType.value = 1
  }
}

const removeBoard = (boardIndex:number) => {
  const boards = form.values.feature.boards.map(a => ({...a}));//.splice(boardIndex, 1)
  boards.splice(boardIndex, 1)
  form.setValues({feature: {boards}}, false)
}

const onSubmit = form.handleSubmit((values) => {
    const fetch = addAuditory(values)
})

const addAuditory = async (values: object) => {
    const { status } = await useFetch('http://127.0.0.1:8000/api/audiences', {
        method: 'post',
        body: values
    })

    if (status.value === 'success') emits('success')
}

const { data: corpuses } = await useFetch('http://127.0.0.1:8000/api/corpus')
</script>

<template>
    <form @submit="onSubmit">
        <div class="space-y-2 max-h-[620px] overflow-y-scroll">
          <FormField v-slot="{ componentField }" name="title">
            <FormItem>
              <FormLabel>Наименование</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Аудитория 230/1" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="number">
            <FormItem>
              <FormLabel>Цифровое обозначение</FormLabel>
              <FormControl>
                <Input type="text" placeholder="230/1" v-bind="componentField" />
              </FormControl>
              <FormDescription>
                Используется для обозначения в таблице.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="corpus_id">
            <FormItem>
              <FormLabel>Привязка к корпусу</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите корпус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="corpus in corpuses.data" :value="corpus.id">
                        {{ corpus.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <div>
            <Separator class="my-4 mb-3" />
          </div>
          <FormField v-slot="{ componentField }" name="feature.capacity">
            <FormItem>
              <FormLabel>Вместимость аудитории</FormLabel>
              <FormControl>
                <Input type="number" placeholder="30" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="feature.features">
            <FormItem>
              <FormLabel>Особенности</FormLabel>
              <FormControl>
                <Input type="text" placeholder="VR, нет доски" v-bind="componentField" />
              </FormControl>
              <FormDescription>
                Укажите ключевые особенности аудитории через запятую.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="feature.computers_count">
            <FormItem>
              <FormLabel>Количество компьютеров</FormLabel>
              <FormControl>
                <Input type="number" placeholder="15" v-bind="componentField" />
              </FormControl>
              <FormDescription>
                Оставьте 0, если компьютеров нет в аудитории.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="boards">
            <FormItem>
              <div class="flex justify-between items-center">
                <FormLabel>Доски</FormLabel>
                <Dialog v-bind:open="isOpenBoardDialog">
                  <DialogTrigger asChild>
                    <p class="text-sm cursor-pointer" @click="isOpenBoardDialog = true">Добавить</p>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Добавить доску</DialogTitle>
                      <DialogDescription>
                        Выберите размер и тип доски.
                      </DialogDescription>
                    </DialogHeader>
                    <div class="flex items-center space-x-2">
                      <Select v-model="selectedBoardSize">
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите размер" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem v-for="boardSize in boardSizes" :value="boardSize">
                            {{ boardSize.name }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Select v-model="selectedBoardType">
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem v-for="boardType in boardTypes" :value="boardType">
                            {{ boardType.name }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter class="sm:justify-start">
                      <DialogClose as-child>
                        <Button type="button" variant="secondary">
                          Отмена
                        </Button>
                      </DialogClose>
                      <Button @click="addNewBoard">
                        Добавить
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <FormControl>
                <ScrollArea class="h-28 w-full rounded-md border">
                  <div v-if="form.values.feature.boards?.length" class="p-4">
                    <div v-for="(board, index) in form.values.feature.boards" :key="board">
                      <div class="text-sm flex justify-between items-center">
                        <p class="first-letter:capitalize">{{ board.name_size }} {{ board.name_type }}</p>
                        <Icon name="i-tabler-trash" size="16" @click="removeBoard(index)" class="cursor-pointer" />
                      </div>
                      <Separator class="my-2" />
                    </div>
                  </div>
                  <div v-else class="p-7 w-full">
                    <div class="flex flex-col gap-y-0.5 items-center justify-center">
                      <Icon name="i-mdi-border-none-variant" size="28" class="text-muted-foreground" />
                      <p class="text-sm text-muted-foreground">Нет досок.</p>
                    </div>
                  </div>
                </ScrollArea>
              </FormControl>
              <FormDescription>
                Оставьте 0, если компьютеров нет в аудитории.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ value, handleChange }" type="checkbox" name="feature.multimedia">
            <FormItem class="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox :value="value" @update:checked="handleChange" />
              </FormControl>
              <FormLabel class="font-normal">
                Мультимедиа
              </FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ value, handleChange }" type="checkbox" name="feature.interact_board">
            <FormItem class="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox id="interact_board" :value="value" @update:checked="handleChange" />
              </FormControl>
              <FormLabel class="font-normal">
                Интерактивная доска
              </FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="flex justify-end">
            <Button type="submit">
                Добавить
            </Button>
        </div>
    </form>
</template>