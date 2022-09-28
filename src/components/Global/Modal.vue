<script setup>
    import { ref } from 'vue'

    const emit = defineEmits(['resetState'])
    const props = defineProps({
        width: String,
        height: String,
    })

    const isOpen = ref(true)
    const closeModal = () => emit('resetState')
</script>

<template>
    <teleport v-if="isOpen" to="#app">
        <div :class="{ 'is-active': isOpen }" class="modal">
            <div @click="closeModal" class="modal-background"></div>
            <div class="modal-content" :style="{ width: props?.width }">
                <slot></slot>
            </div>
            <button
                @click="closeModal"
                class="modal-close is-large"
                aria-label="close"
            ></button>
        </div>
    </teleport>
</template>

<style lang="scss" scoped>
    .modal-content {
        background: white;
        padding: 15px;
        border-radius: 3px;
    }
</style>
