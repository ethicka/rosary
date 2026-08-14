import type { MysterySetName } from "./mysteries.ts";

/** Computes the Gregorian-calendar date of Easter Sunday for a given year
 * using the Anonymous Gregorian (Meeus/Jones/Butcher) algorithm. */
export function computeEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** The Sunday on or before the given date. */
function sundayOnOrBefore(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function sameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBetweenInclusive(date: Date, start: Date, end: Date): boolean {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return d >= s && d <= e;
}

/** Lent: Ash Wednesday (Easter - 46 days) through Holy Saturday (the day before Easter). */
export function getLentRange(year: number): { start: Date; end: Date } {
  const easter = computeEaster(year);
  return { start: addDays(easter, -46), end: addDays(easter, -1) };
}

/** Advent: the 4th Sunday before Christmas (the Sunday on/before Dec 24) back
 * three more weeks, through December 24. */
export function getAdventRange(year: number): { start: Date; end: Date } {
  const dec24 = new Date(year, 11, 24);
  const fourthSunday = sundayOnOrBefore(dec24);
  const firstSunday = addDays(fourthSunday, -21);
  return { start: firstSunday, end: dec24 };
}

export function isInLent(date: Date): boolean {
  // Easter can fall so that Lent starts in Feb/Mar of `date`'s year, or Easter
  // itself could be early enough that we should also check the prior year's
  // range if we're in very early January (not reachable — Lent never spans
  // into January), so a single-year check is sufficient.
  const { start, end } = getLentRange(date.getFullYear());
  return isBetweenInclusive(date, start, end);
}

export function isInAdvent(date: Date): boolean {
  const { start, end } = getAdventRange(date.getFullYear());
  return isBetweenInclusive(date, start, end);
}

export interface MysterySelection {
  set: MysterySetName;
  reason: string;
}

/** Determines the default Mystery set for a given date per USCCB's traditional schedule. */
export function getDefaultMysterySet(date: Date = new Date()): MysterySelection {
  const weekday = date.getDay(); // 0 = Sunday ... 6 = Saturday

  switch (weekday) {
    case 1:
      return { set: "Joyful", reason: "Monday" };
    case 2:
      return { set: "Sorrowful", reason: "Tuesday" };
    case 3:
      return { set: "Glorious", reason: "Wednesday" };
    case 4:
      return { set: "Luminous", reason: "Thursday" };
    case 5:
      return { set: "Sorrowful", reason: "Friday" };
    case 6:
      return { set: "Joyful", reason: "Saturday" };
    case 0:
    default:
      if (isInAdvent(date)) return { set: "Joyful", reason: "Sunday in Advent" };
      if (isInLent(date)) return { set: "Sorrowful", reason: "Sunday in Lent" };
      return { set: "Glorious", reason: "Sunday" };
  }
}

export { sameLocalDay };
