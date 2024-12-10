<template>
    <div class="main-wrap">
      <div class="mb-3 h2">
        <div class="mb-3 d-flex justify-content-start">
          <router-link to="/admin/news" class="h3">{{ route.meta.title  }}</router-link>
          <div class="px-2">/</div>
          <div class="h3">{{ state.title }}</div>
        </div>
      </div>
      <div>
        <div class="mb-3">
          <label for="tieude" class="form-label">Tiêu đề</label>
          <input type="text" class="form-control" id="tieude" placeholder="Nhập tiêu đề" v-model="state.news.tieude" />
        </div>
        <div class="mb-3">
          <label for="noidung" class="form-label">Nội dung:</label>
            <textarea  type="text" class="form-control" id="description" placeholder="Nhập nội dung"
            v-model="state.news.noidung" rows="3">
          </textarea>
        </div>
    
        <div class="mb-3">
            <label for="file" class="form-label">Tải lên hình ảnh:</label>
            <input type="file" class="form-control" id="file" @change="onFileChange" />
        </div>
       
        <div class="mb-3">
          <label for="published_date" class="form-label">Ngày xuất bản:</label>
          <input type="date" class="form-control" id="published_date" placeholder="Nhập ngày xuất bản"
            v-model="state.news.published_date" />
        </div>

 
        <div class="w-100">
          <div @click="onSave" class="btn btn-primary w-100">Lưu</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onBeforeMount, reactive } from "vue";
  import newsApi from "@/api/news";
  import { useRoute, useRouter } from "vue-router";
  import { notify } from "@kyvg/vue3-notification";
  const route = useRoute();
  const router = useRouter();
  
  const state = reactive({
    busy: true,
    title: "Thêm mới",
    news: {
      id: null,
      tieude: "",
      noidung: "",
      hinhanh: "",
      published_date: "",
      status: ""
    },
  });
  
async function onSave() {
  try {
    if (state.fileSelected) {
      const data =  await productApi.uploadImage(state.fileSelected)
      if (data?.filename) {
        state.news.hinhanh = data.filename
        state.fileSelected = null;
      }
    }

    if (route.params.id) {
      // Chỉnh sửa sản phẩm
      await newsApi.edit(route.params.id, state.news);
    } else {
      // Thêm mới sản phẩm
      await newsApi.add(state.news);
    }
    notify({ title: "Thông báo", text: "Thao tác thành công!" });
    router.push({ name: "nenew-admin" });
  } catch (error) {
    notify({ title: "Thông báo", text: "Thao tác không thành công!", type: 'warn' });
  }
}
const fetchNews = async () => {
  const {list} = await newsApi.find(new URLSearchParams({ limit: 100 }))
  if (list) {
    state.news = list
  }
}
function onFileChange(event) {
  state.fileSelected = event.target.files[0];
  
}
onBeforeMount(() => {
  state.fileSelected = null;
  if (route.params.id) {
    newsApi.news(route.params.id)
      .then((data) => { state.mews = data})
      .catch((err) => console.log(err));
    state.title = "Cập nhật";
  }
  fetchNews()
});

  
  
  </script>
  
  <style lang="scss" scoped>
  .main-wrap {
    width: 100%;
  }
  </style>