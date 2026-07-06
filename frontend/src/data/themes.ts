export interface OccasionTheme {
  id: string;            // e.g. 'christmas-2'  (occasion-variantNumber)
  baseId: string;        // e.g. 'christmas'
  variant: number;       // 1–5
  name: string;
  variantLabel: string;  // e.g. 'Snowy Night'
  keywords: string[];
  emoji: string;
  previewGradient: string;
}

/** Build one variant entry */
function v(baseId: string, variant: number, name: string, variantLabel: string,
           emoji: string, gradient: string, keywords: string[]): OccasionTheme {
  return { id: `${baseId}-${variant}`, baseId, variant, name, variantLabel, emoji, previewGradient: gradient, keywords };
}

const DIWALI_KW    = ['diwali','deepawali','deepavali','diya','india','indian','lamp','crackers','fireworks','festival of lights'];
const HOLI_KW      = ['holi','gulal','colour festival','color festival','colors','colours','powder','rangoli','spring festival'];
const FATHERS_KW   = ['father','dad','fathers day','papa','fatherhood','paternal','parent'];
const MOTHERS_KW   = ['mother','mom','mothers day','mama','mum','motherhood','maternal'];
const CHRISTMAS_KW = ['christmas','xmas','santa','december','winter','snow','tree','holiday season'];
const NEWYEAR_KW   = ['new year','nye','new years','midnight','countdown','2025','2026','2027','january','celebration'];
const BIRTHDAY_KW  = ['birthday','bday','celebrate','party','happy birthday','cake','candle','balloons'];
const EID_KW       = ['eid','eid mubarak','ramadan','islam','muslim','eid al fitr','eid ul fitr','eid al adha'];
const HALLOWEEN_KW = ['halloween','spooky','ghost','october','trick','treat','pumpkin','bat','scary','haunted'];
const VALENTINE_KW = ['valentine','love','heart','romance','february','valentines day','couple','romantic'];
const INDEPENDENCE_KW = ['independence day','republic day','freedom','flag','patriotic','india','nation','august 15','january 26','tiranga'];
const GRADUATION_KW= ['graduation','convocation','degree','university','college','graduate','commencement','grad'];
const WEDDING_KW   = ['wedding','marriage','anniversary','bride','groom','nuptials','shaadi','married'];
const SPORTS_KW    = ['sports','cricket','football','victory','win','champion','trophy','tournament','match','game'];

export const THEME_LIBRARY: OccasionTheme[] = [
  // ── DIWALI ─────────────────────────────────────────────────────────────
  v('diwali',1,'Diwali','Classic Night',     '🪔','linear-gradient(160deg,#0a0400 0%,#2d1200 50%,#6b2d00 100%)',DIWALI_KW),
  v('diwali',2,'Diwali','Royal Purple',       '✨','linear-gradient(160deg,#0d0020 0%,#2d0060 50%,#6a00cc 100%)',DIWALI_KW),
  v('diwali',3,'Diwali','Crimson Sky',        '🎆','linear-gradient(160deg,#200000 0%,#6b0000 50%,#cc2200 100%)',DIWALI_KW),
  v('diwali',4,'Diwali','Midnight Blue',      '💛','linear-gradient(160deg,#000a1a 0%,#002244 50%,#003d80 100%)',DIWALI_KW),
  v('diwali',5,'Diwali','Golden Hour',        '🌟','linear-gradient(160deg,#1a0a00 0%,#7a4500 50%,#cc8800 100%)',DIWALI_KW),

  // ── HOLI ───────────────────────────────────────────────────────────────
  v('holi',1,'Holi','Rainbow Burst',          '🎨','linear-gradient(160deg,#ff6b35 0%,#f7c59f 30%,#5bc0eb 65%,#a23b72 100%)',HOLI_KW),
  v('holi',2,'Holi','Pink & Magenta',         '🌸','linear-gradient(160deg,#ff0066 0%,#cc0066 40%,#8800cc 100%)',HOLI_KW),
  v('holi',3,'Holi','Warm Sunrise',           '🟡','linear-gradient(160deg,#ff6600 0%,#ffaa00 50%,#ffdd00 100%)',HOLI_KW),
  v('holi',4,'Holi','Cool Teal',              '🔵','linear-gradient(160deg,#003355 0%,#006699 50%,#00cccc 100%)',HOLI_KW),
  v('holi',5,'Holi','White Powder',           '🤍','linear-gradient(160deg,#e8e8e8 0%,#f5f5f5 50%,#ffffff 100%)',HOLI_KW),

  // ── FATHER'S DAY ───────────────────────────────────────────────────────
  v('fathers-day',1,"Father's Day",'Sky Blue',  '👨‍👧','linear-gradient(160deg,#1a3a5c 0%,#2d6a9f 50%,#5ba3d9 100%)',FATHERS_KW),
  v('fathers-day',2,"Father's Day",'Navy Gold',  '🏅','linear-gradient(160deg,#0d1a33 0%,#1a3366 50%,#cc9900 100%)',FATHERS_KW),
  v('fathers-day',3,"Father's Day",'Warm Earth',  '⚽','linear-gradient(160deg,#1a0a00 0%,#5c3300 50%,#996633 100%)',FATHERS_KW),
  v('fathers-day',4,"Father's Day",'Sunset Orange','✈️','linear-gradient(160deg,#1a0500 0%,#cc4400 50%,#ff9933 100%)',FATHERS_KW),
  v('fathers-day',5,"Father's Day",'Forest Green', '🎣','linear-gradient(160deg,#001a00 0%,#1a5c1a 50%,#33aa33 100%)',FATHERS_KW),

  // ── MOTHER'S DAY ───────────────────────────────────────────────────────
  v('mothers-day',1,"Mother's Day",'Rose Pink',   '🌷','linear-gradient(160deg,#3d0020 0%,#cc3366 50%,#ff99bb 100%)',MOTHERS_KW),
  v('mothers-day',2,"Mother's Day",'Lavender',     '🌸','linear-gradient(160deg,#1a0033 0%,#6633cc 50%,#cc99ff 100%)',MOTHERS_KW),
  v('mothers-day',3,"Mother's Day",'Warm Peach',   '💐','linear-gradient(160deg,#3d1500 0%,#cc6633 50%,#ffcc99 100%)',MOTHERS_KW),
  v('mothers-day',4,"Mother's Day",'Deep Magenta', '🌺','linear-gradient(160deg,#330022 0%,#990066 50%,#cc0099 100%)',MOTHERS_KW),
  v('mothers-day',5,"Mother's Day",'Soft Mint',    '🦋','linear-gradient(160deg,#001a10 0%,#336644 50%,#99ddbb 100%)',MOTHERS_KW),

  // ── CHRISTMAS ──────────────────────────────────────────────────────────
  v('christmas',1,'Christmas','Classic',       '🎄','linear-gradient(160deg,#0d5c1a 0%,#1a8c2c 45%,#c41e22 100%)',CHRISTMAS_KW),
  v('christmas',2,'Christmas','Snowy Night',   '❄️','linear-gradient(160deg,#0a1628 0%,#0d2137 50%,#1a4d80 100%)',CHRISTMAS_KW),
  v('christmas',3,"Christmas","Santa's Night", '🎅','linear-gradient(160deg,#4d0000 0%,#8b0000 50%,#cc8800 100%)',CHRISTMAS_KW),
  v('christmas',4,'Christmas','Cozy Fireplace','🔥','linear-gradient(160deg,#1a0500 0%,#5c1a00 50%,#cc6600 100%)',CHRISTMAS_KW),
  v('christmas',5,'Christmas','Winter White',  '⛄','linear-gradient(160deg,#c8e6f5 0%,#e0f4ff 50%,#ffffff 100%)',CHRISTMAS_KW),

  // ── NEW YEAR ───────────────────────────────────────────────────────────
  v('new-year',1,'New Year','Midnight Black',  '🎆','linear-gradient(160deg,#0d0d0d 0%,#1a0050 50%,#0d0d0d 100%)',NEWYEAR_KW),
  v('new-year',2,'New Year','Deep Purple',     '🥂','linear-gradient(160deg,#0d0020 0%,#2d0060 50%,#8800cc 100%)',NEWYEAR_KW),
  v('new-year',3,'New Year','Royal Blue',      '🎇','linear-gradient(160deg,#000d1a 0%,#002d66 50%,#0066cc 100%)',NEWYEAR_KW),
  v('new-year',4,'New Year','Gold & Black',    '🌟','linear-gradient(160deg,#0d0a00 0%,#4d3300 50%,#cc9900 100%)',NEWYEAR_KW),
  v('new-year',5,'New Year','Silver Confetti', '🎊','linear-gradient(160deg,#1a1a1a 0%,#555555 50%,#aaaaaa 100%)',NEWYEAR_KW),

  // ── BIRTHDAY ───────────────────────────────────────────────────────────
  v('birthday',1,'Birthday','Rainbow Party',   '🎂','linear-gradient(160deg,#ff6b6b 0%,#ffd93d 33%,#6bcb77 66%,#4d96ff 100%)',BIRTHDAY_KW),
  v('birthday',2,'Birthday','Pink Party',      '🎈','linear-gradient(160deg,#330011 0%,#cc0066 50%,#ff66bb 100%)',BIRTHDAY_KW),
  v('birthday',3,'Birthday','Purple Magic',    '🎉','linear-gradient(160deg,#0d001a 0%,#440066 50%,#9900cc 100%)',BIRTHDAY_KW),
  v('birthday',4,'Birthday','Blue & Gold',     '🎁','linear-gradient(160deg,#000d1a 0%,#003366 50%,#cc9900 100%)',BIRTHDAY_KW),
  v('birthday',5,'Birthday','Confetti Burst',  '🎊','linear-gradient(160deg,#1a0000 0%,#660033 40%,#ff99cc 100%)',BIRTHDAY_KW),

  // ── EID ────────────────────────────────────────────────────────────────
  v('eid',1,'Eid','Midnight Teal',             '🌙','linear-gradient(160deg,#030d1a 0%,#0a2137 50%,#0d3d2a 100%)',EID_KW),
  v('eid',2,'Eid','Deep Blue',                 '⭐','linear-gradient(160deg,#000d1a 0%,#00264d 50%,#004d99 100%)',EID_KW),
  v('eid',3,'Eid','Emerald',                   '🕌','linear-gradient(160deg,#001a0d 0%,#004d26 50%,#009944 100%)',EID_KW),
  v('eid',4,'Eid','Purple & Gold',             '🌟','linear-gradient(160deg,#0d0020 0%,#330066 50%,#cc9900 100%)',EID_KW),
  v('eid',5,'Eid','Dark Navy',                 '🏮','linear-gradient(160deg,#000005 0%,#001133 50%,#002266 100%)',EID_KW),

  // ── HALLOWEEN ──────────────────────────────────────────────────────────
  v('halloween',1,'Halloween','Pumpkin Night', '🎃','linear-gradient(160deg,#0a0300 0%,#3d1500 50%,#6b2d00 100%)',HALLOWEEN_KW),
  v('halloween',2,'Halloween','Deep Purple',   '👻','linear-gradient(160deg,#0d0020 0%,#330066 50%,#660099 100%)',HALLOWEEN_KW),
  v('halloween',3,'Halloween','Blood Red',     '🕷️','linear-gradient(160deg,#0d0000 0%,#4d0000 50%,#990000 100%)',HALLOWEEN_KW),
  v('halloween',4,'Halloween','Midnight Green','🦇','linear-gradient(160deg,#001a05 0%,#003311 50%,#006622 100%)',HALLOWEEN_KW),
  v('halloween',5,'Halloween','Cosmic Black',  '💀','linear-gradient(160deg,#000000 0%,#0d0d0d 50%,#1a1a1a 100%)',HALLOWEEN_KW),

  // ── VALENTINE ──────────────────────────────────────────────────────────
  v('valentine',1,"Valentine's Day",'Crimson', '❤️','linear-gradient(160deg,#1a0005 0%,#660011 50%,#cc0022 100%)',VALENTINE_KW),
  v('valentine',2,"Valentine's Day",'Deep Rose','💝','linear-gradient(160deg,#1a000d 0%,#8b002d 50%,#cc0055 100%)',VALENTINE_KW),
  v('valentine',3,"Valentine's Day",'Blush Pink','💖','linear-gradient(160deg,#1a000a 0%,#cc3366 50%,#ff99bb 100%)',VALENTINE_KW),
  v('valentine',4,"Valentine's Day",'Burgundy', '💌','linear-gradient(160deg,#0d0005 0%,#33001a 50%,#660033 100%)',VALENTINE_KW),
  v('valentine',5,"Valentine's Day",'Coral',    '🌹','linear-gradient(160deg,#1a0500 0%,#993322 50%,#ff6644 100%)',VALENTINE_KW),

  // ── INDEPENDENCE ───────────────────────────────────────────────────────
  v('independence',1,'Independence Day','Tricolour',      '🇮🇳','linear-gradient(160deg,#ff9933 0%,#ffffff 50%,#138808 100%)',INDEPENDENCE_KW),
  v('independence',2,'Independence Day','Saffron Glow',   '🔶','linear-gradient(160deg,#1a0500 0%,#7a3300 50%,#ff9933 100%)',INDEPENDENCE_KW),
  v('independence',3,'Independence Day','Patriotic Blue', '🔵','linear-gradient(160deg,#000d1a 0%,#001f4d 50%,#0033aa 100%)',INDEPENDENCE_KW),
  v('independence',4,'Independence Day','Golden Dawn',    '☀️','linear-gradient(160deg,#1a1000 0%,#996600 50%,#ffcc00 100%)',INDEPENDENCE_KW),
  v('independence',5,'Independence Day','Forest Green',   '🌿','linear-gradient(160deg,#001a05 0%,#005c1a 50%,#138808 100%)',INDEPENDENCE_KW),

  // ── GRADUATION ─────────────────────────────────────────────────────────
  v('graduation',1,'Graduation','Royal Purple',  '🎓','linear-gradient(160deg,#0a0020 0%,#2d0066 50%,#6600cc 100%)',GRADUATION_KW),
  v('graduation',2,'Graduation','Navy & Gold',   '📜','linear-gradient(160deg,#000d1a 0%,#001f4d 50%,#cc9900 100%)',GRADUATION_KW),
  v('graduation',3,'Graduation','Deep Maroon',   '🏛️','linear-gradient(160deg,#0d0000 0%,#4d0011 50%,#880022 100%)',GRADUATION_KW),
  v('graduation',4,'Graduation','Black & Gold',  '⭐','linear-gradient(160deg,#0d0d0d 0%,#1a1a1a 50%,#cc9900 100%)',GRADUATION_KW),
  v('graduation',5,'Graduation','Blue Confetti', '🎉','linear-gradient(160deg,#000d1a 0%,#003366 50%,#0066cc 100%)',GRADUATION_KW),

  // ── WEDDING ────────────────────────────────────────────────────────────
  v('wedding',1,'Wedding','Gold & Ivory',   '💍','linear-gradient(160deg,#1a1400 0%,#7a6000 50%,#f5e6cc 100%)',WEDDING_KW),
  v('wedding',2,'Wedding','Rose Gold',      '🌹','linear-gradient(160deg,#1a0a08 0%,#7a3322 50%,#e8a090 100%)',WEDDING_KW),
  v('wedding',3,'Wedding','Champagne',      '💒','linear-gradient(160deg,#1a1408 0%,#5c4c22 50%,#d4bc88 100%)',WEDDING_KW),
  v('wedding',4,'Wedding','Blush & Mauve',  '🌸','linear-gradient(160deg,#1a000d 0%,#994466 50%,#ddaacc 100%)',WEDDING_KW),
  v('wedding',5,'Wedding','Pearl White',    '🕊️','linear-gradient(160deg,#e8e8e8 0%,#f5f0ff 50%,#ffffff 100%)',WEDDING_KW),

  // ── SPORTS ─────────────────────────────────────────────────────────────
  v('sports',1,'Sports & Victory','Green & Gold', '🏆','linear-gradient(160deg,#0a1a00 0%,#1f5c00 50%,#cc9900 100%)',SPORTS_KW),
  v('sports',2,'Sports & Victory','Navy & Red',   '⚽','linear-gradient(160deg,#00001a 0%,#00004d 50%,#cc0000 100%)',SPORTS_KW),
  v('sports',3,'Sports & Victory','Dark Blue',    '🏅','linear-gradient(160deg,#000d1a 0%,#001f4d 50%,#003d99 100%)',SPORTS_KW),
  v('sports',4,'Sports & Victory','Champion Black','⭐','linear-gradient(160deg,#0d0d0d 0%,#1a1a00 50%,#4d4d00 100%)',SPORTS_KW),
  v('sports',5,'Sports & Victory','Amber Victory','🥇','linear-gradient(160deg,#1a0a00 0%,#7a4400 50%,#ff9900 100%)',SPORTS_KW),
];

// ── Search ──────────────────────────────────────────────────────────────

export function getSampleThemes(keyword: string, offset = 0): OccasionTheme[] {
  const kw = keyword.toLowerCase().trim();

  if (!kw) return dedupe5(THEME_LIBRARY, offset);

  // Score each theme
  const scoreMap: Record<string, number> = {};
  for (const t of THEME_LIBRARY) {
    let score = 0;
    for (const k of t.keywords) {
      if (k === kw) score += 10;
      else if (k.startsWith(kw) || kw.startsWith(k)) score += 5;
      else if (kw.split(' ').some(w => k === w || k.startsWith(w))) score += 3;
    }
    if (t.name.toLowerCase().includes(kw)) score += 4;
    if (t.variantLabel.toLowerCase().includes(kw)) score += 2;
    scoreMap[t.baseId] = Math.max(scoreMap[t.baseId] ?? 0, score);
  }

  // Group themes by baseId, sorted by best score descending
  const groupMap = new Map<string, OccasionTheme[]>();
  for (const t of THEME_LIBRARY) {
    if (!groupMap.has(t.baseId)) groupMap.set(t.baseId, []);
    groupMap.get(t.baseId)!.push(t);
  }

  // Sort groups by score
  const sorted = [...groupMap.entries()].sort((a, b) => (scoreMap[b[0]] ?? 0) - (scoreMap[a[0]] ?? 0));

  // Each "page" (offset step of 5) = one occasion's 5 variants
  const page = Math.floor(offset / 5) % sorted.length;
  const [, variants] = sorted[page] ?? sorted[0];
  return variants.slice(0, 5);
}

function dedupe5(lib: OccasionTheme[], offset: number): OccasionTheme[] {
  const unique = lib.filter((t, i, a) => a.findIndex(x => x.baseId === t.baseId) === i);
  const base = unique[offset % unique.length];
  return lib.filter(t => t.baseId === base.baseId).slice(0, 5);
}

export function getThemeById(id: string): OccasionTheme | undefined {
  return THEME_LIBRARY.find(t => t.id === id);
}

export function parseThemeString(themeStr: string): { baseId: string; variant: number } | null {
  if (!themeStr) return null;
  const parts = themeStr.split('-');
  const variantNum = parseInt(parts[parts.length - 1], 10);
  if (isNaN(variantNum)) return null;
  const baseId = parts.slice(0, -1).join('-');
  return { baseId, variant: variantNum };
}
