import { useState } from 'react';
import { format, formatDistance } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStore } from '@/store/useStore';
import { motion, Reorder } from 'framer-motion';

export function Sidebar() {
  const [newPageName, setNewPageName] = useState('');
  const [editingPage, setEditingPage] = useState<{ id: string; name: string } | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    pages,
    currentPageId,
    isSidebarOpen,
    addPage,
    setCurrentPage,
    renamePage,
    deletePage,
    toggleSidebar,
    reorderPages,
  } = useStore();

  const handleCreatePage = () => {
    if (newPageName.trim()) {
      addPage(newPageName.trim());
      setNewPageName('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleRenamePage = () => {
    if (editingPage && editingPage.name.trim()) {
      renamePage(editingPage.id, editingPage.name.trim());
      setEditingPage(null);
      setIsEditDialogOpen(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Notes</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Page</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Page name"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreatePage();
                  }}
                />
                <Button onClick={handleCreatePage}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="space-y-1 p-2">
            <Reorder.Group axis="y" values={pages} onReorder={reorderPages}>
              {pages.map((page) => (
                <Reorder.Item
                  key={page.id}
                  value={page}
                  dragListener={true}
                  className={cn(
                    'flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer',
                    currentPageId === page.id && 'bg-gray-100'
                  )}
                >
                  <div
                    className="flex items-center justify-between flex-1"
                    onClick={() => setCurrentPage(page.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{page.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatDistance(page.createdAt, new Date())}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPage({ id: page.id, name: page.name });
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePage(page.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        </ScrollArea>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'fixed left-0 top-1/2 -translate-y-1/2 z-50 rounded-l-none',
          isSidebarOpen && 'left-64'
        )}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Page name"
              value={editingPage?.name ?? ''}
              onChange={(e) =>
                setEditingPage(
                  editingPage ? { ...editingPage, name: e.target.value } : null
                )
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenamePage();
              }}
            />
            <Button onClick={handleRenamePage}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
