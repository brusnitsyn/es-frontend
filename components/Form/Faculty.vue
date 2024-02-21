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

const facultySchema = toTypedSchema(z.object({
    name: z.string().min(2).max(240),
    short: z.string().min(2).max(10),
    color: z.string().max(7)
}))

const form = useForm({
    validationSchema: facultySchema,
})

const onSubmit = form.handleSubmit((values) => {
    const fetch = addFaculty(values)
})

const addFaculty = async (values: object) => {
    const { status } = await useFetch('http://127.0.0.1:8000/api/faculties', {
        method: 'post',
        body: values
    })

    if (status.value === 'success') emits('success')
} 
</script>

<template>
    <form @submit="onSubmit" class="space-y-2">
        <FormField v-slot="{ componentField }" name="name">
            <FormItem>
                <FormLabel>Наименование</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="Физико-математический факультет" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="short">
            <FormItem>
                <FormLabel>Сокращение</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="ФМФ" v-bind="componentField" />
                </FormControl>
                <FormDescription>
                    Используется для обозначения в таблице.
                </FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="color">
            <FormItem>
                <FormLabel>Цвет</FormLabel>
                <FormControl>
                    <input type="color" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <div class="flex justify-end">
            <Button type="submit">
                Добавить
            </Button>
        </div>
    </form>
</template>