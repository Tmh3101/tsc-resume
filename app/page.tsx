"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { ScrollToTop } from "@/components/ui/ScrollToTop";

// =====================================================
// Trang chủ Landing Page - The Student Company
// =====================================================

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return null;
  // return (
  //   <>
  //     {/* Scroll To Top Button */}
  //     <ScrollToTop />
  //   </>
  // );
}
