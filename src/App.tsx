import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, doc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Character } from './types';
import { Header } from './components/Header';
import { MoonBanner } from './components/MoonBanner';
import { SearchBar } from './components/SearchBar';
import { CharacterList } from './components/CharacterList';
import { CharacterDetailModal } from './components/CharacterDetailModal';
import { AdminCharacterModal } from './components/AdminCharacterModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminZoneModal } from './components/AdminZoneModal';
import { DreamyBackground } from './components/DreamyBackground';
import { playDreamyChime } from './lib/utils';
import { Shield, PlusCircle } from 'lucide-react';

function MainApp() {
  const { isAdmin, user, login } = useAuth();

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Modals & Active Views
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [characterToEdit, setCharacterToEdit] = useState<Character | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isAdminZoneOpen, setIsAdminZoneOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Real-time Firestore sync of characters
  useEffect(() => {
    setLoading(true);
    const charCollection = collection(db, 'characters');
    const q = query(charCollection);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Character[] = [];

        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Character);
        });

        // Sort newest first
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setCharacters(list);
        setLoading(false);

        // Check if there is a character in URL query params on initial load
        const urlParams = new URLSearchParams(window.location.search);
        const charIdFromUrl = urlParams.get('character');

        if (charIdFromUrl) {
          const found = list.find((c) => c.id === charIdFromUrl);

          if (found) {
            setSelectedCharacter(found);
            document.title = `${found.name} | Giấc Mộng Dưới Trăng`;
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'characters');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Update URL and Title when selected character changes
  const handleSelectCharacter = (character: Character) => {
    if (soundEnabled) playDreamyChime('open');

    setSelectedCharacter(character);
    document.title = `${character.name} | Giấc Mộng Dưới Trăng`;

    const url = new URL(window.location.href);
    url.searchParams.set('character', character.id);
    window.history.pushState({}, '', url.toString());
  };

  const handleCloseCharacterDetail = () => {
    if (soundEnabled) playDreamyChime('click');

    setSelectedCharacter(null);
    document.title = 'GIẤC MỘNG DƯỚI TRĂNG';

    const url = new URL(window.location.href);
    url.searchParams.delete('character');
    window.history.pushState({}, '', url.toString());
  };

  // Open Add Character Modal
  const handleOpenAddCharacter = () => {
    setCharacterToEdit(null);
    setIsAddEditModalOpen(true);
  };

  // Open Edit Character Modal
  const handleOpenEditCharacter = (character: Character) => {
    setCharacterToEdit(character);
    setIsAddEditModalOpen(true);
  };

  // Open Delete Confirmation Modal
  const handleOpenDeleteModal = (character: Character) => {
    setCharacterToDelete(character);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete Action
  const handleConfirmDelete = async () => {
    if (!characterToDelete) return;

    setDeleting(true);

    try {
      if (soundEnabled) playDreamyChime('click');

      await deleteDoc(doc(db, 'characters', characterToDelete.id));

      if (selectedCharacter?.id === characterToDelete.id) {
        handleCloseCharacterDetail();
      }

      setIsDeleteModalOpen(false);
      setCharacterToDelete(null);
    } catch (error) {
      console.error('Error deleting character:', error);

      handleFirestoreError(
        error,
        OperationType.DELETE,
        `characters/${characterToDelete.id}`
      );
    } finally {
      setDeleting(false);
    }
  };

  // Extract all distinct hashtags
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();

    characters.forEach((char) => {
      if (char.hashtags) {
        char.hashtags.split(',').forEach((t) => {
          const cleaned = t.trim().replace(/^#/, '');

          if (cleaned) {
            tagsSet.add(cleaned);
          }
        });
      }
    });

    return Array.from(tagsSet);
  }, [characters]);

  return (
    <div className="min-h-screen flex flex-col relative bg-[#FFFDF7] text-[#31465A] font-sans selection:bg-[#D9F0FF] selection:text-[#31465A]">
      {/* Dreamy ambient background with moonlight glow & stars */}
      <DreamyBackground />

      {/* Top Header */}
      <Header
        onOpenAdmin={() => setIsAdminZoneOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAddCharacter={handleOpenAddCharacter}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Admin Floating Banner Bar if Admin */}
      {isAdmin && (
        <div className="w-full bg-[#D9F0FF]/70 backdrop-blur-sm border-b border-[#89B9E6]/30 py-2.5 px-4 z-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2 text-[#31465A] font-semibold">
              <Shield className="w-3.5 h-3.5 text-[#89B9E6]" />

              <span>
                ☾ Đang đăng nhập:{' '}
                <strong className="text-[#31465A]">
                  Quản Trị Viên (Moon)
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAddCharacter}
                className="px-3.5 py-1.5 rounded-full bg-[#C7DFA3] hover:bg-[#b7d18d] text-[#31465A] font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Thêm Nhân Vật Mới</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 z-10 pb-12">
        {/* Poetic Greeting & Slogan Banner */}
        <MoonBanner />

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          availableTags={availableTags}
        />

        {/* Characters Grid & List */}
        <CharacterList
          characters={characters}
          loading={loading}
          searchQuery={searchQuery}
          selectedTag={selectedTag}
          onSelectCharacter={handleSelectCharacter}
          onEditCharacter={handleOpenEditCharacter}
          onDeleteCharacter={handleOpenDeleteModal}
          onAddNew={handleOpenAddCharacter}
          isAdmin={isAdmin}
        />
      </main>

      {/* Blue Matcha Footer */}
      <footer className="h-16 flex items-center justify-between px-6 sm:px-12 z-10 border-t border-[#89B9E6]/25 bg-[#D9F0FF]/45 backdrop-blur-md">
        <div className="text-xs text-[#31465A]/55 tracking-widest uppercase font-medium">
          © 2024 GIẤC MỘNG DƯỚI TRĂNG
        </div>

        <div className="flex items-center gap-4">
          <div
            onClick={() => {
              if (isAdmin) {
                setIsAdminZoneOpen(true);
              } else if (!user) {
                login();
              }
            }}
            className="group cursor-pointer flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-[#C7DFA3] rounded-full group-hover:bg-[#89B9E6] transition-colors" />

            <span className="text-xs font-semibold text-[#31465A]/55 uppercase group-hover:text-[#31465A] transition-colors tracking-widest">
              Moon&apos;s Admin Access
            </span>
          </div>
        </div>
      </footer>

      {/* Character Detail Modal */}
      {selectedCharacter && (
        <CharacterDetailModal
          character={selectedCharacter}
          onClose={handleCloseCharacterDetail}
          onEdit={handleOpenEditCharacter}
          onDelete={handleOpenDeleteModal}
          isAdmin={isAdmin}
          soundEnabled={soundEnabled}
        />
      )}

      {/* Admin Add/Edit Character Modal */}
      <AdminCharacterModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        characterToEdit={characterToEdit}
        onSuccess={(savedChar) => {
          if (
            selectedCharacter &&
            selectedCharacter.id === savedChar.id
          ) {
            setSelectedCharacter(savedChar);
          }
        }}
        soundEnabled={soundEnabled}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        character={characterToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setCharacterToDelete(null);
        }}
        deleting={deleting}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        soundEnabled={soundEnabled}
      />

      {/* Admin Zone Modal */}
      <AdminZoneModal
        isOpen={isAdminZoneOpen}
        onClose={() => setIsAdminZoneOpen(false)}
        characters={characters}
        onAddNew={handleOpenAddCharacter}
        onEdit={handleOpenEditCharacter}
        onDelete={handleOpenDeleteModal}
        onView={handleSelectCharacter}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
