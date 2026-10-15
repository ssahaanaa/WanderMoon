import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const CACHE_TTL = 5 * 60 * 1000;

export const usePackageCache = create(
  persist(
    (set, get) => ({
      entries: {},
      hits: 0,
      misses: 0,

      getCached(key) {
        const entry = get().entries[key];
        const fresh = entry && Date.now() - entry.savedAt < CACHE_TTL;
        set((state) => (fresh ? { hits: state.hits + 1 } : { misses: state.misses + 1 }));
        return fresh ? entry.data : null;
      },

      setCached(key, data) {
        set((state) => ({
          entries: { ...state.entries, [key]: { data, savedAt: Date.now() } },
        }));
      },

      invalidate(prefix) {
        set((state) => ({
          entries: Object.fromEntries(
            Object.entries(state.entries).filter(([key]) => !key.startsWith(prefix))
          ),
        }));
      },

      clearCache() {
        set({ entries: {}, hits: 0, misses: 0 });
      },
    }),
    {
      name: "WanderMoon.packageCache",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ entries: state.entries }),
    }
  )
);
