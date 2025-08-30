import { useState, useEffect, useRef } from "react";
// @ts-ignore
import.meta.env;
import { DashboardLayout } from "@/components/DashboardLayout";
import { ClientCard } from "@/components/ClientCard";
import { BriefingModal } from "@/components/BriefingModal";
import { useClients, useClientCommunications, useClientInsights, Client } from "@/hooks/useClients";
import { seedDatabase } from "@/utils/seedData";
import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

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

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase();
      toast({
        title: "Database Seeded",
        description: "Sample client data has been added successfully!",
      });
      // Refresh the page to show new data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to seed database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleGenerateInsight = async (query: string) => {
    if (!selectedClient) return;
    setIsGenerating(true);
    try {
      // Gather recent communications for context
      const comms = communications
        .filter(c => c.client_id === selectedClient.id)
        .map(c => `Type: ${c.type}\nSubject: ${c.subject}\nContent: ${c.content}`)
        .join("\n\n");

      // Prepare prompt for structured JSON output
      const prompt = `You are an expert sales psychologist. Given the following client communications, answer the user's question.\n\nClient Name: ${selectedClient.name}\nCompany: ${selectedClient.company}\nNotes: ${selectedClient.notes || ''}\n\nCommunications:\n${comms}\n\nUser Question: ${query}\n\nReturn your answer as a JSON object with the following fields:\n{\n  \"personalityProfile\": string,\n  \"personalityConfidence\": number (0-1),\n  \"salesIntelligence\": string,\n  \"salesIntelligenceConfidence\": number (0-1),\n  \"rapportBuilders\": string,\n  \"rapportBuildersConfidence\": number (0-1),\n  \"smartSuggestions\": string[]\n}`;

      // Debug: log prompt
      console.debug("[AI DEBUG] Prompt sent to OpenAI:", prompt);

      // Call OpenAI API
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an expert sales psychologist. Always return valid JSON only." },
            { role: "user", content: prompt }
          ],
          max_tokens: 700,
        }),
      });
      if (!response.ok) throw new Error("OpenAI API error");
      const data = await response.json();
      // Debug: log raw OpenAI response
      console.debug("[AI DEBUG] Raw OpenAI response:", data);
      let aiText = data.choices?.[0]?.message?.content || "No insight generated.";
      aiText = aiText.trim().replace(/^```json|```$/g, '').trim();
      // Debug: log cleaned aiText
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
      // Debug: log extracted insightObj
      console.debug("[AI DEBUG] Extracted insightObj:", insightObj);

      // Store insight in Supabase
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.from("ai_insights").insert({
        client_id: selectedClient.id,
        query,
        response: JSON.stringify(insightObj),
      });
      if (error) throw error;

      toast({
        title: "Analysis Complete",
        description: "AI psychological briefing generated successfully!",
      });
    } catch (error) {
      // Debug: log error
      console.error("[AI DEBUG] Error in handleGenerateInsight:", error);
      toast({
        title: "Error",
        description: "Failed to generate insight. Please try again.",
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Client Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              AI-powered psychological briefings for every client interaction
            </p>
          </div>
          {/* Always show reseed button, with warning if data exists */}
          <Button 
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            className="bg-gradient-primary hover:opacity-90"
          >
            {isSeeding ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Database className="w-4 h-4 mr-2" />
            )}
            {clients && clients.length > 0 ? "Reseed Demo Data (Overwrites)" : "Load Sample Data"}
          </Button>
        </div>

        {/* Client Grid */}
        {clients && clients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onClick={handleClientClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 opacity-20">
              <Database className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No clients yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Load sample data to see Briefing Room in action with realistic client profiles
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
