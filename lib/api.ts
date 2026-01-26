const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface UserProfile {
  persona: 'student' | 'job_seeker';
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

  const response = await fetch(`${API_BASE_URL}/parse-resume`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload resume: ${response.statusText}`);
  }

  return response.json();
}

export async function submitOnboardingData(data: UserProfile): Promise<ApiResponse<{ profileId: string; verified: boolean }>> {
  const response = await fetch(`${API_BASE_URL}/verify-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit profile: ${response.statusText}`);
  }

  return response.json();
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
