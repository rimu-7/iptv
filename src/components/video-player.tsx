"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  src: string;
  title: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Initialize and handle HLS source change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    setError(null);
    setIsPlaying(false);

    // Clean up previous Hls instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (!src) {
      setError("No streaming source provided.");
      setIsLoading(false);
      return;
    }

    // Playback state event listeners
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    const onLoadStart = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("loadstart", onLoadStart);
    video.addEventListener("canplay", onCanPlay);

    // Mode 1: Hls.js supported (Chrome, Firefox, Edge, etc.)
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        maxBufferSize: 30 * 1000 * 1000, // 30MB buffer
        manifestLoadingMaxRetry: 4,
        manifestLoadingRetryDelay: 1000,
      });

      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().catch((err) => {
          console.warn("Autoplay was blocked:", err);
          // State naturally remains isPlaying = false, allowing our play hint to show
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error("Fatal HLS.js loading error:", data);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn("Fatal HLS network error, attempting to recover...");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn("Fatal HLS media error, attempting recovery...");
              hls.recoverMediaError();
              break;
            default:
              setError(
                "Stream loading failed. The stream might be offline or blocked.",
              );
              setIsLoading(false);
              if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
              }
              break;
          }
        } else {
          // Log non-fatal errors quietly as warnings to prevent console error spam
          console.warn(
            "Non-fatal HLS.js error warning:",
            data.details || data.type,
          );
        }
      });
    }
    // Mode 2: Native Safari stream playback (macOS Safari, iOS)
    else if (
      video.canPlayType("application/x-mpegURL") ||
      video.canPlayType("vnd.apple.mpegURL")
    ) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        video.play().catch((err) => {
          console.warn("Native autoplay blocked:", err);
        });
      });

      video.addEventListener("error", (e) => {
        console.error("Native video error event:", e);
        setError(
          "Playback failed. This stream may be offline or temporary blocked by CORS rules.",
        );
        setIsLoading(false);
      });
    } else {
      setError(
        "Your browser does not support HLS streaming (.m3u8 streams). Please try Chrome, Firefox, or Safari.",
      );
      setIsLoading(false);
    }

    return () => {
      // Event cleanup
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("loadstart", onLoadStart);
      video.removeEventListener("canplay", onCanPlay);

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, retryCount]);

  // Volume slider hook controls
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      video.volume = volume;
    }
  }, [isMuted, volume]);

  // Play Pause Toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || error) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((e) => console.error("Play error:", e));
    }
  };

  // Mute / Unmute
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Volume bar modification
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) {
      setIsMuted(false);
    }
  };

  // Go Fullscreen
  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .catch((err) => console.error("Exit fullscreen error:", err));
    } else {
      const wrapper = video.parentElement;
      if (wrapper) {
        wrapper
          .requestFullscreen()
          .catch((err) => console.error("Fullscreen error:", err));
      } else {
        video
          .requestFullscreen()
          .catch((err) => console.error("Fullscreen error:", err));
      }
    }
  };

  // Keyboard controls handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, error]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  return (
    <div
      className={`relative group/player bg-background overflow-hidden rounded-md border border-border shadow-2xl flex flex-col justify-center items-center aspect-video max-w-full select-none ${className}`}
    >
      {/* HTML5 Native Video Tag */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        playsInline
      />

      {/* Buffering/Loading State Overlay */}
      {isLoading && !error && (
        <div className="absolute inset-0 bg-background/80 flex flex-col justify-center items-center gap-4 transition-all duration-300 pointer-events-none z-20">
          <div className="relative w-12 h-12">
            <span className="absolute inset-0 border-2 border-primary/30 rounded-full"></span>
            <span className="absolute inset-0 border-2 border-t-primary rounded-full animate-spin"></span>
          </div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wide animate-pulse">
            Initializing Stream...
          </p>
        </div>
      )}

      {/* Explicit Play Hint Overlay (Shows when loaded but blocked/paused) */}
      {!isLoading && !isPlaying && !error && (
        <div
          className="absolute inset-0 bg-background/40 flex justify-center items-center z-20 cursor-pointer group/hint transition-all duration-300"
          onClick={togglePlay}
        >
          <div className="bg-primary/90 text-primary-foreground p-5 rounded-full shadow-xl transform scale-100 group-hover/hint:scale-110 group-hover/hint:bg-primary transition-all duration-300 backdrop-blur-sm">
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Stream Playback Error State Overlay */}
      {error && (
        <div className="absolute inset-0 bg-background/95 flex flex-col justify-center items-center gap-3 p-6 text-center z-30 rounded-md">
          <div className="bg-destructive/10 p-2.5 rounded-md border border-destructive/20 text-destructive mb-2 animate-bounce">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h4 className="text-foreground font-semibold text-sm tracking-wide">
            Stream Offline / Blocked
          </h4>
          <p className="text-muted-foreground text-xs max-w-md leading-relaxed">
            {error}
          </p>
          <Button
            onClick={handleRetry}
            size="sm"
            variant="outline"
            className="mt-2 border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retry Connection
          </Button>
        </div>
      )}

      {/* Bottom Cinematic Gradient Glassmorphic Overlay Controls */}
      {!error && (
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-background/90 via-background/40 to-transparent flex items-end p-3 opacity-0 translate-y-1 group-hover/player:opacity-100 group-hover/player:translate-y-0 transition-all duration-300 z-10">
          <div className="w-full flex items-center justify-between bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-border/80 shadow-sm">
            {/* Left Controls */}
            <div className="flex items-center gap-2.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
              </Button>

              <div className="h-4 w-px bg-border" />

              <span className="text-xs font-semibold text-foreground line-clamp-1 max-w-[150px] sm:max-w-[280px]">
                {title || "Live Stream"}
              </span>
              <span className="bg-destructive animate-pulse text-[8px] text-destructive-foreground px-1 py-0.5 rounded-sm font-bold tracking-widest uppercase shrink-0">
                Live
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Volume Slider bar */}
              <div className="flex items-center gap-2 group/volume">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-0 overflow-hidden group-hover/volume:w-16 md:group-hover/volume:w-20 transition-all duration-300 h-1 accent-primary bg-secondary rounded-md cursor-pointer appearance-none"
                />
              </div>

              {/* Toggle Fullscreen button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
