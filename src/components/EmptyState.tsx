import { MousePointerClick } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-neutral-400 pointer-events-none">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <MousePointerClick className="h-12 w-12 animate-pulse" />
        </div>
        <p className="text-lg">Double-click anywhere to add a note</p>
        <p className="text-sm">Drag the canvas to move around</p>
      </div>
    </div>
  );
}