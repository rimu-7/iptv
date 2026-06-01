"use client";

import React from "react";
import Link from "next/link";
import { Tv, Heart, Globe, ShieldAlert } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 mt-auto select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info col */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="bg-linear-to-tr from-primary to-primary/80 p-2 rounded-md text-primary-foreground shadow-md group-hover:scale-105 transition-transform duration-300">
                <Tv className="w-5 h-5 fill-primary-foreground/20" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-all select-none">
                <span className="text-primary font-black">IPTV</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-sm">
              Discover, watch, and pin your favorite live television streams.
              Fully customizable, blazing-fast, and open-source. Stream global
              broadcasts right in your browser.
            </p>
          </div>

          {/* Quick Links col */}
          <div className="flex flex-col gap-3">
            <h4 className="text-zinc-200 text-xs font-black uppercase tracking-widest">
              Navigation
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-zinc-500 font-semibold">
              <Link href="/" className="hover:text-primary transition-colors">
                Home Player
              </Link>
              <Link
                href="/categories"
                className="hover:text-primary transition-colors"
              >
                All Categories
              </Link>
              <Link
                href="/about"
                className="hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="/?cat=__watchlist"
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                My Favorites
              </Link>
            </div>
          </div>

          {/* Copyright/Disclaimer col */}
          <div className="flex flex-col gap-3">
            <h4 className="text-zinc-200 text-xs font-black uppercase tracking-widest flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Legal Disclaimer
            </h4>
            <p className="text-[10px] text-zinc-600 leading-normal">
              IPTV does not host, stream, or broadcast any media. We purely
              catalog open M3U8 links fetched from open-source GitHub playlists.
              All stream copyrights belong to their respective original
              networks.
            </p>
          </div>
        </div>

        <div className="h-px bg-zinc-900 my-8 md:my-10" />

        {/* Footer bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <span className="text-[11px]">
            © {new Date().getFullYear()} IPTV. All rights reserved. Distributed
            under GNU License.
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/rimu-7/iptv"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-4 h-4" />
              Source Dataset
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
