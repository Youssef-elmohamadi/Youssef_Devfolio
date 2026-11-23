"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from '@/i18n/routing';
import Image from "next/image";
import { usePathname } from '@/i18n/routing';
import { useSidebar } from "@/app/context/SidebarContext";
import { useTranslations } from "next-intl";
import {
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  UserCircleIcon,
  ChevronDownIcon,
  UserIcon,
  PieChartIcon,
  DocsIcon,
  BellIcon,
  CalenderIcon,
  SettingsIcon,
  MessagesIcon,
} from "@/app/icons";
import SidebarWidget from "./SidebarWidget";
import { FaSignOutAlt, FaTag, FaGraduationCap } from "react-icons/fa";

// 👇 استيراد الأكشن من الملف المنفصل
import { logoutAction } from "@/actions/auth";

type NavItem = {
  key: string;
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { key?: string; name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    key: "home",
    icon: <GridIcon />,
    name: "Home",
    path: "/admin",
  },
  {
    key: "articles",
    icon: <PageIcon />,
    name: "Articles",
    path: "/admin/articles",
  },
  {
    key: "courses",
    icon: <FaGraduationCap />,
    name: "Courses",
    path: "/admin/courses",
  },
  {
    key: "categories",
    icon: <FaTag />,
    name: "Categories",
    path: "/admin/categories",
  },
  {
    key: "about",
    icon: <UserIcon />,
    name: "About Me",
    path: "/admin/about",
  },
  {
    key: "skills",
    icon: <PieChartIcon />,
    name: "My Skills",
    path: "/admin/skills",
  },
  {
    key: "experience",
    icon: <CalenderIcon />,
    name: "My Experience",
    path: "/admin/experience",
  },
  {
    key: "education",
    icon: <DocsIcon />,
    name: "My Education",
    path: "/admin/education",
  },
  {
    key: "projects",
    icon: <ListIcon />,
    name: "MyProjects",
    path: "/admin/projects",
  },
  {
    key: "messages",
    icon: <MessagesIcon />,
    name: "Messages",
    path: "/admin/messages",
  },
  {
    key: "settings",
    icon: <SettingsIcon />,
    name: "Profile Settings",
    path: "/admin/settings",
  },
  {
    key: "logout",
    icon: <FaSignOutAlt />,
    name: "Logout",
  },
];

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const t = useTranslations("admin.nav");
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const handleLogout = async () => {
    await logoutAction();
  };

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others",
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => {
        const label = nav.key ? t(nav.key) : nav.name;
        return (
          <li key={nav.key || nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={` ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{label}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ms-auto w-5 h-5 transition-transform duration-200 ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "rotate-180 text-brand-500"
                        : ""
                    }`}
                  />
                )}
              </button>
            ) : nav.key === "logout" || nav.name === "Logout" ? (
              <button
                onClick={handleLogout}
                className={`menu-item group w-full ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                } menu-item-inactive hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10 dark:hover:text-red-500`}
              >
                <span
                  className={`menu-item-icon-inactive group-hover:text-red-600 dark:group-hover:text-red-500`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{label}</span>
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className={`menu-item-text`}>{label}</span>
                  )}
                </Link>
              )
            )}

            {/* Submenu rendering */}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? `${subMenuHeight[`${menuType}-${index}`]}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ms-9">
                  {nav?.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`menu-dropdown-item ${
                          isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.key ? t(subItem.key) : subItem.name}
                        <span className="flex items-center gap-1 ms-auto">
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`app-sidebar-nav fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 start-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-e border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
              ? "w-[290px]"
              : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full lg:translate-x-0 rtl:lg:translate-x-0"}`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/logo/light-logo.webp"
                alt="Logo"
                width={120}
                height={32}
                style={{ objectFit: 'contain' }}
              />
              <Image
                className="hidden dark:block"
                src="/logo/dark-logo.webp"
                alt="Logo"
                width={120}
                height={32}
                style={{ objectFit: 'contain' }}
              />
            </>
          ) : (
            <Image
              src="/logo/light-logo.webp"
              alt="Logo"
              width={32}
              height={32}
              style={{ objectFit: 'contain' }}
              className="dark:hidden"
            />
          )}
          {!isExpanded && !isHovered && !isMobileOpen && (
            <Image
              src="/logo/dark-logo.webp"
              alt="Logo"
              width={32}
              height={32}
              style={{ objectFit: 'contain' }}
              className="hidden dark:block"
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>

              {renderMenuItems(navItems, "main")}
            </div>

            {/* <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div> */}
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
