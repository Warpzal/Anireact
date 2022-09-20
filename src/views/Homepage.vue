<script setup>
    import { ref, onMounted } from 'vue'
    import { client } from '../pocketbase'

    import Gallery from '../components/Gallery/Gallery.vue'

    const reactions = ref()

    // Fetch reactions from the database
    onMounted(async () => {
        const data = await client.records.getList('reactions', 1, 20)
        reactions.value = data.items
    })
</script>

<template>
    <Gallery :reactions="reactions" />
</template>

<style lang="scss" scoped></style>
