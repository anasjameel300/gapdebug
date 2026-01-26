"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Target,
  BookOpen,
  Briefcase,
  ChevronRight,
  ChevronDown,
  Check,
  Upload,
  FileText,
  TrendingUp,
  Shield,
  Sparkles,
  Twitter,
  Github,
  Linkedin,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function LandingPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-foreground tracking-tight">
              Gap<span className="text-accent">Debug</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              How it works
            </Link>
            <Link
              href="/onboarding"
              className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-accent rounded-full" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Resume Analysis & Career Accelerator
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6 text-balance">
              Your resume gets{" "}
              <span className="text-accent">7 seconds</span> of attention.
              Make them count.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              75% of resumes never reach a human. They get filtered out by ATS
              systems. We help you optimize for both machines and recruiters, so
              your skills actually get seen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-md hover:bg-primary/90 transition-colors group"
              >
                Analyze My Resume
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-medium px-6 py-3 rounded-md hover:bg-secondary/90 transition-colors"
              >
                See How It Works
              </Link>
            </div>
          </motion.div>

          {/* Value Props - Not fake stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 grid md:grid-cols-3 gap-6 max-w-3xl"
          >
            {[
              {
                icon: FileText,
                title: "ATS-Optimized Resume",
                desc: "Pass automated screening systems that filter 75% of applicants",
              },
              {
                icon: TrendingUp,
                title: "3x Better Visibility",
                desc: "Keyword-optimized resumes get 3x more recruiter views",
              },
              {
                icon: Shield,
                title: "Actionable Feedback",
                desc: "Know exactly what to fix before you hit apply",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg"
              >
                <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">
                    {item.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything you need to accelerate your career
            </h2>
            <p className="text-muted-foreground max-w-xl">
              A complete toolkit designed to identify your gaps and close them
              strategically.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "Skill Gap Analysis",
                description:
                  "Compare your current skills against industry demands and identify exactly what you need to learn.",
                color: "bg-accent",
              },
              {
                icon: BookOpen,
                title: "Personalized Roadmap",
                description:
                  "Get a week-by-week learning plan tailored to your timeline, pace, and career goals.",
                color: "bg-[#D00000]",
              },
              {
                icon: Briefcase,
                title: "Resume Optimizer",
                description:
                  "Transform your resume with industry-specific keywords and achievement-focused language.",
                color: "bg-secondary",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card p-6 rounded-lg border border-border hover:border-accent/30 transition-colors"
              >
                <div
                  className={`w-10 h-10 ${feature.color} rounded-md flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ATS Score Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Stop guessing. Start knowing.
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Most candidates apply blindly. You can see exactly how your
                resume performs against ATS filters and what recruiters actually
                notice. Fix issues before they cost you the interview.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-accent">
                  <div className="font-semibold text-foreground mb-1">
                    Did you know?
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Resumes with proper keyword optimization are{" "}
                    <span className="text-accent font-semibold">
                      3x more likely
                    </span>{" "}
                    to get past ATS screening and into human hands.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-[#22c55e]">
                  <div className="font-semibold text-foreground mb-1">
                    The opportunity
                  </div>
                  <p className="text-sm text-muted-foreground">
                    A well-structured resume increases your callback rate by up
                    to{" "}
                    <span className="text-[#22c55e] font-semibold">40%</span>.
                    Small changes, big results.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-secondary rounded-xl p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-xl font-bold text-secondary-foreground">
                  Your GapDebug Score
                </h3>
                <div className="text-4xl font-bold text-[#22c55e]">84/100</div>
              </div>

              <div className="h-3 rounded-full bg-secondary-foreground/10 mb-8 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "84%",
                    background:
                      "linear-gradient(90deg, #DC2F02 0%, #E85D04 25%, #F48C06 50%, #FAA307 75%, #22c55e 100%)",
                  }}
                />
              </div>

              <div className="space-y-1">
                {[
                  {
                    label: "Content Quality",
                    score: "28/35",
                    percent: 80,
                    status: "good",
                    detail:
                      "Strong action verbs and quantified achievements. Consider adding more metrics to your recent role.",
                  },
                  {
                    label: "ATS & Structure",
                    score: "21/25",
                    percent: 84,
                    status: "good",
                    detail:
                      "Good keyword density. Standard formatting detected. Section headers are ATS-friendly.",
                  },
                  {
                    label: "Job Optimization",
                    score: "13/25",
                    percent: 52,
                    status: "warning",
                    detail:
                      "Missing 4 key skills from target job descriptions. Add: TypeScript, AWS, CI/CD, Agile methodology.",
                  },
                  {
                    label: "Writing Quality",
                    score: "10/10",
                    percent: 100,
                    status: "good",
                    detail:
                      "No grammar issues. Clear, concise sentences. Professional tone maintained throughout.",
                  },
                  {
                    label: "Application Ready",
                    score: "5/5",
                    percent: 100,
                    status: "good",
                    detail:
                      "Contact info complete. Links working. File format compatible with major ATS systems.",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedCategory(
                          expandedCategory === item.label ? null : item.label
                        )
                      }
                      className="w-full flex items-center justify-between py-3 border-b border-secondary-foreground/10 hover:bg-secondary-foreground/5 transition-colors rounded px-2 -mx-2"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${item.status === "good" ? "bg-[#22c55e]" : "bg-[#D00000]"}`}
                        />
                        <span className="text-secondary-foreground">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold ${item.status === "good" ? "text-[#22c55e]" : "text-[#D00000]"}`}
                        >
                          {item.score}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-secondary-foreground/60 transition-transform ${expandedCategory === item.label ? "rotate-180" : ""}`}
                        />
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedCategory === item.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="py-3 px-2 text-sm text-secondary-foreground/70 bg-secondary-foreground/5 rounded-md my-2">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex-1 h-1.5 bg-secondary-foreground/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${item.percent}%`,
                                    backgroundColor:
                                      item.status === "good"
                                        ? "#22c55e"
                                        : "#D00000",
                                  }}
                                />
                              </div>
                              <span className="text-xs font-medium">
                                {item.percent}%
                              </span>
                            </div>
                            {item.detail}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <p className="text-secondary-foreground/60 text-sm mt-6 text-center">
                Click any category to see detailed feedback
              </p>

              <Link
                href="/onboarding"
                className="mt-4 w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground font-semibold py-3 rounded-md hover:bg-accent/90 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Get Your Score
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Three simple steps to transform your career trajectory.
            </p>
          </motion.div>

          <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
            {[
              {
                step: "01",
                title: "Tell us about yourself",
                description:
                  "Share your education, skills, and career aspirations through our guided onboarding.",
                detail: "We collect data points on your current academic standing, technical proficiency, and career targets to build a baseline profile."
              },
              {
                step: "02",
                title: "Get your analysis",
                description:
                  "Our system analyzes your profile against thousands of job postings and successful candidates.",
                detail: "Our AI engine compares your profile against real-time market data to identify gaps, strengths, and opportunities for growth."
              },
              {
                step: "03",
                title: "Follow your roadmap",
                description:
                  "Execute your personalized learning plan and watch your employability score climb.",
                detail: "Receive a week-by-week action plan containing curated resources, projects, and certifications to bridge your skill gaps."
              },
            ].map((item, i) => (
              <AccordionItem key={item.step} value={`item-${i}`} className="bg-muted/30 border border-border rounded-lg px-2">
                <AccordionTrigger className="hover:no-underline px-4 py-4">
                  <div className="flex gap-6 items-center text-left">
                    <div className="text-4xl font-bold text-accent/20">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-normal mt-1">{item.description}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="pl-[4.5rem] text-muted-foreground">
                    {item.detail}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-md hover:bg-primary/90 transition-colors text-lg"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-secondary text-secondary-foreground border-t border-border">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="font-bold text-xl">
                Gap<span className="text-primary">Debug</span>
              </span>
            </Link>
            <p className="text-sm text-secondary-foreground/60 max-w-xs leading-relaxed">
              Bridging the gap between education and employment. Our AI-driven platform helps you identify skill deficiencies and build a personalized roadmap to your dream career.
            </p>
            <div className="flex gap-4 mt-6">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/onboarding" className="hover:text-primary transition-colors">Get Started</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-secondary-foreground/50">
          <p>© {new Date().getFullYear()} GapDebug. All rights reserved.</p>
          <p>Designed with intentional minimalism.</p>
        </div>
      </footer>
    </div>
  );
}
