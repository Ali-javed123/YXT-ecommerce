"use client";
import React, { use, useEffect, useState } from "react";
import Breadcrum from "@/components/Application/Breadcrum";
import {
  ADMIN_PRODUCT,
  ADMIN_PRODUCT_EDIT,
  ADMIN_PRODUCT_ADD,
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
import { useFetch } from "@/hooks/useFetch";

import { ProdcutSchema } from "@/lib/zodScheema/productSchema";
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
const { data: ProductData } = useFetch<CategoryApiResponse>(
  `/api/product/get/${id}`
);


  const { data: categoryData } = useFetch('/api/category?deleteType=SD&size=10000');


  const mediaData: any[] = (ProductData as any)?.media ?? [];
useEffect(()=>{
if(mediaData){

  setSelectedMedia(mediaData)
}
},[mediaData])
console.log("Category data",ProductData)


// useEffect(() => {
//   if (ProductData?.success) {
//     console.log("category",ProductData.data);
//   }
  // if(ProductData){
  //   setmediaData((ProductData as any)?.media )

//   }
// }, [ProductData]);


console.log("mediaData",mediaData)
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


  const formik = useFormik({
    enableReinitialize: true,
initialValues: {
  name: (ProductData as any)?.name ??"",
       description: (ProductData as any)?.description ??"",
       mrp:(ProductData as any)?.mrp ??"",
       sellingPrice:(ProductData as any)?.sellingPrice ??"",
       category:(ProductData as any)?.category ??"",
       slug:(ProductData as any)?.slug ??"",
       discountPercentage:(ProductData as any)?.discountPercentage ??"",
      media: ((ProductData as any)?.media ?? []).map((m: any) => m._id),

},
    validate: (values) => {
      const result = ProdcutSchema.safeParse(values);
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
        const { data } = await axios.put("/api/product/update", { ...values,_id:id });
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
    { href: ADMIN_PRODUCT, label: "Product" },
    { href: ADMIN_PRODUCT_EDIT(formik.values.name), label: "Edit Product" },
  ];

  useEffect(() => {
    if(formik.values.name){
      formik.setFieldValue('slug',slugify(formik.values.name).toLowerCase())

    }


  }, [formik.values.name])


useEffect(()=>{
  if(ProductData){
    formik.resetForm({
        values: {
          ...formik.values,
          media: (mediaData as any).map((e:any)=>(e._id)),
          
        },
      })
  }
},[mediaData])


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
    console.log("errors",formik.errors)

 return (
  <div className="w-full " >
    <Breadcrum data={breadcrum} />

    {/* ✅ Yeh force karega left alignment */}
    <div className="mt-5  w-full flex justify-start items-start">
      <Card className="py-0 w-3xl">      {/* w-md wapas lagayen */}
        <CardHeader className="py-2 px-4 [.border-b]:pb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Edit Product
          </h3>
        </CardHeader>

        <CardContent>
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit} className="mt-1">
              <div className="relative mt-2">
                <FieldGroup>
                    <div className="grid md:col-md-3 gap-4 items-center justify-between grid-cols-3">

                        <div>

                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <FastField name="name">
  {({ field }: any) => (
    <Input
      {...field}
      id="name"
      type="text"
      placeholder="Category name"
      onChange={(e) => {
        field.onChange(e);
        formik.setFieldValue("slug", slugify(e.target.value, { lower: true }));
      }}
    />
  )}
</FastField>
                    <ErrorMessage name="name">
                      {(message) => <FieldError>{message}</FieldError>}
                    </ErrorMessage>
                  </Field>
                        </div>
                        
                        <div>

                  <Field>
                    <FieldLabel htmlFor="slug">Slug</FieldLabel>
                   <FastField name="slug">
  {({ field }: any) => (
    <Input
      {...field}
      id="slug"
      type="text"
      placeholder="Product slug"
      onChange={(e) => {
        field.onChange(e);
        formik.setFieldValue("slug", slugify(e.target.value, { lower: true }));
      }}
    />
  )}
</FastField>
                    <ErrorMessage name="slug">
                      {(message) => <FieldError>{message}</FieldError>}
                    </ErrorMessage>
                  </Field>
                        </div>

                          <div>

                  <Field>
                    <FieldLabel htmlFor="mrp">MRP</FieldLabel>
                   <FastField name="mrp">
  {({ field }: any) => (
    <Input
      {...field}
      id="mrp"
      type="text"
      placeholder="Product MRP"
      onChange={(e) => {
        field.onChange(e);
        formik.setFieldValue("mrp", slugify(e.target.value, { lower: true }));
      }}
    />
  )}
</FastField>
                    <ErrorMessage name="slug">
                      {(message) => <FieldError>{message}</FieldError>}
                    </ErrorMessage>
                  </Field>
                        </div>
                        <div>

                  <Field>
                    <FieldLabel htmlFor="sellingPrice">Selling Price</FieldLabel>
                   <FastField name="sellingPrice">
  {({ field }: any) => (
    <Input
      {...field}
      id="sellingPrice"
      type="text"
      placeholder="Selling Price"
      onChange={(e) => {
        field.onChange(e);
        formik.setFieldValue("sellingPrice", slugify(e.target.value, { lower: true }));
      }}
    />
  )}
</FastField>
                    <ErrorMessage name="slug">
                      {(message) => <FieldError>{message}</FieldError>}
                    </ErrorMessage>
                  </Field>
                        </div>

                        <div>

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

                        </div>

                        <div>

     <Field>
                    <FieldLabel htmlFor="discountPercentage">Discount Percentage</FieldLabel>
                   <FastField name="discountPercentage">
  {({ field }: any) => (    
    <Input
      {...field}
      id="discountPercentage"
      type="text"
      placeholder="Selling Price"
      onChange={(e) => {
        field.onChange(e);
        formik.setFieldValue("discountPercentage", slugify(e.target.value, { lower: true }));
      }}
    />
  )}
</FastField>
                    <ErrorMessage name="discountPercentage">
                      {(message) => <FieldError>{message}</FieldError>}
                    </ErrorMessage>
                  </Field>

                        </div>
                    </div>

<div>
     <div className="sm:col-span-2">
                        <RichTextEditor5
        label="Description"
        preset="full"
        value={formik.values.description}
        onChange={(html) => formik.setFieldValue('description', html)}
        onBlur={() => formik.setFieldTouched('description', true, false)}
        error={
            formik.touched.description &&  typeof formik.errors.description==="string"?
             formik.errors.description 
             : undefined
            }
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
                      selectedMedia.map((e:any,i:number)=>(
                      
                        <div key={i} className="relative h-[150px]  w-[150px] border rounded-md">
                      <Image alt={'22'} fill className="rounded" src={e?.url} objectFit="cover"/>
                      
                        </div>
                      ))
                      
                      }
                      </div>
</div>
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

export default EditCategory;