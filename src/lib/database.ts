import { supabase } from './supabase';
import type {
  Region,
  Trainer,
  TrainerTeam,
  PartyMember,
  CounterStrategy,
  RegionId,
  Role,
} from '../types';

export async function getRegions(): Promise<Region[]> {
  const { data, error } = await supabase
    .from('regions')
    .select('*')
    .order('order_index');

  if (error) throw error;
  return data || [];
}

export async function getTrainersByRegion(regionId: RegionId): Promise<Trainer[]> {
  const { data, error } = await supabase
    .from('trainers')
    .select('*')
    .eq('region_id', regionId)
    .order('order_index');

  if (error) throw error;
  return data || [];
}

export async function getTrainersByRole(regionId: RegionId, role: Role): Promise<Trainer[]> {
  const { data, error } = await supabase
    .from('trainers')
    .select('*')
    .eq('region_id', regionId)
    .eq('role', role)
    .order('order_index');

  if (error) throw error;
  return data || [];
}

export async function getTrainerTeams(trainerId: string): Promise<TrainerTeam[]> {
  const { data, error } = await supabase
    .from('trainer_teams')
    .select('*')
    .eq('trainer_id', trainerId)
    .order('order_index');

  if (error) throw error;
  return data || [];
}

export async function getPartyMembers(teamId: string): Promise<PartyMember[]> {
  const { data, error } = await supabase
    .from('party_members')
    .select('*')
    .eq('team_id', teamId)
    .order('send_out_order');

  if (error) throw error;
  return data || [];
}

export async function getCounterStrategies(teamId: string): Promise<CounterStrategy[]> {
  const { data, error } = await supabase
    .from('counter_strategies')
    .select('*')
    .eq('team_id', teamId)
    .order('tier', { ascending: true });

  if (error) throw error;
  return data || [];
}
