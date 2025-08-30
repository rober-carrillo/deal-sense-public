import { useState, useEffect, useRef } from "react";
// @ts-ignore
import.meta.env;
import { DashboardLayout } from "@/components/DashboardLayout";
import { ClientCard } from "@/components/ClientCard";
import { BriefingModal } from "@/components/BriefingModal";
import { useClients, useClientCommunications, useClientInsights, Client } from "@/hooks/useClients";
import { useBillingFeatures } from "@/hooks/useBillingFeatures";
import { trackUsage } from "@/utils/billing";
import { seedDatabase, checkDatabaseStatus } from "@/utils/seedData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Database, Loader2, Sparkles, Zap, Users, Brain, TrendingUp, Crown, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Billing features
  const { 
    features, 
    canUseFeature, 
    getUsagePercentage, 
    currentPlan, 
    isSubscribed 
  } = useBillingFeatures();

  // Debug: Log environment variables on component mount
  useEffect(() => {
    console.debug("[ENV DEBUG] VITE_OPENAI_API_KEY exists:", !!import.meta.env.VITE_OPENAI_API_KEY);
    console.debug("[ENV DEBUG] VITE_OPENAI_API_KEY prefix:", import.meta.env.VITE_OPENAI_API_KEY?.substring(0, 10));
  }, []);

  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: communications = [] } = useClientCommunications(selectedClient?.id || "");
  const { data: insights = [] } = useClientInsights(selectedClient?.id || "");

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setIsBriefingOpen(true);
  };

  // Automatically generate AI insight when opening a client profile if none exists
  const hasGeneratedInitial = useRef<string | null>(null);
  useEffect(() => {
    if (
      isBriefingOpen &&
      selectedClient &&
      insights.length === 0 &&
      !isGenerating &&
      hasGeneratedInitial.current !== selectedClient.id
    ) {
      // Mark as generated for this client to avoid duplicate calls
      hasGeneratedInitial.current = selectedClient.id;
      handleGenerateInsight("Give me a full psychological briefing for this client.");
    }
    // Reset flag when closing or switching clients
    if (!isBriefingOpen || !selectedClient) {
      hasGeneratedInitial.current = null;
    }
  }, [isBriefingOpen, selectedClient, insights.length, isGenerating]);

  const handleCloseBriefing = () => {
    setIsBriefingOpen(false);
    setSelectedClient(null);
  };

  const handleCheckDatabase = async () => {
    console.log("🔍 Checking database status from UI...");
    const status = await checkDatabaseStatus();
    
    toast({
      title: "Database Status Check",
      description: `Clients: ${status?.clients || 0}, Communications: ${status?.communications || 0}, Insights: ${status?.insights || 0}. Check console for details.`,
    });
  };

  const handleSeedDatabase = async () => {
    console.log("🚀 Starting database seeding from UI...");
    
    // First check current status
    console.log("📊 Checking current database status...");
    await checkDatabaseStatus();
    
    setIsSeeding(true);
    try {
      console.log("📞 Calling seedDatabase function...");
      await seedDatabase();
      
      console.log("✅ Seeding completed successfully!");
      
      // Check status after seeding
      console.log("🔍 Checking database status after seeding...");
      const finalStatus = await checkDatabaseStatus();
      
      toast({
        title: "Database Seeded Successfully! 🎉",
        description: `Added ${finalStatus?.clients || 0} clients and ${finalStatus?.communications || 0} communications. Check console for details.`,
      });
      
      // Wait a moment for the data to be fully written
      setTimeout(() => {
        console.log("🔄 Refreshing page to show new data...");
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error("💥 Failed to seed database:", error);
      toast({
        title: "Error Seeding Database",
        description: `Failed to seed database: ${error instanceof Error ? error.message : 'Unknown error'}. Check console for details.`,
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleGenerateInsight = async (query: string) => {
    if (!selectedClient) return;
    
    // Check if user can use AI features
    if (!canUseFeature('aiChat')) {
      toast({
        title: "Feature Locked",
        description: "AI insights are available in Pro and Enterprise plans. Upgrade to unlock unlimited AI-powered analysis.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      console.debug("[AI DEBUG] Starting insight generation for client:", selectedClient.name);
      console.debug("[AI DEBUG] Communications available:", communications.length);
      
      // Gather recent communications for context
      const comms = communications
        .filter(c => c.client_id === selectedClient.id)
        .map(c => `Type: ${c.type}\nSubject: ${c.subject}\nContent: ${c.content}`)
        .join("\n\n");

      console.debug("[AI DEBUG] Filtered communications:", comms.length, "characters");

      // Determine if this is a psychological briefing request or regular chat
      const isPsychologicalBriefing = query.toLowerCase().includes('psychological briefing') || 
                                     query.toLowerCase().includes('full analysis') ||
                                     query.toLowerCase().includes('complete profile') ||
                                     query.toLowerCase().includes('personality analysis');

      let prompt;
      let responseType;

      if (isPsychologicalBriefing) {
        // Structured psychological briefing
        responseType = "structured";
        prompt = `You are an expert sales psychologist. Provide a comprehensive psychological briefing for this client based on their communications.

Client Name: ${selectedClient.name}
Company: ${selectedClient.company}
Notes: ${selectedClient.notes || ''}

Communications:
${comms}

User Question: ${query}

Return your answer as a JSON object with the following fields:
{
  "personalityProfile": string,
  "personalityConfidence": number (0-1),
  "salesIntelligence": string,
  "salesIntelligenceConfidence": number (0-1),
  "rapportBuilders": string,
  "rapportBuildersConfidence": number (0-1),
  "smartSuggestions": string[]
}`;
      } else {
        // Regular conversational response
        responseType = "conversational";
        prompt = `You are an expert sales advisor. Answer the user's question about this client in a helpful, conversational manner.

Client Name: ${selectedClient.name}
Company: ${selectedClient.company}
Notes: ${selectedClient.notes || ''}

Communications:
${comms}

User Question: ${query}

Provide a helpful, detailed response that gives actionable sales advice. Be conversational and specific to this client's situation.`;
      }

      console.debug("[AI DEBUG] Response type:", responseType);
      console.debug("[AI DEBUG] Prompt sent to OpenAI:", prompt);

      // Call OpenAI API
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      console.debug("[AI DEBUG] API Key exists:", !!apiKey);
      console.debug("[AI DEBUG] API Key prefix:", apiKey?.substring(0, 10));
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: "system", 
              content: responseType === "structured" 
                ? "You are an expert sales psychologist. Always return valid JSON only."
                : "You are an expert sales advisor. Provide helpful, actionable advice."
            },
            { role: "user", content: prompt }
          ],
          max_tokens: 700,
        }),
      });
      
      console.debug("[AI DEBUG] Response status:", response.status);
      console.debug("[AI DEBUG] Response headers:", Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("[AI DEBUG] API Error:", response.status, errorText);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.debug("[AI DEBUG] Raw OpenAI response:", data);
      let aiText = data.choices?.[0]?.message?.content || "No insight generated.";
      
      let responseToStore;
      
      if (responseType === "structured") {
        // Process structured JSON response
        aiText = aiText.trim().replace(/^```json|```$/g, '').trim();
        console.debug("[AI DEBUG] Cleaned aiText:", aiText);

        // Regex-based extraction fallback
        const extractField = (field) => {
          const match = aiText.match(new RegExp(`"${field}"\\s*:\\s*("([^\"]*)"|([\\d.]+)|\\[(.*?)\\])`, "s"));
          if (!match) return null;
          if (match[2] !== undefined) return match[2]; // string
          if (match[3] !== undefined) return parseFloat(match[3]); // number
          if (match[4] !== undefined) {
            try {
              return JSON.parse(`[${match[4]}]`);
            } catch {
              return [];
            }
          }
          return null;
        };

        const insightObj = {
          personalityProfile: extractField("personalityProfile"),
          personalityConfidence: extractField("personalityConfidence"),
          salesIntelligence: extractField("salesIntelligence"),
          salesIntelligenceConfidence: extractField("salesIntelligenceConfidence"),
          rapportBuilders: extractField("rapportBuilders"),
          rapportBuildersConfidence: extractField("rapportBuildersConfidence"),
          smartSuggestions: extractField("smartSuggestions"),
        };
        console.debug("[AI DEBUG] Extracted insightObj:", insightObj);
        responseToStore = JSON.stringify(insightObj);
      } else {
        // Store conversational response as plain text
        console.debug("[AI DEBUG] Conversational response:", aiText);
        responseToStore = aiText;
      }

      // Store insight in Supabase
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.from("ai_insights").insert({
        client_id: selectedClient.id,
        query,
        response: responseToStore,
      });
      if (error) throw error;

      // Track usage for billing
      await trackUsage('ai_insight_generation', 1);

      toast({
        title: "Analysis Complete",
        description: "AI psychological briefing generated successfully!",
      });
    } catch (error) {
      // Debug: log error
      console.error("[AI DEBUG] Error in handleGenerateInsight:", error);
      console.error("[AI DEBUG] Error message:", error.message);
      console.error("[AI DEBUG] Error stack:", error.stack);
      
      toast({
        title: "Error",
        description: `Failed to generate insight: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (clientsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Modern Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Sales Intelligence</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold gradient-text leading-tight">
              Client Intelligence
              <br />
              <span className="text-4xl md:text-5xl">Redefined</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform scattered client data into actionable psychological insights. 
              Get personality-driven briefings in seconds, not hours.
            </p>
            
            {/* Welcome message for signed-in user */}
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-success">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">You're signed in and ready to go!</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={handleSeedDatabase}
                disabled={isSeeding}
                size="lg"
                className="btn-primary px-8 py-3 text-base font-semibold"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Loading Intelligence...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-3" />
                    {clients && clients.length > 0 ? "Refresh Demo Data" : "Load Demo Data"}
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleCheckDatabase}
                variant="outline"
                size="lg"
                className="px-6 py-3 text-base"
              >
                <Database className="w-5 h-5 mr-3" />
                Check DB Status
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Experience Deal Sense with realistic client profiles and AI insights
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        {clients && clients.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="card-elevated p-6 text-center group">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{clients.length}</div>
              <div className="text-sm text-muted-foreground">Active Clients</div>
            </div>
            
            <div className="card-elevated p-6 text-center group">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/30 transition-colors">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">AI</div>
              <div className="text-sm text-muted-foreground">Intelligence Engine</div>
            </div>

            <div className="card-elevated p-6 text-center group">
              <div className="w-12 h-12 bg-success/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-success/30 transition-colors">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                ${clients.reduce((sum, client) => sum + (client.deal_value || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Pipeline Value</div>
            </div>

            <div className="card-elevated p-6 text-center group">
              <div className="w-12 h-12 bg-warning/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-warning/30 transition-colors">
                <Zap className="w-6 h-6 text-warning" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">&lt;10s</div>
              <div className="text-sm text-muted-foreground">Insight Generation</div>
            </div>
          </div>
        )}

        {/* Billing Usage Card */}
        {clients && clients.length > 0 && (
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Usage & Plan</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={isSubscribed ? "default" : "secondary"}>
                    {currentPlan}
                  </Badge>
                  {!isSubscribed && (
                    <Button 
                      size="sm" 
                      onClick={() => navigate('/billing')}
                      className="text-xs"
                    >
                      Upgrade
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Clients ({clients.length}/{features.maxClients === Infinity ? '∞' : features.maxClients})</span>
                    <span>{getUsagePercentage(clients.length, 'maxClients').toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(clients.length, 'maxClients')} 
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>AI Insights</span>
                    {canUseFeature('aiChat') ? (
                      <span className="text-green-600">Unlimited</span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </div>
                    )}
                  </div>
                  <Progress 
                    value={canUseFeature('aiChat') ? 100 : 0} 
                    className="h-2"
                  />
                </div>
              </div>
              
              {!canUseFeature('aiChat') && (
                <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
                  <p className="text-sm text-muted-foreground">
                    Upgrade to unlock unlimited AI insights, advanced analytics, and more features.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Client Portfolio Section */}
        {clients && clients.length > 0 ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Client Portfolio</h2>
                <p className="text-muted-foreground">Click any client to generate AI-powered psychological insights</p>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-muted/20 border border-border/30">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-muted-foreground">AI Ready</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {clients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onClick={handleClientClick}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-primary rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Experience AI Sales Intelligence?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Load our demo data to see how Deal Sense transforms client relationships 
              with psychological insights and personality-driven briefings.
            </p>
          </div>
        )}

        {/* Briefing Modal */}
        <BriefingModal
          client={selectedClient}
          isOpen={isBriefingOpen}
          onClose={handleCloseBriefing}
          communications={communications}
          insights={insights}
          onGenerateInsight={handleGenerateInsight}
          isGenerating={isGenerating}
        />
      </div>
    </DashboardLayout>
  );
};

export default Index;
