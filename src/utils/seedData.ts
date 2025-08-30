import { supabase } from "@/integrations/supabase/client";

const sampleClients = [
  {
    name: "Sarah Chen",
    company: "TechFlow Solutions",
    email: "sarah.chen@techflow.com",
    phone: "+1 (555) 123-4567",
    status: "active" as const,
    deal_value: 45000,
    avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b332c8f8?w=150&h=150&fit=crop&crop=face",
    last_contact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Analytical buyer, needs detailed ROI analysis. Daughter at MIT studying CS."
  },
  {
    name: "Mike Rodriguez",
    company: "StartupX",
    email: "mike@startupx.co",
    phone: "+1 (555) 987-6543",
    status: "hot_lead" as const,
    deal_value: 120000,
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    last_contact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Former founder, moves fast. Loves cutting-edge solutions. Golf enthusiast."
  },
  {
    name: "Lisa Wang",
    company: "Enterprise Corp",
    email: "lisa.wang@enterprise.com",
    phone: "+1 (555) 456-7890",
    status: "prospect" as const,
    deal_value: 200000,
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    last_contact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Conservative decision maker, 15+ years in procurement. Risk-averse, thorough evaluation process."
  },
  {
    name: "James Thompson",
    company: "InnovateCorp",
    email: "j.thompson@innovate.com",
    phone: "+1 (555) 321-9876",
    status: "closed_won" as const,
    deal_value: 85000,
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    last_contact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Tech-savvy VP Engineering. Decisive and direct communication style."
  }
];

const sampleCommunications = [
  // Sarah Chen communications
  {
    client_name: "Sarah Chen",
    type: "call" as const,
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
    type: "email" as const,
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
    type: "call" as const,
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
    type: "message" as const,
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
    type: "email" as const,
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

export const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");

    // First, insert clients
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .insert(sampleClients)
      .select();

    if (clientsError) {
      console.error("Error inserting clients:", clientsError);
      return;
    }

    console.log("Clients inserted successfully:", clientsData);

    // Create a mapping of client names to IDs
    const clientNameToId: Record<string, string> = {};
    clientsData.forEach(client => {
      clientNameToId[client.name] = client.id;
    });

    // Insert communications with correct client IDs
    const communicationsWithIds = sampleCommunications.map(comm => ({
      client_id: clientNameToId[comm.client_name],
      type: comm.type,
      subject: comm.subject,
      content: comm.content,
      date: comm.date
    }));

    const { data: commsData, error: commsError } = await supabase
      .from('communications')
      .insert(communicationsWithIds)
      .select();

    if (commsError) {
      console.error("Error inserting communications:", commsError);
      return;
    }

    console.log("Communications inserted successfully:", commsData);
    console.log("Database seeding completed successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
  }
};