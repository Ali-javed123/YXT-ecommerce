"use client";

import React from "react";
import { useFormik } from "formik";
import axios from "axios";

import { otpSchema } from "@/lib/zodScheema/zosScheema";

import { FieldGroup, FieldLabel } from "../ui/field";
import ButtonLoading from "./Button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { showToast } from "@/lib/showToast";

type OtpVerificationProps = {
  email: string;
  handler?: (
    values: { email: string; otp: string },
    resetForm: () => void
  ) => void;
  loading: boolean;
};


const OtpVerification = ({
  email,

  handler,
  loading
}: OtpVerificationProps) => {
  const formik = useFormik({
    initialValues: {
      email: email,
      otp: "",
    },

    enableReinitialize: true,


    validate: (values) => {
      const result = otpSchema.safeParse({
        otp: values.otp,
        email: values.email,
      });

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
      console.log("🔥 OTP Submit",values);
      console.log("📦 Values:", values);

      handler?.(values, resetForm);
    },
  });
  const resendOtp= async()=>{
try {
        const { data } = await axios.post(
          "/api/auth/resend-otp",{email:email},
          {
            validateStatus: (status:any) => status < 500,
          }
        );

        console.log("✅ OTP response:", data);

        if (!data.success) {
          alert(data.message || "Invalid OTP");
          return;
        }

      showToast({ type: "success", content: data.message || "Otp resent successfully", });



        
      } catch (error: unknown) {
        console.error("❌ OTP verification error:", error);

        if (axios.isAxiosError(error)) {
          console.log(
            "API Error:",
            error.response?.data
          );
          showToast({ type: "success", content: error.response?.data?.message || "OTP resend failed", });

          
        } else if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("Something went wrong");
        }
      }
  }
console.log(formik.values)
  return (
    <form
  onSubmit={formik.handleSubmit}
  className="mt-8 w-full"
>
  <div className="flex flex-col items-center text-center mb-4">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          width="20"
          height="16"
          x="2"
          y="4"
          rx="2"
        />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    </div>

    <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
      Verify your email
    </h2>

    <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
      We&apos;ve sent a 5-digit verification code to
    </p>

    <p className="mt-1 text-sm font-medium text-gray-900">
      {email}
    </p>
  </div>

  <FieldGroup>
    {/* OTP INPUT */}
    <FieldLabel>One Time Password (OTP)</FieldLabel>
    <div className="flex justify-center">
      <InputOTP
        maxLength={6}
        value={formik.values.otp}
        onChange={(value) => {
          formik.setFieldValue("otp", value);
        }}
        onBlur={() => {
          formik.setFieldTouched("otp", true);
        }}
        inputMode="numeric"
        pattern="[0-9]*"
      >
        <InputOTPGroup className="gap-3">
          <InputOTPSlot
            index={0}
            className="h-14 w-12 rounded-lg border border-gray-200 text-xl font-semibold shadow-sm focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900"
          />

          <InputOTPSlot
            index={1}
            className="h-14 w-12 rounded-lg border border-gray-200 text-xl font-semibold shadow-sm focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900"
          />

          <InputOTPSlot
            index={2}
            className="h-14 w-12 rounded-lg border border-gray-200 text-xl font-semibold shadow-sm focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900"
          />

          <InputOTPSlot
            index={3}
            className="h-14 w-12 rounded-lg border border-gray-200 text-xl font-semibold shadow-sm focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900"
          />

          <InputOTPSlot
            index={4}
            className="h-14 w-12 rounded-lg border border-gray-200 text-xl font-semibold shadow-sm focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900"
          />
          <InputOTPSlot
            index={5}
            className="h-14 w-12 rounded-lg border border-gray-200 text-xl font-semibold shadow-sm focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900"
          />
        </InputOTPGroup>
      </InputOTP>
    </div>

    {/* ERROR */}
    {formik.touched.otp && formik.errors.otp && (
      <p className="mt-2 text-center text-sm font-medium text-red-500">
        {formik.errors.otp}
      </p>
    )}

    {/* OTP INFO */}
    <div className="mt-2 text-center">
      <p className="text-xs text-gray-500">
        The verification code will expire in{" "}
        <span className="font-medium text-gray-700">
          10 minutes
        </span>
        .
      </p>
    </div>

    {/* SUBMIT */}
    <ButtonLoading
      type="submit"
      text="Verify & Continue"
      className="mt-5 mb-2 w-full rounded-lg  py-3 text-sm font-medium text-white transition-all "
      loading={false}
    />

    {/* RESEND */}
    <div className="mt-3 text-center">
      <p className="text-sm text-gray-500 ">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          onClick={resendOtp}
          className="font-medium text-gray-900 underline  underline-offset-4 transition-colors hover:text-gray-600"
        >
          Resend code
        </button>
      </p>
    </div>
  </FieldGroup>
</form>
  );
};

export default OtpVerification;