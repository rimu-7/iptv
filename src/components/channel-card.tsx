"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Play, Heart } from "lucide-react"
import { useIPTV, Channel } from "@/context/iptv-context"
import { Button } from "@/components/ui/button"

interface ChannelCardProps {
  channel: Channel
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ channel }) => {
  const { toggleFavorite, isFavorite } = useIPTV()
  const [imageError, setImageError] = useState(false)

  const isFav = isFavorite(channel.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(channel.id)
  }

  const initials = channel.name
    ? channel.name.trim().slice(0, 2).toUpperCase()
    : "TV"

  return (
    <Link
      href={`/channel/${channel.id}`}
      className="
        group
        relative
        block
        overflow-hidden
        rounded-xl
        border
        border-border/50
        bg-card/50
        backdrop-blur-xl
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary/30
        hover:shadow-lg
      "
    >
      {/* Glow Effect */}
      <div
        className="
          absolute
          inset-0
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
          bg-primary/5
          pointer-events-none
        "
      />

      <div className="relative flex h-full flex-col gap-3 p-3.5">
        {/* Logo Area */}
        <div
          className="
            relative
            aspect-video
            w-full
            overflow-hidden
            rounded-lg
            border
            border-border/50
            bg-muted/30
            backdrop-blur-md
            flex
            items-center
            justify-center
          "
        >
          {!imageError && channel.logo ? (
            <img
              src={channel.logo}
              alt={`${channel.name} Logo`}
              loading="lazy"
              onError={() => setImageError(true)}
              className="
                max-h-full
                max-w-full
                object-contain
                p-2
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted/20">
              <span className="select-none text-xl font-bold tracking-wider text-muted-foreground">
                {initials}
              </span>
            </div>
          )}

          {/* Play Overlay */}
          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              bg-background/70
              backdrop-blur-sm
              opacity-0
              transition-opacity
              duration-300
              group-hover:opacity-100
            "
          >
            <span
              className="
                rounded-xl
                bg-primary
                p-3
                text-primary-foreground
                shadow-lg
                transition-transform
                duration-300
                group-hover:scale-100
                scale-90
              "
            >
              <Play className="h-4 w-4 fill-current" />
            </span>
          </div>

          {/* Favorite Button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleFavoriteClick}
            className={`
              absolute
              right-2
              top-2
              z-20
              h-8
              w-8
              rounded-lg
              border
              backdrop-blur-md
              transition-all
              duration-300
              ${
                isFav
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/50 bg-background/60 text-muted-foreground hover:text-primary"
              }
            `}
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                isFav ? "fill-current" : ""
              }`}
            />
          </Button>

          {/* Group Badge */}
          <div
            className="
              absolute
              bottom-2
              left-2
              z-20
              rounded-md
              border
              border-border/50
              bg-background/70
              px-2
              py-1
              text-[9px]
              font-medium
              uppercase
              tracking-wide
              text-muted-foreground
              backdrop-blur-md
            "
          >
            {channel.group || "General"}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 select-none">
          <h3
            className="
              line-clamp-1
              text-xs
              font-semibold
              text-foreground
              transition-colors
              group-hover:text-primary
            "
          >
            {channel.name}
          </h3>

          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1 text-muted-foreground font-medium">
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-primary
                  animate-pulse
                "
              />
              Live
            </span>

            <span className="truncate text-[9px] font-medium text-muted-foreground">
              M3U8 HLS
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}