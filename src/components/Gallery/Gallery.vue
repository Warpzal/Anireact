<script setup>
    import Reaction__Image from '../Reaction/Reaction__Image.vue'
    import Gallery__Search from './Gallery__Search.vue'

    const props = defineProps({
        reactions: Array,
    })
</script>

<template>
    <Gallery__Search :reactions="props.reactions" />
    <section class="gallery grid">
        <Reaction__Image
            v-for="reaction in reactions"
            :key="reaction.id"
            :reaction="reaction"
            :tag="reaction.emotion"
        />
    </section>
</template>

<style lang="scss" scoped>
    .grid {
        @media (min-width: 650px) {
            display: grid;
            gap: 20px;
            grid-template-columns: repeat(5, 200px);
        }
    }
</style>
