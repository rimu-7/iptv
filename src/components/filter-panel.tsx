"use client"

import React from "react"
import { useIPTV, SortOption } from "@/context/iptv-context"
import { Badge } from "@/components/ui/badge"
import { ListFilter, Heart, RefreshCw } from "lucide-react"

export const FilterPanel: React.FC = () => {
  const {
    groups,
    selectedGroup,
    setSelectedGroup,
    favorites,
    sortBy,
    setSortBy,
    resetFilters,
  } = useIPTV()

  const handleGroupSelect = (group: string) => {
    setSelectedGroup(group)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption)
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-100/60 dark:bg-zinc-950/65 backdrop-blur-md border border-zinc-200 dark:border-zinc-900 px-4 py-3 rounded-md select-none">
      
      {/* Category Pills list */}
      <div className="flex items-center gap-3 overflow-hidden w-full md:max-w-[70%]">
        <div className="text-zinc-650 dark:text-zinc-400 text-xs font-semibold flex items-center gap-1.5 shrink-0 px-1">
          <ListFilter className="w-3.5 h-3.5" />
          Groups
        </div>

        {/* Scrollable Badges List */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* ALL Category Button */}
          <button
            onClick={() => handleGroupSelect("")}
            className="shrink-0 outline-none"
          >
            <Badge
              variant="outline"
              className={`px-3 py-1 cursor-pointer transition-all duration-300 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                selectedGroup === ""
                  ? "bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              All Channels
            </Badge>
          </button>

          {/* WATCHLIST Badge Button */}
          <button
            onClick={() => handleGroupSelect("__watchlist")}
            className="shrink-0 outline-none"
          >
            <Badge
              variant="outline"
              className={`px-3 py-1 cursor-pointer transition-all duration-300 text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 ${
                selectedGroup === "__watchlist"
                  ? "bg-pink-600 hover:bg-pink-500 border-pink-500 text-white"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-pink-600 dark:text-pink-500/80 hover:text-pink-500 hover:border-pink-300 dark:hover:border-pink-700"
              }`}
            >
              <Heart className={`w-2.5 h-2.5 ${selectedGroup === "__watchlist" ? "fill-white" : "fill-pink-500/30"}`} />
              Watchlist ({favorites.length})
            </Badge>
          </button>

          {/* Dynamic Groups list from JSON */}
          {groups.map((group) => {
            const isSelected = selectedGroup === group
            return (
              <button
                key={group}
                onClick={() => handleGroupSelect(group)}
                className="shrink-0 outline-none"
              >
                <Badge
                  variant="outline"
                  className={`px-3 py-1 cursor-pointer transition-all duration-300 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                    isSelected
                      ? "bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  {group}
                </Badge>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sorting Select and filter resets */}
      <div className="flex items-center justify-end gap-3 shrink-0 select-none">
        {/* Reset Filters Toggle */}
        <button
          onClick={resetFilters}
          title="Reset Filters"
          className="p-2 rounded-md bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 hover:border-zinc-350 dark:hover:border-zinc-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Custom Sort dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="appearance-none bg-white dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 text-xs font-semibold px-4 py-2 pr-8 rounded-md border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700/80 focus:border-indigo-500 focus:outline-none cursor-pointer transition-colors shadow-sm"
          >
            <option value="default">Default Sort</option>
            <option value="alphabetical">Name A - Z</option>
            <option value="group">Category Group</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-500">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>
      
    </div>
  )
}
