// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET;

// if (!JWT_SECRET) {
//   throw new Error("JWT_SECRET is not defined");
// }

// export interface JwtPayload {
//   userId: string;
// }


// export const createToken = (userId: string) => {
//   return jwt.sign(
//     { userId:userId },
//     JWT_SECRET,
//     {
//       expiresIn: "1d",
//     }
//   );
// };

// export const verifyToken = (token: string): JwtPayload => {
//   return jwt.verify(token, JWT_SECRET) as JwtPayload;
// };
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

export interface JwtPayload {
    userId: string;
}

export const createToken = (userId: string) => {
    return jwt.sign(
        {
            userId,
        },
        JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(
        token,
        JWT_SECRET
    ) as JwtPayload;
};