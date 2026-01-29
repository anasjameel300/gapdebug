import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SkillCategory = "frontend" | "backend" | "soft" | "tools" | "other";

export interface SkillNode {
    id: string;
    name: string;
    category: SkillCategory;
    confidence: number; // 0-100
    lastRefined: string; // ISO Date
}

export interface Achievement {
    id: string;
    rawText: string;
    refinedText: string;
    date: string;
    relatedSkills: string[];
    aiTags: string[];
}

interface ContextState {
    skills: SkillNode[];
    achievements: Achievement[];

    // Actions
    addSkill: (skill: Omit<SkillNode, "id" | "lastRefined">) => void;
    updateSkill: (id: string, updates: Partial<SkillNode>) => void;
    removeSkill: (id: string) => void;

    addAchievement: (achievement: Omit<Achievement, "id" | "date">) => void;
    removeAchievement: (id: string) => void;
}

export const useContextStore = create<ContextState>()(
    persist(
        (set) => ({
            skills: [],
            achievements: [],

            addSkill: (skill) => set((state) => ({
                skills: [
                    ...state.skills,
                    {
                        ...skill,
                        id: crypto.randomUUID(),
                        lastRefined: new Date().toISOString(),
                    },
                ],
            })),

            updateSkill: (id, updates) => set((state) => ({
                skills: state.skills.map((s) =>
                    s.id === id ? { ...s, ...updates, lastRefined: new Date().toISOString() } : s
                ),
            })),

            removeSkill: (id) => set((state) => ({
                skills: state.skills.filter((s) => s.id !== id),
            })),

            addAchievement: (achievement) => set((state) => ({
                achievements: [
                    {
                        ...achievement,
                        id: crypto.randomUUID(),
                        date: new Date().toISOString(),
                    },
                    ...state.achievements, // Prepend to show newest first
                ],
            })),

            removeAchievement: (id) => set((state) => ({
                achievements: state.achievements.filter((a) => a.id !== id),
            })),
        }),
        {
            name: 'gapdebug-live-context',
        }
    )
);
