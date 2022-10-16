<script setup>
    import { computed, ref } from 'vue'
    import { domain, client } from '@/pocketbase'
    import { useAuth } from '@/composables/useAuth.js'
    import { tags } from '@/config.js'
    import Modal from '../Global/Modal.vue'

    const emits = defineEmits(['filterReactions'])
    const props = defineProps({
        reaction: Object,
        tag: String,
    })

    const { user } = useAuth()

    const getReactionThumbnail = computed(() => {
        return `${domain}/api/files/reactions/${props?.reaction?.id}/${props?.reaction?.reaction}?thumb=200x200`
    })

    const emotion = ref(props?.reaction?.emotion)
    const isEditMode = ref(false)
    const resetState = () => (isEditMode.value = false)

    const updateReaction = async () => {
        try {
            const record = await client.records.update(
                'reactions',
                props?.reaction?.id,
                {
                    emotion: emotion.value,
                }
            )
            location.reload()
        } catch (e) {
            console.log(e)
        }
    }

    const deleteReaction = async () => {
        try {
            await client.records.delete('reactions', props?.reaction?.id)
            location.reload()
        } catch (e) {
            console.log(e)
        }
    }

    const filterReactions = () => {
        emits('filterReactions', props?.reaction?.emotion)
    }
</script>

<template>
    <Modal :width="'350px'" @resetState="resetState" v-if="isEditMode">
        <div class="edit">
            <img class="" :src="getReactionThumbnail" alt="reaction image" />
            <p>Select Emotion</p>

            <div class="select mb-3">
                <select v-model="emotion">
                    <option v-for="tag in tags">{{ tag }}</option>
                </select>
            </div>

            <button @click="updateReaction" class="button is-info mb-3">
                Update
            </button>
            <button @click="deleteReaction" class="button is-danger mb-3">
                Delete
            </button>
        </div>
    </Modal>

    <div class="relative">
        <a
            :href="`${domain}/api/files/reactions/${props?.reaction?.id}/${props?.reaction?.reaction}`"
            class="reaction"
        >
            <img
                class="reaction__image"
                :src="getReactionThumbnail"
                alt="reaction image"
                loading="lazy"
            />
        </a>
        <p @click="filterReactions" class="reaction__emotion">{{ tag }}</p>
        <i
            v-if="user?.userId === reaction?.uploader"
            @click="isEditMode = true"
            class="fas fa-ellipsis-vertical reaction__edit"
        ></i>
    </div>
</template>

<style lang="scss" scoped>
    .relative {
        position: relative;
    }

    .reaction {
        display: block;
        position: relative;
        width: 100%;
        border-radius: 3px;
        border: 1px solid rgba(0, 0, 0, 0.1);
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
            cursor: pointer;
            position: absolute;
            left: 1px;
            bottom: 1px;
            padding: 5px;
            background: black;
            color: #f3f3f3;
            &:hover {
                background: white;
                color: rgba(0, 0, 0, 0.8);
                border: 1px solid rgba(0, 0, 0, 0.8);
                border-left: 0px;
                border-right: 0px;
            }
        }
        &__edit {
            cursor: pointer;
            padding: 5px;
            background: rgba(0, 0, 0, 0.3);
            color: white;
            border-radius: 5px;
            font-size: 1.8rem;
            position: absolute;
            top: 5px;
            right: 5px;
            transition: 0.3s all;
            &:hover {
                transform: scale(0.8);
            }
        }
    }

    .edit {
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
            width: 60%;
            margin-bottom: 15px;
        }
    }
</style>
