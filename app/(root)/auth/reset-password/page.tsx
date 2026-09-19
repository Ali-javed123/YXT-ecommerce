'use client'
import  { useState } from 'react'
import OtpVerification from "@/components/Application/OtpVerification";
import Logo from "@/assets/images/logo-black.png";
import Image from "next/image";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { Card, CardContent } from "@/components/ui/card";
import { loginSchema } from '@/lib/zodScheema/zosScheema';
import Link from 'next/link';
import ButtonLoading from '@/components/Application/Button';
import axios from 'axios';
import { showToast } from '@/lib/showToast';
import UpdatePassword from '@/components/Application/UpdatePassword';
const ResetPassword = () => {
    const [loading,setLoading]=useState<boolean>(false)
    const [otpEmail,setOtpEmail]=useState<string>()
    const [otpLoading,setotpLoading]=useState<boolean>(false)
    const [isOtpVerified,setisOtpVerified]=useState(false)

  const formik = useFormik({
    initialValues: {
      email: "",
    //   password: "",
    },

validate: (values) => {
  const schema = loginSchema.pick({
    email: true,
    // password: true,
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
        const { data } = await axios.post(
          "/api/auth/reset-password/send-otp",
          values,
          {
            validateStatus: (status) => status < 500,
          }
        );

        console.log("✅ OTP response:", data);

        if (!data.success) {
          showToast({ type: "error",content:data.message || "Invalid OTP"});
          return;
        }
        setOtpEmail(values.email)
        // dispatch(login(data.data))
        // reset();

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
  },
  });
  const handleVerification=async(values:any,reset:any)=>{
    console.log("ss",values)
 try {
        const { data } = await axios.post(
          "/api/auth/reset-password/verify-otp",
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
        // setOtpEmail("")
        // dispatch(login(data.data))
        reset();

showToast({ type: "success", content: data.message || "Registration failed", });
setisOtpVerified(true)

        
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
    <div className="flex justify-center items-center min-h-screen">
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
          {!otpEmail?
        <>
          <div className="text-center mt-2">
            <h1 className="text-4xl font-bold mb-4">
              RESET PASSWORD
            </h1>

            <p>
              Enter your email to password reset
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
              

              {/* <button
                type="submit"

                className="w-full mt-2 mb-2 bg-black text-white py-2 rounded-md"
              >
                Login
              </button> */}
              <ButtonLoading type="Sent OTP" text="Submit" className="w-full mt-2 mb-2 bg-black text-white py-2 rounded-md" loading={loading}/>

            </FieldGroup>
            <div className="text-center justify-center  w-full flex space-x-2 mt-3">
                <div>

                <Link href="/auth/login" className="block text-sm text-cyan-500 font-semibold">Back to Login</Link>
                </div>
            </div>
          </form>
        </> : 
         <>
         {!isOtpVerified?
         <OtpVerification email={otpEmail} handler={handleVerification} loading={otpLoading} />:
         <UpdatePassword email={otpEmail}/>
         }
         </>  
         }

          {/* Form */}
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword