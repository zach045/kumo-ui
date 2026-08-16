<script setup>
defineProps({
  form: { type: Object, required: true },
  fields: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
});

defineEmits(['analyze']);
</script>

<template>
  <form class="mt-7 space-y-5" @submit.prevent="$emit('analyze')">
    <div v-for="field in fields" :key="field.key">
      <label :for="field.key" class="text-sm font-bold text-slate-700">{{ field.label }}</label>
      <input
        :id="field.key"
        v-model="form[field.key]"
        :type="field.type"
        :placeholder="field.placeholder"
        :required="field.key === 'url'"
        class="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
      />
    </div>

    <button
      type="submit"
      :disabled="!form.url || isLoading"
      class="inline-flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {{ isLoading ? 'Analyzing website…' : 'Generate snapshot' }}
    </button>
  </form>
</template>
