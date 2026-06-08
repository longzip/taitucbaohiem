<template>
  <div v-if="loading" class="row justify-center q-my-xl">
    <q-spinner color="primary" size="40px" />
  </div>
  <div v-else-if="!items.length" class="column items-center justify-center q-my-xl text-grey">
      <q-icon name="person_search" size="64px" />
      <div class="text-subtitle1 q-mt-sm">Không tìm thấy người tham gia nào phù hợp</div>
  </div>
  <div v-else class="row q-col-gutter-md">
    <div
      v-for="item in items"
      :key="item.id"
      class="col-12 col-md-6 col-lg-4"
    >
      <slot :item="item"></slot>
    </div>
  </div>
</template>
<script setup>
defineProps({
  items: Array,
  loading: Boolean,
});
</script>
