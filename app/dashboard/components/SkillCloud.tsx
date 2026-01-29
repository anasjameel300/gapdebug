"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkillNode, useContextStore } from "@/lib/stores/context-store";
import { X, Clock, Plus, Check, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const CATEGORY_STYLES = {
    frontend: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
    backend: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
    soft: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
    tools: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/20",
    other: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20 hover:bg-zinc-500/20",
};

export function SkillCloud() {
    const { skills, addSkill, updateSkill, removeSkill } = useContextStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Memoize active skill to prevent potential flickers during state updates
    const selectedSkill = useMemo(() =>
        skills.find(s => s.id === selectedId),
        [skills, selectedId]);

    return (
        <div className="relative h-full">
            <div className="flex flex-wrap content-start gap-3 h-full overflow-y-auto pr-2 pb-2 custom-scrollbar">
                {skills.map((skill) => (
                    <SkillPill
                        key={skill.id}
                        skill={skill}
                        onClick={() => setSelectedId(skill.id)}
                    />
                ))}

                <AddSkillSection
                    isAdding={isAdding}
                    setIsAdding={setIsAdding}
                    onAdd={addSkill}
                />
            </div>

            <SkillDetailOverlay
                skill={selectedSkill}
                isOpen={!!selectedId}
                onClose={() => setSelectedId(null)}
                onUpdate={updateSkill}
                onRemove={(id) => {
                    removeSkill(id);
                    setSelectedId(null);
                }}
            />
        </div>
    );
}

// Sub-component: Individual Skill Pill (Static List Item)
function SkillPill({ skill, onClick }: { skill: SkillNode; onClick: () => void }) {
    const isHighConfidence = skill.confidence >= 80;

    return (
        <div
            onClick={onClick}
            className={`
        cursor-pointer px-4 py-2 rounded-full border transition-all duration-200 
        hover:scale-[1.02] active:scale-[0.98]
        ${CATEGORY_STYLES[skill.category] || CATEGORY_STYLES.other}
      `}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${skill.name}`}
        >
            <div className="flex items-center gap-2 pointer-events-none">
                <div className={`w-2 h-2 rounded-full ${isHighConfidence ? "bg-primary" : "bg-primary/40"}`} />
                <span className="text-sm font-semibold tracking-tight whitespace-nowrap">{skill.name}</span>
            </div>
        </div>
    );
}

// Sub-component: Floating Detail Card
function SkillDetailOverlay({
    skill,
    isOpen,
    onClose,
    onUpdate,
    onRemove
}: {
    skill?: SkillNode;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (id: string, updates: Partial<SkillNode>) => void;
    onRemove: (id: string) => void;
}) {
    return (
        <AnimatePresence>
            {isOpen && skill && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10"
                    />

                    <div className="absolute inset-0 flex items-center justify-center p-4 z-20 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="w-full max-w-sm bg-card border border-border shadow-2xl rounded-2xl overflow-hidden pointer-events-auto"
                        >
                            <div className="p-5 flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <h3 className="text-xl font-bold text-foreground">{skill.name}</h3>
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                            {skill.category}
                                        </span>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-muted-foreground">Confidence Level</span>
                                            <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-xs">
                                                {skill.confidence}%
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={skill.confidence}
                                            onChange={(e) => onUpdate(skill.id, { confidence: parseInt(e.target.value) })}
                                            className="w-full h-2 bg-muted rounded-full accent-primary appearance-none cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-semibold">
                                            <span>Beginner</span>
                                            <span>Expert</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>Refined {formatDistanceToNow(new Date(skill.lastRefined))} ago</span>
                                        </div>
                                        <button
                                            onClick={() => onRemove(skill.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

// Sub-component: Add Skill Logic
function AddSkillSection({
    isAdding,
    setIsAdding,
    onAdd
}: {
    isAdding: boolean;
    setIsAdding: (v: boolean) => void;
    onAdd: (arg: any) => void;
}) {
    const [val, setVal] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isAdding) {
            inputRef.current?.focus();
        }
    }, [isAdding]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (val.trim()) {
            onAdd({
                name: val.trim(),
                category: "other",
                confidence: 50,
            });
            setVal("");
            setIsAdding(false);
        }
    };

    if (!isAdding) {
        return (
            <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 rounded-full border border-dashed border-border bg-background/50 text-muted-foreground hover:text-foreground hover:border-accent hover:bg-accent/5 transition-all text-sm font-medium flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Add Skill
            </button>
        );
    }

    return (
        <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-accent/30 rounded-full shadow-lg"
        >
            <input
                ref={inputRef}
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") setIsAdding(false);
                }}
                placeholder="Skill name..."
                className="bg-transparent border-none outline-none text-sm font-medium w-32 placeholder:text-muted-foreground/50"
            />
            <div className="flex gap-1 border-l border-border pl-2 ml-1">
                <button type="submit" className="p-1 hover:bg-primary/10 text-primary rounded-full">
                    <Check className="w-3.5 h-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-full"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </motion.form>
    );
}
