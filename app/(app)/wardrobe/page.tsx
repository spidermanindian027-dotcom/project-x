'use client';

import * as React from 'react';
import {
  Plus,
  Search,
  Heart,
  Trash2,
  Edit2,
  Camera,
  Upload,
  X,
  Shirt,
  AlertCircle,
  Check,
} from 'lucide-react';
import { VestraButton } from '@/components/ui/vestra-button';
import { VestraCard } from '@/components/ui/vestra-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  WARDROBE_CATEGORIES,
  FORMALITY_LEVELS,
  SEASON_CATEGORIES,
} from '@/lib/validations/wardrobe.schema';

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  subCategory: string | null;
  dominantColor: string;
  colorHex: string | null;
  pattern: string | null;
  material: string | null;
  style: string | null;
  formality: string;
  season: string;
  fit: string | null;
  imageUrl: string;
  imageKey: string;
  isFavorite: boolean;
  notes: string | null;
  createdAt: string;
}

export default function WardrobePage() {
  const [items, setItems] = React.useState<WardrobeItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('ALL');
  const [favoritesOnly, setFavoritesOnly] = React.useState<boolean>(false);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState<boolean>(false);
  const [editingItem, setEditingItem] = React.useState<WardrobeItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  // Add Item Form State
  const [name, setName] = React.useState<string>('');
  const [category, setCategory] = React.useState<string>('TOPS');
  const [dominantColor, setDominantColor] = React.useState<string>('Charcoal');
  const [colorHex, setColorHex] = React.useState<string>('#1a1a1a');
  const [material, setMaterial] = React.useState<string>('');
  const [formality, setFormality] = React.useState<string>('CASUAL');
  const [season, setSeason] = React.useState<string>('ALL_SEASON');
  const [fit, setFit] = React.useState<string>('Relaxed');
  const [notes, setNotes] = React.useState<string>('');
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  // Camera capture inside modal
  const [isCameraActive, setIsCameraActive] = React.useState<boolean>(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const res = await fetch('/api/wardrobe');
        if (!active) return;
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
        }
      } catch {
        if (active) {
          setFeedback({ type: 'error', message: 'Failed to load wardrobe vault' });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const stopCamera = React.useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const startCamera = async () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1080 } },
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch {
      setFeedback({ type: 'error', message: 'Unable to initialize optical sensor. Please use file upload.' });
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(blob));
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    stopCamera();
  };

  const resetForm = () => {
    setName('');
    setCategory('TOPS');
    setDominantColor('Charcoal');
    setColorHex('#1a1a1a');
    setMaterial('');
    setFormality('CASUAL');
    setSeason('ALL_SEASON');
    setFit('Relaxed');
    setNotes('');
    setPhotoFile(null);
    setPhotoPreview(null);
    stopCamera();
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile) {
      setFeedback({ type: 'error', message: 'A garment photo is required.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      formData.append('name', name);
      formData.append('category', category);
      formData.append('dominantColor', dominantColor);
      if (colorHex) formData.append('colorHex', colorHex);
      if (material) formData.append('material', material);
      formData.append('formality', formality);
      formData.append('season', season);
      if (fit) formData.append('fit', fit);
      if (notes) formData.append('notes', notes);

      const res = await fetch('/api/wardrobe', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to catalog item');
      }

      setItems((prev) => [data.item, ...prev]);
      setIsAddModalOpen(false);
      resetForm();
      setFeedback({ type: 'success', message: `"${data.item.name}" cataloged into your vault.` });
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/wardrobe/${editingItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingItem.name,
          category: editingItem.category,
          dominantColor: editingItem.dominantColor,
          material: editingItem.material,
          formality: editingItem.formality,
          season: editingItem.season,
          fit: editingItem.fit,
          notes: editingItem.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update item');
      }

      setItems((prev) => prev.map((it) => (it.id === data.item.id ? data.item : it)));
      setIsEditModalOpen(false);
      setEditingItem(null);
      setFeedback({ type: 'success', message: 'Item specifications updated.' });
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFavorite = async (item: WardrobeItem) => {
    const nextVal = !item.isFavorite;
    // Optimistic UI
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, isFavorite: nextVal } : it))
    );

    try {
      const res = await fetch(`/api/wardrobe/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: nextVal }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revert on error
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, isFavorite: item.isFavorite } : it))
      );
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/wardrobe/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((it) => it.id !== id));
        setDeleteConfirmId(null);
        setFeedback({ type: 'success', message: 'Garment purged from wardrobe vault.' });
      } else {
        throw new Error();
      }
    } catch {
      setFeedback({ type: 'error', message: 'Could not delete item. Please retry.' });
    }
  };

  // Filtered view
  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (favoritesOnly && !item.isFavorite) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchColor = item.dominantColor.toLowerCase().includes(q);
      const matchMat = item.material?.toLowerCase().includes(q) ?? false;
      const matchNotes = item.notes?.toLowerCase().includes(q) ?? false;
      return matchName || matchColor || matchMat || matchNotes;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DED5C8]/10 pb-6">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.25em] text-[#A95239] uppercase block mb-1 font-mono">
            VAYN Digital Inventory
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#F4EFE6] tracking-tight">
            VAYN Wardrobe Vault
          </h1>
          <p className="text-xs md:text-sm text-[#6D6961] mt-1">
            Digitized archive of your tailored silhouettes, textiles, and signature accents ({items.length} items cataloged).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <VestraButton
            variant="primary"
            size="md"
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Catalog New Garment
          </VestraButton>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 text-xs flex items-center justify-between rounded border ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
              : 'bg-red-950/40 border-red-800 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-[#6D6961] hover:text-[#F4EFE6] p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6D6961]" />
            <input
              type="text"
              placeholder="Search by garment title, fabric (e.g. Cashmere), dominant color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#1C1B18] border border-[#DED5C8]/20 rounded text-xs text-[#F4EFE6] placeholder-[#6D6961]/50 focus:border-[#A95239] focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`px-3 py-2 rounded border text-xs flex items-center gap-2 transition-all ${
              favoritesOnly
                ? 'border-[#A95239] bg-[#A95239]/15 text-[#A95239]'
                : 'border-[#DED5C8]/20 bg-[#24231F] text-[#6D6961] hover:text-[#F4EFE6]'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${favoritesOnly ? 'fill-[#A95239]' : ''}`} />
            <span>Vault Favourites</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded border shrink-0 transition-colors uppercase font-mono text-[10px] ${
              selectedCategory === 'ALL'
                ? 'border-[#A95239] bg-[#A95239] text-[#F4EFE6] font-bold'
                : 'border-[#DED5C8]/15 bg-[#24231F] text-[#6D6961] hover:text-[#F4EFE6]'
            }`}
          >
            All Pieces ({items.length})
          </button>
          {WARDROBE_CATEGORIES.map((cat) => {
            const count = items.filter((it) => it.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded border shrink-0 transition-colors uppercase font-mono text-[10px] ${
                  selectedCategory === cat
                    ? 'border-[#A95239] bg-[#A95239] text-[#F4EFE6] font-bold'
                    : 'border-[#DED5C8]/15 bg-[#24231F] text-[#6D6961] hover:text-[#F4EFE6]'
                }`}
              >
                {cat.replace(/_/g, ' ')} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Wardrobe Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <LoadingSpinner size="lg" />
          <span className="text-xs text-[#9ca3af] font-mono">Curating Wardrobe Gallery...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <VestraCard variant="bordered" padding="lg" className="text-center py-16 space-y-4">
          <div className="h-12 w-12 rounded-full bg-[#262626] border border-[#9ca3af]/20 flex items-center justify-center mx-auto text-[#e8c547]">
            <Shirt className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg text-[#f5f0e8]">
              {items.length === 0 ? 'Your Vault is Currently Empty' : 'No Matching Pieces Found'}
            </h3>
            <p className="text-xs text-[#9ca3af] mt-1 max-w-sm mx-auto">
              {items.length === 0
                ? 'Catalog your garments to unlock AI silhouette matching and personal stylist recommendations.'
                : 'Try adjusting your search filter or category selection.'}
            </p>
          </div>
          {items.length === 0 && (
            <VestraButton
              variant="primary"
              size="md"
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Catalog First Piece
            </VestraButton>
          )}
        </VestraCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-[#262626]/40 border border-[#9ca3af]/20 rounded-sm overflow-hidden flex flex-col justify-between hover:border-[#e8c547]/50 transition-all relative"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] bg-black overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Category Badge Top Left */}
                <div className="absolute top-2 left-2">
                  <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 bg-black/75 text-[#e8c547] border border-[#e8c547]/30 rounded-sm">
                    {item.category.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Favorite Button Top Right */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(item)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black text-[#9ca3af] hover:text-[#e8c547] transition-colors"
                  title="Toggle Favorite"
                >
                  <Heart
                    className={`h-4 w-4 ${item.isFavorite ? 'fill-[#e8c547] text-[#e8c547]' : ''}`}
                  />
                </button>

                {/* Dominant Color Dot Bottom Left */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/80 px-2 py-0.5 rounded-sm border border-white/10">
                  <span
                    className="h-2 w-2 rounded-full border border-black"
                    style={{ backgroundColor: item.colorHex || '#9ca3af' }}
                  />
                  <span className="text-[9px] text-[#f5f0e8] font-mono uppercase truncate max-w-[90px]">
                    {item.dominantColor}
                  </span>
                </div>
              </div>

              {/* Item Info Card */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-sm font-medium text-[#f5f0e8] truncate">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {item.material && (
                      <span className="text-[9px] text-[#9ca3af] font-mono bg-white/5 px-1.5 py-0.5 rounded-sm">
                        {item.material}
                      </span>
                    )}
                    <span className="text-[9px] text-[#9ca3af] font-mono bg-white/5 px-1.5 py-0.5 rounded-sm">
                      {item.season.replace(/_/g, ' ')}
                    </span>
                    {item.fit && (
                      <span className="text-[9px] text-[#9ca3af] font-mono bg-white/5 px-1.5 py-0.5 rounded-sm">
                        {item.fit}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Controls */}
                <div className="pt-2.5 border-t border-[#9ca3af]/15 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#9ca3af] font-mono capitalize">
                    {item.formality.toLowerCase().replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(item);
                        setIsEditModalOpen(true);
                      }}
                      className="p-1 text-[#9ca3af] hover:text-[#f5f0e8] transition-colors rounded-sm"
                      title="Edit specifications"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-1 text-[#9ca3af] hover:text-red-400 transition-colors rounded-sm"
                      title="Delete garment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Inline Delete Confirmation Overlay */}
              {deleteConfirmId === item.id && (
                <div className="absolute inset-0 bg-black/95 p-4 flex flex-col items-center justify-center text-center space-y-3 z-10">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                  <p className="text-xs text-[#f5f0e8]">Purge this item from wardrobe vault?</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2.5 py-1 text-xs text-[#9ca3af] hover:text-[#f5f0e8]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="px-3 py-1 bg-red-900/60 hover:bg-red-900 border border-red-700 text-red-200 text-xs rounded-sm"
                    >
                      Confirm Purge
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ADD ITEM MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1a1a1a] border border-[#9ca3af]/25 rounded-sm max-w-xl w-full p-6 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[#9ca3af]/15 pb-4">
              <div>
                <span className="text-[10px] font-semibold tracking-[0.25em] text-[#e8c547] uppercase block">
                  Vault Ingestion
                </span>
                <h2 className="font-serif text-xl text-[#f5f0e8]">Catalog New Garment</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setIsAddModalOpen(false);
                }}
                className="text-[#9ca3af] hover:text-[#f5f0e8] p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              {/* Photo Input: Live Camera or Upload */}
              <div>
                <label className="text-xs font-semibold text-[#f5f0e8] uppercase tracking-wider block mb-2">
                  Garment Portrait / Flat Lay (Required)
                </label>

                {isCameraActive ? (
                  <div className="relative bg-black rounded-sm overflow-hidden border border-[#e8c547]/40 flex flex-col items-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full max-h-[260px] object-cover"
                    />
                    <div className="p-3 bg-black/90 w-full flex items-center justify-between">
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="text-xs text-[#9ca3af] hover:text-[#f5f0e8]"
                      >
                        Cancel
                      </button>
                      <VestraButton
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={capturePhoto}
                        leftIcon={<Camera className="h-3.5 w-3.5" />}
                      >
                        Capture
                      </VestraButton>
                    </div>
                  </div>
                ) : photoPreview ? (
                  <div className="relative rounded-sm overflow-hidden border border-[#e8c547]/40 bg-black flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoPreview}
                      alt="Garment Preview"
                      className="max-h-[200px] object-contain rounded-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                      }}
                      className="absolute top-3 right-3 p-1 rounded-full bg-black/80 text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="p-5 border border-dashed border-[#9ca3af]/30 rounded-sm flex flex-col items-center gap-2 hover:border-[#e8c547] text-center"
                    >
                      <Camera className="h-5 w-5 text-[#9ca3af]" />
                      <span className="text-xs text-[#f5f0e8]">Use Camera</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-5 border border-dashed border-[#9ca3af]/30 rounded-sm flex flex-col items-center gap-2 hover:border-[#e8c547] text-center"
                    >
                      <Upload className="h-5 w-5 text-[#9ca3af]" />
                      <span className="text-xs text-[#f5f0e8]">Upload Photo</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>

              {/* Form Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[#9ca3af] block mb-1">Garment Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Charcoal Double-Breasted Blazer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#262626] border border-[#9ca3af]/30 rounded-sm p-2 text-[#f5f0e8] focus:border-[#e8c547] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#9ca3af] block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#262626] border border-[#9ca3af]/30 rounded-sm p-2 text-[#f5f0e8] focus:border-[#e8c547] focus:outline-none"
                  >
                    {WARDROBE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[#9ca3af] block mb-1">Dominant Color *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Charcoal, Warm Ivory, Navy"
                    value={dominantColor}
                    onChange={(e) => setDominantColor(e.target.value)}
                    className="w-full bg-[#262626] border border-[#9ca3af]/30 rounded-sm p-2 text-[#f5f0e8] focus:border-[#e8c547] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#9ca3af] block mb-1">Color Hex Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="h-8 w-8 bg-transparent cursor-pointer border border-white/10 rounded-sm"
                    />
                    <input
                      type="text"
                      placeholder="#1a1a1a"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="w-full bg-[#262626] border border-[#9ca3af]/30 rounded-sm p-2 text-[#f5f0e8] font-mono focus:border-[#e8c547] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#9ca3af] block mb-1">Textile / Material</label>
                  <input
                    type="text"
                    placeholder="e.g. Virgin Wool, Cashmere, Silk"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full bg-[#262626] border border-[#9ca3af]/30 rounded-sm p-2 text-[#f5f0e8] focus:border-[#e8c547] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#9ca3af] block mb-1">Formality Level</label>
                  <select
                    value={formality}
                    onChange={(e) => setFormality(e.target.value)}
                    className="w-full bg-[#262626] border border-[#9ca3af]/30 rounded-sm p-2 text-[#f5f0e8] focus:border-[#e8c547] focus:outline-none"
                  >
                    {FORMALITY_LEVELS.map((f) => (
                      <option key={f} value={f}>
                        {f.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[#9ca3af] block mb-1">Season</label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full bg-[#262626] border border-[#9ca3af]/30 rounded-sm p-2 text-[#f5f0e8] focus:border-[#e8c547] focus:outline-none"
                  >
                    {SEASON_CATEGORIES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[#9ca3af] block mb-1">Silhouette Fit</label>
                  <input
                    type="text"
                    placeholder="e.g. Structured, Oversized, Slim"
                    value={fit}
                    onChange={(e) => setFit(e.target.value)}
                    className="w-full bg-[#262626] border border-[#9ca3af]/30 rounded-sm p-2 text-[#f5f0e8] focus:border-[#e8c547] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#9ca3af] text-xs block mb-1">Archival Notes / Styling Intent</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Best paired with charcoal trousers or layered over cream silk shirts."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#262626] border border-[#9ca3af]/30 rounded-sm p-2 text-xs text-[#f5f0e8] focus:border-[#e8c547] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#9ca3af]/15 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs text-[#9ca3af] hover:text-[#f5f0e8]"
                >
                  Cancel
                </button>
                <VestraButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  leftIcon={isSubmitting ? <LoadingSpinner size="sm" /> : <Plus className="h-4 w-4" />}
                >
                  {isSubmitting ? 'Cataloging Piece...' : 'Catalog Piece'}
                </VestraButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ITEM MODAL */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1a1a1a] border border-[#9ca3af]/25 rounded-sm max-w-lg w-full p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#9ca3af]/15 pb-4">
              <div>
                <span className="text-[10px] font-semibold tracking-[0.25em] text-[#e8c547] uppercase block">
                  Specifications
                </span>
                <h2 className="font-serif text-xl text-[#f5f0e8]">Edit Garment Details</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingItem(null);
                }}
                className="text-[#9ca3af] hover:text-[#f5f0e8] p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateItem} className="space-y-4 text-xs">
              <div>
                <label className="text-[#9ca3af] block mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-[#262626] border border-[#9ca3af]/30 rounded-sm p-2 text-[#f5f0e8] focus:border-[#e8c547] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#9ca3af] block mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full bg-[#262626] border border-[#9ca3af]/30 rounded-sm p-2 text-[#f5f0e8] focus:border-[#e8c547] focus:outline-none"
                  >
                    {WARDROBE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[#9ca3af] block mb-1">Dominant Color</label>
                  <input
                    type="text"
                    required
                    value={editingItem.dominantColor}
                    onChange={(e) => setEditingItem({ ...editingItem, dominantColor: e.target.value })}
                    className="w-full bg-[#262626] border border-[#9ca3af]/30 rounded-sm p-2 text-[#f5f0e8] focus:border-[#e8c547] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#9ca3af] block mb-1">Material</label>
                  <input
                    type="text"
                    value={editingItem.material || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, material: e.target.value })}
                    className="w-full bg-[#262626] border border-[#9ca3af]/30 rounded-sm p-2 text-[#f5f0e8] focus:border-[#e8c547] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#9ca3af] block mb-1">Formality</label>
                  <select
                    value={editingItem.formality}
                    onChange={(e) => setEditingItem({ ...editingItem, formality: e.target.value })}
                    className="w-full bg-[#262626] border border-[#9ca3af]/30 rounded-sm p-2 text-[#f5f0e8] focus:border-[#e8c547] focus:outline-none"
                  >
                    {FORMALITY_LEVELS.map((f) => (
                      <option key={f} value={f}>
                        {f.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#9ca3af] block mb-1">Archival Notes</label>
                <textarea
                  rows={2}
                  value={editingItem.notes || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                  className="w-full bg-[#262626] border border-[#9ca3af]/30 rounded-sm p-2 text-[#f5f0e8] focus:border-[#e8c547] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#9ca3af]/15 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-xs text-[#9ca3af] hover:text-[#f5f0e8]"
                >
                  Cancel
                </button>
                <VestraButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </VestraButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
