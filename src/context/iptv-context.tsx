"use client"

import React, { createContext, useContext, useState, useEffect, useMemo } from "react"
import { getChannelId } from "@/lib/utils"
import { TurnstileProtection } from "@/components/turnstile-protection"

export interface Channel {
  id: string
  name: string
  logo: string
  group: string
  url: string
}

export type SortOption = "default" | "alphabetical" | "group"

interface IPTVContextType {
  channels: Channel[]
  filteredChannels: Channel[]
  paginatedChannels: Channel[]
  groups: string[]
  loading: boolean
  error: string | null
  searchQuery: string
  selectedGroup: string
  favorites: string[]
  selectedChannel: Channel | null
  sortBy: SortOption
  hasMore: boolean
  setSearchQuery: (query: string) => void
  setSelectedGroup: (group: string) => void
  setSortBy: (sort: SortOption) => void
  toggleFavorite: (id: string) => void
  setSelectedChannel: (channel: Channel | null) => void
  loadMore: () => void
  resetFilters: () => void
  isFavorite: (id: string) => boolean
}

const IPTVContext = createContext<IPTVContextType | undefined>(undefined)

const GITHUB_JSON_URL = "https://raw.githubusercontent.com/SHAJON-404/iptv/refs/heads/main/channels.json"
const INITIAL_VISIBLE_COUNT = 32

export const IPTVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filtering & state
  const [searchQuery, setSearchQueryState] = useState<string>("")
  const [selectedGroup, setSelectedGroupState] = useState<string>("")
  const [sortBy, setSortByState] = useState<SortOption>("default")
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE_COUNT)

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("iptv_favorites")
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (err) {
      console.error("Failed to load favorites from localStorage", err)
    }
  }, [])

  // Sync favorites to localStorage
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
      try {
        localStorage.setItem("iptv_favorites", JSON.stringify(updated))
      } catch (err) {
        console.error("Failed to save favorites to localStorage", err)
      }
      return updated
    })
  }

  const isFavorite = (id: string) => favorites.includes(id)

  // Fetch IPTV channel data
  useEffect(() => {
    if (!isVerified) return

    let active = true

    const fetchData = async () => {
      try {
        setLoading(true)
        let response: Response
        
        // Try GitHub first
        try {
          response = await fetch(GITHUB_JSON_URL)
          if (!response.ok) throw new Error("GitHub fetch failed")
        } catch (fetchErr) {
          console.warn("Could not fetch remote channels, attempting fallback copy...", fetchErr)
          // Fallback to local file
          response = await fetch("/channels.json")
          if (!response.ok) {
            throw new Error("Local fallback channels fetch also failed.")
          }
        }

        const rawData = await response.json()
        
        if (!active) return

        if (!Array.isArray(rawData)) {
          throw new Error("Invalid channel data format: expected an array.")
        }

        // Parse, clean, and enrich channel items with stable unique string IDs
        const parsed: Channel[] = rawData.map((item: any) => {
          const urlStr = item.url || ""
          const nameStr = item.name || "Unnamed Channel"
          const groupStr = item.group || "General"
          return {
            id: getChannelId(nameStr, urlStr),
            name: nameStr.trim(),
            logo: item.logo || "",
            group: groupStr.trim(),
            url: urlStr.trim(),
          }
        })

        // Deduplicate channels based on generated unique id
        const uniqueChannelsMap = new Map<string, Channel>()
        parsed.forEach((ch) => {
          if (ch.url) {
            uniqueChannelsMap.set(ch.id, ch)
          }
        })

        const uniqueChannels = Array.from(uniqueChannelsMap.values())
        setChannels(uniqueChannels)
        setError(null)
      } catch (err: any) {
        console.error("IPTV data fetching error:", err)
        if (active) {
          setError(err.message || "Failed to load channel list. Please check your connection.")
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      active = false
    }
  }, [isVerified])

  // Derive unique categories/groups
  const groups = useMemo(() => {
    const set = new Set<string>()
    channels.forEach((ch) => {
      if (ch.group) set.add(ch.group)
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [channels])

  // Custom filter reset
  const resetFilters = () => {
    setSearchQueryState("")
    setSelectedGroupState("")
    setSortByState("default")
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }

  // Handle resets when filters change
  const setSearchQuery = (query: string) => {
    setSearchQueryState(query)
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }

  const setSelectedGroup = (group: string) => {
    setSelectedGroupState(group)
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }

  const setSortBy = (sort: SortOption) => {
    setSortByState(sort)
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }

  // Filter and sort channel list
  const filteredChannels = useMemo(() => {
    let result = [...channels]

    // Filter by watchlist
    if (selectedGroup === "__watchlist") {
      result = result.filter((ch) => favorites.includes(ch.id))
    } 
    // Filter by regular groups
    else if (selectedGroup) {
      result = result.filter((ch) => ch.group === selectedGroup)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (ch) =>
          ch.name.toLowerCase().includes(q) ||
          ch.group.toLowerCase().includes(q)
      )
    }

    // Sort options
    if (sortBy === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "group") {
      result.sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name))
    }

    return result
  }, [channels, selectedGroup, searchQuery, sortBy, favorites])

  // Slice paginated items
  const paginatedChannels = useMemo(() => {
    return filteredChannels.slice(0, visibleCount)
  }, [filteredChannels, visibleCount])

  const hasMore = visibleCount < filteredChannels.length

  const loadMore = () => {
    if (hasMore) {
      setVisibleCount((prev) => prev + INITIAL_VISIBLE_COUNT)
    }
  }

  if (!isVerified) {
    return <TurnstileProtection onVerify={() => setIsVerified(true)} />
  }

  return (
    <IPTVContext.Provider
      value={{
        channels,
        filteredChannels,
        paginatedChannels,
        groups,
        loading,
        error,
        searchQuery,
        selectedGroup,
        favorites,
        selectedChannel,
        sortBy,
        hasMore,
        setSearchQuery,
        setSelectedGroup,
        setSortBy,
        toggleFavorite,
        setSelectedChannel,
        loadMore,
        resetFilters,
        isFavorite,
      }}
    >
      {children}
    </IPTVContext.Provider>
  )
}

export const useIPTV = () => {
  const context = useContext(IPTVContext)
  if (context === undefined) {
    throw new Error("useIPTV must be used within an IPTVProvider")
  }
  return context
}
