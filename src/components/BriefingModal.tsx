import { useState } from "react";
import { X, Send, Brain, MessageSquare, User, FileText, Lightbulb } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Client, Communication, AIInsight } from "@/hooks/useClients";

interface BriefingModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  communications: Communication[];
  insights: AIInsight[];
  onGenerateInsight: (query: string) => Promise<void>;
  isGenerating: boolean;
}

const sampleQueries = [
  "What's this client's communication style?",
  "How should I handle their price objections?",
  "What personal details can I use for rapport building?",
  "What are their main concerns about our solution?",
  "What's their decision-making process?"
];

export const BriefingModal = ({ 
  client, 
  isOpen, 
  onClose, 
  communications,
  insights,
  onGenerateInsight,
  isGenerating
}: BriefingModalProps) => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'briefing' | 'communications'>('briefing');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isGenerating) return;
    
    await onGenerateInsight(query);
    setQuery("");
  };

  const handleQuickQuery = (quickQuery: string) => {
    onGenerateInsight(quickQuery);
  };

  if (!client) return null;

  const initials = client.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-7xl h-[90vh] glass-card border-glass-border p-0">
        <DialogHeader className="p-6 border-b border-glass-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                <AvatarImage src={client.avatar_url} alt={client.name} />
                <AvatarFallback className="bg-gradient-primary text-white font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl gradient-text">
                  {client.name} - Psychological Briefing
                </DialogTitle>
                <p className="text-muted-foreground">{client.company}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-4">
            <Button
              variant={activeTab === 'briefing' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('briefing')}
              className="flex items-center space-x-2"
            >
              <Brain className="w-4 h-4" />
              <span>AI Briefing</span>
            </Button>
            <Button
              variant={activeTab === 'communications' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('communications')}
              className="flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Raw Communications</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'briefing' ? (
            <div className="flex-1 flex flex-col">
              {/* Query Interface */}
              <div className="p-6 border-b border-glass-border">
                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask anything about this client's psychology..."
                    className="glass-card border-glass-border bg-glass-bg"
                    disabled={isGenerating}
                  />
                  <Button 
                    type="submit" 
                    disabled={!query.trim() || isGenerating}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    {isGenerating ? (
                      <Brain className="w-4 h-4 animate-pulse" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>

                {/* Quick Query Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {sampleQueries.map((sampleQuery, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickQuery(sampleQuery)}
                      disabled={isGenerating}
                      className="glass-card border-glass-border hover:border-primary"
                    >
                      {sampleQuery}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Insights Display */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {insights.length === 0 && !isGenerating && (
                    <div className="text-center py-12">
                      <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium text-muted-foreground">No insights yet</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Ask a question to generate psychological insights about this client
                      </p>
                    </div>
                  )}

                  {isGenerating && (
                    <Card className="glass-card p-6 animate-pulse">
                      <div className="flex items-center space-x-3 mb-4">
                        <Brain className="w-5 h-5 text-primary animate-pulse" />
                        <span className="text-sm text-muted-foreground">Analyzing communications...</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-glass-border rounded animate-pulse"></div>
                        <div className="h-4 bg-glass-border rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-glass-border rounded animate-pulse w-1/2"></div>
                      </div>
                    </Card>
                  )}

                  {insights.map((insight) => (
                    <Card key={insight.id} className="glass-card p-6">
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">{insight.query}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(insight.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                          <Lightbulb className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex-1 prose prose-sm max-w-none text-foreground">
                          <div className="whitespace-pre-wrap">{insight.response}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            /* Communications Tab */
            <div className="flex-1">
              <ScrollArea className="h-full p-6">
                <div className="space-y-4">
                  {communications.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium text-muted-foreground">No communications</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Upload communications to enable AI analysis
                      </p>
                    </div>
                  ) : (
                    communications.map((comm) => (
                      <Card key={comm.id} className="glass-card p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              comm.type === 'email' ? 'bg-blue-500/20 text-blue-400' :
                              comm.type === 'call' ? 'bg-green-500/20 text-green-400' :
                              comm.type === 'meeting' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {comm.type.toUpperCase()}
                            </div>
                            {comm.subject && (
                              <h4 className="font-medium text-foreground">{comm.subject}</h4>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comm.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="prose prose-sm max-w-none text-muted-foreground">
                          <div className="whitespace-pre-wrap">{comm.content}</div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};