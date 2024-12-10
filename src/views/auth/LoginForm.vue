<template>
  <div class="background-image">
    <div class="container login-box">
      <div class="mb-3 h2">
        <div class="mb-3 d-flex justify-content-center">
          <div class="h2">
            <b>
              <i>LOGIN <span class="icon">PetStore</span></i>
            </b>
          </div>
        </div>
      </div>
      <div>
        <div class="mb-3">
          <label for="email" class="form-label">Email:</label>
          <input
            type="email"
            class="form-control"
            id="email"
            placeholder="Enter Email"
            v-model="userProps.email"
            @keyup.enter="onLogin"
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password:</label>
          <input
            type="password"
            class="form-control"
            id="password"
            placeholder="Enter Password"
            v-model="userProps.password"
            @keyup.enter="onLogin"
          />
        </div>
        <div class="w-100">
          <div @click="onLogin" class="btn btn-primary w-100">LOGIN</div>
        </div>
        <div v-if="error" class="error">{{ error }}</div>
        <h3 class="sign-up">
          <u>
            <i>
              <pre>Nếu bạn chưa có tài khoản, hãy nhấn <span class="signup" @click="onSignup">Đăng kí</span> ở đây nhé.</pre>
            </i>
          </u>
        </h3>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import { useAuth } from "@/stores/auth";
const router = useRouter();
const auth = useAuth();
const userProps = reactive({ email: "", password: "" });
const error = ref("");
async function onLogin() {
  try {
    await auth.login({ email: userProps.email, password: userProps.password });
    notify({ type: "success", text: "Đăng nhập thành công!" });
    const { user } = auth;
    if (user.role === "admin") {
      router.push({ path: "/admin" });
    } else {
      router.push({ path: "/" });
    }
  } catch (err) {
    error.value = "Đăng nhập thất bại. Vui lòng kiểm tra thông tin tài khoản.";
    notify({ type: "error", text: error.value });
  }
}
function onSignup() {
  router.push({ path: "/sign-up" });
}
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Lobster&display=swap");
main {
  max-width: none !important;
}
.container {
  width: 100%;
}
@media (max-width: 2000px) {
  .background-image {
    background-image: url("@/assets/img/background-login-sign.png");
    padding-top: 20px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    height: 95vh;
    align-items: flex-start;
    justify-content: center;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
}
.login-box {
  background: rgba(255, 255, 255, 0.8);
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 100%;
}

.sign-up {
  text-align: center;
  font-family: "Satisfy", cursive;
  font-size: 30px;
  color: #f0288c;
  margin-top: 15px;
}

.sign-up a {
  color: #007bff;
  text-decoration: none;
  font-size: 24px;
}

.sign-up a:hover {
  text-decoration: underline;
}
.w-100 {
  background-color: rgb(238, 63, 121);
  transition: background-color 0.3s ease, transform 0.3s ease,
    box-shadow 0.3s ease;
}
.w-100:hover {
  background-color: #ee3d3d;
  transform: scale(1.05);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}
.h2 {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  font-display: inherit;
  font-size: 50px;
}
.signup {
  color: #007bff;
  cursor: pointer;
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
