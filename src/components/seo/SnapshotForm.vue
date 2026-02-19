<script setup>
import { XMarkIcon } from '@heroicons/vue/24/solid';

</script>

<template>
    <form @submit.prevent="handleAnalyze" class="mt-2 flex flex-col flex-wrap rounded-md text-left w-full justify-center" v-if="!site && !isLoading">
        <div v-for="(field, index) in fields" :key="index" class="flex flex-col flex-wrap mb-4">
            <label :for="field.key" class="font-light">{{ field.label }}</label>
            <input
                :type="field.type"
                :id="field.key"
                :placeholder="field.placeholder"
                class="rounded-md p-2 mt-2 border-b border-blue-400"
                v-model="form[field.key]"
            />
        </div>
        <base-button class="max-w-24 mt-8" :disabled="!form.url">Generate</base-button>
    </form>
</template>

<script>
export default {
  props: {
    form: Object,
    fields: Array
  },
  emits: ['analyze', 'closeForm'],
  methods: {
    handleAnalyze() {
      this.$emit('analyze');
    },
    handleCloseForm() {
      this.$emit('closeForm');
    }
  }
}
</script>