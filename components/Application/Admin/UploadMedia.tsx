  // "use client";

  // import React from "react";
  // import { CldUploadWidget, CldUploadWidgetProps } from "next-cloudinary";
  // import { Button } from "@/components/ui/button";
  // import { FaPlus } from "react-icons/fa";
  // import axios from "axios";
  // import { showToast } from "@/lib/showToast";
  // interface UploadMediaProps {
  //   isMultiple?: boolean;
  //   onUploadSuccess?: (url: string) => void;
  // }

  // const UploadMedia = ({ isMultiple = false, onUploadSuccess }: UploadMediaProps) => {
  //   const handleError: CldUploadWidgetProps["onError"] = (error) => {
  //     console.log("Cloudinary upload error:", error);
  //   };

  //   const handleSuccess: CldUploadWidgetProps["onSuccess"] = (result) => {
  //     if (result?.info && typeof result.info !== "string") {
  //       onUploadSuccess?.(result.info.secure_url);
  //     }
  //   };

  //   const handleQueuesEnd: CldUploadWidgetProps["onQueuesEnd"] = async (results) => {
  //   const files = results.info.files;

  //   const uploadedFiles = files
  //     .filter((file) => file.status === "success" && file.uploadInfo)
  //     .map((file) => ({
  //       asset_id: file.uploadInfo.asset_id,
  //       public_id: file.uploadInfo.public_id,
  //       url: file.uploadInfo.secure_url,
  //       format: file.uploadInfo.format,
  //       width: file.uploadInfo.width,
  //       height: file.uploadInfo.height,
  //       bytes: file.uploadInfo.bytes,
  //     }));

  //   if (uploadedFiles.length > 0) {
  //     try {
  //       const { data } = await axios.post("/api/media/create", uploadedFiles);

  //       if (!data.success) {
  //         throw new Error(data.message);
  //       }

  //       showToast({ type: "success", content: data.message });
  //     } catch (error: any) {
  //       showToast({ type: "error", content: error.message || "Upload failed" });
  //     }
  //   }
  // };

  //   return (
  //     <CldUploadWidget
  //       uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
  //       signatureEndpoint="/api/cloudinary-signature"
  //       onError={handleError}
  //       onSuccess={handleSuccess}
  //       onQueuesEnd={handleQueuesEnd}
  //       config={{
  //         cloud: {
  //           cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  //           apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  //         },
  //       }}
  //       options={{
  //         multiple: isMultiple,
  //         sources: ["local", "url", "unsplash","google_drive"],
  //         // maxFiles: isMultiple ? 5 : 1,
  //       }}
  //     >
  //       {({ open }) => (
  //         <Button
  //           type="button"
  //           onClick={() => open()}
  //           className="px-4 py-2 rounded-md bg-primary text-white"
  //         >
  //           <FaPlus/>
  //           Upload {isMultiple ? "Images" : "Image"}
  //         </Button>
  //       )}
  //     </CldUploadWidget>
  //   );
  // };

  // export default UploadMedia;

  "use client";

  import React from "react";
  import { CldUploadWidget, CldUploadWidgetProps } from "next-cloudinary";
  import { Button } from "@/components/ui/button";
  import { FaPlus } from "react-icons/fa";
  import axios from "axios";
  import { showToast } from "@/lib/showToast";
import { title } from "process";
import { MdOutlineImage } from "react-icons/md";

  interface UploadMediaProps {
    isMultiple?: boolean;
    maxFiles?: number;
    onUploadSuccess?: (urls: string[]) => void;
    queryClient:any,
      replaceId?: string;                       // agar ye diya to image sirf isi record ki update hogi
  onReplaceSuccess?: (media: any) => void;  // updated media wapas milega
  label?: string;


    
  }

  const UploadMedia = ({
    isMultiple = false,
    maxFiles = 10,
    onUploadSuccess,
    queryClient,
      replaceId,
  onReplaceSuccess,
  label,

  }: UploadMediaProps) => {

      const isReplace = !!replaceId;

    const handleError: CldUploadWidgetProps["onError"] = (error) => {
      console.log("Cloudinary upload error:", error);
      showToast({ type: "error", content: "Upload failed" });
    };

    const handleQueuesEnd: CldUploadWidgetProps["onQueuesEnd"] = async (
      results,
      { widget }
    ) => {
      console.log("QUEUE END:", results);

      const files = (results?.info as any)?.files ?? [];
      console.log("files count:", files.length);

      const uploadedFiles = files
        .filter((file: any) => file.status === "success" && file.uploadInfo)
        .map((file: any) => ({
          asset_id: file.uploadInfo.asset_id,
          public_id: file.uploadInfo.public_id,
          url: file.uploadInfo.secure_url,
          format: file.uploadInfo.format,
          width: file.uploadInfo.width,
          height: file.uploadInfo.height,
           title: file.uploadInfo.title,

          bytes: file.uploadInfo.bytes,
        }));

      if (uploadedFiles.length > 0) {
        try {
          if(isReplace){
          const { data } = await axios.put("/api/media/replace", {
            _id: replaceId,
            ...uploadedFiles[0], // sirf pehli image
          });
          if (!data.success) throw new Error(data.message);

          onReplaceSuccess?.(data.data);
          queryClient?.invalidateQueries({ queryKey: ["media"] });
          showToast({ type: "success", content: data.message });

          }else{

            const { data } = await axios.post("/api/media/create", uploadedFiles);
  
            if (!data.success) {
              throw new Error(data.message);
            }
  
            onUploadSuccess?.(uploadedFiles.map((f: any) => f.url));
            
            queryClient.invalidateQueries(['media'])
  
  
            showToast({ type: "success", content: data.message });
          }
        } catch (error: any) {
          showToast({
            type: "error",
            content: error?.response?.data?.message || error.message || "Upload failed",
          });
        }
      }

      widget.close();
    };

    return (
      <CldUploadWidget
        key={isMultiple ? "multi" : "single"}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        signatureEndpoint="/api/cloudinary-signature"
        onError={handleError}
        onQueuesEnd={handleQueuesEnd}
        config={{
          cloud: {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
          },
        }}
        options={{
          multiple:isReplace?false: isMultiple,
          maxFiles: isReplace ? 1 : isMultiple? maxFiles : 1,
          sources: ["local", "url", "google_drive"],
          clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
          singleUploadAutoClose: false,
        }}
      >
        {({ open }) => (
          <Button
            // type="button"
            onClick={() => open()}
            // className="px-4 py-2 rounded-md bg-primary dark:text-white"
          >
                      {isReplace ? <MdOutlineImage /> : <FaPlus />}
          {label ?? (isReplace ? "Change Image" : `Upload ${isMultiple ? "Images" : "Image"}`)}

          </Button>
        )}
      </CldUploadWidget>
    );
  };

  export default UploadMedia;