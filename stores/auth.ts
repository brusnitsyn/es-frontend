import { defineStore } from 'pinia'
export const useAuthStore = defineStore('auth', () => {
    const user = ref<object|null>(null)
    const isLogging = computed(() => user.value !== null)
    const rule = computed(() => isLogging.value ? user.value.rule : null)
    const token = useCookie('token')

    function setToken(newToken:string) {
        token.value = newToken
    }
    async function getUser() {
        const { data, status } = await useAuthFetch('/account/user')

        if (status.value === 'success') {
            user.value = data.value
        }
    }
    function $reset() {
        user.value = null
        token.value = null
    }

    return {
        user,
        isLogging,
        rule,
        token,
        setToken,
        getUser,
        $reset,
    }
})