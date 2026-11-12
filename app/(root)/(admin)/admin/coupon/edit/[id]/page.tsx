"use client";
import React, { use, useEffect, useState } from "react";
import Breadcrum from "@/components/Application/Breadcrum";
import {
  
  ADMIN_DASHBOARD,
  ADMIN_COUPON_EDIT,
  ADMIN_COUPON,


  
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
import { useFetch } from "@/hooks/useFetch";

import { UpdateCouponsSchema } from "@/lib/zodScheema/coupons.schema";
import Select from "@/components/Application/Select";
import { RichTextEditor5 } from "@/components/Application/Editors";
import Image from "next/image";
import MediaModal from "@/components/Application/MediaModal";



interface PageProps {
  params: Promise<{
    id: string;
  }>;
}


type ProductData = {
  _id: string;
 name: string,
       description: string,
       mrp:string,
       sellingPrice:string,
       category:string,
       slug:string,
       discountPercentage:string,
       media:any
};

type CategoryApiResponse = {
  success: boolean;
  message?: string;
  data?: ProductData;
};

const EditCategory = ({params}:PageProps) => {
//media state
const [open,setOpen]=useState(false)
const [selectedMedia,setSelectedMedia]=useState<string[]>([])


    const [option,setOption]=useState<any>([])
  const [loading, setLoading] = useState(false);
  const {id}=use(params)
const { data: CouponData } = useFetch<CategoryApiResponse>(
  `/api/coupon/get/${id}`
);




  const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

// ...
console.log("Coupon data",CouponData)


// useEffect(() => {
//   if (ProductData?.success) {
//     console.log("category",ProductData.data);
//   }
  // if(ProductData){
  //   setmediaData((ProductData as any)?.media )

//   }
// }, [ProductData]);



console.log("option",option)    


  const formik = useFormik({
    enableReinitialize: true,
initialValues: {
  _id: (CouponData as any)?._id ??"",
       minShoppingAmount: (CouponData as any)?.minShoppingAmount ??"",
       discountPercentage:(CouponData as any)?.discountPercentage ??"",
       validity:formatDate((CouponData as any)?.validity ??""),
       code:(CouponData as any)?.code ??"",
       

},
    validate: (values) => {
      const result = UpdateCouponsSchema.safeParse(values);
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
        const { data } = await axios.put("/api/coupon/update", { ...values,_id:id });
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
  
  const breadcrum = [
    { href: ADMIN_DASHBOARD, label: "Dashboard" },
    { href: ADMIN_COUPON, label: "Coupon" },
    { href: ADMIN_COUPON_EDIT(formik.values._id), label: "Edit Coupon" },
  ];

useEffect(() => {
  if ((CouponData as any)?.validity) {
      const validity = (CouponData as any)?.validity;

    formik.setFieldValue(
      "validity",
      new Date(validity).toISOString().split("T")[0]
    );
  }
}, [CouponData]);

    console.log("formik",formik.values)
    console.log("errors",formik.errors)

 return (
<div className="w-full " >
    <Breadcrum data={breadcrum} />

    {/* ✅ Yeh force karega left alignment */}
    <div className="mt-5  w-auto mx-w-md flex justify-start items-start">
<Card className="py-0 w-full  ">
        <CardHeader className="py-2 px-4 [.border-b]:pb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Edit Coupons
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

export default EditCategory;