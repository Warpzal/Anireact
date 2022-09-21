<script setup>
    import { computed } from 'vue'
    import { domain } from '@/pocketbase'

    const props = defineProps({
        reaction: Object,
        tag: String,
    })

    const getReactionThumbnail = computed(() => {
        return `${domain}/api/files/reactions/${props.reaction.id}/${props.reaction.reaction}?thumb=200x200`
    })
</script>

<template>
    <a
        :href="`${domain}/api/files/reactions/${props.reaction.id}/${props.reaction.reaction}`"
        class="reaction"
    >
        <img
            class="reaction__image"
            :src="getReactionThumbnail"
            alt="reaction image"
        />
        <p class="reaction__emotion">{{ tag }}</p>
    </a>
</template>

<style lang="scss" scoped>
    .reaction {
        cursor: pointer;
        position: relative;
        width: 100%;
        max-width: 200px;
        height: 200px;
        border-radius: 3px;
        &__image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top;
            border-radius: inherit;
            background: red;
        }
        &__emotion {
            position: absolute;
            bottom: 0;
            padding: 5px;
            background: black;
            color: white;
        }
    }
</style>
