"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useIPTV } from "@/context/iptv-context";
import { LayoutGrid, Tv, ArrowUpRight, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesPage() {
  const { channels, groups, loading } = useIPTV();
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Calculate statistics (number of channels) per group category
  const categoriesWithStats = useMemo(() => {
    const statsMap: Record<string, number> = {};
    channels.forEach((ch) => {
      if (ch.group) {
        statsMap[ch.group] = (statsMap[ch.group] || 0) + 1;
      }
    });

    return groups.map((name) => ({
      name,
      count: statsMap[name] || 0,
      initials: name.slice(0, 2).toUpperCase(),
    }));
  }, [channels, groups]);

  // Filter categories by search input
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categoriesWithStats;
    const q = searchQuery.toLowerCase().trim();
    return categoriesWithStats.filter((cat) =>
      cat.name.toLowerCase().includes(q),
    );
  }, [categoriesWithStats, searchQuery]);

  // 1. Skeletal Loading layout
  if (loading) {
    return (
      <div className="flex flex-col gap-8 py-4 animate-pulse select-none">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48 bg-zinc-900" />
          <Skeleton className="h-4 w-96 bg-zinc-900" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full bg-zinc-900 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-4 min-h-screen pb-20 select-none">
      {/* Intro branding header block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-900 pb-8 text-left">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <LayoutGrid className="w-8 h-8 text-indigo-500" />
            Explore Categories
          </h1>
          <p className="text-zinc-500 text-sm max-w-md leading-relaxed">
            Browse through our extensive library of {groups.length} unique
            streaming categories and find the perfect broadcast.
          </p>
        </div>

        {/* Real-time Category Search Input */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-100 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 pl-10 pr-4 h-10 w-full rounded-md focus-visible:ring-1 focus-visible:ring-indigo-500"
          />
        </div>
      </div>

      {/* Categories Grid List */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map((cat) => (
            <Link
              key={cat.name}
              href={`/?cat=${encodeURIComponent(cat.name)}`}
              className="group relative flex flex-col justify-between p-5 rounded-md bg-zinc-100/60 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-900 hover:border-zinc-350 dark:hover:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900/80 transition-all duration-300 shadow-sm"
            >
              {/* Border shine element */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md opacity-0 group-hover:opacity-20 blur-[2px] transition duration-550" />

              <div className="relative z-10 flex items-start justify-between gap-4 text-left">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 group-hover:dark:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="bg-zinc-200/80 dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700/50 hover:bg-zinc-250 text-zinc-600 dark:text-zinc-400 font-semibold text-[10px] w-fit flex items-center gap-1 py-0.5 px-2 rounded-md"
                  >
                    <Tv className="w-2.5 h-2.5" />
                    {cat.count} Channels
                  </Badge>
                </div>

                <div className="w-10 h-10 rounded-md bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-850 flex items-center justify-center text-xs font-black text-zinc-500 dark:text-zinc-400 shrink-0 select-none uppercase tracking-wide group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white transition-all">
                  {cat.initials}
                </div>
              </div>

              {/* Bottom detail action */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-bold text-zinc-450 dark:text-zinc-650 group-hover:text-indigo-600 dark:group-hover:text-zinc-400 transition-colors mt-6 pt-3 border-t border-zinc-200 dark:border-zinc-900/50">
                <span>OPEN LIVE PLAYLIST</span>
                <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center rounded-md border border-zinc-200 dark:border-zinc-900 bg-zinc-100/50 dark:bg-zinc-900/10 text-zinc-500 max-w-md mx-auto text-sm">
          No categories matched your search criteria.
        </div>
      )}
    </div>
  );
}
