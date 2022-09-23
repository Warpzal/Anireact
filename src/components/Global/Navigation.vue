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
        <div class="nav">
            <div class="left-side">
                <p>reactions.moe</p>
            </div>
            <div class="right-side">
                <div v-if="user">
                    <router-link to="/" class="header__link">
                        <button class="button">Home</button>
                    </router-link>
                    <router-link :to="`/user/${user?.name}`">
                        <button v-if="user" @click="refresh" class="button">
                            My Profile
                        </button>
                    </router-link>
                    <button v-if="user" @click="logout" class="button">
                        Logout
                    </button>
                </div>
                <nav v-else>
                    <ul>
                        <li>
                            <button @click="handleLogin" class="button">
                                Login
                            </button>
                            <button @click="handleRegister" class="button">
                                Register
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
</template>

<style lang="scss" scoped>
    .header {
        max-width: 100%;
        padding: 5px 20px;
        background: grey;
        box-shadow: var(--shadow-3);
    }
    .header__link {
        color: var(--primary-color);
    }
    .nav {
        width: 100%;
        display: flex;
        justify-content: space-between;
        ul {
            display: flex;
        }
    }
</style>
