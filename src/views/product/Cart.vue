<template>
  <div
    class="cart-wrap offcanvas offcanvas-end"
    :class="{ show: props.show }"
    data-bs-scroll="true"
    data-bs-backdrop="static"
    tabindex="-1"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">{{ state[state.step] }}</h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        @click="$emit('onClose')"
      ></button>
    </div>
    <div class="offcanvas-body">
      <!-- Customer Info -->
      <div v-if="state.step === 1 || state.step === 2">
        <div>
          <label for="name" class="form-label">Họ và tên</label>
          <input
            :disabled="state.step === 2"
            type="text"
            class="form-control"
            id="name"
            placeholder="Nhập tên nhận hàng"
            v-model="state.fullname"
          />
        </div>
        <div class="mt-3">
          <label for="phone" class="form-label">Số điện thoại:</label>
          <input
            type="phone"
            :disabled="state.step === 2"
            class="form-control"
            id="phone"
            placeholder="Nhập số điện thoại nhận hàng"
            v-model="state.phone"
          />
        </div>
        <div class="mt-3">
          <label for="email" class="form-label">Email:</label>
          <input
            type="email"
            :disabled="state.step === 2"
            class="form-control"
            id="email"
            placeholder="Nhập số điện thoại nhận hàng"
            v-model="state.email"
          />
        </div>
        <div class="mt-3">
          <label for="address" class="form-label">Địa chỉ:</label>
          <input
            type="address"
            :disabled="state.step === 2"
            class="form-control"
            id="address"
            placeholder="Nhập địa chỉ nhận hàng"
            v-model="state.deliveryAddress"
          />
        </div>
        <div class="mt-3">
          <label for="note" class="form-label">Ghi chú:</label>
          <textarea
            type="text"
            :disabled="state.step === 2"
            class="form-control"
            id="note"
            placeholder="Nhập ghi chú cho đơn hàng"
            v-model="state.note"
            rows="3"
          ></textarea>
        </div>
        <div class="mt-3" v-if="state.step === 2">
          <label class="form-label">Phương thức thanh toán:</label>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              id="cashPayment"
              value=""
              v-model="state.pay"
            />
            <label class="form-check-label" for="cashPayment"
              >Thanh toán khi nhận hàng</label
            >
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              id="bankTransfer"
              value="PAY"
              v-model="state.pay"
            />
            <label class="form-check-label" for="bankTransfer"
              >Chuyển khoản</label
            >
          </div>
        </div>

        <div v-if="state.pay === 'PAY'">
          <b-form-group
            label="Vui lòng lựa chọn phương thức thanh toán"
            v-slot="{ ariaDescribedby }"
          >
            <b-form-radio-group
              id="radio-group-1"
              v-model="state.bankCode"
              :options="banks"
              :aria-describedby="ariaDescribedby"
              name="radio-options"
            ></b-form-radio-group>
          </b-form-group>
        </div>

        <div class="mt-3 d-flex confirm-wrap" v-if="state.step === 1">
          <button
            class="btn btn-outline-secondary w-100 mr-1"
            @click="state.step = 0"
          >
            Quay lại
          </button>
          <button class="btn btn-danger w-100 ml-1" @click="state.step = 2">
            Mua hàng
          </button>
        </div>
      </div>

      <!-- Cart list -->
      <div v-if="state.step === 0 || state.step === 2">
        <table
          class="table table-hover table-striped table-responsive caption-top"
        >
          <caption v-if="state.step === 2" class="fw-bold mt-3">
            <h4 class="fw-300">Danh sách sản phẩm</h4>
          </caption>
          <thead>
            <tr>
              <th class="fw-bold">ID</th>
              <th class="fw-bold">Tên</th>
              <th class="text-center fw-bold">Số lượng</th>

              <th class="text-center fw-bold">Giảm giá</th>
              <th class="text-end fw-bold">Giá</th>
              <th class="text-end fw-bold">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, inx) in cartStore.products"
              :key="`products-${inx}`"
            >
              <td>{{ inx + 1 }}</td>
              <td>{{ item?.name }}</td>
              <td class="text-center">
                <div class="quanlity-wrap">
                  <button
                    class="btn btn-outline-info btn-sm"
                    @click="cartStore.updateQuantity(item.id, -1)"
                  >
                    -
                  </button>
                  <span class="fw-bold">{{ item?.quantity }}</span>
                  <button
                    class="btn btn-outline-info btn-sm"
                    @click="cartStore.updateQuantity(item.id, 1)"
                  >
                    +
                  </button>
                </div>
              </td>
              <td class="text-center">
                <span v-if="item?.discount"
                  >{{ item?.discount }}% ({{
                    formatCurrency(
                      (item?.discount * item.quantity * item.price) / 100
                    )
                  }})</span
                >
              </td>
              <td class="text-end">{{ formatCurrency(item?.price) }}</td>
              <td class="text-end">
                {{
                  formatCurrency(
                    item?.price * item.quantity -
                      (item?.discount * item.quantity * item.price) / 100
                  )
                }}
              </td>
            </tr>
            <tr>
              <td colspan="5" class="text-end fw-bold">Tổng tạm tính:</td>
              <td class="text-end fw-bold">
                {{ formatCurrency(cartStore.totalPrice) }}
              </td>
            </tr>
            <tr>
              <td colspan="5" class="text-end fw-bold">Giảm giá:</td>
              <td class="text-end fw-bold">
                {{ formatCurrency(cartStore.totalDiscount) }}
              </td>
            </tr>
            <tr>
              <td colspan="5" class="text-end fw-bold">Thành tiền:</td>
              <td class="text-end text-danger fw-bold">
                {{
                  formatCurrency(cartStore.totalPrice - cartStore.totalDiscount)
                }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="mt-3 d-flex confirm-wrap" v-if="state.step === 0">
          <button
            class="btn btn-outline-secondary w-100 mr-1"
            @click="$emit('onClose')"
          >
            Đóng
          </button>
          <button class="btn btn-danger w-100 ml-1" @click="state.step = 1">
            Mua hàng
          </button>
        </div>
      </div>

      <div class="mt-3 d-flex confirm-wrap" v-if="state.step === 2">
        <button
          class="btn btn-outline-secondary w-100 mr-1"
          @click="state.step = 1"
        >
          Quay lại
        </button>
        <button class="btn btn-danger w-100 ml-1" @click="onConfirm">
          Xác nhận
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCart } from "@/stores/cart";
import { defineProps, onMounted, reactive } from "vue";
import { notify } from "@kyvg/vue3-notification";
import orderApi from "@/api/orders";
import { useAuth } from "@/stores/auth";

const cartStore = useCart();
const storeAuth = useAuth();

const state = reactive({
  step: 0,
  0: "Đơn hàng",
  1: "Thông tin nhận hàng",
  2: "Thông tin đơn hàng",
  fullname: storeAuth.user?.username || "",
  deliveryAddress: storeAuth.user?.address || "",
  phone: storeAuth.user?.phone || "",
  email: storeAuth.user?.email || "",
  note: "",
  username: storeAuth.user?.username || "",
  pay: "",
  bankCode: "VNBANK",
});

const props = defineProps(["show"]);
const $emit = defineEmits("onClose");

const banks = [
  { text: "Thanh toán qua ATM-Tài khoản ngân hàng nội địa", value: "VNBANK" },
  { text: "Thanh toán qua thẻ quốc tế", value: "INTCARD" },
];

onMounted(() => {
  state.fullname = storeAuth.user?.username || "";
  state.deliveryAddress = storeAuth.user?.address || "";
  state.phone = storeAuth.user?.phone || "";
  state.email = storeAuth.user?.email || "";
  state.note = "";
  state.username = storeAuth.user?.username || "";
});

// Hàm kiểm tra lỗi cho phone và email
function isValidPhone(phone) {
  const phoneRegex = /^[0-9]{10,15}$/; // Kiểm tra số điện thoại hợp lệ
  return phoneRegex.test(phone);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Kiểm tra email hợp lệ
  return emailRegex.test(email);
}

async function onConfirm() {
  const { fullname, deliveryAddress, phone, email, note, username } = state;

  // Kiểm tra lỗi phone và email
  if (!isValidPhone(phone)) {
    notify({
      title: "Lỗi thông tin",
      text: "Số điện thoại không hợp lệ.",
      type: "warning",
    });
    return;
  }

  if (!isValidEmail(email)) {
    notify({
      title: "Lỗi thông tin",
      text: "Email không hợp lệ.",
      type: "warning",
    });
    return;
  }

  const products = cartStore.products.map(
    ({ discount, price, quantity, id, note }) => ({
      discount,
      price,
      quantity,
      id,
      note,
    })
  );

  const data = await orderApi.add({
    fullname,
    username: username || "",
    deliveryAddress,
    phone,
    email,
    note,
    products,
    pay: {
      pay: state.pay,
      bankCode: state.bankCode,
    },
  });

  console.log(data);

  if (data?.status) {
    state.step = 0;
    notify({
      title: "Đặt hàng thành công",
      text: "Bạn đã đặt hàng thành công. Cảm ơn bạn đã mua hàng",
      type: "success",
    });
    cartStore.confirm();
    if (data.link) window.open(data.link, "_blank");
    $emit("onClose");
  } else {
    notify({
      title: "Đặt hàng không thành công",
      text: "Đặt hàng không thành công. Vui lòng kiểm tra lại đơn hàng!",
      type: "warning",
    });
  }
}
</script>
<style lang="scss">
.cart-wrap {
  .confirm-wrap {
    gap: 16px;
  }

  .quanlity-wrap {
    display: flex;
    gap: 0.5rem;
    justify-items: center;
    align-content: center;
    align-items: center;
  }
}
</style>