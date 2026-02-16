import axios from "axios";

const api = axios.create({
  baseURL: "/", // pode colocar import.meta.env.VITE_API_URL se quiser
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true, // importante se usar auth
});

export default api;