<script setup>
    import { ref } from 'vue'
    import { useAuth } from '@/composables/useAuth.js'

    const { login, error } = useAuth()

    const email = ref('')
    const password = ref('')
</script>

<template>
    <form class="form" @submit.prevent="login({ email, password })">
        <h2 class="is-size-5 mb-3">Login</h2>
        <input
            type="email"
            class="input mb-3"
            placeholder="email"
            v-model="email"
        />
        <input
            type="password"
            class="input mb-3"
            placeholder="password"
            v-model="password"
        />
        <button class="button is-primary" type="submit">Login</button>
        <p v-if="error" class="form__error">Incorrect password or email</p>
    </form>
</template>
