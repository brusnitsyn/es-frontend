<script setup lang="ts">
import { MenubarTrigger, type MenubarTriggerProps } from 'radix-vue'
import { cn } from '@/utils'

const props = defineProps<MenubarTriggerProps & { class?: string }>()
</script>

<template>
  <MenubarTrigger
    v-bind="props"
    :class="
      cn(
        'flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-neutral-100 focus:text-neutral-900 data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-900 dark:focus:bg-neutral-800 dark:focus:text-neutral-50 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-50',
        props.class,
      )
    "
  >
    <slot />
  </MenubarTrigger>
</template>
