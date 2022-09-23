<script setup>
    import { onMounted, onUpdated, ref, computed } from 'vue'
    import { useAuth } from '@/composables/useAuth.js'
    import { domain, client } from '@/pocketbase'
    import { resultsPerPage } from '../config.js'

    import Gallery from '../components/Gallery/Gallery.vue'
    import Gallery__Search from '../components/Gallery/Gallery__Search.vue'
    import Modal from '../components/Global/Modal.vue'
    import Reaction__Upload from '../components/Reaction/Reaction__Upload.vue'

    const props = defineProps({
        username: String,
    })

    const { user } = useAuth()

    onMounted(async () => {
        await loadUserProfile()
        await loadReactions()
    })

    const reactions = ref()
    const loadReactions = async () => {
        const data = await client.records.getList(
            'reactions',
            1,
            resultsPerPage,
            {
                filter: `uploader="${userProfile.value.userId}"`,
            }
        )
        reactions.value = data.items
        filteredTags.value = data.items
    }

    const userProfile = ref()
    const loadUserProfile = async () => {
        const data = await client.records.getList('profiles', 1, 2, {
            filter: `name="${props.username}"`,
        })
        console.log(data)
        userProfile.value = data.items[0]
        console.log(userProfile.value)
    }

    const getAvatarUrl = computed(() => {
        if (!userProfile?.value?.avatar)
            return `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcI8nbp2LD-wFq5C5JIKAINuCvfl7_bUNwQw&usqp=CAU`
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
    const filterTags = (tag) => {
        filteredTags.value = reactions?.value?.filter((reaction) => {
            const emotion = reaction.emotion.toLowerCase()
            if (!tag) return reaction
            if (emotion.includes(tag.toLowerCase())) return reaction
        })
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
            :reactions="reactions"
        ></Gallery__Search>
        <Gallery :reactions="filteredTags"></Gallery>
    </section>
</template>

<style lang="scss" scoped>
    .profile {
        padding: 15px;
    }
</style>
