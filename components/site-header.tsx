"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";

export function SiteHeader() {
  const isMobile = useMobile();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-white shadow-[0_4px_20px_rgba(0,73,135,0.29)] transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/logo3.png"
            alt="Blockchain Pioneer Student Logo"
            width={160}
            height={0}
            style={{ height: "auto" }}
          />
        </div>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${pathname === "/" ? "text-[#004987] font-bold" : ""
                    }`}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${pathname === "/about" ? "text-[#004987] font-bold" : ""
                    }`}
                >
                  About
                </Link>
                <Link
                  href="/events"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${pathname === "/events" ? "text-[#004987] font-bold" : ""
                    }`}
                >
                  Events
                </Link>
                <Link
                  href="/blogs"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${pathname === "/news" ? "text-[#004987] font-bold" : ""
                    }`}
                >News</Link>
                {/* 
                <Link
                  href="/news"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${
                    pathname === "/news" ? "text-[#004987] font-bold" : ""
                  }`}
                >
                  Tin tức
                </Link>
                */}
                {/* 
                <Link
                  href="/media"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${
                    pathname === "/media" ? "text-[#004987] font-bold" : ""
                  }`}
                >
                  Thư viện
                </Link>
                */}
                {/* 
                <Link
                  href="/partners"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${
                    pathname === "/partners" ? "text-[#004987] font-bold" : ""
                  }`}
                >
                  Đối tác
                </Link>
                */}
                <Link
                  href="/team"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${pathname === "/team" ? "text-[#004987] font-bold" : ""
                    }`}
                >
                  Team
                </Link>
                <Link
                  href="/contact"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${pathname === "/contact" ? "text-[#004987] font-bold" : ""
                    }`}
                >
                  Contact
                </Link>
                <Link
                  href="/join"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${pathname === "/join" ? "text-[#004987] font-bold" : ""
                    }`}
                >
                  Join Club
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <>
            <div className="flex-1 flex justify-center">
              {/* Desktop & large tablet menu */}
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/"
                  scroll={true}
                  className={`text-sm font-medium transition-transform duration-200 hover:scale-105 hover:text-[#003b6d] active:text-[#002b52] ${pathname === "/"
                    ? "text-[#003b6d] font-bold"
                    : "text-[#004987]"
                    }`}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  scroll={true}
                  className={`text-sm font-medium transition-transform duration-200 hover:scale-105 hover:text-[#003b6d] active:text-[#002b52] ${pathname === "/about"
                    ? "text-[#003b6d] font-bold"
                    : "text-[#004987]"
                    }`}
                >
                  About
                </Link>
                <Link
                  href="/events"
                  scroll={true}
                  className={`text-sm font-medium transition-transform duration-200 hover:scale-105 hover:text-[#003b6d] active:text-[#002b52] ${pathname === "/events"
                    ? "text-[#003b6d] font-bold"
                    : "text-[#004987]"
                    }`}
                >
                  Events
                </Link>
                <Link
                  href="/blogs"
                  scroll={true}
                  className={`text-sm font-medium transition-transform duration-200 hover:scale-105 hover:text-[#003b6d] active:text-[#002b52] ${pathname === "/news"
                      ? "text-[#003b6d] font-bold"
                      : "text-[#004987]"
                    }`}
                >News</Link>
                {/* 
                <Link
                  href="/news"
                  scroll={true}
                  className={`text-sm font-medium transition-transform duration-200 hover:scale-105 hover:text-[#003b6d] active:text-[#002b52] ${
                    pathname === "/news"
                      ? "text-[#003b6d] font-bold"
                      : "text-[#004987]"
                  }`}
                >
                  Tin tức
                </Link>
                */}
                {/* 
                <Link
                  href="/media"
                  scroll={true}
                  className={`text-sm font-medium transition-transform duration-200 hover:scale-105 hover:text-[#003b6d] active:text-[#002b52] ${
                    pathname === "/media"
                      ? "text-[#003b6d] font-bold"
                      : "text-[#004987]"
                  }`}
                >
                  Thư viện
                </Link>
                */}
                {/* 
                <Link
                  href="/partners"
                  scroll={true}
                  className={`text-sm font-medium transition-transform duration-200 hover:scale-105 hover:text-[#003b6d] active:text-[#002b52] ${
                    pathname === "/partners"
                      ? "text-[#003b6d] font-bold"
                      : "text-[#004987]"
                  }`}
                >
                  Đối tác
                </Link>
                */}
                <Link
                  href="/team"
                  scroll={true}
                  className={`text-sm font-medium transition-transform duration-200 hover:scale-105 hover:text-[#003b6d] active:text-[#002b52] ${pathname === "/team"
                    ? "text-[#003b6d] font-bold"
                    : "text-[#004987]"
                    }`}
                >
                  Team
                </Link>
                <Link
                  href="/contact"
                  scroll={true}
                  className={`text-sm font-medium transition-transform duration-200 hover:scale-105 hover:text-[#003b6d] active:text-[#002b52] ${pathname === "/contact"
                    ? "text-[#003b6d] font-bold"
                    : "text-[#004987]"
                    }`}
                >
                  Contact
                </Link>
              </nav>

              {/* Mobile & iPad menu (Sheet) */}
              <nav className="flex md:hidden flex-col gap-4 mt-8">
                <Link
                  href="/"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${pathname === "/" ? "text-[#004987] font-bold" : ""
                    }`}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${pathname === "/about" ? "text-[#004987] font-bold" : ""
                    }`}
                >
                  About
                </Link>
                <Link
                  href="/events"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${pathname === "/events" ? "text-[#004987] font-bold" : ""
                    }`}
                >
                  Events
                </Link>
                {/* 
                <Link
                  href="/news"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${
                    pathname === "/news" ? "text-[#004987] font-bold" : ""
                  }`}
                >
                  Tin tức
                </Link>
                */}
                {/* 
                <Link
                  href="/media"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${
                    pathname === "/media" ? "text-[#004987] font-bold" : ""
                  }`}
                >
                  Thư viện
                </Link>
                */}
                {/* 
                <Link
                  href="/partners"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${
                    pathname === "/partners" ? "text-[#004987] font-bold" : ""
                  }`}
                >
                  Đối tác
                </Link>
                */}
                <Link
                  href="/team"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${pathname === "/team" ? "text-[#004987] font-bold" : ""
                    }`}
                >
                  Team
                </Link>
                <Link
                  href="/contact"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${pathname === "/contact" ? "text-[#004987] font-bold" : ""
                    }`}
                >
                  Contact
                </Link>
                <Link
                  href="/join"
                  scroll={true}
                  className={`text-lg font-medium hover:text-[#004987] ${pathname === "/join" ? "text-[#004987] font-bold" : ""
                    }`}
                >
                  Join Club
                </Link>
              </nav>
            </div>
            <div>
              <Link href="/join">
                <Button
                  className={`${pathname === "/join" ? "bg-[#003b6d]" : "bg-[#004987]"
                    } hover:bg-[#003b6d]`}
                >
                  Join Club
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
