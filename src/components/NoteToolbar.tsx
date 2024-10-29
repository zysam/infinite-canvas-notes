import { Bold, Italic, Underline, Palette, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface NoteToolbarProps {
  onFormatChange: (format: string) => void;
  onColorChange: (color: string) => void;
  activeFormats: string[];
  currentColor: string;
  onDelete: () => void;
  className?: string;
}

const colors = [
  { name: 'Yellow', value: 'bg-yellow-100' },
  { name: 'Pink', value: 'bg-pink-100' },
  { name: 'Blue', value: 'bg-blue-100' },
  { name: 'Green', value: 'bg-green-100' },
  { name: 'Purple', value: 'bg-purple-100' },
];

export function NoteToolbar(opts: NoteToolbarProps) {
  const { onFormatChange, onColorChange, activeFormats, currentColor, onDelete, className } = opts;
  return (
    <div className={cn("absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-1.5 flex gap-1", className)}>
      <Button
        variant="ghost"
        size="icon"
        className={cn("rounded-full h-8 w-8", activeFormats.includes('bold') && "bg-neutral-100")}
        onClick={() => onFormatChange('bold')}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn("rounded-full h-8 w-8", activeFormats.includes('italic') && "bg-neutral-100")}
        onClick={() => onFormatChange('italic')}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn("rounded-full h-8 w-8", activeFormats.includes('underline') && "bg-neutral-100")}
        onClick={() => onFormatChange('underline')}
      >
        <Underline className="h-4 w-4" />
      </Button>

      {/* <div className="w-px h-8 bg-neutral-200 mx-1" /> */}
      <Separator orientation="vertical" className="h-8" />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <Palette className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="grid grid-cols-5 gap-1">
            {colors.map((color) => (
              <button
                key={color.value}
                className={cn(
                  "w-8 h-8 rounded-full",
                  color.value,
                  currentColor === color.value && "ring-2 ring-blue-500"
                )}
                onClick={() => onColorChange(color.value)}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <Separator orientation="vertical" className="h-8" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">

          <DropdownMenuItem
            className="text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              // deletePage(page.id);
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}