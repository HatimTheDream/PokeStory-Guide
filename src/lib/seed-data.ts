import { supabase } from './supabase';

export async function seedDatabase() {
  console.log('Starting database seed...');

  const regions = [
    { id: 'kanto', name: 'Kanto', cover_images: [
      'https://archives.bulbagarden.net/media/upload/0/0a/RB_Vermilion_City.png',
      'https://archives.bulbagarden.net/media/upload/8/8d/FRLG_Pallet_Town.png'
    ], order_index: 0 },
  ];

  console.log('Inserting regions...');
  const { error: regionError } = await supabase.from('regions').upsert(regions, { onConflict: 'id' });
  if (regionError) console.error('Region error:', regionError);

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
  ];

  console.log('Inserting trainers...');
  const { error: trainerError } = await supabase.from('trainers').upsert(trainers, { onConflict: 'id' });
  if (trainerError) console.error('Trainer error:', trainerError);

  const teams = [
    {
      id: 'kanto-brock-rb:rb-first',
      trainer_id: 'kanto-brock-rb',
      label: 'First battle (RB)',
      order_index: 1,
      version_tags: ['red', 'blue'],
    },
  ];

  console.log('Inserting teams...');
  const { error: teamError } = await supabase.from('trainer_teams').upsert(teams, { onConflict: 'id' });
  if (teamError) console.error('Team error:', teamError);

  const partyMembers = [
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

  console.log('Inserting party members...');
  for (const member of partyMembers) {
    const { error } = await supabase.from('party_members').insert(member);
    if (error) console.error('Party member error:', error);
  }

  const counters = [
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
  ];

  console.log('Inserting counter strategies...');
  for (const counter of counters) {
    const { error } = await supabase.from('counter_strategies').insert(counter);
    if (error) console.error('Counter strategy error:', error);
  }

  console.log('Database seed complete!');
}
