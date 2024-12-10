<template>
  <div class="background-image">
    <div class="container signup-box">
      <div class="mb-3 h2">
        <div class="mb-3 d-flex justify-content-center">
          <div class="h2">
            <b>
              <i>REGISTER <span class="icon">PetStore</span></i>
            </b>
          </div>
        </div>
      </div>
      <div>
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            type="text"
            class="form-control"
            id="username"
            placeholder="Enter Username"
            v-model="userProps.username"
            required
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            id="email"
            placeholder="Enter Email"
            v-model="userProps.email"
            required
          />
          <div v-if="errorEmail" class="error">{{ errorEmail }}</div>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            placeholder="Enter Password"
            v-model="userProps.password"
            required
          />
        </div>
        <div class="mb-3">
          <label for="confirmPassword" class="form-label"
            >Confirm Password</label
          >
          <input
            type="password"
            class="form-control"
            id="confirmPassword"
            placeholder="Confirm Password"
            v-model="userProps.confirmPassword"
            required
          />
        </div>
        <div class="mb-3">
          <label for="address" class="form-label">Address</label>
          <input
            type="text"
            class="form-control"
            id="address"
            placeholder="Enter Address"
            v-model="userProps.address"
          />
        </div>
        <div class="w-100">
          <div @click="onSignup" class="btn btn-primary w-100">REGISTER</div>
        </div>
        <h3 class="login-redirect">
          <i>
            <u>
              <pre>Nếu bạn đã có tài khoản, hãy nhấn <span class="login" @click="onLogin">Đăng nhập</span> ở đây nhé.</pre>
            </u>
          </i>
        </h3>
        <div v-if="error" class="error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/stores/auth";

const router = useRouter();
const auth = useAuth();
const userProps = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  address: "",
});
const errorEmail = ref("");
const error = ref("");

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

async function onSignup() {
  if (
    !userProps.username ||
    !userProps.email ||
    !userProps.password ||
    !userProps.confirmPassword
  ) {
    error.value = "Vui lòng điền đầy đủ các trường bắt buộc!";
    return;
  }

  if (!validateEmail(userProps.email)) {
    errorEmail.value = "Email không đúng định dạng!";
    return;
  } else {
    errorEmail.value = "";
  }

  if (userProps.password !== userProps.confirmPassword) {
    error.value = "Mật khẩu không khớp!";
    return;
  }

  try {
    await auth.register(userProps);
    alert("Đăng ký thành công!");
    router.push({ path: "/" });
  } catch (err) {
    error.value = err.message || "Đăng ký thất bại!";
    console.error("Error registering user:", err);
  }
}

function onLogin() {
  router.push({ path: "/login" });
}
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Lobster&display=swap");
.container {
  width: 90%;
}

@media (max-width: 2000px) {
  .background-image {
    background-image: url("@/assets/img/background-login-sign.png");
    padding-top: 20px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    align-items: flex-start;
    justify-content: center;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
}

.signup-box {
  background: rgba(255, 255, 255, 0.8);
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 100%;
}

.login-redirect {
  text-align: center;
  font-family: Arial, sans-serif;
  font-size: 30px;
  color: #f0288c;
  margin-top: 15px;
}

.login {
  color: #007bff;
  cursor: pointer;
}

.login:hover {
  text-decoration: underline;
}

.w-100 {
  background-color: rgb(238, 63, 121);
  transition: background-color 0.3s ease, transform 0.3s ease,
    box-shadow 0.3s ease;
}

.w-100:hover {
  background-color: #ee3d3d;
  transform: scale(1.03);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.h2 {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  font-size: 50px;
}

.icon {
  color: #f350a1;
  font-family: "Lobster", cursive;
  font-size: 60px;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
