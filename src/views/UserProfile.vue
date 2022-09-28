<script setup>
    import { onMounted, ref, computed } from 'vue'

    import { domain, client } from '@/pocketbase'
    import { resultsPerPage } from '@/config.js'
    import { useHelpers } from '@/composables/useHelpers.js'
    import { useAuth } from '@/composables/useAuth.js'

    import Gallery from '../components/Gallery/Gallery.vue'
    import Gallery__Search from '../components/Gallery/Gallery__Search.vue'
    import Modal from '../components/Global/Modal.vue'
    import Reaction__Upload from '../components/Reaction/Reaction__Upload.vue'

    const props = defineProps({
        username: {
            type: String,
            required: true,
        },
        page: {
            required: false,
            default: 1,
        },
    })

    const { user } = useAuth()
    const { capitalize } = useHelpers()

    const currentReactions = ref()
    const reactions = ref()
    const totalPages = ref()

    onMounted(async () => {
        await loadUserProfile()
        await loadReactions()
    })

    const loadReactions = async () => {
        const data = await client.records.getList(
            'reactions',
            +props.page,
            resultsPerPage,
            {
                filter: `uploader="${userProfile.value.userId}"`,
            }
        )
        reactions.value = currentReactions.value = data.items
        totalPages.value = data.totalPages
    }

    const userProfile = ref()
    const loadUserProfile = async () => {
        const data = await client.records.getList('profiles', 1, 2, {
            filter: `name="${props.username}"`,
        })
        userProfile.value = data.items[0]
    }

    const getAvatarUrl = computed(() => {
        if (!userProfile?.value?.avatar) return ``
        return `${domain}/api/files/systemprofiles0/${userProfile?.value?.id}/${userProfile?.value?.avatar}?thumb=100x100`
    })

    const userAvatarFile = ref()
    const uploadAvatar = async () => {
        try {
            const formData = new FormData()
            for (let item of userAvatarFile.value.files) {
                formData.append('avatar', item)
            }
            await client.records.update('profiles', user.value.id, formData)
            await loadUserProfile()
        } catch (e) {
            console.log(e)
        }
    }

    const isUploadingReaction = ref(false)
    const resetState = () => {
        isUploadingReaction.value = false
    }

    /**
     * @param {String} tag
     */
    const filterReactions = async (tag) => {
        if (tag.length > 3) {
            tag = capitalize(tag)
            console.log(tag)
            const data = await client.records.getFullList('reactions', 100, {
                filter: `emotion~"${tag}"&&uploader="${userProfile.value.userId}"`,
            })
            currentReactions.value = data
            return
        }
        currentReactions.value = reactions.value
    }
</script>

<template>
    <section class="profile">
        <Modal @resetState="resetState" v-if="isUploadingReaction">
            <Reaction__Upload></Reaction__Upload>
        </Modal>

        <div
            v-if="userProfile?.userId === user?.userId && userProfile != null"
            class="file"
        >
            <label class="file-label">
                <input
                    class="file-input"
                    type="file"
                    name="resume"
                    ref="userAvatarFile"
                    @change="uploadAvatar"
                />
                <span class="file-cta">
                    <span class="file-icon">
                        <i class="fas fa-upload"></i>
                    </span>
                    <span class="file-label">Change Avatar</span>
                </span>
            </label>
        </div>

        <img class="user-avatar" :src="getAvatarUrl" alt="avatar" />
        <p>{{ userProfile?.name }}</p>

        <button
            v-if="userProfile?.userId === user?.userId && userProfile != null"
            @click="isUploadingReaction = true"
            class="button mb-3"
        >
            Upload Reaction
        </button>

        <Gallery__Search
            @filterReactions="filterReactions"
            :reactions="currentReactions"
        />

        <Gallery :reactions="currentReactions" :totalPages="totalPages" />
    </section>
</template>

<style lang="scss" scoped>
    .profile {
        padding: 15px;
    }
</style>
