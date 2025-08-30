import { DISCProfile, getDominantType } from "@/types/disc";

// Jeff Bezos DISC Profile - Based on known leadership traits and public behavior
export const jeffBezosProfile: DISCProfile = {
  id: "jeff-bezos-001",
  name: "Jeff Bezos",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  scores: {
    dominance: 95,        // Extremely high - decisive leadership, risk-taking, results-driven
    influence: 75,        // High - charismatic leader, persuasive, visionary communication
    steadiness: 25,       // Low - embraces change, disruption, fast-paced environments
    conscientiousness: 85 // High - detail-oriented, analytical, data-driven decisions
  },
  indicators: {
    dominance: {
      decisionSpeed: 98,           // Lightning-fast decisions, "disagree and commit"
      directCommunication: 92,     // Direct, sometimes blunt communication style
      resultsFocus: 96,           // Obsessive focus on results and metrics
      controlPreference: 90       // Strong preference for control and authority
    },
    influence: {
      socialInteraction: 78,      // Comfortable in public, shareholder meetings
      enthusiasm: 85,             // Passionate about vision and innovation
      peopleFocus: 65,           // Focus on customers more than individual employees
      collaboration: 70           // Collaborative when it serves strategic goals
    },
    steadiness: {
      consistency: 30,            // Frequent pivots and strategic changes
      supportiveLanguage: 20,     // Direct feedback, high standards
      stabilityPreference: 15,    // Thrives on disruption and change
      teamOrientation: 35        // Individual contributor mindset at scale
    },
    conscientiousness: {
      detailOriented: 90,         // Famous for diving into details
      analyticalQuestions: 95,    // Data-driven, asks probing questions
      precisionInLanguage: 80,    // Precise in important communications
      qualityFocus: 85           // High standards for execution and quality
    }
  },
  primaryType: 'D',
  secondaryType: 'C',
  lastUpdated: new Date('2024-01-15'),
  confidence: 92
};

// Additional sample profiles for testing
export const sampleProfiles: DISCProfile[] = [
  jeffBezosProfile,
  
  // Oprah Winfrey - High I, Secondary S
  {
    id: "oprah-winfrey-001",
    name: "Oprah Winfrey",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b0e8?w=150&h=150&fit=crop&crop=face",
    scores: {
      dominance: 65,
      influence: 95,
      steadiness: 80,
      conscientiousness: 70
    },
    indicators: {
      dominance: {
        decisionSpeed: 70,
        directCommunication: 60,
        resultsFocus: 75,
        controlPreference: 55
      },
      influence: {
        socialInteraction: 98,
        enthusiasm: 97,
        peopleFocus: 95,
        collaboration: 85
      },
      steadiness: {
        consistency: 85,
        supportiveLanguage: 90,
        stabilityPreference: 75,
        teamOrientation: 80
      },
      conscientiousness: {
        detailOriented: 70,
        analyticalQuestions: 65,
        precisionInLanguage: 75,
        qualityFocus: 80
      }
    },
    primaryType: 'I',
    secondaryType: 'S',
    lastUpdated: new Date('2024-01-10'),
    confidence: 88
  },

  // Tim Cook - High S, Secondary C  
  {
    id: "tim-cook-001",
    name: "Tim Cook",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    scores: {
      dominance: 55,
      influence: 60,
      steadiness: 90,
      conscientiousness: 85
    },
    indicators: {
      dominance: {
        decisionSpeed: 60,
        directCommunication: 50,
        resultsFocus: 70,
        controlPreference: 45
      },
      influence: {
        socialInteraction: 65,
        enthusiasm: 55,
        peopleFocus: 70,
        collaboration: 75
      },
      steadiness: {
        consistency: 95,
        supportiveLanguage: 85,
        stabilityPreference: 90,
        teamOrientation: 88
      },
      conscientiousness: {
        detailOriented: 88,
        analyticalQuestions: 82,
        precisionInLanguage: 85,
        qualityFocus: 90
      }
    },
    primaryType: 'S',
    secondaryType: 'C',
    lastUpdated: new Date('2024-01-08'),
    confidence: 85
  }
];

// Function to get profile by ID
export const getProfileById = (id: string): DISCProfile | undefined => {
  return sampleProfiles.find(profile => profile.id === id);
};

// Function to get random sample profile
export const getRandomProfile = (): DISCProfile => {
  const randomIndex = Math.floor(Math.random() * sampleProfiles.length);
  return sampleProfiles[randomIndex];
};
