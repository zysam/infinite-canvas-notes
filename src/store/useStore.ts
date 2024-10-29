import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Note {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
  rotation: number;
}

export interface Page {
  id: string;
  name: string;
  notes: Note[];
  createdAt: number;
}

interface State {
  pages: Page[];
  currentPageId: string | null;
  isSidebarOpen: boolean;
  addPage: (name: string) => void;
  setCurrentPage: (id: string) => void;
  renamePage: (id: string, name: string) => void;
  deletePage: (id: string) => void;
  addNote: (pageId: string, note: Note) => void;
  updateNote: (pageId: string, noteId: string, updates: Partial<Note>) => void;
  deleteNote: (pageId: string, noteId: string) => void;
  toggleSidebar: () => void;
  reorderPages: (newOrder: Page[]) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      pages: [],
      currentPageId: null,
      isSidebarOpen: true,

      addPage: (name) => set((state) => {
        const newPage: Page = {
          id: Date.now().toString(),
          name,
          notes: [],
          createdAt: Date.now(),
        };
        // 只在没有页面时才设置 currentPageId
        return {
          pages: [...state.pages, newPage],
          currentPageId: state.currentPageId === null ? newPage.id : state.currentPageId,
        };
      }),

      reorderPages: (newOrder) => set({ pages: newOrder }),

      setCurrentPage: (id) => set({ currentPageId: id }),

      renamePage: (id, name) => set((state) => ({
        pages: state.pages.map((page) =>
          page.id === id ? { ...page, name } : page
        ),
      })),

      deletePage: (id) => set((state) => ({
        pages: state.pages.filter((page) => page.id !== id),
        currentPageId:
          state.currentPageId === id
            ? state.pages[0]?.id ?? null
            : state.currentPageId,
      })),

      addNote: (pageId, note) => set((state) => ({
        pages: state.pages.map((page) =>
          page.id === pageId
            ? { ...page, notes: [...page.notes, note] }
            : page
        ),
      })),

      updateNote: (pageId, noteId, updates) => 
        set((state) => {
          const pageIndex = state.pages.findIndex(page => page.id === pageId);
          if (pageIndex === -1) return state; // 如果页面不存在，返回原状态
          
          const page = state.pages[pageIndex];
          const noteIndex = page.notes.findIndex(note => note.id === noteId);
          if (noteIndex === -1) return state; // 如果笔记不存在，返回原状态

          const newPages = [...state.pages];
          newPages[pageIndex] = {
            ...page,
            notes: [
              ...page.notes.slice(0, noteIndex),
              { ...page.notes[noteIndex], ...updates },
              ...page.notes.slice(noteIndex + 1)
            ]
          };
          
          return { pages: newPages };
        }),

      deleteNote: (pageId, noteId) => set((state) => ({
        pages: state.pages.map((page) =>
          page.id === pageId
            ? {
                ...page,
                notes: page.notes.filter((note) => note.id !== noteId),
              }
            : page
        ),
      })),

      toggleSidebar: () => set((state) => ({
        isSidebarOpen: !state.isSidebarOpen,
      })),
    }),
    {
      name: 'canvas-storage',
      // 添加序列化配置
      // serialize: (state) => JSON.stringify(state),
      // deserialize: (str) => JSON.parse(str),
      // 可以添加部分状态持久化
      partialize: (state) => ({
        pages: state.pages,
        currentPageId: state.currentPageId,
        isSidebarOpen: state.isSidebarOpen,
        // 不持久化 currentPageId 和 isSidebarOpen
      }),
    }
  )
);
