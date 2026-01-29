"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Map,
  FileText,
  Building2,
  ChevronRight,
  Loader2,
  AlertCircle,
  Sparkles,
  Menu,
  X,
  RefreshCw,
  Check,
  Zap,
  Search,
  BookOpen,
  User,
  Target,
  CheckCircle2,
} from "lucide-react";
import { ProgressiveLoader } from "@/app/onboarding/components/ProgressiveLoader";
import { type UserProfile } from "@/lib/api";
import { LiveContext } from "./components/LiveContext";
import { useContextStore } from "@/lib/stores/context-store";

type NavItem = {
  id: string;
  label: string;
  icon: typeof Home;
};

// Update Nav Items
const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "profile", label: "Profile", icon: User },
  { id: "internships", label: "Internship Optimizer", icon: Building2 },
];

const ROADMAP_STEPS = [
  { text: "Analyzing your career goal...", icon: Target },
  { text: "Mapping your skill gaps...", icon: Search },
  { text: "Curating learning resources...", icon: BookOpen },
  { text: "Structuring your timeline...", icon: Map },
  { text: "Finalizing your roadmap...", icon: Sparkles },
];

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // New State for Roadmap
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [roadmapGoal, setRoadmapGoal] = useState("");

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const savedProfile = localStorage.getItem("gapdebug_profile");

      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);

        // Hydrate Live Context Store if empty
        const store = useContextStore.getState();
        if (store.skills.length === 0 && parsedProfile.skills && parsedProfile.skills.length > 0) {
          parsedProfile.skills.forEach((skillName: string) => {
            store.addSkill({
              name: skillName,
              category: "other", // Default since onboarding doesn't save category mapping
              confidence: 80,
              verified: true,
              isGhost: false,
            });
          });
        }
      } else {
        setError("No profile found. Please complete onboarding.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch profile data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (profile?.targetRole && !profile.roadmap) {
      setRoadmapGoal(profile.targetRole);
    }
  }, [profile]);

  const generateRoadmap = async () => {
    if (!profile || !roadmapGoal.trim()) return;

    setGeneratingRoadmap(true);
    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        body: JSON.stringify({ profile, goal: roadmapGoal }),
      });
      const data = await res.json();

      if (data.success && data.data) {
        // Update local profile with new roadmap data
        const roadmapData = data.data;
        const updatedProfile = {
          ...profile,
          roadmap: roadmapData.roadmap,
          skillGaps: roadmapData.skillGaps,
          recommendedSkills: roadmapData.recommendedSkills
        };

        // Save to local storage
        localStorage.setItem("gapdebug_profile", JSON.stringify(updatedProfile));
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error("Failed to generate roadmap", error);
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-semibold">GapDebug</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left ${activeNav === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {activeNav === item.id && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-4 py-3 rounded-md bg-sidebar-accent/30">
              <div className="w-9 h-9 bg-sidebar-primary rounded-full flex items-center justify-center text-sidebar-primary-foreground font-semibold text-sm">
                {profile?.persona === "student" ? "S" : "J"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {profile?.persona === "student"
                    ? profile?.university || "Student"
                    : profile?.role || "Job Seeker"}
                </div>
                <div className="text-xs text-sidebar-foreground/60 truncate">
                  {profile?.skills?.slice(0, 3).join(", ") || "No skills added"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-foreground capitalize">
            {activeNav === "home" ? "Dashboard" : activeNav.replace("-", " ")}
          </h1>
          <div className="w-6 lg:hidden" />
        </header>

        {/* Content Area */}
        <div className="p-6">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-6 h-6 text-accent animate-spin" />
              </div>
              <p className="text-muted-foreground">Loading your dashboard...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border border-border rounded-lg p-8 text-center max-w-md mx-auto mt-12"
            >
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Failed to fetch profile
              </h2>
              <p className="text-sm text-muted-foreground mb-6">{error}</p>
              {error?.includes("No profile found") ? (
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Complete Onboarding
                </Link>
              ) : (
                <button
                  onClick={loadProfile}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground font-medium rounded-md hover:bg-accent/90 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {activeNav === "home" && (
                <div className="space-y-6">
                  {/* Welcome Card */}
                  <div className="bg-secondary text-secondary-foreground rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-2">
                      Welcome back, {profile?.name || (profile?.persona === "student" && profile?.university
                        ? `${profile.university.split(" ")[0]} student`
                        : "User")}!
                    </h2>
                    <p className="text-secondary-foreground/80">
                      Your personalized career accelerator is ready. Start
                      exploring your roadmap.
                    </p>
                  </div>

                  {/* AI Analysis Result */}
                  {profile?.analysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card border border-border rounded-lg p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="font-semibold text-card-foreground">AI Profile Analysis</h3>
                      </div>

                      <div className="mb-6 bg-muted/30 p-4 rounded-md border border-muted">
                        <p className="text-sm text-foreground/80 leading-relaxed italic">
                          &quot;{profile.analysis.summary}&quot;
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Check className="w-3 h-3 text-green-500" />
                            Verified Data
                          </div>
                          {profile.analysis.verification.verified.length > 0 ? (
                            <ul className="space-y-2">
                              {profile.analysis.verification.verified.map((item, i) => (
                                <li key={i} className="text-sm text-foreground flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No data verified yet</p>
                          )}
                        </div>

                        <div>
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                            <AlertCircle className="w-3 h-3 text-amber-500" />
                            Requires Verification
                          </div>
                          {profile.analysis.verification.unverified.length > 0 ? (
                            <ul className="space-y-2">
                              {profile.analysis.verification.unverified.map((item, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">All data verified</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Live Context Dashboard */}
                  <div className="mb-8">
                    <LiveContext />
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="font-semibold text-card-foreground mb-4">
                      Quick Actions
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        {
                          label: "View Roadmap",
                          description: "See your personalized learning path",
                          action: () => setActiveNav("roadmap"),
                        },
                        {
                          label: "Optimize Resume",
                          description: "Enhance your resume with AI",
                          action: () => setActiveNav("resume"),
                        },
                      ].map((item: { label: string; description: string; action: () => void }) => (
                        <button
                          key={item.label}
                          onClick={item.action}
                          className="flex items-center gap-4 p-4 bg-muted rounded-md hover:bg-muted/80 transition-colors text-left group"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-foreground">
                              {item.label}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.description}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeNav === "roadmap" && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        Your Learning Roadmap
                      </h2>
                      <p className="text-muted-foreground">
                        {profile?.roadmap
                          ? "Follow your personalized path to success."
                          : "Define your goal to get started."}
                      </p>
                    </div>
                  </div>

                  {/* Input OR Roadmap */}
                  {!profile?.roadmap ? (
                    <div className="bg-card border border-border rounded-lg p-8 max-w-xl mx-auto text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Target className="w-8 h-8 text-accent" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {profile.targetRole ? `Roadmap to ${profile.targetRole}` : "What do you want to become?"}
                      </h3>
                      <p className="text-muted-foreground mb-8">
                        {profile.targetRole
                          ? "We'll build a personalized learning path for this role."
                          : "Enter your dream role (e.g. \"Senior Frontend Engineer\", \"AI Researcher\") and we'll map out how to get there."}
                      </p>

                      <div className="flex flex-col gap-4">
                        <input
                          type="text"
                          placeholder="e.g. Senior Full Stack Developer"
                          value={roadmapGoal}
                          onChange={(e) => setRoadmapGoal(e.target.value)}
                          className="w-full px-4 py-3 bg-background border border-input rounded-md focus:ring-2 focus:ring-accent focus:outline-none"
                        />
                        <button
                          onClick={generateRoadmap}
                          disabled={generatingRoadmap || !roadmapGoal.trim()}
                          className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {generatingRoadmap ? (
                            <div className="py-2">
                              <ProgressiveLoader steps={ROADMAP_STEPS} />
                            </div>
                          ) : (
                            <>
                              Generate Roadmap
                              <Sparkles className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Skill Gaps & Recommendations */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Gaps */}
                        <div className="bg-card border border-border rounded-lg p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-destructive/10 rounded-md">
                              <Zap className="w-5 h-5 text-destructive" />
                            </div>
                            <h3 className="font-semibold text-lg">Skill Gaps</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {profile.skillGaps?.map((skill: string, i: number) => (
                              <span key={i} className="px-3 py-1 bg-destructive/10 text-destructive text-sm font-medium rounded-full border border-destructive/20">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Recommended */}
                        <div className="bg-card border border-border rounded-lg p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-accent/10 rounded-md">
                              <Sparkles className="w-5 h-5 text-accent" />
                            </div>
                            <h3 className="font-semibold text-lg">Recommended</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {profile.recommendedSkills?.map((skill: string, i: number) => (
                              <span key={i} className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full border border-accent/20">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="grid gap-4">
                        {profile.roadmap.map((item: { status: string; id?: string; title: string; description: string; duration: string; resources: string[] }, index: number) => (
                          <div
                            key={index} // Using index as key if ID is missing or duplicate
                            className="bg-card border border-border rounded-lg p-5 flex gap-4 hover:border-accent/50 transition-colors group"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${item.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                item.status === 'in_progress' ? 'bg-accent/10 text-accent' :
                                  'bg-muted text-muted-foreground'
                                }`}>
                                {item.status === 'completed' ? <Check className="w-4 h-4" /> : index + 1}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <h3 className="font-semibold text-lg text-foreground group-hover:text-accent transition-colors">
                                  {item.title}
                                </h3>
                                <span className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded-full whitespace-nowrap">
                                  {item.duration}
                                </span>
                              </div>
                              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                                {item.description}
                              </p>

                              {/* Resources / Actions */}
                              <div className="flex flex-wrap gap-2">
                                {item.resources.map((resource: string, i: number) => (
                                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/50 border border-muted rounded-md text-xs font-medium text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
                                    <FileText className="w-3 h-3" />
                                    {resource}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeNav === "resume" && (
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-lg font-semibold text-card-foreground mb-2">
                    Resume Optimizer
                  </h2>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Upload your resume to get AI-powered suggestions for
                    improvement.
                  </p>
                </div>
              )}

              {activeNav === "internships" && (
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-lg font-semibold text-card-foreground mb-2">
                    Internship Optimizer
                  </h2>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Discover internship opportunities matched to your skills and
                    goals.
                  </p>
                </div>
              )}
              {activeNav === "profile" && profile && (
                <div className="space-y-6">
                  {/* Verified Achievements */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-500/10 rounded-md">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                      <h3 className="font-semibold text-lg">Verified Achievements</h3>
                    </div>
                    {profile.analysis?.verification.verified.length ? (
                      <div className="space-y-3">
                        {profile.analysis.verification.verified.map((achievement, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-green-500/5 rounded-md border border-green-500/10">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                            <span className="text-foreground">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">No verified achievements yet.</p>
                    )}
                  </div>

                  {/* Skills Grid */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-accent/10 rounded-md">
                        <Zap className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="font-semibold text-lg">Your Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 bg-accent text-accent-foreground rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
