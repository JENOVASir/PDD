import React from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface FeatureListItem {
  icon: React.ReactNode;
  text: string;
}

export interface GeneratedItem {
  id: string;
  name_fa: string; // Name in Persian
  rank_fa: string; // Rank in Persian (e.g., معمولی، کمیاب، افسانه‌ای)
  level: number; // Numerical level
  description_fa: string; // Description in Persian
  imageUrl: string; // URL of the generated image
  image_prompt: string; // Prompt used to generate the image
}

export interface World {
  id: string;
  name: string; // World name is now required
  userDescription: string;
  aiGeneratedDetails: string;
  mapConcept: string; // Textual map concept
}

export interface Character {
  id: string;
  name: string;
  worldId: string;
  inventory: GeneratedItem[];
  age?: string;
  characterClass?: string;
  race?: string;
  userDescription?: string; // User's initial description
  aiGeneratedDetails?: string; // AI-expanded details
  imageUrl?: string; // Avatar image URL
  imagePrompt?: string; // Prompt used for avatar
}

export interface AdventureMessage {
  id: string;
  sender: 'user' | 'ai' | 'system'; // System for dice rolls or important events
  text: string;
  timestamp: Date;
}

export type ViewMode = 'home' | 'adventure' | 'worlds' | 'map_display'; // Renamed 'characters' to 'worlds'

export interface AdventureLogCollection {
  [characterId: string]: AdventureMessage[];
}