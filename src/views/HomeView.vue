<script setup>
    import { client, domain } from '@/pocketbase.js'
    import { onMounted, ref, computed } from 'vue'
    import { useAuth } from '@/composables/useAuth.js'

    const { register, login, logout, user } = useAuth()

    const images = ref()
    const file = ref(null)

    onMounted(async () => {
        const data = await client.records.getList('reactions', 1, 15)
        images.value = data.items
        if (window.localStorage.getItem('pocketbase_auth')) {
            getLoggedInUserData()
            console.log(user.value)
        }
    })

    const emotion = ref('')
    async function uploadReaction() {
        try {
            const formData = new FormData()
            for (let item of file.value.files) {
                formData.append('reaction', item)
            }
            formData.append('uploader', user.value.userId)
            formData.append('emotion', emotion.value)
            const newFile = await client.records.create('reactions', formData)
            images.value.push(newFile)
        } catch (e) {
            console.log(e)
        }
    }

    const deleteReaction = async (record) => {
        console.log(record.id)
        await client.records.delete('reactions', record.id)
        location.reload()
    }

    const isEditMode = ref(false)
    const updatedEmotion = ref('')
    const editReaction = async (record) => {
        console.log(updatedEmotion)
        await client.records.update('reactions', record.id, {
            emotion: updatedEmotion.value,
        })
        location.reload()
    }

    function getFileUrl(reaction) {
        return `${domain}/api/files/reactions/${reaction.id}/${reaction.reaction}?thumb=200x200`
    }

    const email = ref('')
    const username = ref('')
    const password = ref('')

    function getLoggedInUserData() {
        const pocketbase_auth = window.localStorage.getItem('pocketbase_auth')
        const user_profile = JSON.parse(pocketbase_auth)
        console.log(user_profile.token)
        user.value = user_profile.model.profile
    }

    const userAvatarFile = ref()
    async function uploadAvatar() {
        try {
            const formData = new FormData()
            for (let item of userAvatarFile.value.files) {
                formData.append('avatar', item)
            }
            const newFile = await client.records.update(
                'profiles',
                user.value.id,
                formData
            )
        } catch (e) {
            console.log(e)
        }
    }

    const getAvatarUrl = computed(() => {
        if (!user?.value?.avatar)
            return `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcI8nbp2LD-wFq5C5JIKAINuCvfl7_bUNwQw&usqp=CAU`
        return `${domain}/api/files/systemprofiles0/${user.value.id}/${user.value.avatar}?thumb=100x100`
    })

    const getMyReactions = async () => {
        // fetch a paginated records list
        const data = await client.records.getList('reactions', 1, 10, {
            filter: `uploader="${user.value.userId}"`,
        })
        images.value = data.items
    }
</script>

<template>
    <main>
        <button @click="getMyReactions">Filter through my uploads</button>
        <button @click="logout">logout</button>
        <p>{{ user?.name }}</p>
        <img class="user-avatar" :src="getAvatarUrl" alt="avatar" />
        <input type="file" @change="uploadAvatar" ref="userAvatarFile" />
        <button @click="getLoggedInUserData">Click</button>
        <form @submit.prevent="login({ email, password })">
            <input v-model="username" type="text" placeholder="username" />
            <input v-model="email" type="email" placeholder="email" />
            <input v-model="password" type="password" placeholder="password" />
            <input type="submit" />
        </form>
        <hr />
        <p>Upload Reaction</p>
        <input type="file" @change="uploadReaction" ref="file" />
        <input type="text" v-model="emotion" />
        <button @click="uploadReaction">Upload Reaction</button>

        <div
            v-for="reaction in images"
            :key="reaction.id"
            class="image-wrapper"
        >
            <p>{{ reaction.emotion }}</p>
            <img class="reaction" :src="getFileUrl(reaction)" alt="reaction" />
            <div v-if="reaction?.uploader === user?.userId" class="controls">
                <button @click="deleteReaction(reaction)">delete</button>
                <button
                    class="button is-small is-primary"
                    @click="
                        ;(isEditMode = !isEditMode),
                            (updatedEmotion = reaction.emotion)
                    "
                >
                    edit
                </button>
                <div v-if="isEditMode">
                    <input type="text" v-model="updatedEmotion" />
                    <button
                        class="button is-small is-primary"
                        @click="editReaction(reaction)"
                    >
                        save changes
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
    img.reaction {
        width: 200px;
        height: 200px;
    }
</style>
