<template>
  <div v-if="loading" class="row justify-center q-my-xl">
    <q-spinner color="primary" size="40px" />
  </div>
  <div v-else-if="!contracts.length">
      <mic-empty-state />
  </div>
  <div v-else class="row q-col-gutter-md">
    <div
      v-for="contract in contracts"
      :key="contract.idHopDong"
      class="col-12 col-md-6 col-lg-4"
    >
      <mic-contract-card 
        :contract="contract" 
        @view-history="$emit('view-history', $event)"
        @record-payment="$emit('record-payment', $event)"
        @update-payment="$emit('update-payment', $event)"
       />
    </div>
  </div>
</template>

<script setup>
import MicContractCard from './MicContractCard.vue';
import MicEmptyState from './MicEmptyState.vue';

defineProps({
  contracts: Array,
  loading: Boolean,
});

defineEmits(['view-history', 'record-payment', 'update-payment']);
</script>
