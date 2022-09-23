<script setup>
    import { ref } from 'vue'
    import { useAuth } from '@/composables/useAuth.js'
    import { client } from '@/pocketbase'
    import { tags } from '@/config.js'

    const { user } = useAuth()
    const uploadFile = ref()
    const emotion = ref('')
    const uploadReaction = async () => {
        try {
            const formData = new FormData()
            for (let item of uploadFile.value.files) {
                formData.append('reaction', item)
            }
            formData.append('uploader', user.value.userId)
            formData.append('emotion', emotion.value)
            const newFile = await client.records.create('reactions', formData)
            window.location.reload()
        } catch (e) {
            console.log(e)
        }
    }
</script>

<template>
    <form @submit.prevent="uploadReaction">
        <h1>Upload Reaction</h1>
        <input ref="uploadFile" type="file" />
        <p>Select Emotion</p>
        <div class="select">
            <select v-model="emotion">
                <option v-for="tag in tags">{{ tag }}</option>
            </select>
        </div>
        <input class="button" type="submit" />
    </form>
</template>

<style lang="scss" scoped></style>
