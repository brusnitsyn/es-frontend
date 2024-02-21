<script setup lang="ts">
const isOpenedCorpusesDialog = ref(false)
const isOpenedFacultyDialog = ref(false)
const isOpenedAuditoryDialog = ref(false)
const isOpenedUserDialog = ref(false)
const isOpenedCreateUser = ref(false)

const authStore = useAuthStore()

</script>

<template>
    <div>
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>{{ authStore.user.name }}</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem disabled>
                      {{ authStore.rule.title }}
                    </MenubarItem>
                    <MenubarSeparator v-if="authStore.rule.slug === 'admin'" />
                    <MenubarItem v-if="authStore.rule.slug === 'admin'" @select="isOpenedCreateUser = true">
                      Добавить пользователя
                    </MenubarItem>
                  </MenubarContent>
            </MenubarMenu>
            <MenubarMenu v-if="authStore.rule.slug === 'admin'">
                <MenubarTrigger>Корпуса</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem @select="isOpenedCorpusesDialog = true">
                        Добавить
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu v-if="authStore.rule.slug === 'admin'">
                <MenubarTrigger>Факультеты</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem @select="isOpenedFacultyDialog = true">
                        Добавить
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu v-if="authStore.rule.slug === 'admin'">
                <MenubarTrigger>Аудитории</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem @select="isOpenedAuditoryDialog = true">
                        Добавить
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>

        <Dialog v-model:open="isOpenedCreateUser">
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать пользователя</DialogTitle>
              <DialogDescription>
                Заполните поля ниже
              </DialogDescription>
            </DialogHeader>
            <FormSignUp @success="isOpenedCreateUser = false" />
          </DialogContent>
        </Dialog>

        <Dialog v-model:open="isOpenedCorpusesDialog">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Добавить корпус</DialogTitle>
                    <DialogDescription>
                        Введите наименование корпуса
                    </DialogDescription>
                </DialogHeader>
                <FormCorpus @success="isOpenedCorpusesDialog = false" />
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="isOpenedFacultyDialog">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Добавить факультет</DialogTitle>
                    <DialogDescription>
                        Заполните поля ниже
                    </DialogDescription>
                </DialogHeader>
                <FormFaculty @success="isOpenedFacultyDialog = false" />
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="isOpenedAuditoryDialog">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Добавить аудиторию</DialogTitle>
                    <DialogDescription>
                        Заполните поля ниже
                    </DialogDescription>
                </DialogHeader>
                <FormAuditory @success="isOpenedAuditoryDialog = false" />
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="isOpenedUserDialog">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Добавить пользователя</DialogTitle>
                    <DialogDescription>
                        Заполните поля ниже
                    </DialogDescription>
                </DialogHeader>
                <div class="py-4">
                    <Label for="name">Имя и фамилия</Label>
                    <Input id="name" placeholder="Татьяна Вершинина" />
                </div>
                <DialogFooter>
                    <Button>Добавить</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>