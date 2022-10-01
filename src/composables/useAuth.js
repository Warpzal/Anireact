import { client } from '@/pocketbase.js'
import { ref, onMounted } from 'vue'

export function useAuth() {
    const user = ref()
    const error = ref()

    onMounted(() => {
        setUser()
        error.value = ''
    })

    const setUser = () => {
        const pocketbase_auth = window.localStorage.getItem('pocketbase_auth')
        if (!pocketbase_auth) {
            user.value = null
            return
        }

        const userProfileRecord = JSON.parse(pocketbase_auth)
        user.value = userProfileRecord.model.profile
    }

    const login = async ({ email, password }) => {
        try {
            await client.users.authViaEmail(email, password)
            location.reload()
        } catch (e) {
            error.value = e
        }
    }

    const logout = async () => {
        try {
            await client.authStore.clear()
            location.reload()
        } catch (e) {
            error.value = e
        }
    }

    const register = async ({ username, email, password }) => {
        try {
            const newUser = await client.users.create({
                email,
                password,
                passwordConfirm: password,
            })
            await client.records.update('profiles', newUser.profile.id, {
                name: username.toLowerCase(),
            })
            login({ email, password })
        } catch (e) {
            console.log(e)
            error.value = e
        }
    }
    return { user, login, logout, register, error }
}
