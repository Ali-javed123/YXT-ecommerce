"use client";
import React, { useEffect, useState } from "react";
import Breadcrum from "@/components/Application/Breadcrum";
import {
  
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT,
  ADMIN_PRODUCT_ADD,
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

type CategoryOption = { label: string; value: string };

const Page = () => {
  const [loading, setLoading] = useState(false);

const [option,setOption]=useState<any>([])
  const { data: categoryData } = useFetch('/api/category?deleteType=SD&size=10000');

//media state
const [open,setOpen]=useState(false)
const [selectedMedia,setSelectedMedia]=useState<string[]>([])


  const fetchMedia = async (page: number) => {
    const response = await axios.get(
      `/api/media?page=${page}&limit=18&deleteType=SD`
    );
    return response.data; // AxiosResponse ka actual data
  };



const {isPending,isError,data,error,isFetching,fetchNextPage,hasNextPage}=useInfiniteQuery({
  queryKey:['MediaModal'],
  queryFn:({pageParam})=> fetchMedia(pageParam),
  placeholderData:keepPreviousData,
  initialPageParam:0 ,

  getNextPageParam:(lastPage,allPages)=>{
const nextPage=allPages.length
return lastPage.hasMore?nextPage:undefined 
  }

})

  const allMedia = (data as any)?.pages?.flatMap((page: any) => page.mediaData) || [];



console.log("selectedMedia",selectedMedia)
useEffect(() => {
    if (categoryData && Array.isArray(categoryData)) {
      const formatted = categoryData.map((val: any) => ({
        label: val.name,
        value: val._id,
      }));
      setOption(formatted);
    }
  }, [categoryData]);

console.log("option",option)    

  const breadcrum = [
    { href: ADMIN_DASHBOARD, label: "Dashboard" },
    { href: ADMIN_PRODUCT, label: "Product" },
    { href: ADMIN_PRODUCT_ADD, label: "Add Product" },
  ];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
       name: "",
       description: "",
       mrp:0,
       sellingPrice:0,
       category:'',
       slug:'',
       discountPercentage:"",
       media:[]
       },


    validate: (values) => {
      const result = ProdcutSchema.safeParse(values);
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
          if (selectedMedia.length <= 0) {
    showToast({ type: "error", content: "please select a media" })
    return   // ✅ yahan ruk jao, loading bhi true nahi hogi
  }


        const mediaIds=selectedMedia.map((e:any)=>e._id)
         values.media=mediaIds  as any

        const { data } = await axios.post("/api/product/create", { ...values });
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
useEffect(()=>{
if(selectedMedia.length<=0){
  showToast({type:"error",content:'please select a media image'})
}

},[selectedMedia])

useEffect(()=>{
  if(selectedMedia.length>0){
    
    const mediaIds=selectedMedia.map((e:any)=>e._id)
           formik.values.media=(mediaIds)  as any
  }

},[selectedMedia.length>0])  

useEffect(() => {
  const mrp = Number(formik.values.mrp)
  const sellingPrice = Number(formik.values.sellingPrice)

  if (mrp > 0 && sellingPrice > 0) {
    const discount = Math.max(0, Math.round(((mrp - sellingPrice) / mrp) * 100))
    formik.setFieldValue("discountPercentage", String(discount))
  } else {
    formik.setFieldValue("discountPercentage", "")
  }
}, [formik.values.mrp, formik.values.sellingPrice])
  useEffect(() => {
    if(formik.values.name){
      formik.setFieldValue('slug',slugify(formik.values.name).toLowerCase())

    }
  }, [formik.values.name])
  
    console.log("formik",formik.values)
    console.log("error",formik.errors)
console.log('media data',data)
 return (
  <div className="w-full " >
    <Breadcrum data={breadcrum} />

    {/* ✅ Yeh force karega left alignment */}
    <div className="mt-5  w-full flex justify-start items-start">
<Card className="py-0 w-full  ">
        <CardHeader className="py-2 px-4 [.border-b]:pb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Add Product
          </h3>
        </CardHeader>

      <CardContent>
  <FormikProvider value={formik}>
    <form onSubmit={formik.handleSubmit} className="mt-1">
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field>
  <FieldLabel htmlFor="name">Name</FieldLabel>
  <FastField name="name">
    {({ field }: any) => (
      <Input {...field} id="name" type="text" placeholder="Category name" />
    )}
  </FastField>
  <ErrorMessage name="name">
    {(message) => <FieldError className="text-red-500 text-sm">{message}</FieldError>}
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
    {(message) => <FieldError className="text-red-500 text-sm">{message}</FieldError>}
  </ErrorMessage>
</Field>
<Field>
  <FieldLabel htmlFor="category">Category</FieldLabel>

     <Select 
     options={option}
    selected={formik.values.category}

    setSelected={(val) => {
      formik.setFieldValue("category", val);
      formik.setFieldTouched("category", true, false);
    }}

      isMulti={false}
      />
  
  <ErrorMessage name="category">
    {(message) => <FieldError className="text-red-500 text-sm">{message}</FieldError>}
  </ErrorMessage>
</Field>

<Field>
  <FieldLabel htmlFor="mrp">MRP</FieldLabel>
  <FastField name="mrp">
    {({ field }: any) => (
      <Input {...field} id="mrp" type="number" placeholder="Enter MRP" />
    )}
  </FastField>
  <ErrorMessage name="mrp">
    {(message) => <FieldError className="text-red-500 text-sm">{message}</FieldError>}
  </ErrorMessage>
</Field>

<Field>
  <FieldLabel htmlFor="sellingPrice">Selling Price</FieldLabel>
  <FastField name="sellingPrice">
    {({ field }: any) => (
      <Input {...field} id="sellingPrice" type="number" placeholder="Enter Selling Price" />
    )}
  </FastField>
  <ErrorMessage name="sellingPrice">
    {(message) => <FieldError className="text-red-500 text-sm">{message}</FieldError>}
  </ErrorMessage>
</Field>

<Field>
  <FieldLabel htmlFor="discountPercentage">Descount Percentage</FieldLabel>
  <FastField  name="discountPercentage">
    {({ field }: any) => (
      <Input readOnly {...field} id="discountPercentage" type="number" placeholder="Enter Descount Percentage" />
    )}
  </FastField>
  <ErrorMessage name="discountPercentage">
    {(message) => <FieldError className="text-red-500 text-sm">{message}</FieldError>}
  </ErrorMessage>
</Field>

                  <div className="sm:col-span-2">
                    <RichTextEditor5
    label="Description"
    preset="full"
    value={formik.values.description}
    onChange={(html) => formik.setFieldValue('description', html)}
    onBlur={() => formik.setFieldTouched('description', true, false)}
    error={formik.touched.description ? formik.errors.description : undefined}
    deferImageUpload
    debounceMs={150}
    minHeight={300}
                    />
                  </div>



<div className="mb-5 md:col-span-2 border border-dashed rounded p-5">
<MediaModal
open={open}
setOpen={setOpen}
selectedMedia={selectedMedia}
setSelectedMedia={setSelectedMedia}
isMultiple={true}
/>

<div 
onClick={()=>setOpen(!open)}
className="bg-gray-50 dark:bg-card border w-50 mx-auto p-5 cursor-pointer ">
<span>Select Media</span>
</div>
</div>

<div className="flex JustifyCenter items-center gap-2 w-full">
{selectedMedia.length>=0&&
selectedMedia.map((e:any,i)=>(

  <div key={i} className="relative h-[200px]  w-[200px] border rounded-md">
<Image alt={'22'} fill src={e?.url} objectFit="cover"/>

  </div>
))

}
</div>
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

export default Page;