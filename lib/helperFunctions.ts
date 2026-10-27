
// import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import type { MRT_ColumnDef } from "material-react-table";
import { NextApiRequest } from "next";

export const response = (
  success: boolean,
  statusCode: number,
  message: string,
  data: unknown = {}
) => {
  return NextResponse.json(
    {
      success,
      statusCode,
      message,
      data,
    },
    {
      status: statusCode,
    }
  );
};

export const catchError = (error: any) => {
  if (error?.name === "ValidationError") {
    const errors = Object.values(error.errors).map(
      (err: any) => ({
        field: err.path,
        message:
          err.kind === "required"
            ? `${err.path.replaceAll("_", " ")} is required`
            : err.message,
      })
    );

    return NextResponse.json(
      {
        success: false,
        statusCode: 400,
        message: "Please provide all required fields",
        data: errors,
      },
      { status: 400 }
    );
  }

  let statusCode = 500;
  let message = "Internal Server Error";

  if (error?.code === 11000) {
    statusCode = 409;

    const fields = Object.keys(error.keyPattern ?? {}).join(", ");
    message = `Duplicate field: ${fields}. These field values must be unique.`;
  } else if (process.env.NODE_ENV === "development") {
    message = error?.message || message;
  }

  return NextResponse.json(
    {
      success: false,
      statusCode,
      message,
    },
    { status: statusCode }
  );
};
export const generateOTP=()=>{
  const otp=Math.floor(100000+Math.random()*900000).toString()
  return otp;
}




function jwtVerify(value: string | undefined, arg1: any): { payload: any; } | PromiseLike<{ payload: any; }> {
  throw new Error("Function not implemented.");
}
export const isAuthenticated = async (
    req: NextRequest,

  role: string) => {
  try {
    // const cookieStore = await cookies();

    // const access_token = cookieStore.get("access_token")?.value;
    const access_token = req.cookies.get("access_token")?.value;
console.log("Cookie exists:", Boolean(access_token));
    // console.log("🔍 Cookie mila:", access_token ? "YES" : "NO - cookie missing hai");

    if (!access_token) {
      return { isAuth: false };
    }

    const payload = jwt.verify(
      access_token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload & { _id: string; role: string };

    if (payload.role !== role) {
      return { isAuth: false };
    }

    return {
      isAuth: true,
      userid: payload._id,
    };
  } catch (error:any) {
        console.log("❌ JWT verify FAIL hua");
    console.log("❌ Error name:", error?.name);
    console.log("❌ Error message:", error?.message);

    return {
      isAuth: false,
      error: error,
    };
  }
};



interface DataType {
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date | null;
  [key: string]: unknown;
}

export const columnConfig = <TData extends DataType>(
  column: MRT_ColumnDef<TData>[],
  isCreatedAt = false,
  isUpdatedAt = false,
  isDeletedAt = false
): MRT_ColumnDef<TData>[] => {
  const newColumn: MRT_ColumnDef<TData>[] = [...column];

  if(isCreatedAt){
    newColumn.push({
      accessorKey:"createdAt",
      header:"Created At",
          Cell: ({ renderedCellValue }: DataType) =>
        renderedCellValue?
        new Date(String(renderedCellValue)).toLocaleString():'-',
    })

  }
  if(isUpdatedAt){
    newColumn.push({
      accessorKey:"updatedAt",
      header:"Updated At",
      Cell: ({ renderedCellValue }: DataType) =>
        renderedCellValue?
        new Date(String(renderedCellValue)).toLocaleString():'-',
    })

  }
  if(isDeletedAt){
    newColumn.push({
      accessorKey:"deletedAt",
      header:"Deleted At",
      Cell: ({ renderedCellValue }: DataType) =>

                renderedCellValue?

        new Date(String(renderedCellValue)).toLocaleString():'-',
    })
    
  }
  
  return newColumn




}