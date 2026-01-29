"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2, Sparkles, CheckCircle2, Search, Brain, FileText, type LucideIcon } from "lucide-react";

export interface LoadingStep {
    text: string;
    icon: LucideIcon;
}

const DEFAULT_STEPS: LoadingStep[] = [
    { text: "Connecting to knowledge base...", icon: Search },
    { text: "Analyzing your skills & experience...", icon: Brain },
    { text: "Structuring your achievements...", icon: FileText },
    { text: "Identifying clarification points...", icon: Search },
    { text: "Finalizing your professional profile...", icon: Sparkles },
];

interface ProgressiveLoaderProps {
    steps?: LoadingStep[];
}

export function ProgressiveLoader({ steps = DEFAULT_STEPS }: ProgressiveLoaderProps) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Total duration around 15 seconds to match the 13-25s expected wait
        // We'll advance steps every ~3 seconds
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 3000);

        return () => clearInterval(interval);
    }, [steps.length]);

    const ActiveIcon = steps[currentStep].icon;

    return (
        <div className="text-center py-20 max-w-md mx-auto">
            {/* Dynamic Icon */}
            <motion.div
                key={currentStep}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8 relative"
            >
                <ActiveIcon className="w-10 h-10 text-accent" />

                {/* Spinner Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
            </motion.div>

            {/* Main Status Text */}
            <motion.h2
                key={steps[currentStep].text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-foreground mb-6 h-8"
            >
                {steps[currentStep].text}
            </motion.h2>

            {/* Step Indicators */}
            <div className="space-y-3 max-w-xs mx-auto">
                {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;

                    return (
                        <div
                            key={index}
                            className={`flex items-center gap-3 text-sm transition-colors duration-300 ${isActive ? "text-foreground font-medium" :
                                isCompleted ? "text-muted-foreground" : "text-muted-foreground/30"
                                }`}
                        >
                            <div className={`
                        w-5 h-5 rounded-full flex items-center justify-center border
                        ${isCompleted ? "bg-accent border-accent text-accent-foreground" :
                                    isActive ? "border-accent text-accent" : "border-border"}
                    `}>
                                {isCompleted ? <CheckCircle2 className="w-3 h-3" /> :
                                    isActive ? <Loader2 className="w-3 h-3 animate-spin" /> :
                                        <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                            </div>
                            <span>{step.text}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
