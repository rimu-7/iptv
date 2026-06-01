"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIPTV } from "@/context/iptv-context";
import { useTheme } from "next-themes";
import {
  Search,
  Tv,
  Heart,
  Menu,
  Sun,
  Moon,
  Info,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery, favorites } = useIPTV();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  // Avoid hydration mismatch by waiting until client component is mounted
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isHome = pathname === "/";

  return (
    <header
      className={`sticky top-0 z-50 w-full select-none transition-all duration-300 border-b ${
        scrolled
          ? "bg-background/80 backdrop-blur-lg shadow-md border-border"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and title */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="bg-gradient-to-tr from-primary to-primary/80 p-2 rounded-md text-primary-foreground shadow-md group-hover:scale-105 transition-transform duration-300">
            <Tv className="w-5 h-5 fill-primary-foreground/20" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-all select-none">
            <span className="text-primary font-black">IPTV</span>
          </span>
        </Link>

        {/* Live Search bar (Visible on desktop, Home page only) */}
        {isHome && (
          <div className="hidden md:flex items-center relative max-w-md w-full">
            <div className="absolute left-3 text-muted-foreground">
              <Search className="w-4 h-4" />
            </div>
            <Input
              type="text"
              placeholder="Search channels, groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary/50 border-input text-foreground placeholder:text-muted-foreground pl-9 pr-4 h-10 w-full rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring hover:bg-secondary transition-colors"
            />
          </div>
        )}

        {/* Desktop Navigation links & controls */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold select-none">
          <Link
            href="/"
            className={`transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href="/categories"
            className={`transition-colors hover:text-primary flex items-center gap-1.5 ${
              pathname === "/categories"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Categories
          </Link>
          <Link
            href="/about"
            className={`transition-colors hover:text-primary flex items-center gap-1.5 ${
              pathname === "/about" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            About
          </Link>

          <div className="h-4 w-px bg-border" />

          {/* Quick watchlist button link */}
          <Link href="/?cat=__watchlist" className="relative group">
            <Button
              variant="outline"
              size="sm"
              className="border-border bg-background hover:bg-accent text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-md px-4"
            >
              <Heart className="w-3.5 h-3.5 fill-destructive text-destructive" />
              Watchlist
              {favorites.length > 0 && (
                <span className="bg-primary text-primary-foreground text-[10px] min-w-[1.25rem] h-5 px-1 rounded-md flex items-center justify-center font-bold tracking-tight shadow-md">
                  {favorites.length}
                </span>
              )}
            </Button>
          </Link>

          {/* Theme switcher */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              title={
                theme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        {/* Mobile controls & Sheet drawer */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Mobile search indicator */}
          {isHome && (
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9 text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="top"
                  className="bg-background border-border p-6 pt-12 rounded-b-md"
                >
                  <div className="flex items-center relative w-full">
                    <Search className="absolute left-3 text-muted-foreground w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search channels..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-background border-input text-foreground pl-9 pr-4 h-11 w-full rounded-md focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}

          {/* Theme switcher for mobile */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          )}

          {/* Drawer Burger menu triggers */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-background border-border flex flex-col justify-between rounded-l-md"
            >
              <div className="flex flex-col gap-8 pt-8">
                <SheetHeader className="text-left px-2">
                  <SheetTitle className="text-foreground font-bold flex items-center gap-2">
                    <Tv className="w-5 h-5 text-primary" />
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 font-semibold text-lg px-2">
                  <Link
                    href="/"
                    className={`flex items-center gap-3 py-2 border-b border-border transition-colors ${
                      pathname === "/"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/categories"
                    className={`flex items-center gap-3 py-2 border-b border-border transition-colors ${
                      pathname === "/categories"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Categories
                  </Link>
                  <Link
                    href="/about"
                    className={`flex items-center gap-3 py-2 border-b border-border transition-colors ${
                      pathname === "/about"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    About
                  </Link>
                  <Link
                    href="/?cat=__watchlist"
                    className={`flex items-center justify-between py-2 border-b border-border transition-colors text-destructive hover:text-destructive/80`}
                  >
                    <span className="flex items-center gap-3">
                      <Heart className="w-5 h-5 fill-destructive" />
                      Watchlist
                    </span>
                    {favorites.length > 0 && (
                      <span className="bg-destructive text-destructive-foreground text-xs px-2.5 py-0.5 rounded-md font-bold shadow-md">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                </nav>
              </div>
              <div className="text-[10px] text-muted-foreground text-center py-4 select-none">
                IPTV © 2026. Made with ❤️
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
