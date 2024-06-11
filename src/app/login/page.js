"use client";
import { useGoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { UserContext } from "../store/context/UserContextProvider";
import { ToastContext } from "../store/context/ToastContextProvider";
import axios from "axios";

export default function Login() {
  const { refetchUser } = useContext(UserContext);
  const { addToast } = useContext(ToastContext);


  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      
      addToast({
        message: "",
        type: "error",
      });

      const { data } = await axios.post("/api/auth/callback/google", {
        access_token: tokenResponse.access_token,
      });
      if (data.success && data.data && data.data.success) {
        refetchUser();
      } else {
        addToast({
          message: data.message ?? data?.data?.message ?? data?.error?.message,
          type: "error",
        });
      }
    },
  });

  return (
    <div className="hero min-h-screen bg-white">
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold text-secondary logo-font">
            koredor
          </h1>
          <p className="mb-5 text-black">
            Our platform is designed to help you evaluate and manage risks with
            ease and precision. Log in now to access powerful tools and insights
            tailored to secure your business's future. Your security and success
            are our top priorities.
          </p>
          <button className="btn btn-primary" onClick={() => login()}>
            Login Using your koredor Account
          </button>
        </div>
      </div>
    </div>
  );
}
