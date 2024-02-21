<script setup lang="ts">
import { MenubarSeparator, type MenubarSeparatorProps } from 'radix-vue'
import { cn } from '@/utils'

const props = defineProps<MenubarSeparatorProps>()
</script>

<template>
  <MenubarSeparator :class=" cn('-mx-1 my-1 h-px bg-neutral-100 dark:bg-neutral-800', $attrs.class ?? '')" v-bind="props" />
</template>
