"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useIPTV } from "@/context/iptv-context";
import { FilterPanel } from "@/components/filter-panel";
import { ChannelGrid } from "@/components/channel-grid";

function DashboardContent() {
  const { setSelectedGroup } = useIPTV();
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");

  // Sync category parameter with the global context state
  useEffect(() => {
    if (catParam !== null) {
      setSelectedGroup(decodeURIComponent(catParam));
    }
  }, [catParam, setSelectedGroup]);

  return (
    <div className="flex flex-col gap-6 min-h-screen pb-16">
      <section className="flex flex-col gap-6">
        <FilterPanel />
        <ChannelGrid />
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <div className="relative w-12 h-12">
            <span className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></span>
            <span className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></span>
          </div>
          <p className="text-zinc-500 text-xs font-medium animate-pulse">
            Loading Dashboard...
          </p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
