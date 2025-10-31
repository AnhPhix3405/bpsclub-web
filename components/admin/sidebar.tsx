"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Calendar,
  User,
  Home,
} from "lucide-react";

const menuItems = [
  {
    title: "Quản lý sự kiện",
    href: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Thông tin tài khoản",
    href: "#", // Chưa cần gắn link
    icon: User,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      {/* Header with Avatar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col items-center">
          <Avatar className="w-16 h-16 mb-3">
            <AvatarImage 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="Admin Avatar" 
            />
            <AvatarFallback className="bg-[#004987] text-white text-lg font-semibold">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-900">Admin User</h3>
            <p className="text-xs text-gray-500 mt-1">Quản trị viên</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                {item.href === "#" ? (
                  <div className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-400 cursor-not-allowed">
                    <Icon className="w-5 h-5 mr-3" />
                    {item.title}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200",
                      isActive
                        ? "bg-[#004987] text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100 hover:text-[#004987]"
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.title}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-[#004987] transition-colors duration-200"
        >
          <Home className="w-5 h-5 mr-3" />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
