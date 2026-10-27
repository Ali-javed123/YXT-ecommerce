// import { ToastContainer } from "react-toastify";
// import GlobalProvider from "@/store/GlobalProvider";
// import {
//   SidebarInset,
//   SidebarProvider,
// } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/Application/Admin/AppSidebar";
// import TopBar from "@/components/Application/TopBar";
// import { ThemeProvider } from "@/components/Application/Admin/ThemeProvider";

// export default function CategoryLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <SidebarProvider>
//   <AppSidebar />
//   <SidebarInset className="min-w-0">
//     <TopBar />
//     <div className="flex-1 w-full p-4 md:p-6">
//       {children}
//     </div>
//     <footer className="flex h-10 items-center justify-center border-t bg-gray-50 text-sm dark:bg-background">
//       @Developer Ali Javed All copyright Reserved
//     </footer>
//   </SidebarInset>
// </SidebarProvider>
//   );
// }
// app/category/layout.tsx
export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}