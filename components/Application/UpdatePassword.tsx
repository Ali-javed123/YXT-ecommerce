
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import ButtonLoading from "@/components/Application/Button";

import Logo from "@/assets/images/logo-black.png";

import { updatePasswordSchema } from "@/lib/zodScheema/zosScheema";
import {
  WEBSITE_LOGIN,
} from "@/routes/website.route";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";
const UpdatePassword = ({ email }: any) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [see, setSee] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: email,
      password: "",
      confirmPassword: "",
    },


    validate: (values) => {
      console.log("🔍 Validating:", values);


      const result = updatePasswordSchema.safeParse(values);



      if (result.success) {
        console.log("✅ Validation passed");
        return {};
      }

      const errors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        console.log("❌ Field:", field);
        console.log("❌ Message:", issue.message);

        if (typeof field === "string" && !errors[field]) {
          errors[field] = issue.message;
        }
      });

      console.log("❌ Formik Errors:", errors);

      return errors;
    },

    onSubmit: async (values, { resetForm }) => {
      console.log("🔥 onSubmit executed");
      console.log("📦 Values:", values);

      try {
        setLoading(true);

        const { data } = await axios.put(
          "/api/auth/reset-password/update-password",
          values,
          {
            validateStatus: (status) => status < 500,
          }

        );

        console.log("✅ update password:", data);

        if (!data.success) {
          alert(data.message || "Update password failed");

        }

        // alert(data.message || "Update password successful");

        resetForm();
        showToast({ type: "success", content: data.message || "Update password successful", });
        router.push('/auth/login')
      } catch (error: unknown) {
        console.error("❌ Update password error:", error);

        if (axios.isAxiosError(error)) {
          console.log("API Error:", error.response?.data);
          showToast({ type: "error", content: error.response?.data?.message || "Update password failed", });

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
  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="w-sm">

        {/* Logo */}


        {/* Heading */}
        <div className="text-center mt-2">
          <h1 className="text-4xl font-semibold mb-4">
            Update Password
          </h1>

          <p>
            Create a new Password by filling below form
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={formik.handleSubmit}
          className="mt-6"
        >
          <FieldGroup>
            {/* Name */}


            {/* Password */}
            <Field>
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
                  onClick={() => setSee((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {see ? (
                    <FaEyeSlash className="text-sm" />
                  ) : (
                    <FaEye className="text-sm" />
                  )}
                </button>
              </div>

              {formik.touched.password &&
                formik.errors.password && (
                  <FieldError>
                    {formik.errors.password}
                  </FieldError>
                )}
            </Field>

            {/* Confirm Password */}
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>

              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={see ? "text" : "password"}
                  placeholder="Enter your confirm password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => setSee((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {see ? (
                    <FaEyeSlash className="text-sm" />
                  ) : (
                    <FaEye className="text-sm" />
                  )}
                </button>
              </div>

              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <FieldError>
                    {formik.errors.confirmPassword}
                  </FieldError>
                )}
            </Field>

            {/* Submit */}
            <ButtonLoading
              type="submit"
              text="Update Password"
              loading={loading}
              className="w-full mt-2 mb-2 bg-black text-white py-2 rounded-md"
            />

          </FieldGroup>

          {/* Login */}
          <div className="text-center flex justify-center gap-2 mt-3">
            <p className="text-sm font-semibold">
              Already have an account?
            </p>

            <Link
              href={WEBSITE_LOGIN}
              className="text-sm text-cyan-500 font-semibold"
            >
              Login!
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
};

export default UpdatePassword;
