"use client";
import React, { useEffect, useState } from "react";
import Breadcrum from "@/components/Application/Breadcrum";
import {
  ADMIN_CATERGORY,
  ADMIN_CATERGORY_ADD,
  ADMIN_DASHBOARD,
} from "@/routes/AdminPanel.route";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFormik, FormikProvider, FastField, ErrorMessage } from "formik";
import { z } from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/Application/Button";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import slugify from 'slugify'
const formSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  slug: z.string().trim().min(1, "slug is required"),
});

const Page = () => {
  const [loading, setLoading] = useState(false);

  const breadcrum = [
    { href: ADMIN_DASHBOARD, label: "Dashboard" },
    { href: ADMIN_CATERGORY, label: "Category" },
    { href: ADMIN_CATERGORY_ADD, label: "Add Category" },
  ];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { name: "", slug: "" },
    validate: (values) => {
      const result = formSchema.safeParse(values);
      if (result.success) return {};
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string") errors[field] = issue.message;
      });
      return errors;
    },

    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const { data } = await axios.post("/api/category/create", { ...values });
        if (!data.success) throw new Error(data.message);
        showToast({ type: "success", content: data.message });
        resetForm();
      } catch (error: any) {
        showToast({ type: "error", content: error?.message || "Update failed" });
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if(formik.values.name){
      formik.setFieldValue('slug',slugify(formik.values.name).toLowerCase())

    }
  }, [formik.values.name])
  
    console.log("formik",formik.values)

 return (
  <div className="w-full " >
    <Breadcrum data={breadcrum} />

    {/* ✅ Yeh force karega left alignment */}
    <div className="mt-5  w-full flex justify-start items-start">
      <Card className="py-0 w-md">      {/* w-md wapas lagayen */}
        <CardHeader className="py-2 px-4 [.border-b]:pb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Add Category
          </h3>
        </CardHeader>

        <CardContent>
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit} className="mt-1">
              <div className="relative mt-2">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <FastField name="name">
                      {({ field }: any) => (
                        <Input {...field} id="name" type="text" placeholder="Category name" />
                      )}
                    </FastField>
                    <ErrorMessage name="name">
                      {(message) => <FieldError>{message}</FieldError>}
                    </ErrorMessage>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="slug">Slug</FieldLabel>
                    <FastField name="slug">
                      {({ field }: any) => (
                        <Input {...field} id="slug" type="text" placeholder="category-slug" />
                      )}
                    </FastField>
                    <ErrorMessage name="slug">
                      {(message) => <FieldError>{message}</FieldError>}
                    </ErrorMessage>
                  </Field>

                  <ButtonLoading
                    type="submit"
                    text="Submit"
                    className="w-full mt-2 mb-10 bg-black text-white py-2 rounded-md"
                    loading={loading}
                  />
                </FieldGroup>
              </div>
            </form>
          </FormikProvider>
        </CardContent>
      </Card>
    </div>
  </div>
);
};

export default Page;