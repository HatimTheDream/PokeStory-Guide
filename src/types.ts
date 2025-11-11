export type RegionId =
  | "kanto"
  | "johto"
  | "hoenn"
  | "sinnoh"
  | "unova"
  | "kalos"
  | "alola"
  | "galar"
  | "paldea";

export type Role = "gym" | "elite4" | "champion" | "rival";

export interface Region {
  id: RegionId;
  name: string;
  cover_images: string[];
  order_index: number;
}

export interface Trainer {
  id: string;
  region_id: RegionId;
  display_name: string;
  role: Role;
  game: string;
  badge_number?: number;
  sprite_urls: string[];
  art_urls?: string[];
  badge_icon_urls?: string[];
  location: string;
  prerequisites?: string[];
  battle_format: "singles" | "doubles" | "multis";
  order_index: number;
}

export interface TrainerTeam {
  id: string;
  trainer_id: string;
  label: string;
  order_index: number;
  version_tags: string[];
}

export interface PartyMember {
  id: string;
  team_id: string;
  species_id: number;
  name: string;
  level: number;
  types: string[];
  moves: string[];
  official_art_url: string;
  pixel_sprite_url: string;
  send_out_order: number;
}

export interface CounterStrategy {
  id: string;
  team_id: string;
  tier: "S" | "A" | "B";
  species_id: number;
  name: string;
  rationale: string;
  recommended_moves: string[];
  target_level: number;
  official_art_url: string;
  pixel_sprite_url: string;
  obtainable_route: string;
  obtainable_method: string;
}

export interface TrainerWithTeams extends Trainer {
  teams: TrainerTeam[];
}

export interface TeamWithParty extends TrainerTeam {
  party: PartyMember[];
  counters: CounterStrategy[];
}
