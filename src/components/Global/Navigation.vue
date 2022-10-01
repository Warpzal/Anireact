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
    <header class="navigation">
        <Modal
            width="400px"
            @resetState="resetState"
            v-if="isLoggingIn || isSigningUp"
        >
            <login v-if="isLoggingIn"></login>
            <register v-if="isSigningUp"></register>
        </Modal>
        <div class="nav">
            <div class="left-side">
                <router-link to="/" class="header__link">
                    <p>Reactions.moe</p>
                    <img class="nav__mascot" src="@/assets/akari.png" alt="" />
                </router-link>
            </div>
            <div class="right-side">
                <div v-if="user">
                    <router-link :to="`/user/${user?.name}`">
                        <p>{{ user?.name }}</p>
                    </router-link>
                    <a href="#" v-if="user" @click="logout">Logout</a>
                </div>
                <div v-else>
                    <p @click="handleLogin">Login</p>
                    <p @click="handleRegister">Register</p>
                </div>
            </div>
        </div>
    </header>
</template>

<style lang="scss" scoped>
    .navigation {
        max-width: 100%;
        padding: 5px 20px;
        &__link {
            color: var(--primary-color);
        }
        box-shadow: var(--shadow-3);
    }
    .nav {
        width: 100%;
        display: flex;
        justify-content: space-between;
        &__mascot {
            width: 50px;
        }
    }
    .left-side > a {
        display: flex;
        align-items: center;
        height: 100%;
        text-transform: lowercase;
    }
    .right-side > div {
        height: 100%;
        display: flex;
        align-items: center;
    }
    .right-side > div p,
    a {
        cursor: pointer;
        color: black;
        padding: 0 15px;
        &:hover {
            color: #333;
            text-decoration: underline;
        }
    }
</style>
