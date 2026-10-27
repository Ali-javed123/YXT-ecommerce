"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuChevronRight, LuLogOut, LuSettings } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";

import logoBlack from "../../../public/assets/images/logo-black.png";
import logoWhite from "../../../public/assets/images/logo-white.png";
import { adminAppSidebarMenu } from "@/lib/AdminSidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const {toggleSidebar}=useSidebar()
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});


  const isActive = (url: string) =>
    url !== "#" && (pathname === url );

  return (
    <Sidebar
      {...props}
      className="border-r border-sidebar-border/60 bg-sidebar/80 backdrop-blur-xl supports-[backdrop-filter]:bg-sidebar/70"
    >
      {/* ═══════════════ HEADER ═══════════════ */}
      <SidebarHeader className="border-b border-sidebar-border/60 h-16 p-0">
        <div className="flex justify-between px-5 items-center h-full">
          <Link href="/admin" className="flex items-center gap-2 group">
            <Image
              src={logoBlack}
              width={logoBlack.width}
              height={logoBlack.height}
              className="dark:hidden block h-10 object-contain w-auto transition-transform duration-300 group-hover:scale-105"
              alt="logo black"
              priority
            />
            <Image
              src={logoWhite}
              width={logoWhite.width}
              height={logoWhite.height}
              className="hidden dark:block object-contain h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              alt="logo white"
              priority
            />
          </Link>
          <Button
            size="icon"
            // variant="ghost"
            type="button"
            onClick={toggleSidebar}
            className="size-8 md:hidden rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
          >
            <IoMdClose className="size-4 text-white" />
          </Button>
        </div>
      </SidebarHeader>

      {/* ═══════════════ CONTENT ═══════════════ */}
      <SidebarContent className="px-2 py-3 gap-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/60 [&::-webkit-scrollbar-track]:bg-transparent">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {adminAppSidebarMenu.map((item) => {
                const Icon = item.icons;
                const active = isActive(item.url);

                // ─── With submenu → Collapsible ───
                if (item.submenu && item.submenu.length > 0) {
                  const hasActiveChild = item.submenu.some((sub) =>
                    isActive(sub.url)
                  );
                  console.log("ADD",hasActiveChild)

                  return (
                    <Collapsible
                      key={item.title}
                      render={<SidebarMenuItem />}
                      defaultOpen={hasActiveChild}
                      open={openMenus[item.title] ?? hasActiveChild}
                      onOpenChange={(open: boolean) => {
  setOpenMenus((prev: any) => ({ ...prev, [item.title]: open }));
}}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger
                        render={
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={hasActiveChild}
                            className="h-10 rounded-xl px-3 font-medium text-sidebar-foreground/85 transition-all duration-200 hover:bg-accent/70 hover:text-sidebar-accent-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold"
                          />
                        }
                      >
                        <span className="flex size-8 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground transition-colors group-hover/collapsible:bg-primary/15 group-hover/collapsible:text-primary data-[active=true]:bg-primary/15 data-[active=true]:text-primary">
                          <Icon className="size-4" />
                        </span>
                        <span className="flex-1 text-left">{item.title}</span>
                        <LuChevronRight className="size-4 shrink-0 text-muted-foreground/70 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                      </CollapsibleTrigger>

                      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-top-1 data-[state=closed]:slide-out-to-top-1 duration-200">
                        <SidebarMenuSub className="ml-4 mt-1 gap-0.5 border-l border-sidebar-border/70 pl-3">
                          {item.submenu.map((sub) => {
                            const subActive = isActive(sub.url);
                            return (
                              <SidebarMenuSubItem key={sub.title}>
                                <SidebarMenuSubButton
                                  render={<Link href={sub.url} />}
                                  isActive={subActive}
                                  className="h-9 rounded-lg px-3 text-sm text-sidebar-foreground/70 transition-all duration-200  border-black hover:bg-accent/60 hover:text-sidebar-accent-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                                >
                                  <span className="relative flex items-center gap-2">
                                    <span
                                      className={`absolute -left-[15px] size-1.5 rounded-full transition-all duration-300 ${
                                        subActive
                                          ? "bg-primary scale-100"
                                          : "bg-border scale-0"
                                      }`}
                                    />
                                    {sub.title}
                                  </span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                }

                // ─── Without submenu → Simple link ───
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      tooltip={item.title}
                      isActive={active}
                      className="h-10 rounded-xl px-3 font-medium text-sidebar-foreground/85 transition-all duration-200 hover:bg-accent/70 hover:text-sidebar-accent-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold"
                    >
                      <span
                        className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
                          active
                            ? "bg-primary/15 text-primary"
                            : "bg-muted/60 text-muted-foreground"
                        }`}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="flex-1 text-left">{item.title}</span>
                      {active && (
                        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <SidebarFooter className="border-t border-sidebar-border/60 p-3">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/admin/settings" />}
              tooltip="Settings"
              className="h-10 rounded-xl px-3 font-medium text-sidebar-foreground/80 transition-all duration-200 hover:bg-accent/70 hover:text-sidebar-accent-foreground"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                <LuSettings className="size-4" />
              </span>
              <span className="flex-1 text-left">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              className="h-10 rounded-xl px-3 font-medium text-destructive/90 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <LuLogOut className="size-4" />
              </span>
              <span className="flex-1 text-left">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail className="after:bg-sidebar-border/60 hover:after:bg-primary/60 transition-colors" />
    </Sidebar>
  );
}