<script setup lang="ts">
import {
  MenubarContent,
  type MenubarContentProps,
  MenubarPortal,
  useForwardProps,
} from 'radix-vue'
import { cn } from '@/utils'

const props = withDefaults(
  defineProps<MenubarContentProps & { class?: string }>(),
  {
    align: 'start',
    alignOffset: -4,
    sideOffset: 8,
  },
)
const forwarded = useForwardProps(props)
</script>

<template>
  <MenubarPortal>
    <MenubarContent
      v-bind="forwarded"
      :class="
        cn(
          'z-50 min-w-[12rem] overflow-hidden rounded-md border border-neutral-200 bg-white p-1 text-neutral-950 shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
          props.class,
        )
      "
    >
      <slot />
    </MenubarContent>
  </MenubarPortal>
</template>
