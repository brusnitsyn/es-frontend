<script setup lang="ts">
import { cn } from '@/utils'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <th :class="cn('border-l border-r first:border-l-0 last:border-r-0 h-10 px-2 text-center align-middle font-medium text-neutral-500 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] dark:text-neutral-400', props.class)">
    <slot />
  </th>
</template>
