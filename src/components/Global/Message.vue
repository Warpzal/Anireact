<script setup>
    import { ref } from 'vue'

    const props = defineProps({
        type: String,
        message: String,
    })

    const isOpen = ref(true)
    const closeMessage = () => (isOpen.value = false)
    const isDanger = () => props.type === 'danger'
</script>

<template>
    <article v-if="isOpen" class="message" :class="{ 'is-danger': isDanger }">
        <div class="message-header">
            <p>Message Header {{ props.type }}</p>
            <button
                @click="closeMessage"
                class="delete"
                aria-label="delete"
            ></button>
        </div>
        <div class="message-body">
            {{ message }}
        </div>
    </article>
</template>
