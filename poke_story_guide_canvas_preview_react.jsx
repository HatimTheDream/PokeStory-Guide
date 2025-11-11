import React, { useMemo, useState } from "react";

// PokeStory Guide — In‑canvas React preview
// Fix: PLACEHOLDER string encoded to avoid unterminated string errors.
// Adds lightweight self-tests. Kanto includes Gyms, Elite Four, Champion, Rival.

// ---------------- Types ----------------
type RegionId =
  | "kanto"
  | "johto"
  | "hoenn"
  | "sinnoh"
  | "unova"
  | "kalos"
  | "alola"
  | "galar"
  | "paldea";

type Role = "gym" | "elite4" | "champion" | "rival";

interface PartyMember {
  speciesId: number;
  name: string;
  level: number;
  types: string[];
  moves: string[];
  officialArt: string;
  pixelSprite: string;
}

interface TrainerTeam {
  id: string;
  label: string;
  order: number;
  versionTags: string[];
  party: PartyMember[];
}

interface Trainer {
  id: string;
  displayName: string;
  role: Role;
  region: RegionId;
  game: string;
  badgeNumber?: number;
  spriteUrl: string | string[]; // pixel sprite of trainer (multi-source)
  artUrl?: string | string[]; // official art of trainer (multi-source)
  badgeIconUrl?: string | string[]; // for gym leaders (multi-source)
  location: string;
  prerequisites?: string[];
  format: "singles" | "doubles" | "multis";
  teams: TrainerTeam[];
}

interface RankedPick {
  tier: "S" | "A" | "B";
  speciesId: number;
  name: string;
  rationale: string;
  recommendedMoves: string[];
  targetLevel: number;
  officialArt: string;
  pixelSprite: string;
  obtainable: { route: string; method: string };
}

// ---------------- Image helpers ----------------
// Encode '#' as %23 and keep the string single-line.
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='120'>" +
  "<rect width='100%' height='100%' fill='%23e5e7eb'/>" +
  "<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-family='sans-serif' font-size='12'>Image not available</text>" +
  "</svg>";

function cn(...xs: (string | false | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

function useMultiSrc(src?: string | string[]) {
  const arr = (Array.isArray(src) ? src : src ? [src] : []).filter(Boolean);
  const [idx, setIdx] = useState(0);
  const cur = arr[idx];
  const onError = () => {
    if (idx < arr.length - 1) setIdx(idx + 1);
  };
  return { cur: cur || PLACEHOLDER, onError };
}

function FallbackImg({ src, alt, className }: { src?: string | string[]; alt: string; className?: string }) {
  const { cur, onError } = useMultiSrc(src);
  return <img src={cur} alt={alt} onError={onError} className={className} loading="lazy" />;
}

function PixelImg({ src, alt, className }: { src?: string | string[]; alt: string; className?: string }) {
  const { cur, onError } = useMultiSrc(src);
  return (
    <img
      src={cur}
      alt={alt}
      onError={onError}
      className={cn("image-render-pixel", className)}
      style={{ imageRendering: "pixelated" as any }}
      loading="lazy"
    />
  );
}

function TypeBadge({ t }: { t: string }) {
  return (
    <span className={cn("px-2 py-0.5 rounded text-xs font-medium border bg-white/70 dark:bg-slate-900/40")}>{t}</span>
  );
}

// ---------------- Mock Data ----------------
const REGIONS: { id: RegionId; name: string; cover: string | string[] }[] = [
  { id: "kanto", name: "Kanto", cover: [
    "https://archives.bulbagarden.net/media/upload/0/0a/RB_Vermilion_City.png",
    "https://archives.bulbagarden.net/media/upload/8/8d/FRLG_Pallet_Town.png"
  ] },
  { id: "johto", name: "Johto", cover: [
    "https://archives.bulbagarden.net/media/upload/1/1a/HGSS_Goldenrod_City.png",
    "https://archives.bulbagarden.net/media/upload/2/2c/HGSS_Violet_City.png"
  ] },
  { id: "hoenn", name: "Hoenn", cover: [
    "https://archives.bulbagarden.net/media/upload/7/75/Slateport_City_E.png",
    "https://archives.bulbagarden.net/media/upload/3/31/RSE_Rustboro_City.png"
  ] },
  { id: "sinnoh", name: "Sinnoh", cover: [
    "https://archives.bulbagarden.net/media/upload/8/86/Hearthome_City_Pt.png",
    "https://archives.bulbagarden.net/media/upload/3/31/DPPt_Jubilife_City.png"
  ] },
  { id: "unova", name: "Unova", cover: [
    "https://archives.bulbagarden.net/media/upload/5/5b/Black_2_White_2_Castelia_City.png",
    "https://archives.bulbagarden.net/media/upload/4/49/Black_White_Striaton_City.png"
  ] },
  { id: "kalos", name: "Kalos", cover: [
    "https://archives.bulbagarden.net/media/upload/1/10/XY_Lumiose_City.png",
    "https://archives.bulbagarden.net/media/upload/9/9c/XY_Aquilacorde_Town.png"
  ] },
  { id: "alola", name: "Alola", cover: [
    "https://archives.bulbagarden.net/media/upload/d/d4/SM_Hau%CA%BBoli_City.png",
    "https://archives.bulbagarden.net/media/upload/7/77/USUM_Heahea_City.png"
  ] },
  { id: "galar", name: "Galar", cover: [
    "https://archives.bulbagarden.net/media/upload/6/62/SwSh_Motostoke_City.png",
    "https://archives.bulbagarden.net/media/upload/6/62/SwSh_Turffield.png"
  ] },
  { id: "paldea", name: "Paldea", cover: [
    "https://archives.bulbagarden.net/media/upload/0/00/Scarlet_Violet_Mesagoza.png",
    "https://archives.bulbagarden.net/media/upload/7/7f/Scarlet_Violet_Cortondo.png"
  ] },
];

// Kanto fully populated: 8 Gyms, Elite Four, Champion, Rival
const KANTO_TRAINERS: Trainer[] = [
  // 1. Brock — Boulder Badge
  {
    id: "kanto-brock-rb",
    displayName: "Brock",
    role: "gym",
    region: "kanto",
    game: "Red/Blue",
    badgeNumber: 1,
    spriteUrl: [
      "https://archives.bulbagarden.net/media/upload/6/6d/Spr_FRLG_Brock.png",
      "https://archives.bulbagarden.net/media/upload/7/72/Spr_RG_Brock.png"
    ],
    artUrl: [
      "https://archives.bulbagarden.net/media/upload/8/8b/Lets_Go_Pikachu_Eevee_Brock.png"
    ],
    badgeIconUrl: [
      "https://archives.bulbagarden.net/media/upload/0/0b/Boulder_Badge.png"
    ],
    location: "Pewter City Gym",
    prerequisites: ["Reach Pewter City"],
    format: "singles",
    teams: [
      {
        id: "rb-first",
        label: "First battle (RB)",
        order: 1,
        versionTags: ["red", "blue"],
        party: [
          { speciesId: 74, name: "Geodude", level: 12, types: ["Rock", "Ground"], moves: ["Tackle", "Defense Curl"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/74.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png" },
          { speciesId: 95, name: "Onix", level: 14, types: ["Rock", "Ground"], moves: ["Tackle", "Screech", "Bind"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png" },
        ],
      },
    ],
  },

  // 2. Misty — Cascade Badge
  {
    id: "kanto-misty-rb",
    displayName: "Misty",
    role: "gym",
    region: "kanto",
    game: "Red/Blue",
    badgeNumber: 2,
    spriteUrl: [
      "https://archives.bulbagarden.net/media/upload/1/1d/Spr_FRLG_Misty.png",
      "https://archives.bulbagarden.net/media/upload/1/1e/Spr_RG_Misty.png"
    ],
    artUrl: ["https://archives.bulbagarden.net/media/upload/2/2d/Lets_Go_Pikachu_Eevee_Misty.png"],
    badgeIconUrl: ["https://archives.bulbagarden.net/media/upload/9/95/Cascade_Badge.png"],
    location: "Cerulean City Gym",
    prerequisites: ["Defeat Brock", "Reach Cerulean City"],
    format: "singles",
    teams: [
      { id: "rb-first", label: "First battle (RB)", order: 1, versionTags: ["red", "blue"], party: [
        { speciesId: 120, name: "Staryu", level: 18, types: ["Water"], moves: ["Tackle", "Water Gun"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/120.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/120.png" },
        { speciesId: 121, name: "Starmie", level: 21, types: ["Water", "Psychic"], moves: ["Tackle", "Water Gun", "BubbleBeam"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/121.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/121.png" },
      ] },
    ],
  },

  // 3. Lt. Surge — Thunder Badge
  {
    id: "kanto-surge-rb",
    displayName: "Lt. Surge",
    role: "gym",
    region: "kanto",
    game: "Red/Blue",
    badgeNumber: 3,
    spriteUrl: [
      "https://archives.bulbagarden.net/media/upload/5/52/Spr_FRLG_Lt_Surge.png",
      "https://archives.bulbagarden.net/media/upload/2/20/Spr_RG_Lt._Surge.png"
    ],
    artUrl: ["https://archives.bulbagarden.net/media/upload/e/ee/Lets_Go_Pikachu_Eevee_Lt_Surge.png"],
    badgeIconUrl: ["https://archives.bulbagarden.net/media/upload/a/a3/Thunder_Badge.png"],
    location: "Vermilion City Gym",
    prerequisites: ["Cut access", "Defeat Misty"],
    format: "singles",
    teams: [
      { id: "rb-first", label: "Gym battle", order: 1, versionTags: ["red", "blue"], party: [
        { speciesId: 100, name: "Voltorb", level: 21, types: ["Electric"], moves: ["Tackle", "Screech"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/100.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/100.png" },
        { speciesId: 25, name: "Pikachu", level: 18, types: ["Electric"], moves: ["ThunderShock", "Growl"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
        { speciesId: 26, name: "Raichu", level: 24, types: ["Electric"], moves: ["Thunderbolt", "Growl"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png" },
      ] },
    ],
  },

  // 4. Erika — Rainbow Badge
  {
    id: "kanto-erika-rb",
    displayName: "Erika",
    role: "gym",
    region: "kanto",
    game: "Red/Blue",
    badgeNumber: 4,
    spriteUrl: [
      "https://archives.bulbagarden.net/media/upload/1/1b/Spr_FRLG_Erika.png",
      "https://archives.bulbagarden.net/media/upload/2/2e/Spr_RG_Erika.png"
    ],
    artUrl: ["https://archives.bulbagarden.net/media/upload/4/43/Lets_Go_Pikachu_Eevee_Erika.png"],
    badgeIconUrl: ["https://archives.bulbagarden.net/media/upload/0/03/Rainbow_Badge.png"],
    location: "Celadon City Gym",
    prerequisites: ["Defeat Lt. Surge"],
    format: "singles",
    teams: [
      { id: "rb-first", label: "Gym battle", order: 1, versionTags: ["red", "blue"], party: [
        { speciesId: 114, name: "Tangela", level: 24, types: ["Grass"], moves: ["Vine Whip", "Bind"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/114.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/114.png" },
        { speciesId: 70, name: "Weepinbell", level: 29, types: ["Grass", "Poison"], moves: ["Acid", "Wrap"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/70.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/70.png" },
        { speciesId: 44, name: "Gloom", level: 29, types: ["Grass", "Poison"], moves: ["Acid", "Sleep Powder"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/44.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/44.png" },
      ] },
    ],
  },

  // 5. Koga — Soul Badge
  {
    id: "kanto-koga-rb",
    displayName: "Koga",
    role: "gym",
    region: "kanto",
    game: "Red/Blue",
    badgeNumber: 5,
    spriteUrl: [
      "https://archives.bulbagarden.net/media/upload/d/d8/Spr_FRLG_Koga.png",
      "https://archives.bulbagarden.net/media/upload/7/73/Spr_RG_Koga.png"
    ],
    artUrl: ["https://archives.bulbagarden.net/media/upload/4/49/Lets_Go_Pikachu_Eevee_Koga.png"],
    badgeIconUrl: ["https://archives.bulbagarden.net/media/upload/8/85/Soul_Badge.png"],
    location: "Fuchsia City Gym",
    prerequisites: ["Safari Zone Warden's Teeth", "Secret House HM Surf"],
    format: "singles",
    teams: [
      { id: "rb-first", label: "Gym battle", order: 1, versionTags: ["red", "blue"], party: [
        { speciesId: 109, name: "Koffing", level: 37, types: ["Poison"], moves: ["Sludge", "Self-Destruct"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/109.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/109.png" },
        { speciesId: 109, name: "Koffing", level: 37, types: ["Poison"], moves: ["Sludge", "Self-Destruct"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/109.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/109.png" },
        { speciesId: 110, name: "Weezing", level: 43, types: ["Poison"], moves: ["Sludge", "Self-Destruct"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/110.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/110.png" },
        { speciesId: 88, name: "Grimer", level: 39, types: ["Poison"], moves: ["Sludge", "Disable"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/88.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/88.png" },
      ] },
    ],
  },

  // 6. Sabrina — Marsh Badge
  {
    id: "kanto-sabrina-rb",
    displayName: "Sabrina",
    role: "gym",
    region: "kanto",
    game: "Red/Blue",
    badgeNumber: 6,
    spriteUrl: [
      "https://archives.bulbagarden.net/media/upload/c/ca/Spr_FRLG_Sabrina.png",
      "https://archives.bulbagarden.net/media/upload/0/0a/Spr_RG_Sabrina.png"
    ],
    artUrl: ["https://archives.bulbagarden.net/media/upload/4/4a/Lets_Go_Pikachu_Eevee_Sabrina.png"],
    badgeIconUrl: ["https://archives.bulbagarden.net/media/upload/8/8c/Marsh_Badge.png"],
    location: "Saffron City Gym",
    prerequisites: ["Silph Co. cleared"],
    format: "singles",
    teams: [
      { id: "rb-first", label: "Gym battle", order: 1, versionTags: ["red", "blue"], party: [
        { speciesId: 49, name: "Venomoth", level: 38, types: ["Bug", "Poison"], moves: ["Psybeam", "Stun Spore"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/49.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/49.png" },
        { speciesId: 65, name: "Alakazam", level: 43, types: ["Psychic"], moves: ["Psychic", "Recover"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png" },
        { speciesId: 122, name: "Mr. Mime", level: 37, types: ["Psychic", "Fairy"], moves: ["Light Screen", "Confusion"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/122.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/122.png" },
      ] },
    ],
  },

  // 7. Blaine — Volcano Badge
  {
    id: "kanto-blaine-rb",
    displayName: "Blaine",
    role: "gym",
    region: "kanto",
    game: "Red/Blue",
    badgeNumber: 7,
    spriteUrl: [
      "https://archives.bulbagarden.net/media/upload/8/8b/Spr_FRLG_Blaine.png",
      "https://archives.bulbagarden.net/media/upload/f/f6/Spr_RG_Blaine.png"
    ],
    artUrl: ["https://archives.bulbagarden.net/media/upload/6/68/Lets_Go_Pikachu_Eevee_Blaine.png"],
    badgeIconUrl: ["https://archives.bulbagarden.net/media/upload/3/3e/Volcano_Badge.png"],
    location: "Cinnabar Island Gym",
    prerequisites: ["Find Blaine in Seafoam in RB if gym is rebuilt in FRLG"],
    format: "singles",
    teams: [
      { id: "rb-first", label: "Gym battle", order: 1, versionTags: ["red", "blue"], party: [
        { speciesId: 58, name: "Growlithe", level: 42, types: ["Fire"], moves: ["Ember", "Take Down"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/58.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/58.png" },
        { speciesId: 77, name: "Ponyta", level: 40, types: ["Fire"], moves: ["Stomp", "Fire Spin"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/77.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/77.png" },
        { speciesId: 78, name: "Rapidash", level: 42, types: ["Fire"], moves: ["Stomp", "Fire Blast"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/78.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/78.png" },
        { speciesId: 59, name: "Arcanine", level: 47, types: ["Fire"], moves: ["Flamethrower", "Take Down"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png" },
      ] },
    ],
  },

  // 8. Giovanni — Earth Badge
  {
    id: "kanto-giovanni-rb",
    displayName: "Giovanni",
    role: "gym",
    region: "kanto",
    game: "Red/Blue",
    badgeNumber: 8,
    spriteUrl: [
      "https://archives.bulbagarden.net/media/upload/8/8e/Spr_FRLG_Giovanni.png",
      "https://archives.bulbagarden.net/media/upload/1/19/Spr_RG_Giovanni.png"
    ],
    artUrl: ["https://archives.bulbagarden.net/media/upload/6/6a/Lets_Go_Pikachu_Eevee_Giovanni.png"],
    badgeIconUrl: ["https://archives.bulbagarden.net/media/upload/4/45/Earth_Badge.png"],
    location: "Viridian City Gym",
    prerequisites: ["Restore power to the Gym"],
    format: "singles",
    teams: [
      { id: "rb-first", label: "Gym battle", order: 1, versionTags: ["red", "blue"], party: [
        { speciesId: 51, name: "Dugtrio", level: 50, types: ["Ground"], moves: ["Earthquake", "Slash"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/51.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/51.png" },
        { speciesId: 31, name: "Nidoqueen", level: 53, types: ["Poison", "Ground"], moves: ["Body Slam", "Earthquake"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/31.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/31.png" },
        { speciesId: 34, name: "Nidoking", level: 55, types: ["Poison", "Ground"], moves: ["Thrash", "Earthquake"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/34.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/34.png" },
        { speciesId: 112, name: "Rhydon", level: 55, types: ["Ground", "Rock"], moves: ["Horn Drill", "Fury Attack"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/112.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/112.png" },
      ] },
    ],
  },

  // Elite Four (all four)
  { id: "kanto-lorelei-rb", displayName: "Lorelei", role: "elite4", region: "kanto", game: "Red/Blue", spriteUrl: ["https://archives.bulbagarden.net/media/upload/8/84/Spr_FRLG_Lorelei.png"], artUrl: ["https://archives.bulbagarden.net/media/upload/2/27/Lets_Go_Pikachu_Eevee_Lorelei.png"], location: "Indigo Plateau", format: "singles", teams: [ { id: "rb-first", label: "League battle", order: 1, versionTags: ["red", "blue"], party: [ { speciesId: 124, name: "Jynx", level: 54, types: ["Ice", "Psychic"], moves: ["Lovely Kiss", "Blizzard", "Body Slam", "Thrash"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/124.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/124.png" }, { speciesId: 131, name: "Lapras", level: 56, types: ["Water", "Ice"], moves: ["Body Slam", "Hydro Pump", "Confuse Ray", "Blizzard"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png" } ] } ] },
  { id: "kanto-bruno-rb", displayName: "Bruno", role: "elite4", region: "kanto", game: "Red/Blue", spriteUrl: ["https://archives.bulbagarden.net/media/upload/5/57/Spr_FRLG_Bruno.png"], artUrl: ["https://archives.bulbagarden.net/media/upload/1/1a/Lets_Go_Pikachu_Eevee_Bruno.png"], location: "Indigo Plateau", format: "singles", teams: [ { id: "rb-first", label: "League battle", order: 1, versionTags: ["red", "blue"], party: [ { speciesId: 95, name: "Onix", level: 53, types: ["Rock", "Ground"], moves: ["Rock Slide", "Bind"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png" }, { speciesId: 106, name: "Hitmonlee", level: 55, types: ["Fighting"], moves: ["High Jump Kick", "Focus Energy"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/106.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/106.png" } ] } ] },
  { id: "kanto-agatha-rb", displayName: "Agatha", role: "elite4", region: "kanto", game: "Red/Blue", spriteUrl: ["https://archives.bulbagarden.net/media/upload/0/0f/Spr_FRLG_Agatha.png"], artUrl: ["https://archives.bulbagarden.net/media/upload/f/f9/Lets_Go_Pikachu_Eevee_Agatha.png"], location: "Indigo Plateau", format: "singles", teams: [ { id: "rb-first", label: "League battle", order: 1, versionTags: ["red", "blue"], party: [ { speciesId: 93, name: "Haunter", level: 56, types: ["Ghost", "Poison"], moves: ["Night Shade", "Confuse Ray"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/93.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/93.png" }, { speciesId: 94, name: "Gengar", level: 60, types: ["Ghost", "Poison"], moves: ["Night Shade", "Hypnosis"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png" } ] } ] },
  { id: "kanto-lance-rb", displayName: "Lance", role: "elite4", region: "kanto", game: "Red/Blue", spriteUrl: ["https://archives.bulbagarden.net/media/upload/1/12/Spr_FRLG_Lance.png"], artUrl: ["https://archives.bulbagarden.net/media/upload/5/58/Lets_Go_Pikachu_Eevee_Lance.png"], location: "Indigo Plateau", format: "singles", teams: [ { id: "rb-first", label: "League battle", order: 1, versionTags: ["red", "blue"], party: [ { speciesId: 130, name: "Gyarados", level: 58, types: ["Water", "Flying"], moves: ["Hydro Pump", "Leer"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png" }, { speciesId: 149, name: "Dragonite", level: 62, types: ["Dragon", "Flying"], moves: ["Hyper Beam", "Agility"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png" } ] } ] },

  // Champion and Rival
  { id: "kanto-champion-blue-rb", displayName: "Champion Blue", role: "champion", region: "kanto", game: "Red/Blue", spriteUrl: ["https://archives.bulbagarden.net/media/upload/0/04/Spr_FRLG_Blue_3.png", "https://archives.bulbagarden.net/media/upload/9/9a/Spr_RG_Blue.png"], artUrl: ["https://archives.bulbagarden.net/media/upload/3/35/Lets_Go_Pikachu_Eevee_Blue.png"], location: "Champion Room", format: "singles", teams: [ { id: "rb-final", label: "Final battle (RB)", order: 1, versionTags: ["red", "blue"], party: [ { speciesId: 130, name: "Gyarados", level: 61, types: ["Water", "Flying"], moves: ["Hydro Pump", "Dragon Rage", "Leer", "Hyper Beam"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png" }, { speciesId: 6, name: "Charizard", level: 65, types: ["Fire", "Flying"], moves: ["Flamethrower", "Slash", "Fire Spin", "Hyper Beam"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png" } ] } ] },
  { id: "kanto-rival-blue-rb", displayName: "Rival Blue", role: "rival", region: "kanto", game: "Red/Blue", spriteUrl: ["https://archives.bulbagarden.net/media/upload/0/04/Spr_FRLG_Blue_2.png", "https://archives.bulbagarden.net/media/upload/b/b7/Spr_RG_Blue_2.png"], artUrl: ["https://archives.bulbagarden.net/media/upload/3/35/Lets_Go_Pikachu_Eevee_Blue.png"], location: "Various (Route 22, S.S. Anne, Pokémon Tower, etc.)", format: "singles", teams: [ { id: "rb-early", label: "Early Route 22 battle", order: 1, versionTags: ["red", "blue"], party: [ { speciesId: 16, name: "Pidgey", level: 9, types: ["Normal", "Flying"], moves: ["Gust", "Sand-Attack"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png" }, { speciesId: 1, name: "Bulbasaur", level: 8, types: ["Grass", "Poison"], moves: ["Tackle", "Growl", "Leech Seed"], officialArt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png", pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" } ] } ] },
];

const COUNTERS: Record<string, RankedPick[]> = {
  // Brock
  "kanto-brock-rb:rb-first": [
    {
      tier: "S",
      speciesId: 7,
      name: "Squirtle",
      rationale: "Water STAB destroys Rock/Ground early.",
      recommendedMoves: ["Water Gun", "Bubble"],
      targetLevel: 12,
      officialArt:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
      pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
      obtainable: { route: "Starter", method: "gift" },
    },
    {
      tier: "A",
      speciesId: 35,
      name: "Clefairy",
      rationale: "Sing + TM Water Gun cheese.",
      recommendedMoves: ["Sing", "Water Gun"],
      targetLevel: 13,
      officialArt:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/35.png",
      pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png",
      obtainable: { route: "Mt. Moon", method: "cave" },
    },
    {
      tier: "B",
      speciesId: 1,
      name: "Bulbasaur",
      rationale: "Resists Rock moves and hits SE with Vine Whip.",
      recommendedMoves: ["Vine Whip", "Leech Seed"],
      targetLevel: 13,
      officialArt:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
      pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      obtainable: { route: "Starter", method: "gift" },
    },
  ],

  // Misty
  "kanto-misty-rb:rb-first": [
    {
      tier: "S",
      speciesId: 25,
      name: "Pikachu",
      rationale: "Electric STAB sweeps Water team. Early in Viridian Forest.",
      recommendedMoves: ["ThunderShock", "Thunder Wave"],
      targetLevel: 20,
      officialArt:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
      pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
      obtainable: { route: "Viridian Forest", method: "grass" },
    },
    {
      tier: "A",
      speciesId: 2,
      name: "Ivysaur",
      rationale: "Grass STAB and good bulk vs Starmie.",
      recommendedMoves: ["Razor Leaf", "Sleep Powder"],
      targetLevel: 22,
      officialArt:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
      pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
      obtainable: { route: "Evolve Bulbasaur", method: "level" },
    },
    {
      tier: "B",
      speciesId: 52,
      name: "Meowth",
      rationale: "Fast utility; budget option.",
      recommendedMoves: ["Scratch", "Bite"],
      targetLevel: 20,
      officialArt:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png",
      pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png",
      obtainable: { route: "Route 5", method: "grass" },
    },
  ],

  // Lorelei
  "kanto-lorelei-rb:rb-first": [
    {
      tier: "S",
      speciesId: 26,
      name: "Raichu",
      rationale: "Electric STAB checks Lapras and Dewgong; outspeeds most.",
      recommendedMoves: ["Thunderbolt", "Thunder Wave"],
      targetLevel: 57,
      officialArt:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png",
      pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png",
      obtainable: { route: "Evolve Pikachu", method: "Thunder Stone" },
    },
    {
      tier: "A",
      speciesId: 3,
      name: "Venusaur",
      rationale: "Resists Water, hits neutral/SE with Razor Leaf; status support.",
      recommendedMoves: ["Razor Leaf", "Sleep Powder"],
      targetLevel: 56,
      officialArt:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
      pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
      obtainable: { route: "Starter line", method: "level" },
    },
  ],

  // Champion Blue
  "kanto-champion-blue-rb:rb-final": [
    {
      tier: "S",
      speciesId: 145,
      name: "Zapdos",
      rationale:
        "High BST, Electric/Flying coverage vs his Water/Flying and Grass/Poison picks.",
      recommendedMoves: ["Thunderbolt", "Drill Peck"],
      targetLevel: 62,
      officialArt:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png",
      pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png",
      obtainable: { route: "Power Plant", method: "static" },
    },
    {
      tier: "A",
      speciesId: 131,
      name: "Lapras",
      rationale:
        "Bulky pivot with Ice + Water coverage; good into Charizard/Gyarados variants.",
      recommendedMoves: ["Ice Beam", "Surf"],
      targetLevel: 60,
      officialArt:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png",
      pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png",
      obtainable: { route: "Silph Co. gift", method: "gift" },
    },
  ],

  // Rival Blue (early)
  "kanto-rival-blue-rb:rb-early": [
    {
      tier: "S",
      speciesId: 19,
      name: "Rattata",
      rationale:
        "Very early availability, outspeeds and chips down Route 22 team.",
      recommendedMoves: ["Quick Attack", "Tail Whip"],
      targetLevel: 9,
      officialArt:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/19.png",
      pixelSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png",
      obtainable: { route: "Route 1–2", method: "grass" },
    },
  ],
};

// ---------------- Components ----------------
function RegionPicker({
  value,
  onChange,
}: {
  value: RegionId;
  onChange: (v: RegionId) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Choose a Region</h2>
      <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {REGIONS.map((r) => (
          <button
            key={r.id}
            onClick={() => onChange(r.id)}
            className={cn(
              "relative rounded-2xl overflow-hidden border shadow hover:shadow-md text-left",
              value === r.id && "ring-2 ring-indigo-500"
            )}
            title={r.name}
          >
            <div className="h-24 w-full bg-slate-200">
              <FallbackImg src={r.cover} alt={r.name} className="h-24 w-full object-cover" />
            </div>
            <div className="p-3 font-semibold">{r.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TrainerGrid({
  trainers,
  title,
  role,
  onOpen,
}: {
  trainers: Trainer[];
  title: string;
  role: Role | "all";
  onOpen: (t: Trainer) => void;
}) {
  const list = trainers
    .filter((t) => (role === "all" ? true : t.role === role))
    .sort((a, b) => (a.badgeNumber || 99) - (b.badgeNumber || 99));
  if (!list.length) return null;
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((t) => (
          <button
            key={t.id}
            onClick={() => onOpen(t)}
            className="rounded-2xl border shadow hover:shadow-md p-4 text-left bg-white/80 dark:bg-slate-900/60"
          >
            <div className="flex items-center gap-3">
              <PixelImg src={t.spriteUrl} alt={`${t.displayName} sprite`} className="w-12 h-12" />
              <div className="flex-1">
                {t.role === "gym" && (
                  <div className="text-sm text-slate-500">Badge #{t.badgeNumber}</div>
                )}
                <div className="font-semibold">{t.displayName}</div>
                <div className="text-xs">{t.location}</div>
              </div>
              {t.badgeIconUrl && (
                <FallbackImg src={t.badgeIconUrl} alt="badge" className="w-10 h-10" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TeamList({ party }: { party: PartyMember[] }) {
  return (
    <ul className="grid md:grid-cols-2 gap-4">
      {party.map((p, i) => (
        <li
          key={`${p.speciesId}-${i}`}
          className="rounded-2xl shadow p-4 bg-white/70 dark:bg-slate-900/60 border"
        >
          <div className="flex items-center gap-3">
            <PixelImg src={p.pixelSprite} alt={`${p.name} sprite`} className="w-12 h-12" />
            <div className="flex-1">
              <div className="text-sm text-slate-500">#{i + 1} send‑out • Lv.{p.level}</div>
              <div className="text-lg font-semibold">{p.name}</div>
              <div className="flex gap-2 mt-1 flex-wrap">
                {p.types.map((t) => (
                  <TypeBadge key={t} t={t} />
                ))}
              </div>
            </div>
            <FallbackImg src={p.officialArt} alt={`${p.name} art`} className="w-16 h-16" />
          </div>
          <div className="mt-3 text-sm">
            <div className="font-medium">Moves</div>
            <div className="flex flex-wrap gap-2 mt-1">
              {p.moves.map((m) => (
                <span
                  key={m}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border text-xs"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function CounterTiers({ picks }: { picks: RankedPick[] }) {
  const tiers: ("S" | "A" | "B")[] = ["S", "A", "B"];
  return (
    <div className="space-y-6">
      {tiers.map((tier) => (
        <section key={tier}>
          <h3 className="text-lg font-bold">{tier} Tier</h3>
          <ul className="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {picks
              .filter((p) => p.tier === tier)
              .map((p) => (
                <li
                  key={`${p.tier}-${p.speciesId}`}
                  className="rounded-xl border p-3 bg-white/70 dark:bg-slate-900/60"
                >
                  <div className="flex items-center gap-2">
                    <PixelImg src={p.pixelSprite} alt={`${p.name} sprite`} className="w-8 h-8" />
                    <div className="font-semibold">{p.name}</div>
                    <span className="ml-auto text-xs text-slate-500">Lv. {p.targetLevel}</span>
                  </div>
                  <div className="mt-2 text-sm">{p.rationale}</div>
                  <div className="mt-2 text-xs">Moves: {p.recommendedMoves.join(", ")}</div>
                  <div className="mt-1 text-xs">Get: {p.obtainable.route} • {p.obtainable.method}</div>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function TrainerView({ trainer }: { trainer: Trainer }) {
  const [teamIdx, setTeamIdx] = useState(0);
  const team = trainer.teams[teamIdx];
  const counterKey = `${trainer.id}:${team.id}`;
  const picks = COUNTERS[counterKey] || [];

  return (
  const [teamIdx, setTeamIdx] = useState(0);
  const team = trainer.teams[teamIdx];
  const counterKey = `${trainer.id}:${team.id}`;
  const picks = COUNTERS[counterKey] || [];

  return (
    <div className="mt-6">
      <div className="flex items-center gap-4">
        <PixelImg
          src={trainer.spriteUrl}
          alt={`${trainer.displayName} sprite`}
          className="w-16 h-16"
        />
        {trainer.artUrl && (
          <FallbackImg
            src={trainer.artUrl}
            alt={`${trainer.displayName} art`}
            className="w-24 h-24"
          />
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{trainer.displayName}</h2>
          <div className="text-sm text-slate-600">
            {trainer.location} • {trainer.game} • {trainer.format}
          </div>
          {trainer.prerequisites && (
            <div className="text-xs mt-1">Prereqs: {trainer.prerequisites.join(", ")}</div>
          )}
        </div>
        {trainer.badgeIconUrl && (
          <FallbackImg src={trainer.badgeIconUrl} alt="badge" className="w-10 h-10" />
        )}
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        {trainer.teams.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setTeamIdx(i)}
            className={cn(
              "px-3 py-1 rounded-full border text-sm",
              i === teamIdx ? "bg-indigo-600 text-white" : "bg-white/70 dark:bg-slate-900/60"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Team Order</h3>
        <TeamList party={team.party} />
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">How to Beat</h3>
        <CounterTiers picks={picks} />
      </div>
    </div>
  );
}

// ---------------- Self-tests ----------------
function SelfTests() {
  const results = useMemo(() => {
    const r: { name: string; ok: boolean; note?: string }[] = [];

    // Test 1: Placeholder format
    r.push({ name: "PLACEHOLDER prefix", ok: PLACEHOLDER.startsWith("data:image/svg+xml") });

    // Test 2: Encoded colors exist
    r.push({ name: "PLACEHOLDER URL-encoded colors", ok: PLACEHOLDER.includes("%23e5e7eb") && PLACEHOLDER.includes("%236b7280") });

    // Test 3: No newlines in placeholder string
    r.push({ name: "PLACEHOLDER single-line", ok: !/
/.test(PLACEHOLDER) });

    // Test 4: Kanto roles present and gym count = 8
    const kantoGyms = KANTO_TRAINERS.filter((t) => t.role === "gym");
    r.push({ name: "Kanto: 8 gyms present", ok: kantoGyms.length === 8 });

    // Test 5: Every gym has a badge icon URL
    r.push({ name: "Kanto gyms have badges", ok: kantoGyms.every((g) => !!g.badgeIconUrl) });

    return r;
  }, []);

  const failed = results.filter((x) => !x.ok);
  return (
  }, []);

  const failed = results.filter((x) => !x.ok);
  return (
    <div className="mt-8 rounded-lg border p-3 text-xs">
      <div className="font-semibold mb-2">Self-tests</div>
      <ul className="space-y-1">
        {results.map((t) => (
          <li key={t.name} className={t.ok ? "text-green-600" : "text-red-600"}>
            {t.ok ? "✓" : "✗"} {t.name}
          </li>
        ))}
      </ul>
      {failed.length === 0 ? (
        <div className="mt-2 text-green-600">All tests passed.</div>
      ) : (
        <div className="mt-2 text-red-600">{failed.length} test(s) failed. See console for details.</div>
      )}
    </div>
  );
}

// ---------------- Main App ----------------
export default function App() {
  const [region, setRegion] = useState<RegionId>("kanto");
  const [activeTrainer, setActiveTrainer] = useState<Trainer | null>(null);
  const trainers = useMemo(() => (region === "kanto" ? KANTO_TRAINERS : []), [region]);

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-slate-950 dark:to-slate-900">
      <header className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black tracking-tight">PokeStory Guide</h1>
        <p className="text-sm text-slate-600 mt-1">
          Pick a region. Open a Gym, Elite Four, Champion, or Rival. View team order and counters.
        </p>
      </header>

      <main className="max-w-6xl mx-auto mt-6">
        <RegionPicker
          value={region}
          onChange={(r) => {
            setRegion(r);
            setActiveTrainer(null);
          }}
        />

        {trainers.length === 0 ? (
          <div className="mt-6 p-4 rounded-xl border bg-amber-50">
            Trainers for {region} not loaded yet in this preview. The loader and image fallbacks are ready.
          </div>
        ) : (
          <>
            <TrainerGrid trainers={trainers} role="gym" title="Gym Leaders" onOpen={setActiveTrainer} />
            <TrainerGrid trainers={trainers} role="elite4" title="Elite Four" onOpen={setActiveTrainer} />
            <TrainerGrid trainers={trainers} role="champion" title="Champion" onOpen={setActiveTrainer} />
            <TrainerGrid trainers={trainers} role="rival" title="Rivals" onOpen={setActiveTrainer} />
            {activeTrainer && <TrainerView trainer={activeTrainer} />}
          </>
        )}

        <SelfTests />
      </main>

      <footer className="max-w-6xl mx-auto mt-10 pb-8 text-xs text-slate-500">
        Images load from public mirrors with built-in fallbacks. Final app will mirror to a CDN with citations.
      </footer>
    </div>
  );
}
