import React from 'react';
import { DiwaliBackground } from './DiwaliBackground';
import { HoliBackground } from './HoliBackground';
import { FathersDayBackground } from './FathersDayBackground';
import { MothersDayBackground } from './MothersDayBackground';
import { ChristmasBackground } from './ChristmasBackground';
import { NewYearBackground } from './NewYearBackground';
import { BirthdayBackground } from './BirthdayBackground';
import { EidBackground } from './EidBackground';
import { HalloweenBackground } from './HalloweenBackground';
import { ValentineBackground } from './ValentineBackground';
import { IndependenceBackground } from './IndependenceBackground';
import { GraduationBackground } from './GraduationBackground';
import { WeddingBackground } from './WeddingBackground';
import { SportsBackground } from './SportsBackground';
import { DefaultBackground } from './DefaultBackground';

type BgComponent = React.FC<{ variant?: number }>;

const COMPONENTS: Record<string, BgComponent> = {
  'diwali':        DiwaliBackground,
  'holi':          HoliBackground,
  'fathers-day':   FathersDayBackground,
  'mothers-day':   MothersDayBackground,
  'christmas':     ChristmasBackground,
  'new-year':      NewYearBackground,
  'birthday':      BirthdayBackground,
  'eid':           EidBackground,
  'halloween':     HalloweenBackground,
  'valentine':     ValentineBackground,
  'independence':  IndependenceBackground,
  'graduation':    GraduationBackground,
  'wedding':       WeddingBackground,
  'sports':        SportsBackground,
  'default':       DefaultBackground,
};

/**
 * Parses "christmas-3" → renders <ChristmasBackground variant={3} />
 * Also handles legacy "diwali:0" format → renders <DiwaliBackground variant={1} />
 */
export function getBackgroundElement(themeId: string): React.ReactElement | null {
  if (!themeId) return null;

  // New format: "baseId-variantNum"  e.g. "christmas-3"
  const dashIdx = themeId.lastIndexOf('-');
  let baseId = themeId;
  let variant = 1;

  if (dashIdx !== -1) {
    const possibleVariant = parseInt(themeId.slice(dashIdx + 1), 10);
    if (!isNaN(possibleVariant) && possibleVariant >= 1 && possibleVariant <= 5) {
      baseId = themeId.slice(0, dashIdx);
      variant = possibleVariant;
    }
  }

  // Legacy colon format: "diwali:2"
  if (baseId.includes(':')) {
    baseId = baseId.split(':')[0];
  }

  const Comp = COMPONENTS[baseId];
  if (!Comp) return null;
  return React.createElement(Comp, { variant });
}

export { DefaultBackground };
