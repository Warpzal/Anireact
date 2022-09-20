<script setup>
    import { ref } from 'vue'
    import { useAuth } from '@/composables/useAuth.js'

    const { register, error } = useAuth()

    const username = ref('')
    const email = ref('')
    const password = ref('')
</script>

<template>
    <form
        class="form"
        @submit.prevent="register({ username, email, password })"
    >
        <h2 class="is-size-5 mb-3">Register</h2>
        <input
            type="text"
            class="input mb-3"
            placeholder="username"
            v-model="username"
        />
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
        <button class="button is-primary" type="submit">Register</button>
        <p v-if="error" class="form__error">Username or Email taken</p>
    </form>
</template>
