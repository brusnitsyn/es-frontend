<script setup lang="ts">
import { cn } from '@/utils'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <td
    :class="
      cn(
        'text-center align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] border last:border-r-0 first:border-l-0 border-b-0',
        props.class,
      )
    "
  >
    <slot />
  </td>
</template>
