import { useState, useEffect } from 'react';
import { RegionPicker } from './components/RegionPicker';
import { TrainerGrid } from './components/TrainerGrid';
import { TrainerView } from './components/TrainerView';
import { getRegions, getTrainersByRegion, getTrainerTeams } from './lib/database';
import type { Region, RegionId, Trainer, TrainerTeam, Role } from './types';

export default function App() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<RegionId>('kanto');
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [selectedTrainerTeams, setSelectedTrainerTeams] = useState<TrainerTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRegions = async () => {
      try {
        const regionsData = await getRegions();
        setRegions(regionsData);
      } catch (error) {
        console.error('Error loading regions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRegions();
  }, []);

  useEffect(() => {
    const loadTrainers = async () => {
      setLoading(true);
      try {
        const trainersData = await getTrainersByRegion(selectedRegion);
        setTrainers(trainersData);
        setSelectedTrainer(null);
        setSelectedTrainerTeams([]);
      } catch (error) {
        console.error('Error loading trainers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrainers();
  }, [selectedRegion]);

  const handleTrainerSelect = async (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    try {
      const teams = await getTrainerTeams(trainer.id);
      setSelectedTrainerTeams(teams);
    } catch (error) {
      console.error('Error loading trainer teams:', error);
    }
  };

  const filterTrainersByRole = (role: Role) =>
    trainers.filter((t) => t.role === role).sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black tracking-tight">PokeStory Guide</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Pick a region. Open a Gym, Elite Four, Champion, or Rival. View team order and counters.
        </p>
      </header>

      <main className="max-w-6xl mx-auto mt-6">
        {loading && regions.length === 0 ? (
          <div className="text-center py-8 text-slate-500">Loading regions...</div>
        ) : (
          <RegionPicker
            regions={regions}
            value={selectedRegion}
            onChange={(regionId) => {
              setSelectedRegion(regionId);
              setSelectedTrainer(null);
            }}
          />
        )}

        {loading && trainers.length === 0 ? (
          <div className="mt-6 text-center py-8 text-slate-500">Loading trainers...</div>
        ) : trainers.length === 0 ? (
          <div className="mt-6 p-4 rounded-xl border bg-amber-50 dark:bg-amber-900/20">
            No trainers available for this region yet. Data can be added through the database.
          </div>
        ) : (
          <>
            <TrainerGrid
              trainers={filterTrainersByRole('gym')}
              title="Gym Leaders"
              onOpen={handleTrainerSelect}
            />
            <TrainerGrid
              trainers={filterTrainersByRole('elite4')}
              title="Elite Four"
              onOpen={handleTrainerSelect}
            />
            <TrainerGrid
              trainers={filterTrainersByRole('champion')}
              title="Champion"
              onOpen={handleTrainerSelect}
            />
            <TrainerGrid
              trainers={filterTrainersByRole('rival')}
              title="Rivals"
              onOpen={handleTrainerSelect}
            />

            {selectedTrainer && selectedTrainerTeams.length > 0 && (
              <TrainerView trainer={selectedTrainer} teams={selectedTrainerTeams} />
            )}
          </>
        )}
      </main>

      <footer className="max-w-6xl mx-auto mt-10 pb-8 text-xs text-slate-500">
        Images load from public mirrors with built-in fallbacks. All data stored in Supabase.
      </footer>
    </div>
  );
}
