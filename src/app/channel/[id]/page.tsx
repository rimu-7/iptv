"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useIPTV } from "@/context/iptv-context";
import { VideoPlayer } from "@/components/video-player";
import { Tv, Heart, ChevronLeft, Share2, ListVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ChannelPageProps {
  params: Promise<{ id: string }>;
}

export default function ChannelPage({ params }: ChannelPageProps) {
  const { id } = React.use(params);
  const { channels, loading, toggleFavorite, isFavorite } = useIPTV();

  // Match the active channel object from ID
  const channel = useMemo(() => {
    return channels.find((ch) => ch.id === id);
  }, [channels, id]);

  const isFav = useMemo(() => {
    return id ? isFavorite(id) : false;
  }, [isFavorite, id]);

  // Scroll to top when loading a new channel stream
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Select recommended related channels from same group category
  const relatedChannels = useMemo(() => {
    if (!channel) return [];
    return channels
      .filter((ch) => ch.group === channel.group && ch.id !== channel.id)
      .slice(0, 10);
  }, [channels, channel]);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: `Watch ${channel?.name || "Live TV"} on  IPTV`,
          text: `Stream ${channel?.name || "live television"} directly in your browser!`,
          url: window.location.href,
        })
        .catch((err) => console.warn("Share failed", err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Channel streaming link copied to clipboard!");
    }
  };

  // 1. Loading State Screen
  if (loading && !channel) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-4 animate-pulse select-none">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Skeleton className="aspect-video w-full rounded-xl border border-border" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col gap-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // 2. Channel Not Found Fallback Screen
  if (!loading && !channel) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center select-none max-w-md mx-auto">
        <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20 text-destructive mb-6">
          <Tv className="w-10 h-10" />
        </div>
        <h2 className="text-foreground text-xl font-bold tracking-tight">
          Channel Not Found
        </h2>
        <p className="text-muted-foreground text-sm mt-2 mb-8 leading-relaxed">
          The channel you are looking for may have been removed, or the stream
          URL hash has expired. Please return to the homepage dashboard.
        </p>
        <Link href="/">
          <Button size="lg" className="px-8 shadow-sm">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const activeChannel = channel!;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-2 md:py-4 select-none">
      {/* Immersive Video Player Dashboard (Left Column) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between px-1">
          <Link href={`/?cat=${encodeURIComponent(activeChannel.group)}`}>
            <button className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1 group/btn cursor-pointer transition-colors">
              <ChevronLeft className="w-4 h-4 group-hover/btn:-translate-x-0.5 transition-transform" />
              Back to {activeChannel.group}
            </button>
          </Link>
          <span className="text-[10px] uppercase tracking-widest font-bold text-primary/80">
            Now Playing
          </span>
        </div>

        {/* Custom M3U8 Player component */}
        <div className="rounded-xl overflow-hidden shadow-sm border border-border bg-background">
          <VideoPlayer src={activeChannel.url} title={activeChannel.name} />
        </div>

        {/* Channel Stream Metadata Card */}
        <div className="bg-card text-card-foreground border border-border rounded-xl p-5 md:p-6 flex flex-col gap-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Branding details */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-12 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-2">
                {activeChannel.logo ? (
                  <img
                    src={activeChannel.logo}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <Tv className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <h1 className="text-xl md:text-2xl font-black leading-tight">
                  {activeChannel.name}
                </h1>
                <div className="flex items-center flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="text-[10px] uppercase font-bold tracking-wider py-0.5 px-2.5"
                  >
                    {activeChannel.group}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    1080p Live
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons (Favorites and Sharing) */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="gap-2 text-xs font-semibold h-9"
              >
                <Share2 className="w-4 h-4 text-muted-foreground" />
                Share
              </Button>

              <Button
                onClick={() => toggleFavorite(activeChannel.id)}
                variant={isFav ? "default" : "outline"}
                size="sm"
                className="gap-2 text-xs font-semibold h-9"
              >
                <Heart
                  className={`w-4 h-4 ${isFav ? "fill-current" : "text-muted-foreground"}`}
                />
                {isFav ? "Favorited" : "Pin Channel"}
              </Button>
            </div>
          </div>

          <hr className="border-border" />

          {/* Description Block */}
          <div className="text-left flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-foreground">
                Stream Description & Technical Specs
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
                This digital television signal is streamed via HTTP Live
                Streaming (HLS) M3U8 container formats. Our player dynamically
                demuxes and decodes the stream directly inside your sandbox
                browser, ensuring smooth hardware-accelerated framerates.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 py-3 px-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Protocol
                </span>
                <span className="text-xs font-bold text-foreground">
                  HLS M3U8
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Framerate
                </span>
                <span className="text-xs font-bold text-foreground">
                  60 FPS (Auto)
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Encryption
                </span>
                <span className="text-xs font-bold text-foreground">
                  None (Sandbox)
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Category
                </span>
                <span className="text-xs font-bold text-foreground truncate">
                  {activeChannel.group}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Related Channels Sidebar (Right Column) */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase text-foreground tracking-wider flex items-center gap-2">
            <ListVideo className="w-4 h-4 text-primary" />
            Up Next In {activeChannel.group}
          </h2>
          <Badge variant="outline" className="text-[10px] font-semibold">
            {relatedChannels.length} Streams
          </Badge>
        </div>

        {/* Sidebar Recommended list */}
        {relatedChannels.length > 0 ? (
          <div className="flex flex-col gap-2.5 max-h-[70vh] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {relatedChannels.map((ch) => (
              <Link
                key={ch.id}
                href={`/channel/${ch.id}`}
                className="flex items-center gap-3.5 p-3 rounded-lg bg-card border border-border hover:border-primary/30 hover:bg-accent/50 hover:shadow-sm transition-all group/item"
              >
                <div className="w-12 h-8 rounded-md bg-background border border-border flex items-center justify-center shrink-0 overflow-hidden p-1.5">
                  {ch.logo ? (
                    <img
                      src={ch.logo}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Tv className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left min-w-0 flex-1">
                  <span className="text-xs font-bold text-foreground group-hover/item:text-primary transition-colors truncate">
                    {ch.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/80 animate-pulse" />
                    {ch.group}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground text-xs font-medium">
            No other channels found in this group.
          </div>
        )}
      </div>
    </div>
  );
}
