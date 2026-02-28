"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { addWeeks, format, startOfDay, startOfWeek } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import { getDb } from "@/lib/db/dexie";
import { useFocusStore } from "@/state/useFocusStore";

const db = getDb();

function weekKey(date: Date): string {
  return format(startOfWeek(date, { weekStartsOn: 0 }), "yyyy-MM-dd");
}

export function useAnalyticsWeek() {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [nowTick, setNowTick] = useState(Date.now());

  const activeSessionId = useFocusStore((state) => state.activeSessionId);
  const activeStartedAt = useFocusStore((state) => state.activeStartedAt);
  const previousCurrentWeekKey = useRef(weekKey(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => setNowTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const latestCurrentKey = weekKey(new Date());
      const viewedKey = weekKey(weekStart);
      if (viewedKey === previousCurrentWeekKey.current && latestCurrentKey !== previousCurrentWeekKey.current) {
        setWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));
      }
      previousCurrentWeekKey.current = latestCurrentKey;
    }, 60_000);

    return () => window.clearInterval(id);
  }, [weekStart]);

  const key = weekKey(weekStart);

  const sessions = useLiveQuery(async () => db.focusSessions.where("weekKey").equals(key).toArray(), [key], []);

  const withRealtime = useMemo(() => {
    const base = [...(sessions ?? [])];
    if (activeSessionId && activeStartedAt && weekKey(new Date(activeStartedAt)) === key) {
      base.push({
        id: activeSessionId,
        startAt: activeStartedAt,
        durationSec: Math.floor((nowTick - new Date(activeStartedAt).getTime()) / 1000),
        dayKey: format(startOfDay(new Date(activeStartedAt)), "yyyy-MM-dd"),
        weekKey: key,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        createdAt: activeStartedAt,
        updatedAt: new Date(nowTick).toISOString(),
      });
    }
    return base;
  }, [sessions, activeSessionId, activeStartedAt, nowTick, key]);

  const dailyTotals = useMemo(() => {
    const totals: number[] = Array.from({ length: 7 }, () => 0);
    for (const session of withRealtime) {
      const dayIndex = new Date(`${session.dayKey}T00:00:00`).getDay(); // 0=Sun..6=Sat
      totals[dayIndex] += session.durationSec ?? 0;
    }
    return totals;
  }, [withRealtime]);

  const hourTotals = useMemo(() => {
    const hours = Array.from({ length: 24 }, () => 0);
    for (const session of withRealtime) {
      const hour = new Date(session.startAt).getHours();
      hours[hour] += session.durationSec ?? 0;
    }
    return hours;
  }, [withRealtime]);

  return {
    weekStart,
    dailyTotals,
    hourTotals,
    prevWeek: () => setWeekStart((prev) => addWeeks(prev, -1)),
    nextWeek: () => setWeekStart((prev) => addWeeks(prev, 1)),
  };
}
