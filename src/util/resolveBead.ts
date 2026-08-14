import type { Bead } from "../state/beadSequence.ts";
import { en } from "../data/i18n/en.ts";
import { getMysterySet, type Mystery, type MysterySetName } from "../data/mysteries.ts";
import type { PrayerText } from "../data/i18n/en.ts";

export interface ResolvedBead {
  prayer?: PrayerText;
  mystery?: Mystery;
}

export function resolveBead(bead: Bead, mysterySet: MysterySetName): ResolvedBead {
  const p = en.prayers;
  switch (bead.type) {
    case "signOfCross":
      return { prayer: p.signOfCross };
    case "creed":
      return { prayer: p.creed };
    case "ourFather":
      return { prayer: p.ourFather };
    case "hailMary":
      return { prayer: p.hailMary };
    case "gloryBe":
      return { prayer: p.gloryBe };
    case "fatima":
      return { prayer: p.fatima };
    case "hailHolyQueen":
      return { prayer: p.hailHolyQueen };
    case "versicleResponse":
      return { prayer: p.versicleResponse };
    case "closingPrayer":
      return { prayer: p.closingPrayer };
    case "stJoseph":
      return { prayer: p.stJoseph };
    case "mysteryAnnounce": {
      const mysteries = getMysterySet(mysterySet);
      const mystery = mysteries[bead.mysteryIndex ?? 0];
      return { mystery };
    }
    default:
      return {};
  }
}
