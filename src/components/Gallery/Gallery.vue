<script setup>
    import Reaction__Image from '../Reaction/Reaction__Image.vue'
    import { useRouter, useRoute } from 'vue-router'
    import { onMounted } from 'vue'

    const props = defineProps({
        reactions: Array,
        totalPages: Number,
    })

    const router = useRouter()
    const route = useRoute()

    onMounted(async () => {
        // console.log(route.name)
        // console.log(route.params.page)
        // console.log(router)
    })

    const isValidPage = (pageNumber) => {
        if (pageNumber > props.totalPages || pageNumber < 1) return false
        return true
    }

    const fetchPreviousPage = () => {
        const currentPage = +route.params?.page || 1
        if (!isValidPage(currentPage - 1)) return
        const name = route.name.includes('Pagination')
            ? route.name
            : route.name + 'Pagination'
        router.push({ name, params: { page: currentPage - 1 } })
    }

    const fetchNextPage = () => {
        const currentPage = +route.params?.page || 1
        if (!isValidPage(currentPage + 1)) return
        const name = route.name.includes('Pagination')
            ? route.name
            : route.name + 'Pagination'

        router.push({
            name,
            params: { page: currentPage + 1 },
        })
    }
</script>

<template>
    <section class="gallery grid">
        <Reaction__Image
            v-for="reaction in reactions"
            :key="reaction.id"
            :reaction="reaction"
            :tag="reaction.emotion"
        />
    </section>

    <div class="page-navigation">
        <button
            :disabled="!isValidPage(+route.params?.page - 1 || 0)"
            @click="fetchPreviousPage"
            class="button"
        >
            Prev
        </button>
        <button
            :disabled="!isValidPage(+route.params?.page + 1 || 2)"
            @click="fetchNextPage"
            class="button"
        >
            Next
        </button>
    </div>
</template>

<style lang="scss" scoped>
    .page-navigation {
        margin-top: 20px;
    }
    .grid {
        @media (min-width: 500px) {
            display: grid;
            gap: 20px;
            grid-template-columns: repeat(auto-fit, 225px);
        }
    }
</style>
