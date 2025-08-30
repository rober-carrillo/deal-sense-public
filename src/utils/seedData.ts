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
    status: "prospect" as const,  // Changed from "hot_lead" to "prospect"
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
    status: "active" as const,  // Changed from "closed_won" to "active"
    deal_value: 85000,
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    last_contact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Tech-savvy VP Engineering. Decisive and direct communication style."
  }
];

const sampleCommunications = [
  // James Thompson communications
  {
    client_name: "James Thompson",
    type: "call" as const,
    subject: "Kickoff Call - Implementation Plan",
    content: `Call Duration: 55 minutes
Attendees: James Thompson (VP Engineering), Alex (AE), Priya (Implementation Lead)

Transcript:
James: What’s the expected timeline for full deployment?
Priya: 4-6 weeks, depending on integration complexity. We’ll provide a detailed project plan.
James: What resources do you need from our side?
Priya: A technical lead and access to your staging environment.`,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    client_name: "James Thompson",
    type: "email" as const,
    subject: "Re: Project Plan and Next Steps",
    content: `Hi James,

Attached is the detailed project plan. Please review and let me know if you have any questions or want to schedule a follow-up call.

Best,
Alex`,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    client_name: "James Thompson",
    type: "call" as const,
    subject: "Technical Deep Dive",
    content: `Call Duration: 70 minutes
Attendees: James Thompson (VP Engineering), Alex (AE), Priya (Lead Engineer)

Transcript:
James: Can you show us the API documentation and sample code?
Priya: Absolutely, I’ll send you the docs and a Postman collection.
James: What about SLAs and uptime guarantees?
Alex: We offer 99.9% uptime and have a dedicated support team.`,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    client_name: "James Thompson",
    type: "message" as const,
    subject: "Quick question about API limits",
    content: `Hi Alex,

What are the API rate limits for the enterprise plan?

Thanks,
James`,
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
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
  {
    client_name: "Sarah Chen",
    type: "call" as const,
    subject: "Technical Deep Dive - Integration",
    content: `Call Duration: 60 minutes
Attendees: Sarah Chen (CFO), John Kim (IT Director), Priya Patel (Lead Engineer)

Transcript:
Sarah: Can you walk us through the integration process with Oracle?
Priya: Absolutely. We use RESTful APIs and have pre-built connectors for Oracle and SAP. The process typically takes 2-3 weeks.
John: What about data migration and downtime?
Priya: We do a staged migration with zero downtime. Our team will provide a detailed migration plan.
Sarah: That’s great. Can you send over a sample migration plan and references from other Oracle customers?
Priya: Of course, I’ll email those today.`,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    client_name: "Sarah Chen",
    type: "email" as const,
    subject: "Follow-up: ROI Calculator Attached",
    content: `Hi Sarah,

Attached is the ROI calculator with industry benchmarks. Please let me know if you have any questions or want to schedule a review session.

Best,
Alex`,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    client_name: "Sarah Chen",
    type: "message" as const,
    subject: "Quick question about references",
    content: `Hi Alex,

Can you provide references from other SaaS companies in the healthcare sector?

Thanks,
Sarah`,
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
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
  {
    client_name: "Mike Rodriguez",
    type: "call" as const,
    subject: "Quarterly Business Review Planning",
    content: `Call Duration: 40 minutes
Attendees: Mike Rodriguez (CEO), Alex (AE), Priya (CSM)

Transcript:
Mike: I want to make sure we’re getting the most out of the platform. What new features are coming next quarter?
Alex: We’re launching advanced analytics and a new mobile app. I’ll send you the roadmap.
Mike: Great, and can you connect me with your CTO for a technical deep dive?
Alex: Absolutely, I’ll set that up.`,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    client_name: "Mike Rodriguez",
    type: "email" as const,
    subject: "Re: Executive Summary Attached",
    content: `Hi Mike,

Attached is the executive summary you requested. Let me know if you have any questions or want to discuss further.

Best,
Alex`,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    client_name: "Mike Rodriguez",
    type: "message" as const,
    subject: "Golf at Pebble Beach",
    content: `Hey Alex,

Let’s schedule a round of golf at Pebble Beach next month. I’ll bring a few friends from the industry.

Cheers,
Mike`,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
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
  },
  {
    client_name: "Lisa Wang",
    type: "call" as const,
    subject: "Reference Check Call",
    content: `Call Duration: 35 minutes
Attendees: Lisa Wang (Procurement Director), Alex (AE), Customer Reference (CIO at MedTech Inc)

Transcript:
Lisa: Can you share your experience with the implementation process?
Reference: The team was very professional, and the project was delivered on time. Minimal disruption to our operations.
Lisa: Any issues with support or product reliability?
Reference: No major issues. Support is responsive and knowledgeable.
Lisa: Would you recommend them to other enterprises?
Reference: Absolutely.`,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    client_name: "Lisa Wang",
    type: "email" as const,
    subject: "Request for Implementation Timeline",
    content: `Hi Alex,

Can you send a detailed implementation timeline with milestones and deliverables? Our executive committee wants to review before final selection.

Thanks,
Lisa`,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    client_name: "Lisa Wang",
    type: "call" as const,
    subject: "Security Audit Call",
    content: `Call Duration: 50 minutes
Attendees: Lisa Wang (Procurement Director), Michael Stevens (Legal), Alex (AE), Priya (Security Lead)

Transcript:
Lisa: Please walk us through your security protocols and compliance certifications.
Priya: We are SOC 2 Type II certified, GDPR compliant, and conduct annual penetration testing. I’ll send you the full documentation.
Michael: What about data residency and privacy?
Priya: We offer data residency options in the US, EU, and APAC. All data is encrypted at rest and in transit.
Lisa: Thank you. Please send the documentation and a summary of your incident response plan.`,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    client_name: "Lisa Wang",
    type: "message" as const,
    subject: "Final questions before selection",
    content: `Hi Alex,

Our committee has a few final questions before we make a decision:
- Can you confirm 24/7 support response times?
- What is your escalation process for critical issues?
- Are there any additional fees for premium support?

Thanks,
Lisa`,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
];

export const checkDatabaseStatus = async () => {
  try {
    console.log("🔍 Checking database status...");
    
    // Check clients table
    const { data: clients, error: clientsError, count: clientCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact' });
    
    if (clientsError) {
      console.error("❌ Error checking clients:", clientsError);
    } else {
      console.log("👥 Clients in database:", clientCount);
      console.log("📋 Client data:", clients?.map(c => ({ name: c.name, id: c.id })));
    }
    
    // Check communications table
    const { data: communications, error: commsError, count: commsCount } = await supabase
      .from('communications')
      .select('*', { count: 'exact' });
    
    if (commsError) {
      console.error("❌ Error checking communications:", commsError);
    } else {
      console.log("💬 Communications in database:", commsCount);
      
      // Group by client
      if (communications) {
        const commsByClient = communications.reduce((acc, comm) => {
          acc[comm.client_id] = (acc[comm.client_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        console.log("📊 Communications per client ID:", commsByClient);
      }
    }
    
    // Check ai_insights table
    const { data: insights, error: insightsError, count: insightsCount } = await supabase
      .from('ai_insights')
      .select('*', { count: 'exact' });
    
    if (insightsError) {
      console.error("❌ Error checking insights:", insightsError);
    } else {
      console.log("🧠 AI insights in database:", insightsCount);
    }
    
    return {
      clients: clientCount || 0,
      communications: commsCount || 0,
      insights: insightsCount || 0
    };
    
  } catch (error) {
    console.error("💥 Error checking database status:", error);
    return null;
  }
};

export const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");
    console.log("🔢 Sample clients to insert:", sampleClients.length);
    console.log("💬 Sample communications to insert:", sampleCommunications.length);

    // Delete existing data first with detailed logging
    console.log("🗑️ Clearing existing data...");
    
    const { error: deleteCommsError } = await supabase
      .from('communications')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteCommsError) {
      console.error("❌ Error deleting communications:", deleteCommsError);
    } else {
      console.log("✅ Communications table cleared");
    }

    const { error: deleteClientsError } = await supabase
      .from('clients')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteClientsError) {
      console.error("❌ Error deleting clients:", deleteClientsError);
    } else {
      console.log("✅ Clients table cleared");
    }

    // Insert clients with detailed logging
    console.log("👥 Inserting clients...");
    console.log("📋 Client data to insert:", sampleClients.map(c => ({ name: c.name, status: c.status })));
    
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .insert(sampleClients)
      .select();

    if (clientsError) {
      console.error("❌ Error inserting clients:", clientsError);
      console.error("📋 Client data that failed:", sampleClients);
      return;
    }

    console.log("✅ Clients inserted successfully!");
    console.log("📊 Inserted clients count:", clientsData?.length || 0);
    console.log("👥 Client IDs:", clientsData?.map(c => ({ name: c.name, id: c.id })));

    // Create a mapping of client names to IDs
    const clientNameToId: Record<string, string> = {};
    if (clientsData) {
      clientsData.forEach(client => {
        clientNameToId[client.name] = client.id;
      });
    }

    console.log("🗺️ Client name to ID mapping:", clientNameToId);

    // Insert communications with correct client IDs and schema-compliant fields
    console.log("💬 Preparing communications data...");
    console.log("🗺️ Client name to ID mapping:", clientNameToId);
    console.log("📝 Available client names in mapping:", Object.keys(clientNameToId));
    console.log("📋 Sample communications client names:", [...new Set(sampleCommunications.map(c => c.client_name))]);
    
    const communicationsWithIds = sampleCommunications.map((comm, index) => {
      const clientId = clientNameToId[comm.client_name];
      
      if (!clientId) {
        console.warn(`⚠️ No client ID found for: "${comm.client_name}"`);
        console.warn(`📋 Available client names:`, Object.keys(clientNameToId));
      } else {
        console.log(`✅ Mapping "${comm.client_name}" to ID: ${clientId}`);
      }

      // Generate summary from content (first 100 chars)
      const summary = comm.content.length > 100 
        ? comm.content.substring(0, 97) + "..."
        : comm.content;

      // Create metadata object with additional info
      const metadata = {
        client_name: comm.client_name,
        communication_index: index,
        content_length: comm.content.length,
        has_transcript: comm.content.includes('Transcript:'),
        is_follow_up: comm.subject.toLowerCase().includes('follow-up') || comm.subject.toLowerCase().includes('re:')
      };

      return {
        client_id: clientId,
        type: comm.type,
        subject: comm.subject,
        content: comm.content,
        summary: summary,
        date: comm.date,
        metadata: metadata
      };
    }).filter(comm => comm.client_id); // Filter out communications without valid client IDs

    console.log("📝 Communications prepared:", communicationsWithIds.length);
    console.log("🚫 Communications filtered out (no client ID):", sampleCommunications.length - communicationsWithIds.length);
    console.log("🔍 Sample communication structure:", communicationsWithIds[0]);

    const { data: commsData, error: commsError } = await supabase
      .from('communications')
      .insert(communicationsWithIds)
      .select();

    if (commsError) {
      console.error("❌ Error inserting communications:", commsError);
      console.error("📋 Communications data that failed:", communicationsWithIds);
      return;
    }

    console.log("✅ Communications inserted successfully!");
    console.log("📊 Inserted communications count:", commsData?.length || 0);
    
    // Log communications per client
    if (commsData) {
      const commsByClient = commsData.reduce((acc, comm) => {
        const clientName = communicationsWithIds.find(c => c.client_id === comm.client_id)?.metadata?.client_name || 'Unknown';
        acc[clientName] = (acc[clientName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log("📈 Communications per client:", commsByClient);
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log("📋 Summary:");
    console.log(`   - Clients: ${clientsData?.length || 0}`);
    console.log(`   - Communications: ${commsData?.length || 0}`);

  } catch (error) {
    console.error("💥 Error seeding database:", error);
    if (error instanceof Error) {
      console.error("📝 Error message:", error.message);
      console.error("📚 Error stack:", error.stack);
    }
  }
};