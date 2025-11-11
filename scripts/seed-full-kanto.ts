import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedFullKanto() {
  console.log('Seeding full Kanto region data...');

  const region = {
    id: 'kanto',
    name: 'Kanto',
    cover_images: [
      'https://archives.bulbagarden.net/media/upload/0/0a/RB_Vermilion_City.png',
      'https://archives.bulbagarden.net/media/upload/8/8d/FRLG_Pallet_Town.png'
    ],
    order_index: 0,
  };

  await supabase.from('regions').upsert(region, { onConflict: 'id' });

  const trainers = [
    {
      id: 'kanto-brock-rb',
      region_id: 'kanto',
      display_name: 'Brock',
      role: 'gym',
      game: 'Red/Blue',
      badge_number: 1,
      sprite_urls: [
        'https://archives.bulbagarden.net/media/upload/6/6d/Spr_FRLG_Brock.png',
        'https://archives.bulbagarden.net/media/upload/7/72/Spr_RG_Brock.png'
      ],
      art_urls: ['https://archives.bulbagarden.net/media/upload/8/8b/Lets_Go_Pikachu_Eevee_Brock.png'],
      badge_icon_urls: ['https://archives.bulbagarden.net/media/upload/0/0b/Boulder_Badge.png'],
      location: 'Pewter City Gym',
      prerequisites: ['Reach Pewter City'],
      battle_format: 'singles',
      order_index: 1,
    },
    {
      id: 'kanto-misty-rb',
      region_id: 'kanto',
      display_name: 'Misty',
      role: 'gym',
      game: 'Red/Blue',
      badge_number: 2,
      sprite_urls: [
        'https://archives.bulbagarden.net/media/upload/1/1d/Spr_FRLG_Misty.png',
        'https://archives.bulbagarden.net/media/upload/1/1e/Spr_RG_Misty.png'
      ],
      art_urls: ['https://archives.bulbagarden.net/media/upload/2/2d/Lets_Go_Pikachu_Eevee_Misty.png'],
      badge_icon_urls: ['https://archives.bulbagarden.net/media/upload/9/95/Cascade_Badge.png'],
      location: 'Cerulean City Gym',
      prerequisites: ['Defeat Brock', 'Reach Cerulean City'],
      battle_format: 'singles',
      order_index: 2,
    },
  ];

  for (const trainer of trainers) {
    await supabase.from('trainers').upsert(trainer, { onConflict: 'id' });
  }

  const teams = [
    {
      id: 'kanto-brock-rb:rb-first',
      trainer_id: 'kanto-brock-rb',
      label: 'First battle (RB)',
      order_index: 1,
      version_tags: ['red', 'blue'],
    },
    {
      id: 'kanto-misty-rb:rb-first',
      trainer_id: 'kanto-misty-rb',
      label: 'First battle (RB)',
      order_index: 1,
      version_tags: ['red', 'blue'],
    },
  ];

  for (const team of teams) {
    await supabase.from('trainer_teams').upsert(team, { onConflict: 'id' });
  }

  const brockParty = [
    {
      team_id: 'kanto-brock-rb:rb-first',
      species_id: 74,
      name: 'Geodude',
      level: 12,
      types: ['Rock', 'Ground'],
      moves: ['Tackle', 'Defense Curl'],
      official_art_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/74.png',
      pixel_sprite_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png',
      send_out_order: 0,
    },
    {
      team_id: 'kanto-brock-rb:rb-first',
      species_id: 95,
      name: 'Onix',
      level: 14,
      types: ['Rock', 'Ground'],
      moves: ['Tackle', 'Screech', 'Bind'],
      official_art_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png',
      pixel_sprite_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png',
      send_out_order: 1,
    },
  ];

  const mistyParty = [
    {
      team_id: 'kanto-misty-rb:rb-first',
      species_id: 120,
      name: 'Staryu',
      level: 18,
      types: ['Water'],
      moves: ['Tackle', 'Water Gun'],
      official_art_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/120.png',
      pixel_sprite_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/120.png',
      send_out_order: 0,
    },
    {
      team_id: 'kanto-misty-rb:rb-first',
      species_id: 121,
      name: 'Starmie',
      level: 21,
      types: ['Water', 'Psychic'],
      moves: ['Tackle', 'Water Gun', 'BubbleBeam'],
      official_art_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/121.png',
      pixel_sprite_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/121.png',
      send_out_order: 1,
    },
  ];

  for (const member of [...brockParty, ...mistyParty]) {
    await supabase.from('party_members').insert(member);
  }

  const brockCounters = [
    {
      team_id: 'kanto-brock-rb:rb-first',
      tier: 'S',
      species_id: 7,
      name: 'Squirtle',
      rationale: 'Water STAB destroys Rock/Ground early.',
      recommended_moves: ['Water Gun', 'Bubble'],
      target_level: 12,
      official_art_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
      pixel_sprite_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
      obtainable_route: 'Starter',
      obtainable_method: 'gift',
    },
    {
      team_id: 'kanto-brock-rb:rb-first',
      tier: 'A',
      species_id: 35,
      name: 'Clefairy',
      rationale: 'Sing + TM Water Gun cheese.',
      recommended_moves: ['Sing', 'Water Gun'],
      target_level: 13,
      official_art_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/35.png',
      pixel_sprite_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png',
      obtainable_route: 'Mt. Moon',
      obtainable_method: 'cave',
    },
    {
      team_id: 'kanto-brock-rb:rb-first',
      tier: 'B',
      species_id: 1,
      name: 'Bulbasaur',
      rationale: 'Resists Rock moves and hits SE with Vine Whip.',
      recommended_moves: ['Vine Whip', 'Leech Seed'],
      target_level: 13,
      official_art_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      pixel_sprite_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      obtainable_route: 'Starter',
      obtainable_method: 'gift',
    },
  ];

  const mistyCounters = [
    {
      team_id: 'kanto-misty-rb:rb-first',
      tier: 'S',
      species_id: 25,
      name: 'Pikachu',
      rationale: 'Electric STAB sweeps Water team. Early in Viridian Forest.',
      recommended_moves: ['ThunderShock', 'Thunder Wave'],
      target_level: 20,
      official_art_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      pixel_sprite_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      obtainable_route: 'Viridian Forest',
      obtainable_method: 'grass',
    },
    {
      team_id: 'kanto-misty-rb:rb-first',
      tier: 'A',
      species_id: 2,
      name: 'Ivysaur',
      rationale: 'Grass STAB and good bulk vs Starmie.',
      recommended_moves: ['Razor Leaf', 'Sleep Powder'],
      target_level: 22,
      official_art_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png',
      pixel_sprite_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
      obtainable_route: 'Evolve Bulbasaur',
      obtainable_method: 'level',
    },
  ];

  for (const counter of [...brockCounters, ...mistyCounters]) {
    await supabase.from('counter_strategies').insert(counter);
  }

  console.log('✓ Kanto seed complete! Added Brock and Misty with full data.');
}

seedFullKanto().catch(console.error);
