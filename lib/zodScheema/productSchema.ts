import z from "zod";

export const MediaSchema=z.object({
  _id:z.string().min(1,'media id is required!'),
  // url:z.string().min(1,'url is required!'),
})
  const requiredNumber = (label: string, allowZero = false) =>
  z
    .union([z.string(), z.number()])
    .superRefine((raw, ctx) => {
      const val = String(raw).trim();

      if (val === "") {
        ctx.addIssue({ code: "custom", message: `${label} is required!` });
        return;
      }
      if (isNaN(Number(val))) {
        ctx.addIssue({ code: "custom", message: "Please enter a valid number!" });
        return;
      }
      if (allowZero ? Number(val) < 0 : Number(val) <= 0) {
        ctx.addIssue({
          code: "custom",
          message: allowZero ? "Cannot be negative!" : "Must be greater than 0!",
        });
      }
    })
    .transform((val) => Number(val));

export const ProdcutSchema=z.object({
    name:z.string().min(1,"name is required!"),
    description:z.string().min(1,"description is required!").max(5000,"decription is max in 30"),
    slug:z.string().min(1,"name is required!"),
    category:z.string().min(1,"category is required!"),
      mrp: requiredNumber("MRP"),
  sellingPrice: requiredNumber("Selling price"),
  discountPercentage: requiredNumber("Discount percentage", true),
media: z
    .array(z.string().min(1, "media id is required!"))
    .min(1, "Please select at least one media"),

    // mrp:z.union([
    //     z.number().min(1,"mrp is required").positive("Expected number must be positive!"),
    //     z.string().min(1,"mrp is required").transform((val)=>Number(val)).refine((val)=>!isNaN(val)
    //      && val>=0,"please enter a valid number!")
    // ]),


    // sellingPrice:z.union([
    //     z.number().min(1,"Selling Price is required").positive("Expected number must be positive!"),
    //     z.string().min(1,"Selling Price is required").transform((val)=>Number(val)).refine((val)=>!isNaN(val)
    //      && val>=0,"please enter a valid number!")
         
    // ]),

    // discountPercentage:z.union([
    //     z.number().min(1,"Discount Percentage   is required").positive("Expected number must be positive!"),
    //     z.string().min(1,"Discount Percentage is required").transform((val)=>Number(val)).refine((val)=>!isNaN(val)
    //      && val>=0,"please enter a valid number!")
    // ]),

})