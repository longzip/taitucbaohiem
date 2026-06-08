<template>
  <div v-if="loading" class="row justify-center q-my-xl">
    <q-spinner color="primary" size="40px" />
  </div>
  <div v-else-if="!contracts.length">
      <tnds-empty-state />
  </div>
  <div v-else class="row q-col-gutter-md">
    <div v-for="contract in contracts" :key="contract.id" class="col-12 col-md-6 col-lg-4">
      <tnds-contract-card :contract="contract" @click="$emit('edit', contract)" />
    </div>
  </div>
</template>

<script setup>
import TndsContractCard from './TndsContractCard.vue';
import TndsEmptyState from './TndsEmptyState.vue';

defineProps({
  contracts: Array,
  loading: Boolean,
});
defineEmits(['edit']);
</script>
