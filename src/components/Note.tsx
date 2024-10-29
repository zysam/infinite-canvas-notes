import { motion, useDragControls } from 'framer-motion';
import { RotateCw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NoteToolbar } from './NoteToolbar';
import { useState, useRef, useCallback } from 'react';

interface NoteProps {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
  rotation: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onChange: (id: string, content: string) => void;
  onMove: (id: string, deltaX: number, deltaY: number) => void;
  onColorChange: (id: string, color: string) => void;
  onRotationChange: (id: string, rotation: number) => void;
  onDeselect: () => void;
  onDelete: (id: string) => void;
}

interface TextFormat {
  start: number;
  end: number;
  format: string;
}

export function Note({
  id,
  content,
  x,
  y,
  color,
  rotation,
  isSelected,
  onSelect,
  onChange,
  onMove,
  onColorChange,
  onRotationChange,
  onDeselect,
  onDelete,
}: NoteProps) {
  const [formats, setFormats] = useState<TextFormat[]>([]);
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
  const rotateStartRef = useRef({ x: 0, y: 0, rotation: 0 });
  const isRotatingRef = useRef(false);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const controls = useDragControls()


  const handleFormatChange = (format: string) => {
    if (!selection || selection.start === selection.end) return;

    const textarea = document.querySelector(`textarea[data-note-id="${id}"]`) as HTMLTextAreaElement;
    if (!textarea) return;

    // Get the selected text
    const selectedText = content.slice(selection.start, selection.end);

    // Create the formatted text
    const formatSymbol = getFormatSymbol(format);
    const formattedText = `${formatSymbol}${selectedText}${formatSymbol}`;

    // Create the new content by replacing only the selected portion
    const newContent =
      content.slice(0, selection.start) +
      formattedText +
      content.slice(selection.end);

    // Update the content
    onChange(id, newContent);

    // Restore selection after format change
    setTimeout(() => {
      const newSelectionStart = selection.start;
      const newSelectionEnd = selection.end + (formatSymbol.length * 2);
      textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
      textarea.focus();
    }, 0);
  };

  const getFormatSymbol = (format: string): string => {
    switch (format) {
      case 'bold':
        return '**';
      case 'italic':
        return '*';
      case 'underline':
        return '_';
      default:
        return '';
    }
  };

  const getActiveFormats = () => {
    if (!selection) return [];
    return formats
      .filter(f => f.start === selection.start && f.end === selection.end)
      .map(f => f.format);
  };

  const handleSelect = () => {
    const textarea = document.querySelector(`textarea[data-note-id="${id}"]`) as HTMLTextAreaElement;
    if (textarea) {
      const newSelection = {
        start: textarea.selectionStart,
        end: textarea.selectionEnd,
      };

      // Only update selection if there's actually text selected
      if (newSelection.start !== newSelection.end) {
        setSelection(newSelection);
      }
    }
  };

  const handleRotateStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    isRotatingRef.current = true;  // 使 ref 而不是 setState
    const noteElement = e.currentTarget.parentElement as HTMLElement;

    rotateStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotation,
    };

    const handleRotateMove = (e: MouseEvent) => {
      if (!isRotatingRef.current) return;  // 使用 ref 检查状态

      const rect = noteElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const startAngle = Math.atan2(
        rotateStartRef.current.y - centerY,
        rotateStartRef.current.x - centerX
      );
      const currentAngle = Math.atan2(
        e.clientY - centerY,
        e.clientX - centerX
      );

      const deltaAngle = (currentAngle - startAngle) * (180 / Math.PI);
      const newRotation = rotateStartRef.current.rotation + deltaAngle;

      onRotationChange(id, newRotation);
    };

    const handleRotateEnd = () => {
      isRotatingRef.current = false;  // 使用 ref 而不是 setState
      document.removeEventListener('mousemove', handleRotateMove);
      document.removeEventListener('mouseup', handleRotateEnd);
    };

    document.addEventListener('mousemove', handleRotateMove);
    document.addEventListener('mouseup', handleRotateEnd);
  };

  // 修改拖拽处理函数
  const handleDrag = useCallback((e: any, info: any) => {
    if (e.type === 'pointerup') {
      onMove(id, info.offset.x, info.offset.y);
    }
  }, [id, onMove]);

  // 修改 onChange 处理函数，应用格式化
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    onChange(id, newContent);
  };


  return (
    <motion.div
      className={cn(
        "absolute p-4 rounded-lg shadow-lg min-w-[200px] min-h-[200px] flex flex-col",
        color,
        isSelected ? "ring-2 ring-blue-500" : ""
      )}
      style={{
        x,
        y,
        rotate: rotation,
        transformOrigin: 'center',
        touchAction: "none"
      }}
      drag={isSelected}
      dragMomentum={false}
      dragListener={false}
      dragControls={controls}
      onDragEnd={handleDrag}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {isSelected && (
        <>
          {/* 拖拽句柄 - 顶部区域 */}
          <div
            ref={dragHandleRef}
            className="absolute -top-1 left-0 right-0 h-4 cursor-move bg-transparent"
            onPointerDown={(e) => {
              console.log('drag handle down');
              // e.stopPropagation();
              controls.start(e);

              // isDraggingRef.current = true;
              // setIsListeningDrag(true);
              // onSelect(id);
            }}
          >
            {/* Add delete button */}
            {/* <button
              className="absolute right-2 top-2 p-1 hover:bg-red-100 rounded-md transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button> */}
          </div>

          <NoteToolbar
            className="note-toolbar" // 增加上边距以适应更高的拖拽句柄
            onFormatChange={handleFormatChange}
            onColorChange={(newColor) => onColorChange(id, newColor)}
            activeFormats={getActiveFormats()}
            currentColor={color}
            onDelete={() => onDelete(id)}
          />
        </>
      )}

      {/* 旋转按钮 */}
      {isSelected && (
        <button
          className="absolute -right-3 -bottom-3 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center cursor-move hover:bg-gray-50"
          onMouseDown={handleRotateStart}
          onClick={(e) => e.stopPropagation()}
        >
          <RotateCw className="w-3 h-3 text-gray-600" />
        </button>
      )}

      {/* 文本区域容器 */}
      <div
        className="flex-1 mt-2"
        onClick={(e) => e.stopPropagation()}
      // onPointerDown={(e) => {
      //   // 只有当点击发生在文本区域时才阻止事件传播
      //   if ((e.target as HTMLElement).tagName === 'TEXTAREA') {
      //     e.stopPropagation();
      //     console.log('textarea down');
      //     // isDraggingRef.current = false;
      //     // setIsListeningDrag(false);
      //   }
      // }}
      >
        <textarea
          data-note-id={id}
          className="w-full h-full min-h-[160px] bg-transparent resize-none focus:outline-none font-mono whitespace-pre-wrap"
          value={content}
          onChange={handleContentChange}
          onSelect={handleSelect}
          // onPointerDown={handlePointerDown}
          placeholder="Type your note here..."
          onClick={(e) => {
            e.stopPropagation();
            // console.log('textarea clicked');
            // handlePointerDown(e as unknown as React.PointerEvent);
            onSelect(id);
          }}
        // draggable={false}
        />
      </div>
    </motion.div>
  );
}
