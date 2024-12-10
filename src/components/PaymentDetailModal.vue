<template>
    <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal">
      <h4>Thông tin thanh toán</h4>
      <pre>{{ paymentDetails }}</pre>
      <button @click="close" class="btn btn-primary">Đóng</button>
    </div>
  </div>
  </template>
  
  <script setup>
import { ref, watch } from "vue";

const props = defineProps(["show", "payData"]);
const emit = defineEmits(["close"]);

const paymentDetails = ref("");

watch(() => props.payData, (newData) => {
  if (newData) {
    try {
      const parsedData = JSON.parse(newData);
      let dataString = "";
      for (let key in parsedData) {
        dataString += `${key}: ${parsedData[key]}\n`;
      }
      paymentDetails.value = dataString;
    } catch (error) {
      console.error("Error parsing payData", error);
      paymentDetails.value = "Dữ liệu không hợp lệ";
    }
  } else {
    paymentDetails.value = "";
  }
});

const close = () => {
  emit("close");
};
</script>

  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    width: 400px;
    text-align: left;
  }
  </style>
  