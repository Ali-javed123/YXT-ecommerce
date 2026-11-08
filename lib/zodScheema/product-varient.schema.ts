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

export const ProdcutVariantSchema=z.object({
    product:z.string().min(1,"product is required!"),
    color:z.string().min(1,"color is required!"),

    sku:z.string().min(1,"sku is required!"),
    size:z.string().min(1,"size is required!"),

      mrp: requiredNumber("MRP"),
  sellingPrice: requiredNumber("Selling price"),
  
  discountPercentage: requiredNumber("Discount percentage", true),

media: z
    .array(z.string().min(1, "media id is required!"))
    .min(1, "Please select at least one media"),


})

export const ProdcutVariantUpdateSchema=z.object({
    product:z.string().min(1,"product  is required!"),
    _id:z.string().min(1,"_id  is required!"),
    color:z.string().min(1,"color is required!"),

    sku:z.string().min(1,"sku is required!"),
    size:z.string().min(1,"size is required!"),

      mrp: requiredNumber("MRP"),
  sellingPrice: requiredNumber("Selling price"),
  
  discountPercentage: requiredNumber("Discount percentage", true),

media: z
    .array(z.string().min(1, "media id is required!"))
    .min(1, "Please select at least one media"),


})