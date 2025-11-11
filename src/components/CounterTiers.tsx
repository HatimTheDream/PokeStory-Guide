import { PixelImg } from './ui/PixelImg';
import type { CounterStrategy } from '../types';

interface CounterTiersProps {
  counters: CounterStrategy[];
}

export function CounterTiers({ counters }: CounterTiersProps) {
  const tiers: ('S' | 'A' | 'B')[] = ['S', 'A', 'B'];

  return (
    <div className="space-y-6">
      {tiers.map((tier) => {
        const tierCounters = counters.filter((c) => c.tier === tier);
        if (tierCounters.length === 0) return null;

        return (
          <section key={tier}>
            <h3 className="text-lg font-bold">{tier} Tier</h3>
            <ul className="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tierCounters.map((counter) => (
                <li
                  key={counter.id}
                  className="rounded-xl border p-3 bg-white/70 dark:bg-slate-900/60"
                >
                  <div className="flex items-center gap-2">
                    <PixelImg
                      src={counter.pixel_sprite_url}
                      alt={`${counter.name} sprite`}
                      className="w-8 h-8"
                    />
                    <div className="font-semibold">{counter.name}</div>
                    <span className="ml-auto text-xs text-slate-500">
                      Lv. {counter.target_level}
                    </span>
                  </div>
                  <div className="mt-2 text-sm">{counter.rationale}</div>
                  <div className="mt-2 text-xs">
                    <span className="font-medium">Moves:</span> {counter.recommended_moves.join(', ')}
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    <span className="font-medium">Get:</span> {counter.obtainable_route} • {counter.obtainable_method}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
