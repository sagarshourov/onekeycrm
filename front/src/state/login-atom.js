import { atom, selector } from "recoil";

export const loginState = atom({
  key: "loginState",
  default: {
    email: "",
    profile_image: localStorage.profile_image
      ? localStorage.getItem("profile_image")
      : "",
    first_name: localStorage.first_name
      ? localStorage.getItem("first_name")
      : "",
    last_name: localStorage.last_name ? localStorage.getItem("last_name") : "",
    isAdmin: localStorage.isAdmin ? localStorage.getItem("isAdmin") : 0,
    token: localStorage.token ? localStorage.getItem("token") : "",
    role: localStorage.role ? parseInt(localStorage.getItem("role")) : 0,
    userId: localStorage.userId ? parseInt(localStorage.getItem("userId")) : 0,
    view: localStorage.view ? localStorage.getItem("view") : false,
    team: localStorage.team ? parseInt(localStorage.getItem("team")) : 0,
  },
});
