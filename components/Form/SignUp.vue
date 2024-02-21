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

const { data: ruleOptions, error: ruleOptionsError } = await useAsyncData(
  'ruleOptions',
  () => useAuthFetch('/rules')
)

const signUpSchema = toTypedSchema(z.object({
  name: z.string().min(2).max(240),
  login: z.string().min(2).max(240),
  password: z.string().min(2).max(240),
  rule: z.object({
    id: z.number().default(1)
  })
}))

const form = useForm({
  validationSchema: signUpSchema,
})

const onSubmit = form.handleSubmit((values) => {
  const fetch = signUp(values)
})

const signUp = async (values: object) => {
  const { status } = await useFetch('http://127.0.0.1:8000/api/account/register', {
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
        <FormLabel>ФИО</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="login">
      <FormItem>
        <FormLabel>Логин</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Пароль</FormLabel>
        <FormControl>
          <Input type="password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="rule.id">
      <FormItem>
        <FormLabel>Уровень доступа</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Выберите уровень доступа" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="rule in ruleOptions.data" :value="rule.id">
                {{ rule.title }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </FormField>
    <div class="flex justify-end">
      <Button type="submit">
        Добавить пользователя
      </Button>
    </div>
  </form>
</template>