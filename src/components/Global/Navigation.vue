<script setup>
    import { ref } from 'vue'
    import { useAuth } from '@/composables/useAuth.js'

    import Modal from './Modal.vue'
    import Login from '../Auth/Login.vue'
    import Register from '../Auth/Register.vue'

    const { user, logout } = useAuth()

    const isLoggingIn = ref(false)
    const isSigningUp = ref(false)

    const handleLogin = () => (isLoggingIn.value = true)
    const handleRegister = () => (isSigningUp.value = true)

    const resetState = () => {
        isLoggingIn.value = false
        isSigningUp.value = false
    }
</script>

<template>
    <header class="header">
        <Modal @resetState="resetState" v-if="isLoggingIn || isSigningUp">
            <login v-if="isLoggingIn"></login>
            <register v-if="isSigningUp"></register>
        </Modal>
        <h4>AnimeReactions.moe</h4>
        <h4 v-if="user">{{ user.name }}</h4>
        <router-link to="/me">
            <button v-if="user" class="button">My Profile</button>
        </router-link>
        <button v-if="user" @click="logout" class="button">Logout</button>
        <nav>
            <ul>
                <li v-if="!user">
                    <button @click="handleLogin" class="button">Login</button>
                    <button @click="handleRegister" class="button">
                        Register
                    </button>
                </li>
                <li>
                    <router-link to="/" class="header__link">Home</router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style lang="scss" scoped>
    .header {
        max-width: 100%;
        margin-bottom: 20px;
        padding: 5px 20px;
        background: red;
        box-shadow: var(--shadow-3);
    }
    .header__link {
        color: var(--primary-color);
    }
</style>
