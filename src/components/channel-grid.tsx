"use client";

import React from "react";
import { ChannelCard } from "./channel-card";
import { useIPTV } from "@/context/iptv-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tv, Info, SearchX, AlertCircle } from "lucide-react";

export const ChannelGrid: React.FC = () => {
  const {
    paginatedChannels,
    filteredChannels,
    loading,
    error,
    hasMore,
    loadMore,
    resetFilters,
    searchQuery,
    selectedGroup,
  } = useIPTV();

  // 1. Loading State - Render Skeletal placeholders
  if (loading && paginatedChannels.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl p-4 flex flex-col gap-3 shadow-sm"
            >
              <Skeleton className="aspect-video w-full rounded-lg" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Fatal Fetching Error State
  if (error) {
    return (
      <div className="mx-auto my-12 flex max-w-xl flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl px-6 py-16 text-center shadow-lg">
        <div className="mb-4 flex items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive animate-pulse">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Error Fetching Data
        </h3>
        <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {error}
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="rounded-md border-border bg-background/50 backdrop-blur-md px-6 py-2 text-primary font-medium shadow-sm hover:bg-primary/10 hover:text-primary"
        >
          Refresh Application
        </Button>
      </div>
    );
  }

  // 3. Empty Search / Filter Results State
  if (paginatedChannels.length === 0) {
    const isWatchlist = selectedGroup === "__watchlist";
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl px-6 py-20 text-center shadow-lg">
        <div className="mb-4 flex items-center justify-center rounded-xl border border-border/50 bg-muted/50 p-4 text-muted-foreground">
          {isWatchlist ? (
            <Tv className="w-10 h-10 stroke-muted-foreground" />
          ) : (
            <SearchX className="w-10 h-10 stroke-muted-foreground" />
          )}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {isWatchlist ? "Watchlist Empty" : "No Channels Found"}
        </h3>
        <p className="mb-6 max-w-xs text-sm text-muted-foreground">
          {isWatchlist
            ? "You haven't pinned any channels to your favorites yet. Click the heart icon on any card!"
            : `We couldn't find matches for "${searchQuery || ""}" in the selected category.`}
        </p>
        {!isWatchlist && (
          <Button
            onClick={resetFilters}
            className="rounded-md bg-primary text-primary-foreground px-6 py-2 font-medium shadow-md hover:bg-primary/90"
          >
            Clear Search & Filters
          </Button>
        )}
      </div>
    );
  }

  // 4. Render Active Grid Layout
  return (
    <div className="flex flex-col gap-10">
      {/* Search status bar */}
      <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card/40 backdrop-blur-lg px-4 py-3 text-xs text-muted-foreground select-none">
        <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
          <Info className="w-3.5 h-3.5 text-muted-foreground" />
          Showing {paginatedChannels.length} of {filteredChannels.length}{" "}
          channels
        </span>
        {searchQuery && (
          <span className="text-muted-foreground">
            Search query:{" "}
            <strong className="text-primary font-semibold">
              "{searchQuery}"
            </strong>
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {paginatedChannels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>

      {/* Infinite Paginated Load More Section */}
      {hasMore && (
        <div className="flex justify-center items-center py-6 select-none">
          <Button
            onClick={loadMore}
            size="lg"
            variant="outline"
            className="rounded-xl border border-border/50 bg-card/60 px-8 py-3 font-medium tracking-wide backdrop-blur-xl shadow-md hover:bg-primary/10 hover:text-primary transition-all duration-300"
          >
            Load More Channels
          </Button>
        </div>
      )}
    </div>
  );
};
