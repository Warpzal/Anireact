<script setup>
    import { ref } from 'vue'

    const tags = ref(['happy', 'disappointment'].sort())
</script>

<template>
    <form class="search">
        <input
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
