"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEYS = {
  supabaseUrl: "supabase_url",
  supabaseAnonKey: "supabase_anon_key",
  tamboApiKey: "tambo_api_key",
} as const;

export function getCredentials() {
  if (typeof window === "undefined") return { supabaseUrl: "", supabaseAnonKey: "" };
  return {
    supabaseUrl: localStorage.getItem(STORAGE_KEYS.supabaseUrl) ?? "",
    supabaseAnonKey: localStorage.getItem(STORAGE_KEYS.supabaseAnonKey) ?? "",
  };
}

export function hasAllCredentials(): boolean {
  const creds = getCredentials();
  return !!(creds.supabaseUrl.trim() && creds.supabaseAnonKey.trim());
}

/** Fires whenever credentials change */
export const CREDENTIALS_UPDATED_EVENT = "credentials_updated";

export default function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const creds = getCredentials();
    setSupabaseUrl(creds.supabaseUrl);
    setSupabaseAnonKey(creds.supabaseAnonKey);
  }, [isOpen]);

  const handleSave = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.supabaseUrl, supabaseUrl.trim());
    localStorage.setItem(STORAGE_KEYS.supabaseAnonKey, supabaseAnonKey.trim());
    window.dispatchEvent(new Event(CREDENTIALS_UPDATED_EVENT));
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setIsOpen(false);
    }, 1200);
  }, [supabaseUrl, supabaseAnonKey]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <>
      {/* ── Gear Button ── */}
      <button
        id="settings-button"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full
                   bg-white/80 backdrop-blur border border-gray-200 shadow-lg
                   hover:bg-gray-100 hover:shadow-xl hover:scale-105
                   active:scale-95 transition-all duration-200"
        title="Settings"
        aria-label="Open settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-700"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {/* ── Modal Overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease]" />

          {/* Panel */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl
                       border border-gray-100 overflow-hidden
                       animate-[slideUp_0.3s_ease]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Settings</h2>
                  <p className="text-xs text-gray-500">Configure your credentials</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-5">
              {/* Supabase URL */}
              <div>
                <label htmlFor="settings-supabase-url" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Supabase Project URL
                </label>
                <input
                  id="settings-supabase-url"
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400
                             placeholder:text-gray-400 transition-all"
                  autoComplete="off"
                />
              </div>

              {/* Supabase Anon Key */}
              <div>
                <label htmlFor="settings-supabase-key" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Supabase Anon Key
                </label>
                <input
                  id="settings-supabase-key"
                  type="password"
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="your supabase anon key"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400
                             placeholder:text-gray-400 transition-all"
                  autoComplete="off"
                />
              </div>

              {/* Removed Tambo API Key field as per user request */}

              <p className="text-xs text-gray-400 leading-relaxed">
                All credentials are stored only in your browser&apos;s localStorage. They are never sent to our servers.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                id="settings-save-button"
                onClick={handleSave}
                disabled={saved}
                className="px-6 py-2 text-sm font-semibold text-white bg-black rounded-lg
                           hover:bg-gray-800 active:scale-[0.97] transition-all
                           disabled:opacity-60 disabled:cursor-not-allowed
                           flex items-center gap-2"
              >
                {saved ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Saved!
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
