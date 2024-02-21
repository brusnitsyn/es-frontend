<script setup lang="ts">
import { cn } from '@/utils'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <tfoot :class="cn('bg-neutral-900 font-medium text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900', props.class)">
    <slot />
  </tfoot>
</template>
