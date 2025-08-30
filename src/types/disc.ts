// DISC Behavioral Assessment Types

export interface DISCScore {
  dominance: number;     // D: 0-100
  influence: number;     // I: 0-100  
  steadiness: number;    // S: 0-100
  conscientiousness: number; // C: 0-100
}

export interface DISCBehavioralIndicators {
  dominance: {
    decisionSpeed: number;           // Fast decision making
    directCommunication: number;     // Direct, assertive language
    resultsFocus: number;           // Results-oriented language
    controlPreference: number;      // Preference for authority/control
  };
  influence: {
    socialInteraction: number;      // Frequency of social engagement
    enthusiasm: number;             // Enthusiastic communication style
    peopleFocus: number;           // People-oriented language
    collaboration: number;          // Collaborative tendencies
  };
  steadiness: {
    consistency: number;            // Consistent response patterns
    supportiveLanguage: number;     // Supportive, nurturing language
    stabilityPreference: number;    // Preference for stable environments
    teamOrientation: number;        // Team-focused behavior
  };
  conscientiousness: {
    detailOriented: number;         // Detail-focused communications
    analyticalQuestions: number;    // Analytical question patterns
    precisionInLanguage: number;    // Precise, careful language
    qualityFocus: number;          // Quality-focused concerns
  };
}

export interface DISCProfile {
  id: string;
  name: string;
  avatar?: string;
  scores: DISCScore;
  indicators: DISCBehavioralIndicators;
  primaryType: 'D' | 'I' | 'S' | 'C';
  secondaryType?: 'D' | 'I' | 'S' | 'C';
  lastUpdated: Date;
  confidence: number; // 0-100 - confidence in assessment
}

export interface DISCInsight {
  type: 'strength' | 'challenge' | 'communication_tip' | 'motivation';
  title: string;
  description: string;
  category: 'D' | 'I' | 'S' | 'C';
}

export interface DISCAnalysis {
  profile: DISCProfile;
  insights: DISCInsight[];
  communicationStyle: string;
  motivationFactors: string[];
  stressIndicators: string[];
  idealEnvironment: string[];
}

// Utility functions
export const getDominantType = (scores: DISCScore): 'D' | 'I' | 'S' | 'C' => {
  const { dominance, influence, steadiness, conscientiousness } = scores;
  const max = Math.max(dominance, influence, steadiness, conscientiousness);
  
  if (max === dominance) return 'D';
  if (max === influence) return 'I';
  if (max === steadiness) return 'S';
  return 'C';
};

export const getTypeDescription = (type: 'D' | 'I' | 'S' | 'C'): string => {
  const descriptions = {
    D: 'Dominance - Direct, Results-Driven, Decisive',
    I: 'Influence - Enthusiastic, Optimistic, People-Oriented',
    S: 'Steadiness - Patient, Reliable, Team-Oriented',
    C: 'Conscientiousness - Analytical, Precise, Quality-Focused'
  };
  return descriptions[type];
};

export const getTypeColor = (type: 'D' | 'I' | 'S' | 'C'): string => {
  const colors = {
    D: '#ef4444', // Red - Bold, powerful
    I: '#f59e0b', // Amber - Energetic, warm
    S: '#22c55e', // Green - Stable, harmonious  
    C: '#3b82f6'  // Blue - Analytical, precise
  };
  return colors[type];
};
