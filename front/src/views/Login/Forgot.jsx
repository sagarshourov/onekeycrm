import logoUrl from "@/assets/images/logo.png";

import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import axios from "axios";
import { getBaseApi } from "../../configuration";

import { LoadingIcon } from "@/base-components";

const Forgot = (props) => {
  let navigate = useNavigate();
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const LOGIN_URL = getBaseApi() + "forgot";
  const [err, setErr] = useState([]);

  const handelLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (email == "") {
      setErr(["User E-mail  is required!"]);
    }

    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({ email }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

  
      setInfo(["E-mail Sent ! Please check your email."]);
      setLoading(false);
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
            <img
              className="mx-auto w-16"
              alt="Template"
              src={logoUrl}
            />
            <div className="text-white dark:text-slate-300 text-2xl font-medium text-center mt-14">
              Forgot Your Account!
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
              {info.length > 0 &&
                info.map((text, key) => {
                  return (
                    <h3 className="text-info" key={key}>
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

              <div className="mt-5 xl:mt-8 text-center xl:text-left">
                <button
                  onClick={handelLogin}
                  className="btn btn-primary w-full xl:mr-3"
                >
                  Send Password Reset Link
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

export default Forgot;
