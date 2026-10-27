import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/routes/AdminPanel.route'
import type { Breadcrum as breadcrum } from '@/types/breadcrum'
import Link from 'next/link';

const Breadcrum = ({ data = [] }: { data?: breadcrum[] }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {data.map((item, index) => {
          const isLast = index === data.length - 1;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={`${item.href}`} />}>
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrum;