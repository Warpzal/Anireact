<script setup>
    import { onMounted, ref, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuth } from '@/composables/useAuth.js'
    import { domain, client } from '@/pocketbase'

    import Gallery from '../components/Gallery/Gallery.vue'

    const router = useRouter()

    const { user } = useAuth()

    onMounted(async () => {
        if (!user) router.push('/')
        await loadReactions()
        await loadUserProfile()
    })

    const reactions = ref()
    const loadReactions = async () => {
        const data = await client.records.getList('reactions', 1, 20, {
            filter: `uploader="${user.value.userId}"`,
        })
        reactions.value = data.items
    }

    const userProfile = ref()
    const loadUserProfile = async () => {
        userProfile.value = await client.records.getOne(
            'profiles',
            user.value.id
        )
    }

    const getAvatarUrl = computed(() => {
        if (!user?.value?.avatar)
            return `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcI8nbp2LD-wFq5C5JIKAINuCvfl7_bUNwQw&usqp=CAU`
        return `${domain}/api/files/systemprofiles0/${user.value.id}/${userProfile?.value?.avatar}?thumb=100x100`
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
</script>

<template>
    <p>{{ userProfile?.name }}</p>
    <div class="file">
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
    <Gallery :reactions="reactions"></Gallery>
</template>

<style lang="scss" scoped></style>
