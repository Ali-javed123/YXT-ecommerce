import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup } from "@/components/ui/field";
import { retry } from "ckeditor5";
import Image from "next/image";

type MediaCheckProps = {
  media: any;
  selectedMedia: string[];
  setSelectedMedia: (selectedMedia: any) => void;
  isMultiple: boolean;
  setPrevState:(prevState:any)=>void
  prevState:any
};

export const MediaCheck = ({
  media,
  selectedMedia,
  setSelectedMedia,
  isMultiple,
  setPrevState,
  prevState
}: MediaCheckProps) =>
{

  console.log("media", selectedMedia)

  interface Media
  {
    _id: string,
    url: string
  }
  const handleCheck = (media: Media, checked: boolean) =>
  {

  setPrevState((prev:any)=>{
    // const isSelect=prev.some((e:any)=>e._id==media._id)

      if(!checked) { 
      return  prev.filter((e:any)=>e._id!==media._id) 
      }  


           const item = { _id: media._id, url: media.url }
    return isMultiple ? [...prev, item] : [item]


  })
  };

  return (
    <div key={ media._id } className="h-[350px] w-full relative rounded">
      <Image
        alt={ media?.title || "Media" }
        fill
        src={ media?.url }
        className="object-cover"
      />

      <div className="absolute h-5 w-5 left-1 top-1">
        <FieldGroup className="w-fit">
          <Field orientation="horizontal">
            <Checkbox
              className="border-2 border-cyan-400"
              checked={ prevState.some((e:any)=>e._id===media._id) }

              onCheckedChange={ (checked) =>
                handleCheck(media, Boolean(checked))
              }

            />
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
};

export default MediaCheck;