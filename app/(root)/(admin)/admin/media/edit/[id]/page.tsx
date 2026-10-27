
"use client";

import React, { use, useEffect, useState } from "react";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanel.route";
import { useFetch } from "@/hooks/useFetch";
import Breadcrum from "@/components/Application/Breadcrum";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  useFormik,
  FormikProvider,
  FastField,
  ErrorMessage,
} from "formik";
import { z } from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/Application/Button";
import Image from "next/image";
import img from '../../../../../../../assets/images/img-placeholder.webp'
import axios from "axios";
import { showToast } from "@/lib/showToast";

import UploadMedia from "@/components/Application/Admin/UploadMedia";
import { useQueryClient } from "@tanstack/react-query";

const breadcrum = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: ADMIN_MEDIA_SHOW,
    label: "Media",
  },
  {
    href: "",
    label: "Edit Media",
  },
];
console.log("img:=>",img.src)
type Media = {
  _id: string;
  asset_id: string;
  bytes: number;
  createdAt: string;
  deletedAt: string | null;
  format: string;
  height: number;
  alt?: string;
  title?: string;
  public_id: string;
  updatedAt: string;
  url: string;
  width: number;
  __v: number;
};

const formSchema = z.object({
  alt: z.string().trim().min(1, "Alt is required"),
  title: z.string().trim().min(1, "Title is required"),
});

const page = ({ params }: any) => {

  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { id } = use(params) as { id: string };

  const { data: mediaData ,data,refresh} = useFetch<Media|any>(
    `/api/media/get/${id}`
  );



  
  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      _id:'',
      alt:  mediaData?.alt??"",
      title:  mediaData?.title??"",
    },

    validate: (values) => {
      const result = formSchema.safeParse(values);

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

    onSubmit: async (values,{resetForm}) => {
      setLoading(true);

      try {
        console.log("Form Values:", values);
        const {data:response,data}:any=await axios.put("/api/media/update",{...values,_id:mediaData._id})
        if(!data.success){
          throw new Error("reponse filed",data.massege)
        }
        console.log("response:",response)
        showToast({type:"success",content:data.massege})
        resetForm()




        // Yahan apni update API call add karna.
      } catch (error) {
        console.error("Media update failed:", error);
      } finally {
        setLoading(false);
      }
    },
  });
    console.log("mediaData",mediaData)

  useEffect(()=>{
    if(mediaData &&data.success ){
          setImageUrl(mediaData.url);

      formik.resetForm({
        values: {
          _id: mediaData._id,
          alt: mediaData.alt,
          title: mediaData.title,
        },
      })

    }

  },[mediaData])

  return (
    <div>
      <Breadcrum data={breadcrum} />

      <div className="mt-5">
        <Card className="py-0 rounded shadow-sm w-md">
          <CardHeader className="py-2 px-4 [.border-b]:pb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Edit Media
            </h3>
          </CardHeader>

          <CardContent>
            <FormikProvider value={formik}>
              <form
                onSubmit={formik.handleSubmit}
                className="mt-1"
              >
                <div className="!mb-1 relative w-full max-w-35 h-35 rounded-md">
                  {mediaData && (
                    <Image
                      alt={mediaData.alt || ""}
                      className="rounded-sm"
                      src={mediaData.url?mediaData.url:img.src}
                      fill
                      objectFit="cover"
                    />
                  )}


                </div>
{mediaData && (
  <div className="mt-2">
    <UploadMedia
      replaceId={mediaData._id}
      queryClient={queryClient}
      onReplaceSuccess={(updated) =>{ setImageUrl(updated.url);refresh()}}
    />
  </div>
)}
                <div className="relative mt-2">
                  <FieldGroup>
                    {/* Alt Field */}
                    <Field>
                      <FieldLabel htmlFor="alt">
                        Alt
                      </FieldLabel>

                      <FastField name="alt">
                        {({ field }: any) => (
                          <Input
                            {...field}
                            id="alt"
                            type="text"
                            placeholder="Image alt text"
                          />
                        )}
                      </FastField>

                      <ErrorMessage name="alt">
                        {(message) => (
                          <FieldError>{message}</FieldError>
                        )}
                      </ErrorMessage>
                    </Field>

                    {/* Title Field */}
                    <Field>
                      <FieldLabel htmlFor="title">
                        Title
                      </FieldLabel>

                      <FastField name="title">
                        {({ field }: any) => (
                          <Input
                            {...field}
                            id="title"
                            type="text"
                            placeholder="Image Title"
                          />
                        )}
                      </FastField>

                      <ErrorMessage name="title">
                        {(message) => (
                          <FieldError>{message}</FieldError>
                        )}
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

export default page;
