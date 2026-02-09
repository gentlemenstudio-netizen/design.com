"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export const LoadingBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done(); // Stop when route changes
    return () => { NProgress.start(); }; // Start when navigating
  }, [pathname, searchParams]);

  return null;
};