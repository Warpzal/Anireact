<script setup>
    import { ref, onMounted } from 'vue'
    import { client } from '../pocketbase'
    import { resultsPerPage } from '../config.js'
    import Gallery from '../components/Gallery/Gallery.vue'
    import Gallery__Search from '../components/Gallery/Gallery__Search.vue'

    const props = defineProps({
        page: String,
    })

    const currentReactions = ref()
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

    const filterTags = async (tag) => {
        if (tag.length < 3) {
            currentReactions.value = reactions.value
            return
        }
        const capitalize = (word) => {
            word = [...word]
            for (const [index, letter] of word.entries()) {
                if (index == 0) word[index] = letter.toUpperCase()
                else word[index] = letter.toLowerCase()
            }
            return word.join('')
        }
        tag = capitalize(tag)
        const data = await client.records.getFullList('reactions', 100, {
            filter: `emotion~"${tag}"`,
        })
        currentReactions.value = data
    }
</script>

<template>
    <div>
        <Gallery__Search
            @filterTags="filterTags"
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
