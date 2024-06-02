import axios from "axios";
import { getBaseApi } from "../configuration";



const API_URL = getBaseApi();

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login =  (username, password) => {
  const response =  axios
    .post(API_URL + "signin", {
      username,
      password,
    });
  if (response.data.accessToken) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

export default {
  register,
  login,
  logout,
};
