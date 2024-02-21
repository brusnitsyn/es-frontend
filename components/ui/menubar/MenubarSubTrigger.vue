<script setup lang="ts">
import { MenubarSubTrigger, type MenubarSubTriggerProps } from 'radix-vue'
import { ChevronRightIcon } from '@radix-icons/vue'
import { cn } from '@/utils'

const props = defineProps<MenubarSubTriggerProps & { inset?: boolean; class?: string }>()
</script>

<template>
  <MenubarSubTrigger
    v-bind="props"
    :class="[
      cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-neutral-100 focus:text-neutral-900 data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-900 dark:focus:bg-neutral-800 dark:focus:text-neutral-50 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-50',
        inset && 'pl-8',
        props.class,
      ),
    ]"
  >
    <slot />
    <ChevronRightIcon class="ml-auto h-4 w-4" />
  </MenubarSubTrigger>
</template>
