"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, History, Zap } from "lucide-react";
import { useContextStore } from "@/lib/stores/context-store";
import { SkillCloud } from "./SkillCloud";
import { BrainDump } from "./BrainDump";

const ModuleHeader = ({
    title,
    icon: Icon,
    action
}: {
    title: string;
    icon: any;
    action?: React.ReactNode
}) => (
    <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-background/50 rounded-md border border-border/50">
                <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground/90">{title}</h3>
        </div>
        {action}
    </div>
);

export function LiveContext() {
    const { } = useContextStore();

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                        <Brain className="w-6 h-6 text-accent" />
                        Live Context
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Your dynamic career brain. Update it to keep the AI smart.
                    </p>
                </div>
            </header>

            {/* Bento Grid Layout */}
            <div className="grid lg:grid-cols-12 gap-6 lg:h-[600px] h-auto">
                {/* Left: Skills (7 cols) */}
                <div className="lg:col-span-7 bg-card border border-border rounded-xl p-6 relative overflow-hidden group min-h-[400px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <ModuleHeader
                        title="Skills"
                        icon={Zap}
                        action={
                            <div className="text-xs font-medium text-muted-foreground px-2 py-1 bg-background/50 rounded-md border border-border/50">
                                0 Active
                            </div>
                        }
                    />

                    <div className="h-full relative custom-scrollbar">
                        <SkillCloud />
                    </div>
                </div>

                {/* Right: Log Stream (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-6 min-h-[500px] lg:min-h-0">
                    <div className="flex-1 bg-card border border-border rounded-xl p-6 flex flex-col relative overflow-hidden">

                        <ModuleHeader
                            title="My Log"
                            icon={History}
                        />

                        <div className="flex-1 min-h-0">
                            <BrainDump />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
