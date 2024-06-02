import logoUrl from "@/assets/images/logo.png";

import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import axios from "axios";
import { getBaseApi } from "../../configuration";

import { LoadingIcon } from "@/base-components";

import { useRecoilState } from "recoil";

import { loginState } from "../../state/login-atom";

const Login = (props) => {
  let navigate = useNavigate();

  const [loginstate, setLoginState] = useRecoilState(loginState);

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const LOGIN_URL = getBaseApi() + "login";
  const [err, setErr] = useState([]);

  const handelLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (email == "" || password == "") {
      setErr(["User E-mail and password is required!"]);
    }

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response?.data.success) {
        const accessToken = response?.data?.data?.token;
        const roles = response?.data?.data?.user?.is_admin;

        if (roles == 1) {
          localStorage.setItem("isAdmin", true);
        }

        localStorage.setItem("loggedIn", true);
        localStorage.setItem("token", accessToken);
        localStorage.setItem(
          "user",
          JSON.stringify(response?.data?.data?.user)
        );

        localStorage.setItem(
          "first_name",
          response?.data?.data?.user?.first_name
        );
        localStorage.setItem(
          "last_name",
          response?.data?.data?.user?.last_name
        );
        if (response?.data?.data.profile_image) {
          localStorage.setItem(
            "profile_image",
            response?.data?.data?.profile_image?.file_path
          );
        }
        if (response?.data?.data.user) {
          localStorage.setItem("userId", response?.data?.data?.user?.id);
          localStorage.setItem("team", response?.data?.data?.user?.team);
        }

        localStorage.setItem("role", roles);

        setLoginState({
          profile_image: response?.data?.data?.profile_image?.file_path,
          email: email,
          first_name: response?.data?.data?.user?.first_name,
          last_name: response?.data?.data?.user?.last_name,
          isAdmin: roles == 1 ? roles : 0,
          role: roles,
          token: accessToken,
          userId: response?.data?.data?.user?.id,
          team: response?.data?.data?.user?.team,
        });

        navigate("../", { replace: true });
      } else {
        setLoading(false);

        setErr(Object.values(response.data.data));
      }
    } catch (err) {
      setLoading(false);

      err?.response?.data?.data &&
        setErr(Object.values(err.response.data.data));
    }
  };
  return (
    <>
      <div className="container">
        {/* <DarkModeSwitcher />
        <MainColorSwitcher /> */}
        <div className="w-full min-h-screen p-5 md:p-20 flex items-center justify-center">
          <div className="w-96 intro-y">
            <img className="mx-auto w-16" alt="Template" src={logoUrl} />
            <div className="text-white dark:text-slate-300 text-2xl font-medium text-center mt-14">
              Login to Your Account!
            </div>
            <div className="box px-5 py-8 mt-10 max-w-[450px] relative before:content-[''] before:z-[-1] before:w-[95%] before:h-full before:bg-slate-200 before:border before:border-slate-200 before:-mt-5 before:absolute before:rounded-lg before:mx-auto before:inset-x-0 before:dark:bg-darkmode-600/70 before:dark:border-darkmode-500/60">
              {err.length > 0 &&
                err.map((text, key) => {
                  return (
                    <h3 className="text-danger py-3 text-center" key={key}>
                      {text}
                    </h3>
                  );
                })}

              <input
                type="text"
                className="form-control py-3 px-4 block"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="form-control py-3 px-4 block mt-4"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="text-slate-500 flex text-xs sm:text-sm mt-4">
                <div className="flex items-center mr-auto">
                  <input
                    type="checkbox"
                    className="form-check-input border mr-2"
                    id="remember-me"
                  />
                  <label
                    className="cursor-pointer select-none"
                    htmlFor="remember-me"
                  >
                    Remember me
                  </label>
                </div>
                <Link to="/forgot">Forgot Password?</Link>
              </div>
              <div className="mt-5 xl:mt-8 text-center xl:text-left">
                <button
                  onClick={handelLogin}
                  className="btn btn-primary w-full xl:mr-3"
                >
                  Login
                  {loading && (
                    <LoadingIcon
                      icon="three-dots"
                      color="white"
                      className="w-4 h-4 ml-2"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
