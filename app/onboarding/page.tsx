"use client";

import React from "react"

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Briefcase,
  X,
  Linkedin,
  Github,
  Twitter,
  Upload,
  Loader2,
  Check,
  Sparkles,
} from "lucide-react";
import { submitOnboardingData, uploadResume, type UserProfile } from "@/lib/api";
import Link from "next/link";

const STEPS = ["Persona", "Skills", "Socials", "Achievements", "Verification"];

const SKILL_CATEGORIES = {
  "Programming Languages": [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Go",
    "Rust",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
  ],
  "Frontend": [
    "React",
    "Vue.js",
    "Angular",
    "Next.js",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Sass",
    "Redux",
    "Svelte",
  ],
  "Backend": [
    "Node.js",
    "Express",
    "Django",
    "Flask",
    "Spring Boot",
    "FastAPI",
    "GraphQL",
    "REST APIs",
    "PostgreSQL",
    "MongoDB",
  ],
  "DevOps & Cloud": [
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Terraform",
    "Linux",
    "Git",
    "Jenkins",
  ],
  "Data & AI": [
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "Data Analysis",
    "SQL",
    "Pandas",
    "NumPy",
    "R",
    "Tableau",
  ],
  "Design & Tools": [
    "Figma",
    "Adobe XD",
    "Photoshop",
    "Illustrator",
    "UI/UX Design",
    "Sketch",
    "InVision",
    "Zeplin",
  ],
  "Soft Skills": [
    "Communication",
    "Leadership",
    "Problem Solving",
    "Teamwork",
    "Project Management",
    "Agile",
    "Scrum",
    "Time Management",
  ],
};

const ALL_SKILLS = Object.values(SKILL_CATEGORIES).flat();

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserProfile>({
    persona: "student",
    university: "",
    gradYear: "",
    role: "",
    yearsOfExperience: 0,
    skills: [],
    socials: {
      linkedin: "",
      github: "",
      twitter: "",
    },
    achievements: "",
    resumeUrl: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const updateFormData = useCallback(
    (updates: Partial<UserProfile>) => {
      setFormData((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const addSkill = useCallback(() => {
    const trimmed = skillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
      setSkillInput("");
    }
  }, [skillInput, formData.skills]);

  const removeSkill = useCallback((skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  }, []);

  const toggleSkill = useCallback((skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  }, []);

  const filteredSkills = skillSearch
    ? ALL_SKILLS.filter((skill) =>
      skill.toLowerCase().includes(skillSearch.toLowerCase())
    )
    : [];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSkill();
      }
    },
    [addSkill]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setResumeFile(file);
      }
    },
    []
  );

  const nextStep = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (resumeFile) {
        const uploadResult = await uploadResume(resumeFile);
        if (uploadResult.data?.url) {
          formData.resumeUrl = uploadResult.data.url;
        }
      }

      const result = await submitOnboardingData(formData);

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Verification failed. Please try again.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, resumeFile, router]);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 0:
        if (formData.persona === "student") {
          return formData.university && formData.gradYear;
        }
        return formData.role && formData.yearsOfExperience !== undefined;
      case 1:
        return formData.skills.length > 0;
      case 2:
        return true;
      case 3:
        return true;
      default:
        return true;
    }
  }, [currentStep, formData]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-md flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-lg text-foreground">
              GapDebug
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {STEPS.map((step, i) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors ${i === currentStep
                    ? "bg-accent"
                    : i < currentStep
                      ? "bg-primary"
                      : "bg-border"
                  }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-muted">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={currentStep}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Step 1: Persona */}
              {currentStep === 0 && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      Tell us who you are
                    </h1>
                    <p className="text-muted-foreground">
                      This helps us personalize your experience.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => updateFormData({ persona: "student" })}
                      className={`p-6 rounded-lg border-2 transition-all text-left ${formData.persona === "student"
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                        }`}
                    >
                      <GraduationCap
                        className={`w-8 h-8 mb-3 ${formData.persona === "student" ? "text-accent" : "text-muted-foreground"}`}
                      />
                      <div className="font-semibold text-foreground">
                        Student
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Currently in school
                      </div>
                    </button>

                    <button
                      onClick={() => updateFormData({ persona: "job_seeker" })}
                      className={`p-6 rounded-lg border-2 transition-all text-left ${formData.persona === "job_seeker"
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                        }`}
                    >
                      <Briefcase
                        className={`w-8 h-8 mb-3 ${formData.persona === "job_seeker" ? "text-accent" : "text-muted-foreground"}`}
                      />
                      <div className="font-semibold text-foreground">
                        Job Seeker
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Looking for work
                      </div>
                    </button>
                  </div>

                  {formData.persona === "student" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          University
                        </label>
                        <input
                          type="text"
                          value={formData.university}
                          onChange={(e) =>
                            updateFormData({ university: e.target.value })
                          }
                          placeholder="e.g. Stanford University"
                          className="w-full px-4 py-3 bg-card border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Expected Graduation Year
                        </label>
                        <input
                          type="text"
                          value={formData.gradYear}
                          onChange={(e) =>
                            updateFormData({ gradYear: e.target.value })
                          }
                          placeholder="e.g. 2025"
                          className="w-full px-4 py-3 bg-card border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </motion.div>
                  )}

                  {formData.persona === "job_seeker" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Target Role
                        </label>
                        <input
                          type="text"
                          value={formData.role}
                          onChange={(e) =>
                            updateFormData({ role: e.target.value })
                          }
                          placeholder="e.g. Frontend Developer"
                          className="w-full px-4 py-3 bg-card border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          value={formData.yearsOfExperience || ""}
                          onChange={(e) =>
                            updateFormData({
                              yearsOfExperience: parseInt(e.target.value) || 0,
                            })
                          }
                          placeholder="e.g. 2"
                          min="0"
                          className="w-full px-4 py-3 bg-card border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 2: Skills */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      What skills do you have?
                    </h1>
                    <p className="text-muted-foreground">
                      Search and select your skills, or add custom ones.
                    </p>
                  </div>

                  {/* Selected Skills */}
                  {formData.skills.length > 0 && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                        Selected ({formData.skills.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill) => (
                          <motion.span
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-accent-foreground rounded-md text-sm font-medium"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="hover:opacity-70 transition-opacity"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Search Skills */}
                  <div className="relative">
                    <input
                      type="text"
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                      placeholder="Search skills..."
                      className="w-full px-4 py-3 bg-card border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {skillSearch && filteredSkills.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-input rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                        {filteredSkills.slice(0, 8).map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => {
                              toggleSkill(skill);
                              setSkillSearch("");
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center justify-between ${formData.skills.includes(skill)
                                ? "text-accent font-medium"
                                : "text-foreground"
                              }`}
                          >
                            {skill}
                            {formData.skills.includes(skill) && (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(SKILL_CATEGORIES).map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() =>
                          setActiveCategory(
                            activeCategory === category ? null : category
                          )
                        }
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeCategory === category
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Skills Grid */}
                  {activeCategory && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-2 p-4 bg-card border border-border rounded-lg"
                    >
                      {SKILL_CATEGORIES[
                        activeCategory as keyof typeof SKILL_CATEGORIES
                      ].map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${formData.skills.includes(skill)
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {/* Add Custom Skill */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                      Add custom skill
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a skill not listed above..."
                        className="flex-1 px-4 py-2.5 bg-card border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        disabled={!skillInput.trim()}
                        className="px-4 py-2.5 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Socials */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      Connect your profiles
                    </h1>
                    <p className="text-muted-foreground">
                      Optional, but helps us understand your background better.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <Linkedin className="w-4 h-4 text-[#0077B5]" />
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={formData.socials.linkedin}
                        onChange={(e) =>
                          updateFormData({
                            socials: {
                              ...formData.socials,
                              linkedin: e.target.value,
                            },
                          })
                        }
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full px-4 py-3 bg-card border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <Github className="w-4 h-4" />
                        GitHub
                      </label>
                      <input
                        type="url"
                        value={formData.socials.github}
                        onChange={(e) =>
                          updateFormData({
                            socials: {
                              ...formData.socials,
                              github: e.target.value,
                            },
                          })
                        }
                        placeholder="https://github.com/yourusername"
                        className="w-full px-4 py-3 bg-card border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                        Twitter
                      </label>
                      <input
                        type="url"
                        value={formData.socials.twitter}
                        onChange={(e) =>
                          updateFormData({
                            socials: {
                              ...formData.socials,
                              twitter: e.target.value,
                            },
                          })
                        }
                        placeholder="https://twitter.com/yourhandle"
                        className="w-full px-4 py-3 bg-card border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Achievements */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      Share your achievements
                    </h1>
                    <p className="text-muted-foreground">
                      Hackathons, olympiads, certifications, and more.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Hackathons & Competitions
                      </label>
                      <textarea
                        value={formData.achievements}
                        onChange={(e) =>
                          updateFormData({ achievements: e.target.value })
                        }
                        placeholder="e.g. Won 2nd place at HackMIT 2024, Participated in Google Code Jam..."
                        rows={4}
                        className="w-full px-4 py-3 bg-card border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Resume Upload
                      </label>
                      <div
                        className={`border-2 border-dashed rounded-md p-8 text-center transition-colors ${resumeFile
                            ? "border-accent bg-accent/5"
                            : "border-input hover:border-accent/50"
                          }`}
                      >
                        {resumeFile ? (
                          <div className="flex items-center justify-center gap-3">
                            <Check className="w-5 h-5 text-accent" />
                            <span className="text-foreground font-medium">
                              {resumeFile.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => setResumeFile(null)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            <div className="text-sm text-foreground font-medium">
                              Click to upload or drag and drop
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              PDF, DOC, or DOCX (max 5MB)
                            </div>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Verification */}
              {currentStep === 4 && (
                <div className="text-center py-12">
                  {isSubmitting ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                        <Loader2 className="w-8 h-8 text-accent animate-spin" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                          Analyzing Profile...
                        </h1>
                        <p className="text-muted-foreground">
                          We&apos;re processing your information and building
                          your personalized roadmap.
                        </p>
                      </div>
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                          Profile saved
                        </h1>
                        <p className="text-muted-foreground mb-6">
                          We couldn&apos;t verify all details, but your profile
                          has been saved. You can continue to the dashboard.
                        </p>
                        <div className="flex flex-col gap-3">
                          <Link
                            href="/dashboard"
                            className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors text-center"
                          >
                            Continue to Dashboard
                          </Link>
                          <button
                            onClick={handleSubmit}
                            className="px-6 py-3 bg-muted text-muted-foreground font-medium rounded-md hover:bg-muted/80 transition-colors"
                          >
                            Try Verification Again
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                          Ready to analyze
                        </h1>
                        <p className="text-muted-foreground mb-6">
                          Click below to submit your profile and get your
                          personalized career roadmap.
                        </p>
                        <button
                          onClick={handleSubmit}
                          className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors"
                        >
                          Analyze My Profile
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Navigation Footer */}
      {currentStep < 4 && (
        <footer className="border-t border-border bg-card p-6">
          <div className="max-w-xl mx-auto flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
