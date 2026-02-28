"use client";

import Link from "next/link";

type TopMode = "planner" | "focus" | "today" | "analytics";

interface TopAccentBarProps {
  mode: TopMode;
  rangeLabel?: string;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onTogglePrefs: () => void;
}

function IconShell({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span className={active ? "flex h-7 w-7 items-center justify-center rounded-sm bg-white/20" : "flex h-7 w-7 items-center justify-center rounded-sm hover:bg-white/15"}>
      {children}
    </span>
  );
}

function IconPlanner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20h4l10-10-4-4L4 16v4Z" stroke="currentColor" strokeWidth="2" />
      <path d="m13 7 4 4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20V4" stroke="currentColor" strokeWidth="2" />
      <path d="M4 20h16" stroke="currentColor" strokeWidth="2" />
      <rect x="7" y="12" width="3" height="6" fill="currentColor" />
      <rect x="12" y="9" width="3" height="9" fill="currentColor" />
      <rect x="17" y="6" width="3" height="12" fill="currentColor" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" stroke="currentColor" strokeWidth="2" />
      <path d="M19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4.8a7 7 0 0 0-1.7-1l-.3-2.5h-4l-.3 2.5a7 7 0 0 0-1.7 1l-2.4-.8-2 3.4L5.1 11a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-.8a7 7 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7 7 0 0 0 1.7-1l2.4.8 2-3.4-2-1.6c.1-.3.1-.7.1-1Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconButton({
  icon,
  title,
  onClick,
  href,
  active,
}: {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  href?: string;
  active?: boolean;
}) {
  if (href) {
    return (
      <Link href={href} className="text-white/95" aria-label={title} title={title}>
        <IconShell active={active}>{icon}</IconShell>
      </Link>
    );
  }

  return (
    <button type="button" className="text-white/95" aria-label={title} title={title} onClick={onClick}>
      <IconShell active={active}>{icon}</IconShell>
    </button>
  );
}

export function TopAccentBar({ mode, rangeLabel, searchQuery, onSearchChange, onTogglePrefs }: TopAccentBarProps) {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-9 border-b border-black/10 bg-accent text-white">
      <div className="mx-auto flex h-full items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="pr-2 text-[12px] font-semibold tracking-[0.08em] text-white/90" style={{ fontFamily: "var(--font-heading)" }}>
            CHEQLIST
          </Link>
          {rangeLabel ? <span className="ml-2 text-[11px] text-white/90">{rangeLabel}</span> : null}
        </div>

        <div className="flex items-center gap-2">
          {mode === "planner" && onSearchChange ? (
            <input
              value={searchQuery ?? ""}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search"
              className="h-7 w-44 rounded-sm border border-white/35 bg-white/15 px-2 text-[12px] text-white placeholder:text-white/70 outline-none"
              aria-label="Search tasks"
            />
          ) : null}

          <IconButton href="/" title="Planner" active={mode === "planner"} icon={<IconPlanner />} />
          <IconButton href="/focus" title="Focus" active={mode === "focus" || mode === "today"} icon={<IconClock />} />
          <IconButton href="/analytics" title="Analytics" active={mode === "analytics"} icon={<IconChart />} />
          <IconButton title="Settings" onClick={onTogglePrefs} icon={<IconSettings />} />
        </div>
      </div>
    </div>
  );
}
