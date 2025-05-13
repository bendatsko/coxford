'use client';

import { Sun, Users, Copy, Map as MapIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import Image from 'next/image';

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
  const [copied] = useState(false);
  const [showDiscordTooltip, setShowDiscordTooltip] = useState(false);
  const [showMapTooltip, setShowMapTooltip] = useState(false);
  const [showThemeTooltip, setShowThemeTooltip] = useState(false);
  const [dynmapError, setDynmapError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mounted, setMounted] = useState(false);

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
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen bg-background text-foreground font-[family-name:var(--font-geist-sans)]">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="w-full max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-lg tracking-tight text-primary">
            Coxford Community
          </div>
          <div className="flex-1 flex justify-center">
            {/* Center nav links if needed */}
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://discord.gg/vfxgh2ssB7"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-muted transition-colors relative"
              aria-label="Join our Discord"
              onMouseEnter={() => setShowDiscordTooltip(true)}
              onMouseLeave={() => setShowDiscordTooltip(false)}
            >
              <DiscordIcon />
              {mounted && showDiscordTooltip && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black text-white text-xs font-medium opacity-90 z-10 shadow-lg whitespace-nowrap">
                  Join our Discord
                </span>
              )}
            </a>
            <a
              href="https://map.coxford.net"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-muted transition-colors relative"
              aria-label="Open Live Map"
              onMouseEnter={() => setShowMapTooltip(true)}
              onMouseLeave={() => setShowMapTooltip(false)}
            >
              <MapIcon className="w-6 h-6 text-primary" />
              {mounted && showMapTooltip && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black text-white text-xs font-medium opacity-90 z-10 shadow-lg whitespace-nowrap">
                  Open Live Map
                </span>
              )}
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="w-full max-w-6xl mx-auto px-4 py-16 flex flex-col gap-16 items-center">
          {/* Online indicator above join.coxford.net */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-medium">Online</span>
              <Users size={16} className="ml-1" />
              <span>0</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-1">Join the Community Server</h1>
            <span className="text-base text-muted-foreground mb-2 text-center">A Minecraft server and community for engineers, tinkerers, and friends.</span>
            <ShimmerButton
              className="w-full max-w-md mx-auto py-3 px-10 text-xl font-mono tracking-tight flex items-center justify-center gap-3 bg-foreground dark:bg-[#18181b] border-none"
              shimmerColor="#fff"
              shimmerDuration="8s"
              borderRadius="1.5rem"
            >
              <span className="sharpen-mono text-lg md:text-xl tracking-tight text-background dark:text-white">join.coxford.net</span>
              <Copy size={22} className="opacity-60 group-hover:opacity-100 transition-opacity text-background dark:text-white" />
            </ShimmerButton>
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-black text-white text-xs font-medium opacity-90 animate-fade-in-out pointer-events-none z-20 shadow-lg">
                Copied to clipboard!
              </span>
            )}
          </div>
          {/* Main Content: Steps + Map */}
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Left: Steps */}
            <section className="w-full max-w-xl mx-auto md:mx-0 flex flex-col">
              <h2 className="text-2xl md:text-2xl font-bold tracking-tight mb-1 text-left">How to Join</h2>
              <span className="w-full text-left text-xs text-muted-foreground mb-3">To play, install the CurseForge app and the modpack currently running on the server.</span>
              <ol className="flex flex-col gap-3">
                {/* Step 1 */}
                <li className="rounded-2xl bg-card shadow-md border border-border p-6 flex gap-4 items-start">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted font-bold text-lg text-primary mt-1">1</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">Download & Install CurseForge</h3>
                    <p className="text-muted-foreground mb-2 text-sm">CurseForge is the most popular mod manager for Minecraft. Download and install it to easily manage your modpacks.</p>
                    <a
                      href="https://www.curseforge.com/download/app"
                      onClick={e => {
                        e.preventDefault();
                        window.open('https://www.curseforge.com/download/app', 'popup', 'width=600,height=800,left=200,top=100');
                      }}
                      className="text-primary hover:underline font-medium text-base"
                    >
                      Download CurseForge
                    </a>
                  </div>
                </li>
                {/* Step 2 */}
                <li className="rounded-2xl bg-card shadow-md border border-border p-6 flex gap-4 items-start">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted font-bold text-lg text-primary mt-1">2</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">Install the Modpack</h3>
                    <p className="text-muted-foreground mb-2 text-sm">Currently Running: All of Create by LunaPixelStudios. Download and import the modpack zip into CurseForge.</p>
                    <a
                      href="https://www.curseforge.com/minecraft/modpacks/aoc/download/6338398"
                      onClick={e => {
                        e.preventDefault();
                        window.open('https://www.curseforge.com/minecraft/modpacks/aoc/download/6338398', 'popup', 'width=600,height=800,left=200,top=100');
                      }}
                      className="text-primary hover:underline font-medium text-base"
                    >
                      Download Modpack
                    </a>
                  </div>
                </li>
                {/* Step 3 */}
                <li className="rounded-2xl bg-card shadow-md border border-border p-6 flex gap-4 items-start">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted font-bold text-lg text-primary mt-1">3</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">Launch Minecraft via CurseForge</h3>
                    <p className="text-muted-foreground mb-2 text-sm">Open CurseForge, click &apos;Import Modpack&apos;, select the downloaded zip, and launch the game.</p>
                  </div>
                </li>
              </ol>
            </section>
            {/* Right: DynMap */}
            <section className="w-full max-w-xl mx-auto md:mx-0 flex flex-col items-center">
              <h2 className="w-full text-2xl md:text-2xl font-bold tracking-tight mb-1 text-left">Live Map</h2>
              <span className="w-full text-left text-xs text-muted-foreground mb-3">Last updated: just now</span>
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
                  <div className="text-center text-muted-foreground font-medium">Live map preview unavailable.<br />
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

      <footer className="w-full max-w-6xl mx-auto px-4 border-t border-border/40">
        <div className="h-14 flex items-center justify-between text-sm text-muted-foreground">
          <a
            href="https://admin.coxford.net"
            className="hover:text-foreground transition-colors"
          >
            Admin
          </a>
          <span>© 2025 Informatik Haus</span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-muted transition-colors relative"
            aria-label="Toggle light/dark mode"
            onMouseEnter={() => setShowThemeTooltip(true)}
            onMouseLeave={() => setShowThemeTooltip(false)}
          >
            <Sun size={18} />
            {mounted && showThemeTooltip && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black text-white text-xs font-medium opacity-90 z-10 shadow-lg whitespace-nowrap">
                Toggle light/dark mode
              </span>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
