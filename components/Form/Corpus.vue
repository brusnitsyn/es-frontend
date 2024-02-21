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

const emits = defineEmits('success')

const corpusSchema = toTypedSchema(z.object({
    name: z.string().min(1).max(50),
}))

const corpusForm = useForm({
    validationSchema: corpusSchema,
})

const onSubmit = corpusForm.handleSubmit((values) => {
    const fetch = addCorpus(values)
})

const addCorpus = async (values: object) => {
    const { status } = await useFetch('http://127.0.0.1:8000/api/corpus', {
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
                    <Input type="text" placeholder="Центральный корпус" v-bind="componentField" />
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