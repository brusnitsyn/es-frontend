export default defineNuxtPlugin(async () => {
    const token = useCookie("token")
    const authStore = useAuthStore()

    if (token.value) {
        await authStore.getUser()
    }
});