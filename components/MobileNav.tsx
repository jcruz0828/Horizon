"use client";

import React from "react";
import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

const MobileNav = ({ user }: MobileNavProps) => {
  const pathName = usePathname();
  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent className="border-none bg-white"
        side={'left'}>
          <nav className="flex flex-col gap-4">
            <Link
              href={"/"}
              className="mb-12 cursor-pointer flex item-center gap-2"
            >
              <Image
                src="/icons/logo.svg"
                width={34}
                height={34}
                alt="Horizon logo"
                className="size-[24px] item-center max-xl:size-14"
              />
              <h1 className="sidebar-logo">Horizon</h1>
            </Link>
            <div className="mobilenav-sheet">
              <SheetClose asChild>
                <nav className=" flex h-full flex-col gap-6 pt-16 text-white">
                  {sidebarLinks.map((item) => {
                    const isActive =
                      pathName === item.route ||
                      pathName.startsWith(`${item.route}/`);
                    return (
                      <SheetClose asChild key={item.route}>
                        <Link
                          href={item.route}
                          key={item.label}
                          className={cn("mobilenav-sheet_close w-full", {
                            "bg-bank-gradient": isActive,
                          })}
                        >
                          
                            <Image
                              src={item.imgURL}
                              alt={item.label}
                              className={cn({
                                "brightness-[3] invert-0": isActive,
                              })}
                              width={20}
                              height={20}
                            />
                      
                          <p
                            className={cn("text-16 font-semibold text-black-2 ", {
                              "!text-white": isActive,
                            })}
                          >
                            {item.label}
                          </p>
                        </Link>
                      </SheetClose>
                    );
                  })}
                  
                </nav>
              </SheetClose>
              <Footer
              user = {user}
              />
            </div>
           
          </nav>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
