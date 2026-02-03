"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContextStore, Achievement } from "@/lib/stores/context-store";
import { Send, Sparkles, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

export function BrainDump() {
    const { achievements, addAchievement, removeAchievement } = useContextStore();
    const [input, setInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsProcessing(true);

        // Simulate AI Processing Delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Optimistic Update (Mock AI Response)
        addAchievement({
            rawText: input,
            refinedText: `• ${input}`, // Simple bullet point structure
            relatedSkills: [],
            aiTags: [], // No tags
        });

        setInput("");
        setIsProcessing(false);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Input Area */}
            <form onSubmit={handleSubmit} className="mb-6 relative">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="What did you achieve today? (e.g. 'Fixed a critical bug')"
                        className="w-full h-24 p-4 pr-12 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all placeholder:text-muted-foreground/50"
                        disabled={isProcessing}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isProcessing}
                        className="absolute bottom-3 right-3 p-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isProcessing ? (
                            <Sparkles className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 pl-1">
                    <span className="font-semibold text-accent">Tip:</span> Just dump your raw thoughts. The AI will structure it for your resume.
                </p>
            </form>

            {/* Stream Feed */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                <AnimatePresence mode="popLayout">
                    {achievements.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-10 text-muted-foreground/60 italic"
                        >
                            No memories yet. Add your first achievement above.
                        </motion.div>
                    ) : (
                        achievements.map((achievement) => (
                            <AchievementCard
                                key={achievement.id}
                                achievement={achievement}
                                onRemove={removeAchievement}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function AchievementCard({
    achievement,
    onRemove
}: {
    achievement: Achievement;
    onRemove: (id: string) => void;
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="group bg-card border border-border rounded-lg p-4 hover:border-accent/30 transition-colors relative"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-accent/10 rounded-md">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(achievement.date), "MMM d, yyyy")}
                    </span>
                </div>

                <button
                    onClick={() => onRemove(achievement.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-destructive/10 text-destructive/50 hover:text-destructive rounded-md transition-all"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-2">
                <p className="font-medium text-foreground text-sm leading-relaxed">
                    {achievement.refinedText}
                </p>
            </div>
        </motion.div>
    );
}
