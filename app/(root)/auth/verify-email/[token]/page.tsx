"use client";

import React, { use, useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import verifiedGif from "../../../../../public/assets/images/verified.gif";
import verifiedFailed from "../../../../../public/assets/images/verification-failed.gif";
import Image from "next/image";
import { WEBSITE_HOME } from "@/routes/website.route";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
    params: Promise<{
        token: string;
    }>;
}

const Page = ({ params }: PageProps) => {
    const { token } = use(params);

    const [isVerify, setVerify] = useState(false);

    useEffect(() => {
        const verify = async () => {
            try {
                const { data: verification } = await axios.post(
                    "/api/auth/verify-email",
                    {
                        token,
                    }
                );

                console.log("verification", verification);

                if (verification.success) {
                    setVerify(true);
                } else {
                    setVerify(false);
                }
            } catch (error) {
                console.error("Verification error:", error);
                setVerify(false);
            }
        };

        if (token) {
            verify();
        }
    }, [token]);

    return (
        <Card>
            <CardContent>
                {isVerify ? (
                    <div className="flex h-[230px] w-[300px] flex-col justify-center items-center">
                        <Image
                            src={verifiedGif.src}
                            className="w-auto h-28"
                            height={verifiedGif.height}
                            width={verifiedGif.width}
                            alt="Email verified"
                        />

                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">
                                Email Verification Success!
                            </h2>

                            <Button>
                                <Link href={WEBSITE_HOME}>
                                    Continue Shopping
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-[500px] w-[300px] flex-col justify-center items-center">
                        <Image
                            src={verifiedFailed.src}
                            className="w-auto h-28"
                            height={verifiedFailed.height}
                            width={verifiedFailed.width}
                            alt="Email verification failed"
                        />

                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-red-500">
                                Email Verification Failed!
                            </h2>

                            <Button>
                                <Link href={WEBSITE_HOME}>
                                    Continue Shopping
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default Page;