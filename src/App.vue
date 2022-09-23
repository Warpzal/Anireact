<script setup>
    import { RouterView } from 'vue-router'

    import Navigation from './components/Global/Navigation.vue'
</script>

<template>
    <Navigation></Navigation>
    <RouterView :key="$route.path" />
</template>

<style lang="scss">
    * {
        box-sizing: border-box;
        margin: 0;
    }
</style>
