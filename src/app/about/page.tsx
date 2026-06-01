"use client";

import React, { useState } from "react";
import {
  Info,
  HelpCircle,
  Code2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  InfoIcon,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "Is  IPTV free to use?",
      answer:
        "Yes,  IPTV is 100% free and open-source. We do not charge subscription fees, serve ads, or sell premium features. It is built as a highly polished open project for developers and television enthusiasts.",
    },
    {
      question: "Why do some streams show 'Stream Offline / Blocked'?",
      answer:
        " IPTV loads raw stream links provided by the open source IPTV database. These streams are subject to various network circumstances: the broadcasting station may be temporarily offline, the token parameters in the stream M3U8 link may have expired, or the broadcaster's server may have strict CORS (Cross-Origin Resource Sharing) restrictions that block browsers from loading media directly on external sites. Trying a different channel in the list is usually the best solution.",
    },
    {
      question: "What is HLS.js streaming technology?",
      answer:
        "HLS.js is a premium Javascript library that implements an HTTP Live Streaming client. It relies on HTML5 video and MediaSource Extensions (MSE) to handle demuxing, buffering, and decoding M3U8 TS segments smoothly. This enables seamless, buffer-optimized live stream decoding in modern browsers (Chrome, Firefox, Edge) that do not support HLS natively.",
    },
    {
      question: "How do I add channels to my Watchlist?",
      answer:
        "Simply hover or tap on any channel card in our dashboard and click the Heart icon at the top right of the card. The channel will be saved instantly to your Watchlist (backed by browser local persistence), and you can view your favorited streams anytime by selecting the '❤️ Watchlist' category badge in the filters.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-12 py-4 min-h-screen pb-20 select-none">
      {/* Page Header block */}
      <div className="border-b border-zinc-200 dark:border-zinc-900 pb-8 text-left flex flex-col gap-2">
        <div className="inline-flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-650 dark:text-indigo-400 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-md w-fit">
          <InfoIcon className="w-3.5 h-3.5 fill-indigo-400/20" />
          Docs
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
          About IPTV
        </h1>
        <p className="text-zinc-505 text-sm max-w-xl leading-relaxed">
          Discover the technology, open-source licensing compliance,
          architecture, and answers to frequently asked questions about our
          cinematic live streaming player.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Documentation, Architecture and Licensing */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          {/* Card 1: Open Source Mission */}
          <div className="p-6 rounded-md bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 flex flex-col gap-4">
            <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-indigo-500 dark:text-indigo-400" />
              Open Stream Cataloging
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              IPTV acts as a fully stateless client player dashboard. We do not
              download or re-host streaming assets on our servers. The playlist
              dataset is loaded dynamically from the repository under public MIT
              terms. We provide the visual container wrapper to clean up and
              structure these public television feeds.
            </p>
          </div>

          {/* Card 2: Tech Specs */}
          <div className="p-6 rounded-md bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 flex flex-col gap-4">
            <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <Code2 className="w-4.5 h-4.5 text-indigo-500 dark:text-indigo-400" />
              Architectural Specifications
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1 p-3 rounded-md bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-900">
                <span className="text-[10px] uppercase font-bold text-zinc-450 dark:text-zinc-600 tracking-wider">
                  Framework
                </span>
                <span className="font-bold text-zinc-700 dark:text-zinc-300">
                  Next.js 16 (App Router)
                </span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-md bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-900">
                <span className="text-[10px] uppercase font-bold text-zinc-450 dark:text-zinc-660 tracking-wider">
                  Styling
                </span>
                <span className="font-bold text-zinc-700 dark:text-zinc-300">
                  Tailwind CSS v4 & custom variables
                </span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-md bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-900">
                <span className="text-[10px] uppercase font-bold text-zinc-450 dark:text-zinc-660 tracking-wider">
                  HLS Demuxer
                </span>
                <span className="font-bold text-zinc-700 dark:text-zinc-300">
                  HLS.js buffer-optimized client
                </span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-md bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-900">
                <span className="text-[10px] uppercase font-bold text-zinc-450 dark:text-zinc-660 tracking-wider">
                  Components
                </span>
                <span className="font-bold text-zinc-700 dark:text-zinc-300">
                  Shadcn UI custom modules
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Copyright and Safety */}
          <div className="p-6 rounded-md bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 flex flex-col gap-4">
            <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-indigo-500 dark:text-indigo-400" />
              Content Guidelines & DMCA compliance
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              IPTV operates in full compliance with copyright law as a database
              directory search interface. If you are a copyright holder
              representing a channel inside our loaded dataset and would like to
              request removal, please submit a request directly to the source
              database playlist at{" "}
              <a
                href="https://github.com/rimu-7/iptv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                rimu-7/iptv
              </a>{" "}
              on GitHub. The dataset updates instantly inside our client once
              resolved at the source.
            </p>
          </div>
        </div>

        {/* Right Column: FAQ Accordion blocks */}
        <div className="lg:col-span-5 flex flex-col gap-5 text-left">
          <h2 className="text-sm font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-wider flex items-center gap-1.5 px-1">
            <HelpCircle className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            Frequently Asked Questions
          </h2>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-md border border-zinc-200 dark:border-zinc-900 bg-zinc-100/50 dark:bg-zinc-900/30 hover:border-zinc-300 dark:hover:border-zinc-800 transition-all overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 flex items-center justify-between gap-4 font-bold text-sm text-zinc-800 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-200 dark:border-zinc-900/50 pt-4 bg-white dark:bg-zinc-950/20">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
