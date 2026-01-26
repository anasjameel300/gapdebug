const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface UserProfile {
  persona: 'student' | 'job_seeker';
  name?: string;
  university?: string;
  gradYear?: string;
  role?: string;
  yearsOfExperience?: number;
  skills: string[];
  socials: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  achievements?: string;
  resumeUrl?: string;
  roadmap?: RoadmapItem[];
  analysis?: {
    summary: string;
    verification: {
      verified: string[];
      unverified: string[];
    };
  };
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  resources: string[];
  status: 'pending' | 'in_progress' | 'completed';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function uploadResume(file: File): Promise<ApiResponse<{ url: string; parsedData: Record<string, unknown> }>> {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch('/api/parse-resume', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload resume: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Simulates analyzing the profile from verified sources (GitHub).
 */
export async function analyzeProfile(data: UserProfile): Promise<ApiResponse<Partial<UserProfile>>> {
  const response = await fetch('/api/analyze-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ profile: data }),
  });

  if (!response.ok) {
    throw new Error(`Failed to analyze profile: ${response.statusText}`);
  }

  const result = await response.json();
  return {
    success: true,
    data: result.data
  };
}

export async function submitOnboardingData(data: UserProfile): Promise<ApiResponse<{ profileId: string; }>> {
  // 1. Save Profile (In a real scenario, POST to /api/profile)
  // For now, we assume local storage handling is primary for the prototype, 
  // or we could save to a lightweight DB here.

  // We explicitly DO NOT generate the roadmap here anymore.

  return {
    success: true,
    data: {
      profileId: "local-session-id",
    }
  };
}

export async function fetchRoadmap(goal: string): Promise<ApiResponse<{ roadmap: RoadmapItem[] }>> {
  const response = await fetch(`${API_BASE_URL}/generate-pathway?goal=${encodeURIComponent(goal)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch roadmap: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchUserProfile(): Promise<ApiResponse<UserProfile>> {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.statusText}`);
  }

  return response.json();
}
