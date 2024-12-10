<template>
  <div class="main-wrap">
    <div class="mb-3 h2">
      <div class="mb-3 d-flex justify-content-start">
        <router-link to="/admin/products" class="h3">{{ route.meta.title }}</router-link>
        <div class="px-2">/</div>
        <div class="h3">{{ state.title }}</div>
      </div>
    </div>
    
    <div>
      <div class="mb-3">
        <label for="name" class="form-label">Tên sản phẩm</label>
        <input type="text" class="form-control" id="name" placeholder="Nhập tên sản phẩm" v-model="state.pet.name" />
      </div>

      <div class="mb-3">
        <label for="price" class="form-label">Giá:</label>
        <input type="number" class="form-control" id="price" placeholder="Nhập giá" v-model="state.pet.price" />
      </div>

      <div class="mb-3">
        <label for="discount" class="form-label">Giảm giá:</label>
        <input type="number" class="form-control" id="discount" placeholder="Nhập giảm giá" v-model="state.pet.discount" />
      </div>

      <!-- Dropdown cho Loại thú cưng -->
      <div class="mb-3">
        <label for="cat_pet" class="form-label">Loại thú cưng:</label>
        <select class="form-control" id="cat_pet" v-model="state.pet.cat_pet" @change="onChangePet">
          <option v-for="pet in state.pets" :key="pet.id" :value="pet.id">{{ pet.name }}</option>
        </select>
      </div>

      <!-- Dropdown cho Loại sản phẩm -->
      <div class="mb-3">
        <label for="cat_pro" class="form-label">Loại sản phẩm:</label>
        <select class="form-control" id="cat_pro" v-model="state.pet.cat_pro">
          <option v-for="product in state.categories" :key="product.id" :value="product.id">{{ product.name }}</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="file" class="form-label">Tải lên hình ảnh:</label>
        <input type="file" class="form-control" id="file" @change="onFileChange" />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Mô tả:</label>
        <textarea class="form-control" id="description" placeholder="Nhập mô tả" v-model="state.pet.description" rows="3"></textarea>
      </div>

      <div class="w-100">
        <div @click="onSave" class="btn btn-primary w-100">Lưu</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, reactive } from "vue";
import productApi from "@/api/product";
import catPetApi from '@/api/cat-pet';
import catProApi from '@/api/cat-product';
import { useRoute, useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";

const route = useRoute();
const router = useRouter();

const state = reactive({
  busy: true,
  title: "Thêm mới",
  fileSelected: null,
  pet: {
    id: null,
    name: "",
    price: null,
    cat_pro: 0,
    cat_pet: 0,
    discount: 0,
    description: "",
    picture: ""
  },
  categories: [],
  pets: []

});


async function onSave() {
  try {
    if (state.fileSelected) {
      const data =  await productApi.uploadImage(state.fileSelected)
      if (data?.filename) {
        state.pet.picture = data.filename
        state.fileSelected = null;
      }
    }

    if (route.params.id) {
      // Chỉnh sửa sản phẩm
      await productApi.edit(route.params.id, state.pet);
    } else {
      // Thêm mới sản phẩm
      await productApi.add(state.pet);
    }
    notify({ title: "Thông báo", text: "Thao tác thành công!" });
    router.push({ name: "admin-products" });
  } catch (error) {
    notify({ title: "Thông báo", text: "Thao tác không thành công!", type: 'warn' });
  }
}

const fetchPets = async () => {
  const {list} = await catPetApi.find(new URLSearchParams({ limit: 100 }))
  if (list) {
    state.pets = list
  }
}

const onChangePet = () => {
  fetchPros(state.pet.cat_pet)
}

const fetchPros = async (cat_pet) => {
  const {list} = await catProApi.find(new URLSearchParams({ limit: 100, cat_pet }))
  if (list) {
    state.categories = list
    console.log(list);
  }
}

function onFileChange(event) {
  state.fileSelected = event.target.files[0];
  
}

onBeforeMount(() => {
  state.fileSelected = null;
  if (route.params.id) {
    productApi.pet(route.params.id)
      .then((data) => {
        state.pet = data
        fetchPros(data.cat_pet)
      })
      .catch((err) => console.log(err));
    state.title = "Cập nhật";
  }
  fetchPets()
});
</script>

<style lang="scss" scoped>
.main-wrap {
  width: 100%;
}
</style>
