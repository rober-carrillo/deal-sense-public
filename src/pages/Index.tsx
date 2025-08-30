import { useState, useEffect } from "react";
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
      // Simulate AI analysis for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would call the Honcho API
      const mockResponse = `Based on analysis of ${selectedClient.name}'s communications:

**Personality Profile:**
- Analytical decision-maker who values data-driven insights
- Risk-averse and prefers thorough evaluation processes
- Detail-oriented with strong preference for written documentation

**Communication Style:**
- Prefers formal, structured communication
- Asks detailed technical questions
- Values transparency and comprehensive information

**Key Insights:**
- Shows high interest but needs extensive validation
- Likely to involve multiple stakeholders in final decision
- Personal connection points: ${selectedClient.notes}

**Recommendations:**
- Provide detailed ROI calculations and case studies
- Offer multiple customer references
- Schedule technical deep-dive sessions
- Follow up with comprehensive written summaries`;

      // Store insight in database (mock for demo)
      toast({
        title: "Analysis Complete",
        description: "AI psychological briefing generated successfully!",
      });
    } catch (error) {
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
          
          {(!clients || clients.length === 0) && (
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
              Load Sample Data
            </Button>
          )}
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
