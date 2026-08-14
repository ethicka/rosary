import type { MysterySetName } from "../data/mysteries.ts";

export type BeadType =
  | "signOfCross"
  | "creed"
  | "ourFather"
  | "hailMary"
  | "gloryBe"
  | "fatima"
  | "mysteryAnnounce"
  | "hailHolyQueen"
  | "versicleResponse"
  | "closingPrayer"
  | "stJoseph";

export interface Bead {
  type: BeadType;
  /** 0 = opening sequence, 1-5 = each Mystery's decade, 6 = closing sequence. */
  decade: number;
  /** Only meaningful for type "hailMary": how many Hail Marys to pray in this single step (3 opening, 10 per decade). */
  count?: number;
  /** Which of the 5 Mysteries in the active set this decade covers (0-4). */
  mysteryIndex?: number;
}

export interface BeadSequenceOptions {
  includeFatima: boolean;
  includeStJoseph: boolean;
}

/** Builds the flat, precomputed array of "beads" that drives the whole Rosary
 * walkthrough, per the USCCB structure. Navigation through a Rosary session is
 * just an integer index into this array. */
export function buildBeadSequence(options: BeadSequenceOptions): Bead[] {
  const beads: Bead[] = [];

  // Opening
  beads.push({ type: "signOfCross", decade: 0 });
  beads.push({ type: "creed", decade: 0 });
  beads.push({ type: "ourFather", decade: 0 });
  beads.push({ type: "hailMary", decade: 0, count: 3 });
  beads.push({ type: "gloryBe", decade: 0 });

  // Five decades
  for (let decade = 1; decade <= 5; decade++) {
    const mysteryIndex = decade - 1;
    beads.push({ type: "mysteryAnnounce", decade, mysteryIndex });
    beads.push({ type: "ourFather", decade, mysteryIndex });
    beads.push({ type: "hailMary", decade, count: 10, mysteryIndex });
    beads.push({ type: "gloryBe", decade, mysteryIndex });
    if (options.includeFatima) {
      beads.push({ type: "fatima", decade, mysteryIndex });
    }
  }

  // Closing
  beads.push({ type: "hailHolyQueen", decade: 6 });
  beads.push({ type: "versicleResponse", decade: 6 });
  beads.push({ type: "closingPrayer", decade: 6 });
  if (options.includeStJoseph) {
    beads.push({ type: "stJoseph", decade: 6 });
  }
  beads.push({ type: "signOfCross", decade: 6 });

  return beads;
}

export interface ProgressLabel {
  decadeLabel: string;
  detailLabel: string;
}

/** Human-readable progress text, e.g. "Decade 3 - Hail Mary x10". */
export function describeProgress(bead: Bead, mysterySet: MysterySetName): ProgressLabel {
  if (bead.decade === 0) {
    return { decadeLabel: "Opening", detailLabel: openingDetail(bead) };
  }
  if (bead.decade === 6) {
    return { decadeLabel: "Closing", detailLabel: closingDetail(bead) };
  }
  const decadeLabel = `${mysterySet} Mysteries - Decade ${bead.decade} of 5`;
  return { decadeLabel, detailLabel: decadeDetail(bead) };
}

function openingDetail(bead: Bead): string {
  switch (bead.type) {
    case "signOfCross":
      return "Sign of the Cross";
    case "creed":
      return "Apostles' Creed";
    case "ourFather":
      return "Our Father";
    case "hailMary":
      return `Hail Mary x${bead.count}`;
    case "gloryBe":
      return "Glory Be";
    default:
      return "";
  }
}

function decadeDetail(bead: Bead): string {
  switch (bead.type) {
    case "mysteryAnnounce":
      return "Announcing the Mystery";
    case "ourFather":
      return "Our Father";
    case "hailMary":
      return `Hail Mary x${bead.count}`;
    case "gloryBe":
      return "Glory Be";
    case "fatima":
      return "Fatima Prayer";
    default:
      return "";
  }
}

function closingDetail(bead: Bead): string {
  switch (bead.type) {
    case "hailHolyQueen":
      return "Hail, Holy Queen";
    case "versicleResponse":
      return "Versicle and Response";
    case "closingPrayer":
      return "Closing Prayer";
    case "stJoseph":
      return "Prayer to St. Joseph";
    case "signOfCross":
      return "Sign of the Cross";
    default:
      return "";
  }
}
