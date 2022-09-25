<script setup>
    import { computed } from 'vue'
    import { domain, client } from '@/pocketbase'
    import { useAuth } from '@/composables/useAuth.js'

    const props = defineProps({
        reaction: Object,
        tag: String,
    })

    const { user } = useAuth()

    const getReactionThumbnail = computed(() => {
        return `${domain}/api/files/reactions/${props?.reaction?.id}/${props?.reaction?.reaction}?thumb=200x200`
    })

    const deleteReaction = async () => {
        try {
            await client.records.delete('reactions', props?.reaction?.id)
            location.reload()
        } catch (e) {
            console.log(e)
        }
    }
</script>

<template>
    <div class="relative">
        <a
            :href="`${domain}/api/files/reactions/${props?.reaction?.id}/${props?.reaction?.reaction}`"
            class="reaction"
        >
            <img
                class="reaction__image"
                :src="getReactionThumbnail"
                alt="reaction image"
            />
            <p class="reaction__emotion">{{ tag }}</p>
        </a>
        <button
            class="button is-small is-danger reaction__delete"
            @click="deleteReaction"
            v-if="reaction?.uploader === user?.userId"
        >
            Delete
        </button>
    </div>
</template>

<style lang="scss" scoped>
    .relative {
        position: relative;
    }

    .reaction {
        display: block;
        cursor: pointer;
        position: relative;
        width: 100%;
        border-radius: 3px;
        overflow: hidden;
        @media (min-width: 500px) {
            aspect-ratio: 1/1;
            max-width: 225px;
        }
        &__image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top;
            border-radius: inherit;
            transition: 0.4s;
            &:hover {
                transform: scale(1.1);
            }
        }
        &__emotion {
            position: absolute;
            bottom: 0;
            padding: 5px;
            background: black;
            color: white;
        }
        &__delete {
            position: absolute;
            top: 0;
        }
    }
</style>
