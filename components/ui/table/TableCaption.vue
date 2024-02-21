<script setup lang="ts">
import { cn } from '@/utils'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <caption :class="cn('mt-4 text-sm text-neutral-500 dark:text-neutral-400', props.class)">
    <slot />
  </caption>
</template>
