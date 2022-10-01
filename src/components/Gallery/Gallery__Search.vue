<script setup>
    import { ref, watchEffect } from 'vue'
    import { tags } from '@/config.js'

    const emit = defineEmits(['filterReactions'])
    const searchTerm = ref('')

    watchEffect(() => {
        emit('filterReactions', searchTerm.value)
    })
</script>

<template>
    <form @submit.prevent="" class="search">
        <input
            v-model="searchTerm"
            autocomplete="off"
            list="tags"
            name="tags"
            class="input mb-4"
            type="text"
            placeholder="Search by Tag ex:(happy)"
        />

        <datalist id="tags">
            <option v-for="tag in tags" :key="tag" :value="tag"></option>
        </datalist>
    </form>
</template>
