import { DISCProfile } from "@/types/disc";
import { generateDISCProfileFromCommunications, Communication } from "@/utils/discAnalysis";

// Import the actual conversation data from seedData
const sampleCommunications: Communication[] = [
  // Sarah Chen communications
  {
    client_name: "Sarah Chen",
    type: "call",
    subject: "Discovery Call - Budget Discussion",
    content: `Call Duration: 45 minutes
Attendees: Sarah Chen (CFO), John Kim (IT Director)

Key Discussion Points:
- Budget allocation for Q4 technology initiatives ($50K approved)
- ROI requirements: minimum 25% improvement in efficiency
- Timeline: Implementation needed before fiscal year end
- Concerns about integration with existing Oracle systems
- Mentioned daughter at MIT studying computer science, very proud
- Asked about security compliance and data protection measures

Sarah's Communication Style:
- Very analytical, asks detailed questions
- Wants data-driven proof points and case studies
- Risk-averse, needs multiple vendor references
- Takes detailed notes during conversations
- Prefers email follow-ups with written documentation

Next Steps:
- Send ROI calculator with industry benchmarks
- Provide 3 customer references in similar industries
- Schedule technical deep-dive with IT team
- Prepare security compliance documentation`,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    client_name: "Sarah Chen",
    type: "email",
    subject: "Re: Security Compliance Questions",
    content: `Hi Sarah,

Thank you for the detailed questions about our security compliance. As requested, here are the specifics:

1. SOC 2 Type II certification (renewed annually)
2. GDPR compliance with data residency options
3. End-to-end encryption for all data in transit and at rest
4. Regular penetration testing by third-party security firms

I noticed you mentioned your daughter is studying computer science at MIT - that's fantastic! Our CTO actually graduated from MIT's CSAIL program. 

I've attached our complete security documentation and compliance certificates. Would you like to schedule a 30-minute call with our security team to address any remaining concerns?

Looking forward to moving forward with the proposal.

Best regards,
Alex`,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },

  // Mike Rodriguez communications
  {
    client_name: "Mike Rodriguez",
    type: "call",
    subject: "Product Demo & Strategy Discussion",
    content: `Call Duration: 30 minutes
Attendee: Mike Rodriguez (CEO)

Mike's Background:
- Former founder of two successful startups (both acquired)
- Sold last company to Microsoft for $50M
- Very relationship-focused, likes to know the people behind the product
- Golf enthusiast - plays at Pebble Beach regularly
- Moves fast, doesn't like lengthy evaluation processes

Discussion Highlights:
- Impressed by our AI capabilities and roadmap vision
- Wants to be an early adopter of cutting-edge features
- Budget is not a primary concern, more focused on innovation
- Asked about our founding team and company culture
- Mentioned he's looking for strategic partnerships, not just vendors
- Wants quarterly business reviews with our executive team

Communication Style:
- Very casual and friendly
- Makes decisions quickly based on gut feeling and team chemistry
- Prefers phone calls over email
- Likes to talk about business strategy and market trends
- Values personal relationships highly

Action Items:
- Introduce him to our CEO for a peer-to-peer conversation
- Invite him to our annual user conference as VIP guest
- Propose pilot program with newest AI features
- Send executive summary instead of detailed technical specs`,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    client_name: "Mike Rodriguez",
    type: "message",
    subject: "Quick question about integration",
    content: `Hey Alex,

Quick question - can your platform integrate with Slack and Teams simultaneously? 

Our dev team uses Slack but exec team is on Teams. Want to make sure we can push notifications to both.

Also, any chance you'll be at the TechCrunch Disrupt conference next month? Would love to grab coffee if you're there.

Cheers,
Mike

P.S. Shot a 78 at Pebble Beach last weekend! Getting better 😄`,
    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },

  // Lisa Wang communications
  {
    client_name: "Lisa Wang",
    type: "email",
    subject: "Vendor Evaluation Process - Next Steps",
    content: `Dear Alex,

Thank you for your comprehensive proposal submitted on October 15th. Our procurement team has completed the initial review and I wanted to update you on our evaluation process.

Current Status:
- Technical evaluation: Complete (passed all requirements)
- Financial review: In progress with our CFO
- Reference checks: Scheduled for next week
- Security audit: Pending IT security team approval

Evaluation Committee:
- Lisa Wang (Procurement Director) - Lead
- Robert Kim (IT Director)
- Jennifer Adams (CFO)
- Michael Stevens (Legal Counsel)

Timeline:
- Week 1: Complete reference calls
- Week 2: Present findings to executive committee
- Week 3: Final vendor selection
- Week 4: Contract negotiations

Please note that we are evaluating three vendors in total. All vendors must meet our stringent requirements for:
1. Financial stability (5+ years of audited financials required)
2. Enterprise-grade security compliance
3. 24/7 support with guaranteed response times
4. Minimum 3 customer references in Fortune 500 companies

I have 15 years of experience in enterprise procurement and always ensure thorough due diligence. We prefer established relationships with vendors who can grow with us long-term.

Please provide the following additional documentation:
- Latest D&B business credit report
- Professional liability insurance certificate
- Detailed implementation timeline with milestones

Best regards,
Lisa Wang
Director of Procurement
Enterprise Corp`,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Generate DISC profiles from actual conversations
export const conversationBasedProfiles: DISCProfile[] = [
  generateDISCProfileFromCommunications(
    "Sarah Chen", 
    sampleCommunications.filter(c => c.client_name === "Sarah Chen")
  ),
  generateDISCProfileFromCommunications(
    "Mike Rodriguez", 
    sampleCommunications.filter(c => c.client_name === "Mike Rodriguez")
  ),
  generateDISCProfileFromCommunications(
    "Lisa Wang", 
    sampleCommunications.filter(c => c.client_name === "Lisa Wang")
  )
];

// Add avatars to match the seedData clients
conversationBasedProfiles[0].avatar = "https://images.unsplash.com/photo-1494790108755-2616b332c8f8?w=150&h=150&fit=crop&crop=face";
conversationBasedProfiles[1].avatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
conversationBasedProfiles[2].avatar = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face";

// Function to get communications for a specific client
export const getCommunicationsForClient = (clientName: string): Communication[] => {
  return sampleCommunications.filter(c => c.client_name === clientName);
};

// Function to get profile by client name
export const getConversationProfileByName = (name: string): DISCProfile | undefined => {
  return conversationBasedProfiles.find(profile => profile.name === name);
};

// Function to get profile by ID (for compatibility with existing code)
export const getConversationProfileById = (id: string): DISCProfile | undefined => {
  return conversationBasedProfiles.find(profile => profile.id === id);
};

// Export default profile (Sarah Chen for initial display)
export const defaultConversationProfile = conversationBasedProfiles[0];
