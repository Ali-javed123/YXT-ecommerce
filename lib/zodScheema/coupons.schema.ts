import z from "zod";
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


export const CouponsSchema=z.object({
    code:z.string().min(1,'coupon code is required'),
  discountPercentage: requiredNumber("Discount percentage", true),
  minShoppingAmount: requiredNumber("Discount percentage", true),
  validity: z.coerce.date()

})
export const UpdateCouponsSchema=z.object({
    code:z.string().min(1,'coupon code is required'),
  discountPercentage: requiredNumber("Discount percentage", true),
  minShoppingAmount: requiredNumber("Discount percentage", true),
  validity: z.coerce.date(),
_id:z.string().min(1,'_id is required')

})