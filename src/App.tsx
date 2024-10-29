import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Toolbar } from '@/components/Toolbar';
import { Note } from '@/components/Note';
import { EmptyState } from '@/components/EmptyState';
import { Sidebar } from '@/components/Sidebar';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils'

const colors = [
  'bg-yellow-100',
  'bg-pink-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-purple-100',
];

function App() {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    pages,
    currentPageId,
    isSidebarOpen,
    addPage,
    addNote,
    updateNote,
    deleteNote,
  } = useStore();

  useEffect(() => {
    if (pages.length === 0) {
      addPage('Untitled Page');
    }
  }, [pages.length, addPage]);

  console.log(pages);

  const currentPage = pages.find(page => page.id === currentPageId);
  const notes = currentPage?.notes ?? [];

  const handleAddNote = useCallback((e: React.MouseEvent) => {
    if (containerRef.current && currentPageId) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      
      const newNote = {
        id: Date.now().toString(),
        content: '',
        x,
        y,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: 0,
      };
      
      addNote(currentPageId, newNote);
      setSelectedNote(newNote.id);
    }
  }, [scale, currentPageId, addNote]);

  const handleDeleteNote = (noteId: string) => {
    if (!currentPageId) return;
    deleteNote(currentPageId, noteId);
  };
  const handleNoteChange = (id: string, content: string) => {
    if (currentPageId) {
      updateNote(currentPageId, id, { content });
    }
  };

  const handleNoteMove = (id: string, deltaX: number, deltaY: number) => {
    if (currentPageId) {
      const note = notes.find(n => n.id === id);
      if (note) {
        updateNote(currentPageId, id, {
          x: note.x + deltaX / scale,
          y: note.y + deltaY / scale,
        });
      }
    }
  };

  const handleColorChange = (id: string, color: string) => {
    if (currentPageId) {
      updateNote(currentPageId, id, { color });
    }
  };

  const handleRotationChange = (id: string, rotation: number) => {
    if (currentPageId) {
      updateNote(currentPageId, id, { rotation });
    }
  };

  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(0.25, prev + delta), 2));
  };

  const handleDeselectNote = () => {
    setSelectedNote(null);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-neutral-50 relative">
      <Sidebar />
      
      <main
        className={cn(
          "h-full transition-all duration-300",
          isSidebarOpen && "ml-64"
        )}
        onClick={handleDeselectNote}
      >
        <Toolbar scale={scale} onZoom={handleZoom} />

        <motion.div
          ref={containerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{
            x,
            y,
            scale,
          }}
          drag={!selectedNote}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDoubleClick={(e) => {
            if (!isDragging && e.target === containerRef.current) {
              handleAddNote(e);
            }
          }}
        >
          {notes.map((note) => (
            <Note
              key={note.id}
              {...note}
              isSelected={selectedNote === note.id}
              onSelect={setSelectedNote}
              onDeselect={handleDeselectNote}
              onChange={handleNoteChange}
              onMove={handleNoteMove}
              onColorChange={handleColorChange}
              onRotationChange={handleRotationChange}
              onDelete={handleDeleteNote}
            />
          ))}
        </motion.div>

        {notes.length === 0 && <EmptyState />}
      </main>
    </div>
  );
}

export default App;
