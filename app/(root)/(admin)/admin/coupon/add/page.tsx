"use client";
import React, { useEffect, useState } from "react";
import Breadcrum from "@/components/Application/Breadcrum";
import {
  
  ADMIN_DASHBOARD,
  ADMIN_COUPON,
  ADMIN_COUPON_ADD,
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

import { ProdcutSchema } from "@/lib/zodScheema/productSchema";
import { useFetch } from "@/hooks/useFetch";
import Select from "@/components/Application/Select";


import { RichTextEditor5 } from '@/components/Application/Editors';
// import type { RichTextEditor4Handle } from '@/components/Application/Editors';
import { htmlToText } from '@/lib/helperFunctions';
import MediaModal from "@/components/Application/MediaModal";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import Image from "next/image";



import { CouponsSchema } from "@/lib/zodScheema/coupons.schema";


const Coupons = () => {
  const [loading, setLoading] = useState(false);


//media state
const [open,setOpen]=useState(false)
const [selectedMedia,setSelectedMedia]=useState<string[]>([])









console.log("selectedMedia",selectedMedia)


  const breadcrum = [
    { href: ADMIN_DASHBOARD, label: "Dashboard" },
    { href: ADMIN_COUPON, label: "Coupons" },
    { href: ADMIN_COUPON_ADD, label: "Add Coupon" },
  ];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
       code: "",
       discountPercentage:"",
       minShoppingAmount:'',
       validity:""
       },


    validate: (values) => {
      const result = CouponsSchema.safeParse(values);
      if (result.success) return {};
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue:any) => {
        const field = issue.path[0];
        if (typeof field === "string") errors[field] = issue.message;
      });
      return errors;
    },

    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {


        const { data } = await axios.post("/api/coupon/create", { ...values });
        if (!data.success) throw new Error(data.message);
        showToast({ type: "success", content: data.message });
        resetForm();
        setSelectedMedia([])
      } catch (error: any) {
        showToast({ type: "error", content: error?.message || "Update failed" });
      } finally {
        setLoading(false);
      }
    },
  });

 return (
  <div className="w-full " >
    <Breadcrum data={breadcrum} />

    {/* ✅ Yeh force karega left alignment */}
    <div className="mt-5  w-auto mx-w-md flex justify-start items-start">
<Card className="py-0 w-full  ">
        <CardHeader className="py-2 px-4 [.border-b]:pb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Add Coupons
          </h3>
        </CardHeader>

      <CardContent>
  <FormikProvider value={formik}>
    <form onSubmit={formik.handleSubmit} className="mt-1">
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
  

<Field>
  <FieldLabel htmlFor="code">Coupon Code</FieldLabel>
  <FastField name="code">
    {({ field }: any) => (
      <Input {...field} id="code" type="text" placeholder="Enter Coupon Code" />
    )}
  </FastField>
  <ErrorMessage name="code">
    {(message) => <FieldError className="text-red-500 text-sm">{message}</FieldError>}
  </ErrorMessage>
</Field>

<Field>
  <FieldLabel htmlFor="discountPercentage">Descount Percentage</FieldLabel>
  <FastField  name="discountPercentage">
    {({ field }: any) => (
      <Input  {...field} id="discountPercentage" type="number" placeholder="Enter Descount Percentage" />
    )}
  </FastField>
  <ErrorMessage name="discountPercentage">
    {(message) => <FieldError className="text-red-500 text-sm">{message}</FieldError>}
  </ErrorMessage>
</Field>
<Field>
  <FieldLabel htmlFor="minShoppingAmount">Min. Shopping Amount</FieldLabel>
  <FastField  name="minShoppingAmount">
    {({ field }: any) => (
      <Input  {...field} id="minShoppingAmount" type="number" placeholder="Enter Min. Shopping Amount" />
    )}
  </FastField>
  <ErrorMessage name="minShoppingAmount">
    {(message) => <FieldError className="text-red-500 text-sm">{message}</FieldError>}
  </ErrorMessage>
</Field>
<Field>
  <FieldLabel htmlFor="validity">Validity</FieldLabel>
  <FastField  name="validity">
    {({ field }: any) => (
      <Input  {...field} id="validity" type="date" placeholder="Enter vlidity" />
    )}
  </FastField>
  <ErrorMessage name="validity">
    {(message) => <FieldError className="text-red-500 text-sm">{message}</FieldError>}
  </ErrorMessage>
</Field>



        <div className="sm:col-span-2">
          <ButtonLoading
            type="submit"
            text="Submit"
            className="w-full bg-black text-white py-2 rounded-md"
            loading={loading}
          />
        </div>
      </div>
    </form>
  </FormikProvider>
</CardContent>
      </Card>
    </div>
  </div>
);
};

export default Coupons;