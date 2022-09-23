<script setup>
    import { ref, onMounted } from 'vue'
    import { client } from '../pocketbase'
    import { resultsPerPage } from '../config.js'

    import Gallery from '../components/Gallery/Gallery.vue'
    import Gallery__Search from '../components/Gallery/Gallery__Search.vue'

    const props = defineProps({
        page: String,
    })

    const reactions = ref()
    const totalPages = ref()

    onMounted(async () => {
        const pageNumber = +props.page || 1
        const data = await client.records.getList(
            'reactions',
            pageNumber,
            resultsPerPage
        )
        totalPages.value = data.totalPages
        reactions.value = data.items
    })
</script>

<template>
    <div>
        <Gallery__Search :reactions="reactions" />
        <Gallery :reactions="reactions" :totalPages="totalPages" />
    </div>
</template>

<style lang="scss" scoped>
    div {
        padding: 15px;
    }
</style>
