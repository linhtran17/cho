<template>
  <div class="main-wrap">
    <div class="mb-3 h2">
      <div class="mb-3 d-flex justify-content-start">
        <router-link to="/admin/cat-pets" class="h3">{{ route.meta.title }}</router-link>
        <div class="px-2">/</div>
        <div class="h3">{{ state.title }}</div>
      </div>
    </div>
    <MyLoading v-if="state.busy"/>
    <div>
      <div class="mb-3">
        <label for="name" class="form-label">Tên loại</label>
        <input
          type="text"
          class="form-control"
          id="name"
          placeholder="Nhập loại"
          v-model="state.pet.name"
        />
      </div>
      <div class="">
        <div @click="onSave" class="btn btn-primary">Lưu</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, reactive } from "vue";
import api from "@/api/cat-pet";
import { useRoute, useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import MyLoading from '@/components/Loading.vue';

const route = useRoute();
const router = useRouter();

const state = reactive({
  busy: false,
  title: "Thêm mới",
  pet: {
    id: null,
    name: "",
  },
});

async function onSave() {
  if (route.params.id) {
    const data = await api.edit(route.params.id, state.pet);
  } else {
    const data = await api.add(state.pet);
  }
  notify({ title: "Thông tin", text: "Thao tác thành công!" });
  router.push({ name: "cat-pets" })

}

onBeforeMount(() => {
  if (route.params.id) {
    state.pet = true
    api
      .getById(route.params.id)
      .then((data) => (state.pet = data))
      .catch((err) => console.log(err));
    state.title = "Cập nhật";
  }
});
</script>

<style lang="scss" scoped>
.main-wrap {
  width: 100%;
}
</style>