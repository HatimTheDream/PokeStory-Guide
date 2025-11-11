/*
  # PokeStory Guide Database Schema

  ## Overview
  Creates the complete database schema for the PokeStory Guide application,
  including regions, trainers, teams, party members, and counter strategies.

  ## Tables Created

  ### 1. regions
  - id (text, primary key): Region identifier (e.g., "kanto", "johto")
  - name (text): Display name
  - cover_images (text[]): Array of fallback image URLs
  - order_index (int): Display order
  - created_at (timestamptz)

  ### 2. trainers
  - id (text, primary key): Unique trainer identifier
  - region_id (text, foreign key): References regions
  - display_name (text): Trainer's display name
  - role (text): gym, elite4, champion, or rival
  - game (text): Game version (e.g., "Red/Blue")
  - badge_number (int, nullable): For gym leaders
  - sprite_urls (text[]): Fallback pixel sprite URLs
  - art_urls (text[], nullable): Fallback official art URLs
  - badge_icon_urls (text[], nullable): Badge icons for gym leaders
  - location (text): In-game location
  - prerequisites (text[], nullable): Array of requirement strings
  - battle_format (text): singles, doubles, or multis
  - order_index (int): Display order within category
  - created_at (timestamptz)

  ### 3. trainer_teams
  - id (text, primary key): Unique team identifier
  - trainer_id (text, foreign key): References trainers
  - label (text): Team label (e.g., "First battle (RB)")
  - order_index (int): Display order
  - version_tags (text[]): Version identifiers
  - created_at (timestamptz)

  ### 4. party_members
  - id (uuid, primary key): Auto-generated
  - team_id (text, foreign key): References trainer_teams
  - species_id (int): Pokemon species ID
  - name (text): Pokemon name
  - level (int): Pokemon level
  - types (text[]): Type array
  - moves (text[]): Move array
  - official_art_url (text): Official artwork URL
  - pixel_sprite_url (text): Pixel sprite URL
  - send_out_order (int): Order in battle
  - created_at (timestamptz)

  ### 5. counter_strategies
  - id (uuid, primary key): Auto-generated
  - team_id (text, foreign key): References trainer_teams
  - tier (text): S, A, or B
  - species_id (int): Pokemon species ID
  - name (text): Pokemon name
  - rationale (text): Strategy explanation
  - recommended_moves (text[]): Move recommendations
  - target_level (int): Suggested level
  - official_art_url (text): Official artwork URL
  - pixel_sprite_url (text): Pixel sprite URL
  - obtainable_route (text): Where to find
  - obtainable_method (text): How to obtain
  - created_at (timestamptz)

  ## Security
  - All tables have RLS enabled
  - Public read access for all data (this is reference data)
  - No write access from client (data managed by admins)
*/

-- Create regions table
CREATE TABLE IF NOT EXISTS regions (
  id text PRIMARY KEY,
  name text NOT NULL,
  cover_images text[] NOT NULL DEFAULT '{}',
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view regions"
  ON regions FOR SELECT
  TO public
  USING (true);

-- Create trainers table
CREATE TABLE IF NOT EXISTS trainers (
  id text PRIMARY KEY,
  region_id text NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('gym', 'elite4', 'champion', 'rival')),
  game text NOT NULL,
  badge_number int,
  sprite_urls text[] NOT NULL DEFAULT '{}',
  art_urls text[] DEFAULT '{}',
  badge_icon_urls text[] DEFAULT '{}',
  location text NOT NULL,
  prerequisites text[] DEFAULT '{}',
  battle_format text NOT NULL CHECK (battle_format IN ('singles', 'doubles', 'multis')),
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view trainers"
  ON trainers FOR SELECT
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_trainers_region ON trainers(region_id);
CREATE INDEX IF NOT EXISTS idx_trainers_role ON trainers(role);

-- Create trainer_teams table
CREATE TABLE IF NOT EXISTS trainer_teams (
  id text PRIMARY KEY,
  trainer_id text NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  label text NOT NULL,
  order_index int NOT NULL DEFAULT 0,
  version_tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trainer_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view trainer teams"
  ON trainer_teams FOR SELECT
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_trainer_teams_trainer ON trainer_teams(trainer_id);

-- Create party_members table
CREATE TABLE IF NOT EXISTS party_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id text NOT NULL REFERENCES trainer_teams(id) ON DELETE CASCADE,
  species_id int NOT NULL,
  name text NOT NULL,
  level int NOT NULL,
  types text[] NOT NULL DEFAULT '{}',
  moves text[] NOT NULL DEFAULT '{}',
  official_art_url text NOT NULL,
  pixel_sprite_url text NOT NULL,
  send_out_order int NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE party_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view party members"
  ON party_members FOR SELECT
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_party_members_team ON party_members(team_id);
CREATE INDEX IF NOT EXISTS idx_party_members_order ON party_members(team_id, send_out_order);

-- Create counter_strategies table
CREATE TABLE IF NOT EXISTS counter_strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id text NOT NULL REFERENCES trainer_teams(id) ON DELETE CASCADE,
  tier text NOT NULL CHECK (tier IN ('S', 'A', 'B')),
  species_id int NOT NULL,
  name text NOT NULL,
  rationale text NOT NULL,
  recommended_moves text[] NOT NULL DEFAULT '{}',
  target_level int NOT NULL,
  official_art_url text NOT NULL,
  pixel_sprite_url text NOT NULL,
  obtainable_route text NOT NULL,
  obtainable_method text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE counter_strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view counter strategies"
  ON counter_strategies FOR SELECT
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_counter_strategies_team ON counter_strategies(team_id);
CREATE INDEX IF NOT EXISTS idx_counter_strategies_tier ON counter_strategies(team_id, tier);
