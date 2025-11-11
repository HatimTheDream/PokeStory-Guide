import { PixelImg } from './ui/PixelImg';
import { FallbackImg } from './ui/FallbackImg';
import { TypeBadge } from './ui/TypeBadge';
import type { PartyMember } from '../types';

interface TeamListProps {
  party: PartyMember[];
}

export function TeamList({ party }: TeamListProps) {
  return (
    <ul className="grid md:grid-cols-2 gap-4">
      {party.map((pokemon, i) => (
        <li
          key={pokemon.id}
          className="rounded-2xl shadow p-4 bg-white/70 dark:bg-slate-900/60 border"
        >
          <div className="flex items-center gap-3">
            <PixelImg
              src={pokemon.pixel_sprite_url}
              alt={`${pokemon.name} sprite`}
              className="w-12 h-12"
            />
            <div className="flex-1">
              <div className="text-sm text-slate-500">
                #{i + 1} send-out • Lv.{pokemon.level}
              </div>
              <div className="text-lg font-semibold">{pokemon.name}</div>
              <div className="flex gap-2 mt-1 flex-wrap">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
            </div>
            <FallbackImg
              src={pokemon.official_art_url}
              alt={`${pokemon.name} art`}
              className="w-16 h-16"
            />
          </div>
          <div className="mt-3 text-sm">
            <div className="font-medium">Moves</div>
            <div className="flex flex-wrap gap-2 mt-1">
              {pokemon.moves.map((move) => (
                <span
                  key={move}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border text-xs"
                >
                  {move}
                </span>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
