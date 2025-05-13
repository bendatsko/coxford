'use client';

import { Sun, Moon, Users, Copy, Map as MapIcon, Menu, ExternalLink } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import Image from 'next/image';
import { FeedbackModal } from "@/components/FeedbackModal";
import { cn } from "@/lib/utils";

// Replace the custom SVG with the official Discord mark
const DiscordIcon = () => (
  <Image
    src="https://cdn.jsdelivr.net/npm/simple-icons@9/icons/discord.svg"
    alt="Discord Logo"
    width={24}
    height={24}
    className="w-6 h-6 dark:invert"
  />
);

export default function Home() {
  const [theme, setTheme] = useState('light');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDiscordTooltip, setShowDiscordTooltip] = useState(false);
  const [showMapTooltip, setShowMapTooltip] = useState(false);
  const [showThemeTooltip, setShowThemeTooltip] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isInstallHighlighted, setIsInstallHighlighted] = useState(false);
  const [dynmapError, setDynmapError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const installSectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [serverStatus, setServerStatus] = useState({ online: false, version: '' });

  const scrollToInstall = () => {
    if (installSectionRef.current) {
      const yOffset = -100; // Offset from the top of the viewport
      const y = installSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
      setIsInstallHighlighted(true);
      setTimeout(() => setIsInstallHighlighted(false), 1000); // Match animation duration
    }
  };

  useEffect(() => {
    const pingServer = async () => {
      try {
        const response = await fetch('https://join.coxford.net:80');
        setServerStatus({ online: response.ok, version: '' });
      } catch (error) {
        setServerStatus({ online: false, version: '' });
      }
    };
    pingServer();
    const interval = setInterval(pingServer, 30000); // Ping every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const systemPrefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(stored || (systemPrefers ? 'dark' : 'light'));
    document.documentElement.classList.toggle('dark', stored === 'dark' || (!stored && systemPrefers));

    if (iframeRef.current) {
      const onError = () => setDynmapError(true);
      const iframe = iframeRef.current;
      iframe.addEventListener('error', onError);
      return () => iframe.removeEventListener('error', onError);
    }

    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-[family-name:var(--font-geist-sans)]">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <nav className="w-full max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <Image 
                src="/logo.png"
                alt="Coxford Logo"
                width={20}
                height={20}
                className="object-contain opacity-80"
              />
              <span className="font-medium text-base tracking-tight">Coxford</span>
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a 
                href="https://map.coxford.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
              >
                Live Map
              </a>
              <a 
                href="https://www.modpackindex.com/modpack/64950/all-of-create"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
              >
                Modpack Wiki
              </a>
              <div className="relative">
                <button 
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 cursor-pointer group"
                >
                  More
                  <svg 
                    width="10" 
                    height="10" 
                    viewBox="0 0 10 10" 
                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                  >
                    <path 
                      d="M0 3l5 5 5-5" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
                {showMoreMenu && (
                  <div className="absolute top-full mt-2 right-0 w-48 py-2 bg-card rounded-lg shadow-lg border border-border">
                    <a 
                      href="https://admin.coxford.net" 
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors cursor-pointer"
                    >
                      Admin Portal
                      <ExternalLink size={14} className="ml-auto opacity-50" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="text-sm font-medium hover:text-primary transition-colors hidden md:block cursor-pointer"
            >
              Feedback
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-muted transition-colors relative cursor-pointer"
              aria-label="Toggle light/dark mode"
              onMouseEnter={() => setShowThemeTooltip(true)}
              onMouseLeave={() => setShowThemeTooltip(false)}
            >
              {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
              {mounted && showThemeTooltip && (
                <span className="absolute -bottom-8 right-0 px-2 py-1 rounded bg-popover text-popover-foreground text-xs font-medium shadow-lg whitespace-nowrap border border-border">
                  Switch to {theme === 'light' ? 'dark' : 'light'} mode
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <div className="w-full max-w-6xl mx-auto px-4 py-16 flex flex-col gap-16">
          {/* Hero Section */}
          <section className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Welcome to Coxford</h1>
            <p className="text-base text-muted-foreground mb-6">Where we embody <b>people-last engineering</b>™, because this is a Minecraft server.</p>
            <div className="relative w-full max-w-md mx-auto">
              <RainbowButton
                onClick={() => {
                  navigator.clipboard.writeText('join.coxford.net');
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="w-full py-3 px-10 text-xl font-mono tracking-tight flex items-center justify-center gap-3 group cursor-pointer"
              >
                <span className="sharpen-mono text-lg md:text-xl tracking-tight">join.coxford.net</span>
                <div className="flex items-center gap-1 text-primary-foreground/70 group-hover:text-primary-foreground transition-colors">
                  <Copy size={20} className="group-hover:scale-110 transition-transform" />
                </div>
              </RainbowButton>
              {copied && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-popover text-popover-foreground text-sm font-medium shadow-lg border border-border/40 whitespace-nowrap animate-in fade-in slide-in-from-bottom-2">
                  IP copied! Paste in Minecraft to connect
                </div>
              )}
            </div>
          </section>

          {/* Main Content Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Left: Installation Steps */}
            <section 
              ref={installSectionRef}
              className="flex flex-col relative"
            >
              {/* Shimmer highlight effect */}
              <div
                className={cn(
                  "absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 rounded-2xl overflow-hidden",
                  isInstallHighlighted && "opacity-100"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 translate-x-[-100%]",
                    isInstallHighlighted && "animate-[highlight-shimmer_800ms_ease-in-out_forwards]"
                  )}
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, var(--primary) 25%, var(--primary) 50%, transparent 100%)",
                    opacity: 0.1,
                  }}
                />
              </div>

              <div className="rounded-2xl">
                <h2 className="text-2xl font-bold tracking-tight mb-2">How to Join</h2>
                <p className="text-sm text-muted-foreground mb-6">To play, just install the modpack through CurseForge. Here's how:</p>
                <ol className="flex flex-col gap-4">
                  {/* Step 1 */}
                  <li className="rounded-2xl bg-card shadow-sm border border-border/40 p-6 flex gap-4 items-start">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted font-medium text-base text-muted-foreground mt-1">1</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-2">Launch the CurseForge App</h3>
                      <p className="text-muted-foreground mb-3 text-sm">You will launch Minecraft Java Edition from here as opposed to the Minecraft Launcher.</p>
                      <a
                        href="https://www.curseforge.com/download/app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium text-base"
                      >
                        Click to Download
                      </a>
                    </div>
                  </li>
                  {/* Step 2 */}
                  <li className="rounded-2xl bg-card shadow-sm border border-border/40 p-6 flex gap-4 items-start">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted font-medium text-base text-muted-foreground mt-1">2</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-2">Install the Modpack</h3>
                      <p className="text-muted-foreground mb-3 text-sm">Download the zip file below. Then, open CurseForge, click 'Import Modpack', select the downloaded zip, and launch the game.</p>
                      <a
                        href="https://www.curseforge.com/minecraft/modpacks/aoc/download/6338398"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium text-base"
                      >
                        Click to Download
                      </a>
                    </div>
                  </li>
                  {/* Step 3 */}
                  <li className="rounded-2xl bg-card shadow-sm border border-border/40 p-6 flex gap-4 items-start">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted font-medium text-base text-muted-foreground mt-1">3</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-2">Connect and Have Fun!</h3>
                      <p className="text-muted-foreground text-sm">Build to your heart's content!</p>
                    </div>
                  </li>
                </ol>
              </div>
            </section>

            {/* Right: Live Map */}
            <section className="flex flex-col">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Live Map</h2>
              <p className="text-sm text-muted-foreground mb-6">Last updated: just now</p>
              {!dynmapError ? (
                <div className="w-full aspect-[1.1/1] rounded-2xl overflow-hidden shadow-lg bg-card border border-border flex flex-col justify-stretch" style={{ minHeight: 480 }}>
                  <iframe
                    ref={iframeRef}
                    src="https://map.coxford.net"
                    title="DynMap"
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="w-full aspect-[1.1/1] rounded-2xl overflow-hidden shadow-lg bg-muted border border-border flex flex-col items-center justify-center gap-4" style={{ minHeight: 480 }}>
                  <div className="text-5xl text-muted-foreground">🗺️</div>
                  <div className="text-center text-muted-foreground font-medium">
                    Live map preview unavailable.<br />
                    <a
                      href="https://map.coxford.net"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm shadow hover:bg-primary/90 transition-colors"
                    >
                      View Live Map
                    </a>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <FeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
      />
    </div>
  );
}
