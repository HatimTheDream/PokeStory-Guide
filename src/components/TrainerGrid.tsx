import { PixelImg } from './ui/PixelImg';
import { FallbackImg } from './ui/FallbackImg';
import type { Trainer } from '../types';

interface TrainerGridProps {
  trainers: Trainer[];
  title: string;
  onOpen: (trainer: Trainer) => void;
}

export function TrainerGrid({ trainers, title, onOpen }: TrainerGridProps) {
  if (!trainers.length) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trainers.map((trainer) => (
          <button
            key={trainer.id}
            onClick={() => onOpen(trainer)}
            className="rounded-2xl border shadow hover:shadow-md p-4 text-left bg-white/80 dark:bg-slate-900/60 transition-shadow"
          >
            <div className="flex items-center gap-3">
              <PixelImg
                src={trainer.sprite_urls}
                alt={`${trainer.display_name} sprite`}
                className="w-12 h-12"
              />
              <div className="flex-1">
                {trainer.role === 'gym' && (
                  <div className="text-sm text-slate-500">Badge #{trainer.badge_number}</div>
                )}
                <div className="font-semibold">{trainer.display_name}</div>
                <div className="text-xs text-slate-600">{trainer.location}</div>
              </div>
              {trainer.badge_icon_urls && trainer.badge_icon_urls.length > 0 && (
                <FallbackImg src={trainer.badge_icon_urls} alt="badge" className="w-10 h-10" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
