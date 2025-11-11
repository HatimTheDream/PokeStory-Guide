import { cn } from '../utils/cn';
import { FallbackImg } from './ui/FallbackImg';
import type { Region, RegionId } from '../types';

interface RegionPickerProps {
  regions: Region[];
  value: RegionId;
  onChange: (regionId: RegionId) => void;
}

export function RegionPicker({ regions, value, onChange }: RegionPickerProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Choose a Region</h2>
      <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => onChange(region.id)}
            className={cn(
              'relative rounded-2xl overflow-hidden border shadow hover:shadow-md text-left transition-all',
              value === region.id && 'ring-2 ring-blue-500'
            )}
            title={region.name}
          >
            <div className="h-24 w-full bg-slate-200">
              <FallbackImg
                src={region.cover_images}
                alt={region.name}
                className="h-24 w-full object-cover"
              />
            </div>
            <div className="p-3 font-semibold">{region.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
