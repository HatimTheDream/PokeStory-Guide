import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';
import { PixelImg } from './ui/PixelImg';
import { FallbackImg } from './ui/FallbackImg';
import { TeamList } from './TeamList';
import { CounterTiers } from './CounterTiers';
import { getPartyMembers, getCounterStrategies } from '../lib/database';
import type { Trainer, TrainerTeam, PartyMember, CounterStrategy } from '../types';

interface TrainerViewProps {
  trainer: Trainer;
  teams: TrainerTeam[];
}

export function TrainerView({ trainer, teams }: TrainerViewProps) {
  const [teamIdx, setTeamIdx] = useState(0);
  const [party, setParty] = useState<PartyMember[]>([]);
  const [counters, setCounters] = useState<CounterStrategy[]>([]);
  const [loading, setLoading] = useState(true);

  const currentTeam = teams[teamIdx];

  useEffect(() => {
    if (!currentTeam) return;

    const loadTeamData = async () => {
      setLoading(true);
      try {
        const [partyData, countersData] = await Promise.all([
          getPartyMembers(currentTeam.id),
          getCounterStrategies(currentTeam.id),
        ]);
        setParty(partyData);
        setCounters(countersData);
      } catch (error) {
        console.error('Error loading team data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [currentTeam]);

  if (!currentTeam) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-4">
        <PixelImg
          src={trainer.sprite_urls}
          alt={`${trainer.display_name} sprite`}
          className="w-16 h-16"
        />
        {trainer.art_urls && trainer.art_urls.length > 0 && (
          <FallbackImg
            src={trainer.art_urls}
            alt={`${trainer.display_name} art`}
            className="w-24 h-24"
          />
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{trainer.display_name}</h2>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {trainer.location} • {trainer.game} • {trainer.battle_format}
          </div>
          {trainer.prerequisites && trainer.prerequisites.length > 0 && (
            <div className="text-xs mt-1 text-slate-500">
              Prereqs: {trainer.prerequisites.join(', ')}
            </div>
          )}
        </div>
        {trainer.badge_icon_urls && trainer.badge_icon_urls.length > 0 && (
          <FallbackImg src={trainer.badge_icon_urls} alt="badge" className="w-10 h-10" />
        )}
      </div>

      {teams.length > 1 && (
        <div className="mt-4 flex gap-2 flex-wrap">
          {teams.map((team, i) => (
            <button
              key={team.id}
              onClick={() => setTeamIdx(i)}
              className={cn(
                'px-3 py-1 rounded-full border text-sm transition-colors',
                i === teamIdx
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              {team.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="mt-4 text-center py-8 text-slate-500">Loading team data...</div>
      ) : (
        <>
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Team Order</h3>
            <TeamList party={party} />
          </div>

          {counters.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">How to Beat</h3>
              <CounterTiers counters={counters} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
