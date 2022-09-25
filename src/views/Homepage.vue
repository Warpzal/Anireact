<script setup>
    import { ref, onMounted } from 'vue'
    import { client } from '../pocketbase'
    import { resultsPerPage } from '../config.js'
    import { useHelpers } from '@/composables/useHelpers.js'

    import Gallery from '../components/Gallery/Gallery.vue'
    import Gallery__Search from '../components/Gallery/Gallery__Search.vue'

    const props = defineProps({
        page: {
            type: String,
            required: false,
            default: 1,
        },
    })

    const { capitalize } = useHelpers()

    const currentReactions = ref()
    const initialReactions = ref()
    const totalPages = ref()

    onMounted(async () => {
        const pageNumber = +props.page
        const data = await client.records.getList(
            'reactions',
            pageNumber,
            resultsPerPage
        )
        totalPages.value = data.totalPages
        initialReactions.value = data.items
    })

    /**
     * @param {String} tag
     */
    const filterReactions = async (tag) => {
        if (tag.length > 3) {
            tag = capitalize(tag)
            const data = await client.records.getFullList('reactions', 100, {
                filter: `emotion~"${tag}"`,
            })
            currentReactions.value = data
            return
        }
        currentReactions.value = initialReactions.value
    }
</script>

<template>
    <div>
        <Gallery__Search
            @filterReactions="filterReactions"
            :reactions="currentReactions"
        />
        <Gallery :reactions="currentReactions" :totalPages="totalPages" />
    </div>
</template>

<style lang="scss" scoped>
    div {
        padding: 15px;
    }
</style>
