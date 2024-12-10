<template>
  <div class="main-wrap">
    <div class="mb-3 h2">
      <div class="mb-3 d-flex justify-content-start">
        <router-link to="/admin/cat-pro" class="h3">{{
          route.meta.title
        }}</router-link>
        <div class="px-2">/</div>
        <div class="h3">{{ state.title }}</div>
      </div>
    </div>
    <MyLoading v-if="state.busy" />
    <div>
      <div class="mb-3">
        <label for="name" class="form-label">Tên loại</label>
        <input
          type="text"
          class="form-control"
          id="name"
          placeholder="Nhập loại"
          v-model="state.product.name"
          required
        />
      </div>
      <div>
        <label for="name" class="form-label">Thu cung:</label>
        <select class="form-select" name="cat_pet" required aria-label="Category product" v-model="state.product.cat_pet">
          <option
            v-for="cat in state.categories"
            :key="`cat-${cat.id}`"
            :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>
      <div class="mt-3">
        <div @click="onSave" class="btn btn-primary w-100">Lưu</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, reactive } from "vue";
import api from "@/api/cat-product";
import catApi from "@/api/cat-pet";
import { useRoute, useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import MyLoading from "@/components/Loading.vue";

const route = useRoute();
const router = useRouter();

const state = reactive({
  busy: false,
  title: "Thêm mới",
  product: {
    id: null,
    name: "",
    cat_pet: 1
  },
  categories: [],
});

async function onSave() {
  if (!state.product.name) {
    notify({
      type: "error",
      title: "Thông tin",
      text: "Tên loại không được để trống!",
    });
    return;
  }

  if (route.params.id) {
    const data = await api.update(route.params.id, state.product); // Đảm bảo gọi update
  } else {
    const data = await api.add(state.product); // Gọi add cho trường hợp tạo mới
  }
  notify({ title: "Thông tin", text: "Thao tác thành công!" });
  router.push({ name: "cat-pro" });
}

onBeforeMount(() => {
  const fetchData = async () => {
    state.busy = true;

    if (route.params.id) {
      const data = await api.getById(route.params.id);
      state.title = "Cập nhật";
      state.product = data;
    }

    const result = await catApi.find("limit=100");
    if (result.list) {
      state.categories = result.list;
    }
    state.busy = false;
  };
  fetchData();
});
</script>

<style lang="scss" scoped>
.main-wrap {
  width: 100%;
}
</style>