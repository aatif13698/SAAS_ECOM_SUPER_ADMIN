import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import Social from "./common/social";
import useDarkMode from "@/hooks/useDarkMode";

import IntroImage from "@/assets/images/loginIlustration.png";
const login = () => {
  const [isDark] = useDarkMode();
  const style = {
    backgroundColor: "#f1f5f9",
  };
  return (
    <div className="loginwrapper">
      <div className="lg-inner-column">
        <div className="left-column relative z-[1]">
          <div className="max-w-full pt-20 ltr:pl-20 rtl:pr-20 " style={style}>
            <div className="flex gap-3">
              <Link to="/">
                <img
                  src={isDark ? "" : ""}
                  alt=""
                  className="mb-10 w-[200px]"
                />
              </Link>
            </div>

            {/* <h4>
              <p className="text-white"> Unlock your Project</p>
              <span className="text-orange-600 dark:text-slate-400 font-bold">
                performance
              </span>
            </h4> */}
          </div>
          <div
            className="absolute left-0 2xl:bottom-[-160px] bottom-[-130px] h-full w-full z-[-1]  text-center items-center"
            style={style}
          >
            <img
              src={IntroImage}
              alt=""
              className="h-full w-[300px] object-contain text-center justify-center items-center"
              style={{
                marginLeft: "8em",
                width: "28em",
                paddingBottom: "8em",
              }}
            />
          </div>
          {/* <img
            src={EllipseLogo}
            alt=""
            className=" w-[1]  text-center justify-center items-center top-5 pt-12"
            style={{ width: "120px", marginTop: "96px", marginLeft: "30%" }}
          /> */}
        </div>
        <div className="right-column relative bg-white dark:bg-darkSecondary">
          <div className="inner-content h-full flex flex-col  ">
            <div className="auth-box h-full flex flex-col justify-center">
              <div className="mobile-logo text-center mb-6 lg:hidden block">
                <Link to="/">
                  <img
                    src={isDark ? "" : ""}
                    alt=""
                    className="mx-auto w-12 bg-red-600"
                  />
                </Link>
              </div>
              <div className="text-center 2xl:mb-10 mb-4">
                <h4 className="font-medium">Sign in</h4>
                <div className="text-slate-500 text-base">
                  Sign in to your account to start using Kosmo
                </div>
              </div>
              <LoginForm />
              {/* <div className="relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                <div className="absolute inline-block bg-white dark:bg-slate-800 dark:text-slate-400 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm text-slate-500 font-normal">
                  Or continue with
                </div>
              </div> */}
              {/* <div className="max-w-[242px] mx-auto mt-8 w-full">
                <Social />
              </div> */}
              {/* <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-12 uppercase text-sm">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-slate-900 dark:text-white font-medium hover:underline"
                >
                  Sign up
                </Link>
              </div> */}
            </div>
            <div className="auth-footer text-center">
              Powered By
              <a href="" target="_blank">
                <span className="text-blue-500"> SPK Technosoft &reg;</span>{" "}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default login;
