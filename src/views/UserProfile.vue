<script setup>
    import { onMounted, ref, computed } from 'vue'
    import { useAuth } from '@/composables/useAuth.js'
    import { domain, client } from '@/pocketbase'
    import { resultsPerPage } from '../config.js'

    import Gallery from '../components/Gallery/Gallery.vue'
    import Gallery__Search from '../components/Gallery/Gallery__Search.vue'
    import Modal from '../components/Global/Modal.vue'
    import Reaction__Upload from '../components/Reaction/Reaction__Upload.vue'

    const props = defineProps({
        username: String,
        page: String,
    })

    const { user } = useAuth()
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
            +props.page || 1,
            resultsPerPage,
            {
                filter: `uploader="${userProfile.value.userId}"`,
            }
        )
        reactions.value = data.items
        currentReactions.value = reactions.value
        filteredTags.value = data.items
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
        return `${domain}/api/files/systemprofiles0/${userProfile?.value.id}/${userProfile?.value?.avatar}?thumb=100x100`
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

    const filteredTags = ref()

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
        console.log(tag)
        const data = await client.records.getFullList('reactions', 100, {
            filter: `emotion~"${tag}"&&uploader="${userProfile.value.userId}"`,
        })
        currentReactions.value = data
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
            @filterTags="filterTags"
            :reactions="currentReactions"
        ></Gallery__Search>
        <Gallery
            :reactions="currentReactions"
            :totalPages="totalPages"
        ></Gallery>
    </section>
</template>

<style lang="scss" scoped>
    .profile {
        padding: 15px;
    }
</style>
