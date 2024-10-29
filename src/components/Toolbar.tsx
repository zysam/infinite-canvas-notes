import { Plus, Minus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ToolbarProps {
  scale: number;
  onZoom: (delta: number) => void;
}

export function Toolbar({ scale, onZoom }: ToolbarProps) {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-full shadow-lg p-2 flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onZoom(-0.25)}
              className="rounded-full"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="px-2 flex items-center min-w-[60px] justify-center">
        {Math.round(scale * 100)}%
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onZoom(0.25)}
              className="rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}