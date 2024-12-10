import axios from "axios";

const URL_BASE = "http://localhost:8000/api";

const instance = axios.create({
  baseURL: URL_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});


const AUTH_TOKEN = 'auth/user-token'

const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  }
  const token = localStorage.getItem(AUTH_TOKEN)
  if (token) {
    headers['authorization'] = `Bearer ${token}`
  }

  return headers;
}

export default {
  get: function (url, params) {
    return instance.get(url, { params, headers: getHeaders() }); // Sử dụng params cho các yêu cầu GET
  },
  post: function (url, data) {
    return instance.post(url, data, { headers: getHeaders() });
  },
  put: function (url, data) {
    // Đổi tên từ 'update' thành 'put'
    return instance.put(url, data, { headers: getHeaders() });
  },
  delete: function (url) {
    return instance.delete(url, { headers: getHeaders() });
  },
};
