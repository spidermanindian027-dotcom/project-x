'use client';

import * as React from 'react';
import {
  UserCircle2,
  Calendar,
  Mail,
  Shield,
  Camera,
  Trash2,
  Check,
  AlertCircle,
  Save,
} from 'lucide-react';
import { VestraButton } from '@/components/ui/vestra-button';
import { VestraCard } from '@/components/ui/vestra-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  STYLE_ARCHETYPES,
  BODY_TYPES,
  type StyleProfileUpdateInput,
} from '@/lib/validations/profile.schema';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

interface ProfileData {
  id: string;
  primaryArchetype: string | null;
  secondaryArchetype: string | null;
  styleKeywords: string[];
  bodyProportionType: string;
  proportionSource: string;
  preferredColours: string[];
  avoidedColours: string[];
  skinToneCategory: string;
  occasionWeekday: string;
  occasionWeekend: string;
  occasionFormal: boolean;
  referencePhotoUrl: string | null;
  onboardingCompleted: boolean;
}

const COLOR_MAP: Record<string, string> = {
  'Onyx Black': '#111111',
  'Warm Ivory': '#f5f0e8',
  'Charcoal Slate': '#2c302e',
  'Ecru Cream': '#e8dcce',
  'Camel Tan': '#c19a6b',
  'Deep Espresso': '#362217',
  'Midnight Navy': '#1b263b',
  'Forest Green': '#1e3f20',
  'Burgundy Wine': '#581825',
  'Burnished Gold': '#d4af37',
  'Terracotta': '#c46243',
  'Dove Grey': '#9ca3af',
  'Cobalt Azure': '#0047ab',
  'Sage Olive': '#8a9a86',
  'Dusty Rose': '#c08081',
  'Cognac Rust': '#9a4726',
};

export default function ProfilePage() {
  const [user, setUser] = React.useState<UserData | null>(null);
  const [profile, setProfile] = React.useState<ProfileData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Editable fields
  const [primaryArchetype, setPrimaryArchetype] = React.useState<string>('');
  const [secondaryArchetype, setSecondaryArchetype] = React.useState<string>('');
  const [bodyProportion, setBodyProportion] = React.useState<string>('PREFER_NOT_TO_SAY');
  const [skinTone, setSkinTone] = React.useState<string>('unset');
  const [weekdayOccasion, setWeekdayOccasion] = React.useState<string>('casual');
  const [weekendOccasion, setWeekendOccasion] = React.useState<string>('casual');

  React.useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [userRes, profileRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/profile'),
        ]);

        if (!active) return;

        if (userRes.ok) {
          const uData = await userRes.json();
          setUser(uData.user);
        }

        if (profileRes.ok) {
          const pData = await profileRes.json();
          if (pData.profile) {
            setProfile(pData.profile);
            setPrimaryArchetype(pData.profile.primaryArchetype || '');
            setSecondaryArchetype(pData.profile.secondaryArchetype || '');
            setBodyProportion(pData.profile.bodyProportionType || 'PREFER_NOT_TO_SAY');
            setSkinTone(pData.profile.skinToneCategory || 'unset');
            setWeekdayOccasion(pData.profile.occasionWeekday || 'casual');
            setWeekendOccasion(pData.profile.occasionWeekend || 'casual');
          }
        }
      } catch {
        if (active) {
          setFeedback({ type: 'error', message: 'Failed to load profile data.' });
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

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const payload: StyleProfileUpdateInput = {
        primaryArchetype: (primaryArchetype as StyleProfileUpdateInput['primaryArchetype']) || null,
        secondaryArchetype: (secondaryArchetype as StyleProfileUpdateInput['secondaryArchetype']) || null,
        bodyProportionType: bodyProportion as StyleProfileUpdateInput['bodyProportionType'],
        skinToneCategory: skinTone as StyleProfileUpdateInput['skinToneCategory'],
        occasionWeekday: weekdayOccasion as StyleProfileUpdateInput['occasionWeekday'],
        occasionWeekend: weekendOccasion as StyleProfileUpdateInput['occasionWeekend'],
      };

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update style preferences.');
      }

      setProfile(data.profile);
      setFeedback({ type: 'success', message: 'Style preferences updated successfully.' });
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      const res = await fetch('/api/profile/photo', { method: 'DELETE' });
      if (res.ok) {
        setProfile((prev) => (prev ? { ...prev, referencePhotoUrl: null } : null));
        setFeedback({ type: 'success', message: 'Reference photo removed.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to delete photo.' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <LoadingSpinner size="lg" />
        <span className="text-xs text-[#9ca3af] font-mono">Loading Atelier Profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="border-b border-[#9ca3af]/15 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.25em] text-[#e8c547] uppercase block mb-1">
            Client Dossier
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#f5f0e8] tracking-tight">
            Style Fit Profile
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1">
            Personal identity metrics, proportion configurations, and wardrobe calibrations.
          </p>
        </div>

        {user?.role && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 bg-[#e8c547]/10 text-[#e8c547] border border-[#e8c547]/30 rounded-sm">
              Role: {user.role}
            </span>
          </div>
        )}
      </div>

      {feedback && (
        <div
          className={`p-3 text-xs flex items-center gap-2 rounded-sm border ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
              : 'bg-red-950/40 border-red-800 text-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Top Grid: User Info & Photo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <VestraCard variant="bordered" padding="md" className="md:col-span-2">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-[#262626] border border-[#e8c547]/30 flex items-center justify-center shrink-0">
              <UserCircle2 className="h-7 w-7 text-[#e8c547]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-[#f5f0e8]">
                {user?.fullName || 'Private Client'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
                <Mail className="h-3.5 w-3.5" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#9ca3af]/80 font-mono">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#9ca3af]/10 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider block">
                Primary Aesthetic
              </span>
              <span className="text-[#f5f0e8] font-medium mt-0.5 block">
                {profile?.primaryArchetype?.replace(/_/g, ' ') || 'Not Configured'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider block">
                Secondary Aesthetic
              </span>
              <span className="text-[#f5f0e8] font-medium mt-0.5 block">
                {profile?.secondaryArchetype?.replace(/_/g, ' ') || 'None Selected'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider block">
                Proportion Type
              </span>
              <span className="text-[#f5f0e8] font-medium mt-0.5 block">
                {profile?.bodyProportionType?.replace(/_/g, ' ') || 'Prefer not to say'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider block">
                Skin Tone Undertone
              </span>
              <span className="text-[#f5f0e8] font-medium mt-0.5 block capitalize">
                {profile?.skinToneCategory || 'Unset'}
              </span>
            </div>
          </div>
        </VestraCard>

        {/* Reference Photo Card */}
        <VestraCard variant="bordered" padding="md" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase text-[#e8c547]">
                Reference Portrait
              </span>
              {profile?.referencePhotoUrl && (
                <button
                  type="button"
                  onClick={handleDeletePhoto}
                  className="text-red-400 hover:text-red-300 p-1 rounded-sm"
                  title="Remove reference photo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {profile?.referencePhotoUrl ? (
              <div className="relative group rounded-sm overflow-hidden border border-[#9ca3af]/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.referencePhotoUrl}
                  alt="Reference Portrait"
                  className="w-full h-44 object-cover"
                />
              </div>
            ) : (
              <div className="h-44 border border-dashed border-[#9ca3af]/25 rounded-sm flex flex-col items-center justify-center p-4 text-center bg-[#262626]/20">
                <Camera className="h-7 w-7 text-[#9ca3af]/50 mb-2" />
                <span className="text-xs text-[#9ca3af]">No Photo Calibrated</span>
                <span className="text-[10px] text-[#9ca3af]/60 mt-1">
                  Upload via onboarding or scanner
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 text-[10px] text-[#9ca3af] leading-tight flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-[#e8c547] shrink-0" />
            <span>Encrypted fit reference for AI styling.</span>
          </div>
        </VestraCard>
      </div>

      {/* Colour Palette Summary */}
      <VestraCard variant="bordered" padding="md">
        <h3 className="text-sm font-semibold text-[#f5f0e8] uppercase tracking-wider mb-3">
          Calibrated Color Palette
        </h3>
        <div className="space-y-4">
          <div>
            <span className="text-[11px] text-[#9ca3af] block mb-2">Preferred Hues:</span>
            {profile?.preferredColours && profile.preferredColours.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.preferredColours.map((c) => (
                  <div
                    key={c}
                    className="flex items-center gap-2 px-2.5 py-1 bg-[#262626] border border-[#9ca3af]/20 rounded-sm text-xs text-[#f5f0e8]"
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-black/30"
                      style={{ backgroundColor: COLOR_MAP[c] || '#9ca3af' }}
                    />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-[#9ca3af]/60 italic">No preferred hues selected</span>
            )}
          </div>

          {profile?.avoidedColours && profile.avoidedColours.length > 0 && (
            <div>
              <span className="text-[11px] text-[#9ca3af] block mb-2">Avoided Hues:</span>
              <div className="flex flex-wrap gap-2">
                {profile.avoidedColours.map((c) => (
                  <div
                    key={c}
                    className="flex items-center gap-2 px-2.5 py-1 bg-red-950/20 border border-red-900/30 rounded-sm text-xs text-red-200"
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-black/30"
                      style={{ backgroundColor: COLOR_MAP[c] || '#9ca3af' }}
                    />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </VestraCard>

      {/* Edit Section Form */}
      <VestraCard variant="bordered" padding="lg">
        <div className="border-b border-[#9ca3af]/15 pb-4 mb-6">
          <span className="text-[10px] font-semibold tracking-[0.25em] text-[#e8c547] uppercase block mb-1">
            Calibration Settings
          </span>
          <h3 className="font-serif text-xl font-normal text-[#f5f0e8] tracking-tight">
            Edit Style Preferences
          </h3>
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Archetype */}
            <div>
              <label className="text-xs font-semibold text-[#f5f0e8] uppercase tracking-wider block mb-2">
                Primary Aesthetic Archetype
              </label>
              <select
                value={primaryArchetype}
                onChange={(e) => setPrimaryArchetype(e.target.value)}
                className="w-full bg-[#262626] border border-[#9ca3af]/30 text-xs text-[#f5f0e8] rounded-sm p-2.5 focus:border-[#e8c547] focus:outline-none"
              >
                <option value="">Select Primary Archetype</option>
                {STYLE_ARCHETYPES.map((arch) => (
                  <option key={arch} value={arch}>
                    {arch.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Secondary Archetype */}
            <div>
              <label className="text-xs font-semibold text-[#f5f0e8] uppercase tracking-wider block mb-2">
                Secondary Aesthetic Archetype
              </label>
              <select
                value={secondaryArchetype}
                onChange={(e) => setSecondaryArchetype(e.target.value)}
                className="w-full bg-[#262626] border border-[#9ca3af]/30 text-xs text-[#f5f0e8] rounded-sm p-2.5 focus:border-[#e8c547] focus:outline-none"
              >
                <option value="">None Selected</option>
                {STYLE_ARCHETYPES.map((arch) => (
                  <option key={arch} value={arch}>
                    {arch.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Body Proportion */}
            <div>
              <label className="text-xs font-semibold text-[#f5f0e8] uppercase tracking-wider block mb-2">
                Body Proportion Architecture
              </label>
              <select
                value={bodyProportion}
                onChange={(e) => setBodyProportion(e.target.value)}
                className="w-full bg-[#262626] border border-[#9ca3af]/30 text-xs text-[#f5f0e8] rounded-sm p-2.5 focus:border-[#e8c547] focus:outline-none"
              >
                {BODY_TYPES.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Skin Undertone */}
            <div>
              <label className="text-xs font-semibold text-[#f5f0e8] uppercase tracking-wider block mb-2">
                Skin Tone Undertone
              </label>
              <select
                value={skinTone}
                onChange={(e) => setSkinTone(e.target.value)}
                className="w-full bg-[#262626] border border-[#9ca3af]/30 text-xs text-[#f5f0e8] rounded-sm p-2.5 focus:border-[#e8c547] focus:outline-none"
              >
                <option value="warm">Warm</option>
                <option value="cool">Cool</option>
                <option value="neutral">Neutral</option>
                <option value="unset">Prefer not to say</option>
              </select>
            </div>

            {/* Weekday Occasion */}
            <div>
              <label className="text-xs font-semibold text-[#f5f0e8] uppercase tracking-wider block mb-2">
                Weekday Primary Occasion
              </label>
              <select
                value={weekdayOccasion}
                onChange={(e) => setWeekdayOccasion(e.target.value)}
                className="w-full bg-[#262626] border border-[#9ca3af]/30 text-xs text-[#f5f0e8] rounded-sm p-2.5 focus:border-[#e8c547] focus:outline-none"
              >
                <option value="casual">Casual</option>
                <option value="smart_casual">Smart Casual</option>
                <option value="business">Business</option>
                <option value="formal">Formal</option>
              </select>
            </div>

            {/* Weekend Occasion */}
            <div>
              <label className="text-xs font-semibold text-[#f5f0e8] uppercase tracking-wider block mb-2">
                Weekend Primary Occasion
              </label>
              <select
                value={weekendOccasion}
                onChange={(e) => setWeekendOccasion(e.target.value)}
                className="w-full bg-[#262626] border border-[#9ca3af]/30 text-xs text-[#f5f0e8] rounded-sm p-2.5 focus:border-[#e8c547] focus:outline-none"
              >
                <option value="casual">Casual</option>
                <option value="smart_casual">Smart Casual</option>
                <option value="business">Business</option>
                <option value="formal">Formal</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#9ca3af]/15">
            <VestraButton
              type="submit"
              variant="primary"
              size="md"
              disabled={isSaving}
              leftIcon={isSaving ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
            >
              {isSaving ? 'Saving Changes...' : 'Save Preferences'}
            </VestraButton>
          </div>
        </form>
      </VestraCard>
    </div>
  );
}
