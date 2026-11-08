"use client";
import React, { use, useEffect, useEffectEvent, useState } from "react";
import Breadcrum from "@/components/Application/Breadcrum";
import {
  ADMIN_PRODUCT,
  ADMIN_PRODUCT_EDIT,
  ADMIN_PRODUCT_ADD,
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_Varient,

  
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
import { ProdcutVariantUpdateSchema } from "@/lib/zodScheema/product-varient.schema";
import { size } from "@/lib/utils";
import { AnyARecord } from "dns";


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
const [productOption,setProductOption]=useState<any>([])

const [open,setOpen]=useState(false)
const [selectedMedia,setSelectedMedia]=useState<string[]>([])


    const [option,setOption]=useState<any>([])
  const [loading, setLoading] = useState(false);
  const {id}=use(params)
const { data: ProductData } = useFetch<CategoryApiResponse>(
  `/api/product-varient/get/${id}`
);


  const { data: productData } = useFetch('/api/product?deleteType=SD&size=10000');


  const mediaData: any[] = (ProductData as any)?.media ?? [];
useEffect(() => {
  if ((ProductData as any)?.media) {
    setSelectedMedia((ProductData as any).media);
  }
}, [ProductData]);


console.log("product data",ProductData)

// useEffect(()=>{
// if(ProductData && Array.isArray((ProductData as any)?.media) ){
// let slect=(ProductData as any).media.map((e:any)=>e.media) 
// setSelectedMedia(slect)
// }
// },[Array.isArray(ProductData)])
// useEffect(() => {
//   if (ProductData?.success) {
//     console.log("category",ProductData.data);
//   }
  // if(ProductData){
  //   setmediaData((ProductData as any)?.media )

//   }
// }, [ProductData]);


console.log("mediaData",mediaData)
console.log("selectedData",selectedMedia)
useEffect(() => {
    if (productData && Array.isArray(productData)) {
      const formatted = productData.map((val: any) => ({
        label: val.name,
        value: val._id,
      }));
      setProductOption(formatted);
    }
  }, [productData]);

console.log("option",option)    


  const formik = useFormik({
    enableReinitialize: true,
initialValues: {
  _id:(ProductData as any)?._id ??"",
  // name: (ProductData as any)?.name ??"",
      //  description: (ProductData as any)?.description ??"",
      //  mrp:(ProductData as any)?.mrp ??"",
      //  sellingPrice:(ProductData as any)?.sellingPrice ??"",
      //  category:(ProductData as any)?.category ??"",
      //  slug:(ProductData as any)?.slug ??"",
      //  discountPercentage:(ProductData as any)?.discountPercentage ??"",
      // media: ((ProductData as any)?.media ?? []).map((m: any) => m._id),
      product:(ProductData as any)?.product ??"",
       sku: (ProductData as any)?.sku ??"",
       size:(ProductData as any)?.size ??"",
       mrp:(ProductData as any)?.mrp ??"",
       sellingPrice:(ProductData as any)?.sellingPrice ??"",
       discountPercentage:(ProductData as any)?.discountPercentage ??"",
       media:((ProductData as any)?.media ?? []).map((m: any) => m._id),
       color:(ProductData as any)?.color ??""                                                                           

},
    validate: (values) => {
      const result = ProdcutVariantUpdateSchema.safeParse(values);
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
        const { data } = await axios.put("/api/product-varient/update", { ...values });
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
    { href: ADMIN_PRODUCT_Varient, label: "Product Varient" },
    { href: ADMIN_PRODUCT_EDIT(formik.values.product), label: "Edit Product Varient" },
  ];

  useEffect(() => {
    if(formik.values.product){
      formik.setFieldValue('slug',slugify(formik.values.product).toLowerCase())

    }


  }, [formik.values.product])


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
      if(formik.values.product){
        formik.setFieldValue('slug',slugify(formik.values.product).toLowerCase())
  
      }
    }, [formik.values.product])
  
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
            Edit Product Varient
          </h3>
        </CardHeader>

        <CardContent>
     <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit} className="mt-1">
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
    
            <Field>
      <FieldLabel htmlFor="product">Product</FieldLabel>
    
         <Select 
         options={productOption}
        selected={formik.values.product}
    
        setSelected={(val) => {
          formik.setFieldValue("product", val);
          formik.setFieldTouched("product", true, false);
        }}
    
          isMulti={false}
          />
      
      <ErrorMessage name="product">
        {(message) => <FieldError className="text-red-500 text-sm">{message}</FieldError>}
      </ErrorMessage>
    </Field>
    
    <Field>
      <FieldLabel htmlFor="sku">SKU</FieldLabel>
      <FastField name="sku">
        {({ field }: any) => (
          <Input {...field} id="sku" type="text" placeholder="Enter sku" />
        )}
      </FastField>
      <ErrorMessage name="sku">
        {(message) => <FieldError className="text-red-500 text-sm">{message}</FieldError>}
      </ErrorMessage>
    </Field>
    <Field>
      <FieldLabel htmlFor="color">Varients color</FieldLabel>
      <FastField  name="color">
        {({ field }: any) => (
          <Input  {...field} id="color" type="text" placeholder="Enter varient color" />
        )}
      </FastField>
      <ErrorMessage name="color">
        {(message) => <FieldError className="text-red-500 text-sm">{message}</FieldError>}
      </ErrorMessage>
    </Field>
     <Field>
      <FieldLabel htmlFor="size">Size</FieldLabel>
    
         <Select 
         options={size}
        selected={formik.values.size}
    
        setSelected={(val) => {
          formik.setFieldValue("size", val);
          formik.setFieldTouched("size", true, false);
        }}
    
          isMulti={false}
          />
      
      <ErrorMessage name="sku">
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
      <FieldLabel htmlFor="discountPercentage">Discount Percentage</FieldLabel>
      <FastField name="discountPercentage">
        {({ field }: any) => (
          <Input readOnly {...field} id="discountPercentage" type="text" placeholder="enter a discount Percentage" />
        )}
      </FastField>
      <ErrorMessage name="discountPercentage">
        {(message) => <FieldError className="text-red-500 text-sm">{message}</FieldError>}
      </ErrorMessage>
    </Field>
    
    
    
    
    
    
    
    
    
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

export default EditCategory;