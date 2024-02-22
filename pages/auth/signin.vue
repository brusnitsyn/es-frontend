<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const authStore = useAuthStore()

const signInSchema = toTypedSchema(z.object({
  login: z.string().min(2).max(240),
  password: z.string().min(1).max(240)
}))

const form = useForm({
  validationSchema: signInSchema,
})

const onSubmit = form.handleSubmit((values) => {
  const fetch = signIn(values)
})

const signIn = async (values: object) => {
  const { data, status } = await useFetch('http://127.0.0.1:8000/api/account/login', {
    method: 'post',
    body: values
  })

  if (status.value === 'success') {
    authStore.setToken(data.value.token)
    await useRouter().push('/dashboard')
  }
}

definePageMeta({
  layout: 'auth',
  middleware: ['guest']
})
</script>

<template>
  <div class="flex h-screen items-center justify-center">
    <form @submit="onSubmit" class="w-full max-w-sm space-y-2 border rounded-md p-3 px-4">
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
      <div class="flex justify-end">
        <Button type="submit">
          Войти
        </Button>
      </div>
    </form>
  </div>
</template>