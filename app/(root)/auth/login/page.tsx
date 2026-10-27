"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import Logo from "@/assets/images/logo-black.png";
import Image from "next/image";

import {
  Field,
  
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { useFormik } from "formik";

import { loginSchema } from "@/lib/zodScheema/zosScheema";
import ButtonLoading from "@/components/Application/Button";
import Link from "next/link";


import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import { response } from "@/lib/helperFunctions";
import OtpVerification from "@/components/Application/OtpVerification";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import { USER_DASHBOARD, WEBSITE_RESETPASSWORD } from "@/routes/website.route";



import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ADMIN_DASHBOARD } from "@/routes/AdminPanel.route";
const Page = () => {
const searchParams=useSearchParams()
const router=useRouter()
  const dispatch = useDispatch()


  const [loading, setLoading] = useState<boolean>(false)
  const [otpLoading, setotpLoading] = useState<boolean>(false)
  const [see, setSee] = useState(false)
  const [otpEmail, setOtpEmail] = useState<string>()
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validate: (values) => {
      const schema = loginSchema.pick({
        email: true,
        password: true,
      });

      const result = schema.safeParse(values);

      if (result.success) {
        return {};
      }

      const errors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (typeof field === "string") {
          errors[field] = issue.message;
        }
      });

      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      console.log("🔥 onSubmit executed");
      console.log("📦 Values:", values);

      try {
        setLoading(true);

        const  data  = await axios.post(
          "/api/auth/login",
          values,
          {
            validateStatus: (status) => status < 500,
          }

        );

        console.log("✅ login response:", data.data);

        if (data.data.success===false) {
          console.log("HASH")
          showToast({
            type: "error",
            content: data.data.message || "Invalid email or password",
          });

          return; // ⭐ VERY IMPORTANT
        }


        setOtpEmail(values.email);

        showToast({
          type: "success",
          content: data.data.message || "OTP sent successfully",
        });

        resetForm();
      } catch (error: unknown) {
        console.error("❌ Registration error:", error);

        if (axios.isAxiosError(error)) {
          console.log("API Error:", error.response?.data);
          showToast({ type: "error", content: error.response?.data?.message || "login failed", });

        } else if (error instanceof Error) {
          // alert(error.message);
          
          showToast({ type: "error", content: error.message, });
        } else {
          // alert("Something went wrong");
          showToast({ type: "error", content: "Something went wrong", });
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const handleVerification = async (values: Record<string, string>, reset: () => void) => {
    console.log("ss", values)
    try {
      const { data } = await axios.post(
        "/api/auth/verify-otp",
        values,
        {
          validateStatus: (status) => status < 500,
        }
      );

      console.log("✅ OTP response:", data);
    

      if (!data.success) {
        alert(data.message || "Invalid OTP");
        return;
      }
      console.log("HY NAME",data)

      setOtpEmail("")
      dispatch(login(data.data))
      const callback = searchParams.get('callback');
      if (callback) {
        router.push(callback)
      } else if (data.data.role === "admin") {
        router.push(ADMIN_DASHBOARD)
      } else {
        router.push(USER_DASHBOARD)
      }
      reset();

      showToast({ type: "success", content: data.message || "Registration failed", });



    } catch (error: unknown) {
      console.error("❌ OTP verification error:", error);

      if (axios.isAxiosError(error)) {
        console.log(
          "API Error:",
          error.response?.data
        );
        showToast({ type: "success", content: error.response?.data?.message || "OTP verification failed", });


      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Something went wrong");
      }
    }
  }
  return (
    <div className="flex justify-center dark:text-white items-center min-h-screen">
      <Card className="w-sm">
        <CardContent>
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src={Logo.src}
              alt="Logo"
              width={Logo.width}
              height={Logo.height}
              className="max-w-[150px]"
            />
          </div>

          {/* Heading */}
          {!otpEmail ?
            <>
              <div className="text-center dark:text-white mt-2">
                <h1 className="text-4xl dark:text-white font-semibold mb-4">
                  Login into Account
                </h1>

                <p className="dark:text-gray-300">
                  Login into your account by filling out the form below
                </p>
              </div>

              <form onSubmit={formik.handleSubmit} className="mt-6">
                <FieldGroup>

                  {/* Email */}
                  <Field>
                    <FieldLabel htmlFor="email">
                      Email
                    </FieldLabel>

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@gmail.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />

                    {formik.touched.email && formik.errors.email && (
                      <FieldError>
                        {formik.errors.email}
                      </FieldError>
                    )}
                  </Field>

                  {/* Password */}
                  <Field className="flex gap-2">
                    <FieldLabel htmlFor="password">
                      Password
                    </FieldLabel>

                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={see ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="pr-10"
                      />

                      <button
                        type="button"
                        onClick={() => setSee(!see)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {see ? (
                          <FaEyeSlash className="text-sm" />
                        ) : (
                          <FaEye className="text-sm" />
                        )}
                      </button>
                    </div>


                    {formik.touched.password && formik.errors.password && (
                      <FieldError>
                        {formik.errors.password}
                      </FieldError>
                    )}
                  </Field>

                  {/* <button
                type="submit"

                className="w-full mt-2 mb-2 bg-black text-white py-2 rounded-md"
              >
                Login
              </button> */}
                  <ButtonLoading type="submit" text="Submit" className="w-full mt-2 mb-2 bg-black text-white py-2 rounded-md" loading={loading} />

                </FieldGroup>
                <div className="text-center flex space-x-2 mt-3">
                  <p className="text-sm font-semibold">Don&apos;t have  acount?</p>
                  <Link href="/auth/register" className="text-sm text-cyan-500 font-semibold">Create Account</Link>
                  <Link href={WEBSITE_RESETPASSWORD} className="text-sm text-cyan-500 font-semibold">Forget Password</Link>
                </div>
              </form>
            </> :
            <>
              <OtpVerification email={otpEmail} handler={handleVerification} loading={otpLoading} />
            </>
          }

          {/* Form */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;