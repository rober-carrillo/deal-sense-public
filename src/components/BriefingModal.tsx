import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { X, Send, Brain, MessageSquare, User, FileText, Lightbulb, Target, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Client, Communication, AIInsight } from "@/hooks/useClients";
import { DISCSpiderWeb } from "@/components/widgets/DISCSpiderWeb";
import { generateDISCProfileFromCommunications } from "@/utils/discAnalysis";
import { Communication as DISCCommunication } from "@/utils/discAnalysis";
import { getTypeColor } from "@/types/disc";
import { TranscriptUploader } from "@/components/TranscriptUploader";

interface BriefingModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  communications: Communication[];
  insights: AIInsight[];
  onGenerateInsight: (query: string) => Promise<void>;
  isGenerating: boolean;
  refreshData?: () => void;
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
  isGenerating,
  refreshData
}: BriefingModalProps) => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'briefing' | 'communications' | 'disc'>('briefing');
  const [showTranscriptUploader, setShowTranscriptUploader] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isGenerating) return;
    
    await onGenerateInsight(query);
    setQuery("");
  };

  const handleQuickQuery = (quickQuery: string) => {
    onGenerateInsight(quickQuery);
  };

  const handleUploadComplete = () => {
    setShowTranscriptUploader(false);
    if (refreshData) {
      refreshData();
    }
  };

  if (!client) return null;

  const initials = client.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  // Helper to parse the latest insight
  let latestParsed = null;
  if (insights.length > 0) {
    try {
      latestParsed = typeof insights[0].response === 'string' ? JSON.parse(insights[0].response) : insights[0].response;
    } catch {
      latestParsed = null;
    }
  }

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
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTranscriptUploader(true)}
                className="flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Transcript</span>
              </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
            </div>
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
            <Button
              variant={activeTab === 'disc' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('disc')}
              className="flex items-center space-x-2"
            >
              <Target className="w-4 h-4" />
              <span>DISC Profile</span>
            </Button>
          </div>
        </DialogHeader>
        {/* --- VISUALIZATION PANEL --- */}
        {activeTab === 'briefing' && latestParsed && typeof latestParsed === 'object' && (
          <div className="p-6 border-b border-glass-border bg-glass-bg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Sentiment Chart */}
              {latestParsed.sentimentTimeline && Array.isArray(latestParsed.sentimentTimeline) && (
                <div>
                  <div className="font-semibold mb-2">Sentiment Over Time</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={latestParsed.sentimentTimeline}>
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis domain={[-1, 1]} fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="sentiment" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              {/* Engagement Score */}
              {typeof latestParsed.engagementScore === 'number' && (
                <div>
                  <div className="font-semibold mb-2">Engagement Score</div>
                  <BarChart width={220} height={180} data={[{ name: 'Engagement', value: latestParsed.engagementScore }]}> 
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis domain={[0, 100]} fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#34d399" />
                  </BarChart>
                  <div className="mt-2 text-center text-lg font-bold">{latestParsed.engagementScore}%</div>
                </div>
              )}
              {/* Deal Stage Pie Chart */}
              {latestParsed.dealStageDistribution && Array.isArray(latestParsed.dealStageDistribution) && (
                <div>
                  <div className="font-semibold mb-2">Deal Stage Distribution</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={latestParsed.dealStageDistribution} dataKey="value" nameKey="stage" cx="50%" cy="50%" outerRadius={60} label>
                        {latestParsed.dealStageDistribution.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={["#6366f1", "#34d399", "#f59e42", "#ef4444"][idx % 4]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              {/* Risk Score Widget */}
              {typeof latestParsed.riskScore === 'number' && (
                <div>
                  <div className="font-semibold mb-2">Deal Risk Score</div>
                  <div className="w-full h-8 bg-glass-border rounded flex items-center">
                    <div style={{ width: `${latestParsed.riskScore}%` }} className="h-8 bg-red-400 rounded"></div>
                    <span className="ml-2 text-lg font-bold">{latestParsed.riskScore}%</span>
                  </div>
                  <div className="text-xs mt-1 text-muted-foreground">Higher = more risk</div>
                </div>
              )}
              {/* Topics Bar Chart */}
              {latestParsed.topics && Array.isArray(latestParsed.topics) && (
                <div>
                  <div className="font-semibold mb-2">Topics Frequency</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={latestParsed.topics}>
                      <XAxis dataKey="topic" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'briefing' ? (
            <div className="flex-1">
              <ScrollArea className="h-full">
                {/* DISC Profile Widget */}
                <div className="p-6 border-b border-glass-border">
                {(() => {
                  // Convert communications to DISC format
                  const discCommunications: DISCCommunication[] = communications.map(comm => ({
                    client_name: client?.name || '',
                    type: comm.type as 'call' | 'email' | 'message',
                    subject: comm.subject || '',
                    content: comm.content,
                    date: comm.date
                  }));

                  if (discCommunications.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-medium text-muted-foreground">DISC Analysis Unavailable</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Load sample data to enable behavioral analysis
                        </p>
                      </div>
                    );
                  }

                  // Generate DISC profile from communications
                  const discProfile = generateDISCProfileFromCommunications(
                    client?.name || 'Unknown Client',
                    discCommunications
                  );

                  // Add avatar from client data
                  discProfile.avatar = client?.avatar_url;

                  return (
                    <div className="w-full">
                      {/* DISC Widget with Full Analysis like Feature Lab */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Widget Preview */}
                        <div>
                          <h4 className="text-lg font-semibold mb-4">DISC Behavioral Analysis</h4>
                          <DISCSpiderWeb 
                            profile={discProfile} 
                            size={300}
                            showDetails={true}
                            showExplanation={true}
                          />
                        </div>

                        {/* Analysis Sources */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold">Analysis Sources</h4>
                          
                          <Card className="p-4">
                            <h5 className="font-medium mb-2">DISC Assessment Results</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Primary Type:</span>
                                <span className="font-mono font-bold" style={{ color: getTypeColor(discProfile.primaryType) }}>
                                  {discProfile.primaryType}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Secondary Type:</span>
                                <span className="font-mono font-bold" style={{ color: discProfile.secondaryType ? getTypeColor(discProfile.secondaryType) : undefined }}>
                                  {discProfile.secondaryType || 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Analysis Confidence:</span>
                                <span className="font-bold">{discProfile.confidence}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Last Updated:</span>
                                <span>{new Date(discProfile.lastUpdated).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </Card>

                          <Card className="p-4">
                            <h5 className="font-medium mb-3">Source Communications</h5>
                            <div className="space-y-3 max-h-48 overflow-y-auto">
                              {communications.map((comm, index) => (
                                <div key={index} className="border-l-2 border-muted pl-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                                      comm.type === 'email' ? 'bg-blue-500/20 text-blue-400' :
                                      comm.type === 'call' ? 'bg-green-500/20 text-green-400' :
                                      comm.type === 'meeting' ? 'bg-purple-500/20 text-purple-400' :
                                      'bg-gray-500/20 text-gray-400'
                                    }`}>
                                      {comm.type.toUpperCase()}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(comm.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <h6 className="text-sm font-medium mb-1">{comm.subject}</h6>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {comm.content.substring(0, 120)}...
                                  </p>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                              DISC traits analyzed from <strong>{communications.length}</strong> communications using behavioral pattern recognition.
                            </div>
                          </Card>

                          <Card className="p-4">
                            <h5 className="font-medium mb-2">Analysis Method</h5>
                            <div className="text-sm space-y-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span>Keyword pattern matching for behavioral indicators</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span>Communication style analysis</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                                <span>Decision-making pattern recognition</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                                <span>Manual adjustments based on known behavior</span>
                              </div>
                            </div>
                          </Card>

                          {/* DISC Scores Breakdown */}
                          <Card className="p-4">
                            <h5 className="font-medium mb-3">DISC Score Breakdown</h5>
                            <div className="space-y-2">
                              {[
                                { type: 'D', label: 'Dominance', score: discProfile.scores.dominance, color: '#ef4444' },
                                { type: 'I', label: 'Influence', score: discProfile.scores.influence, color: '#f59e0b' },
                                { type: 'S', label: 'Steadiness', score: discProfile.scores.steadiness, color: '#22c55e' },
                                { type: 'C', label: 'Conscientiousness', score: discProfile.scores.conscientiousness, color: '#3b82f6' }
                              ].map((item) => (
                                <div key={item.type} className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div 
                                      className="w-3 h-3 rounded-full" 
                                      style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm font-medium">{item.type}</span>
                                    <span className="text-sm text-muted-foreground">{item.label}</span>
                                  </div>
                                  <span className="text-sm font-mono font-bold">{item.score}</span>
                                </div>
                              ))}
                            </div>
                          </Card>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              {/* Query Interface (below DISC widget) */}
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
                <div className="p-6 space-y-6">
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
                      {/* Structured AI Insight Visualization */}
                      <div className="flex flex-col gap-4">
                        {(() => {
                          let parsed = null;
                          try {
                            parsed = typeof insight.response === 'string' ? JSON.parse(insight.response) : insight.response;
                          } catch {
                            // fallback to raw string
                          }
                          if (!parsed || typeof parsed !== 'object') {
                            return (
                              <div className="prose prose-sm max-w-none text-foreground">
                                <div className="whitespace-pre-wrap">{insight.response}</div>
                              </div>
                            );
                          }
                          return (
                            <>
                              {/* Personality Profile */}
                              <div>
                                <div className="font-semibold text-primary mb-1">Personality Profile</div>
                                <div className="mb-2">{parsed.personalityProfile}</div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">Confidence:</span>
                                  <div className="w-32 h-2 bg-glass-border rounded">
                                    <div style={{ width: `${(parsed.personalityConfidence || 0) * 100}%` }} className="h-2 bg-primary rounded"></div>
                                  </div>
                                  <span className="text-xs">{Math.round((parsed.personalityConfidence || 0) * 100)}%</span>
                                </div>
                              </div>
                              {/* Sales Intelligence */}
                              <div>
                                <div className="font-semibold text-primary mb-1">Sales Intelligence</div>
                                <div className="mb-2">{parsed.salesIntelligence}</div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">Confidence:</span>
                                  <div className="w-32 h-2 bg-glass-border rounded">
                                    <div style={{ width: `${(parsed.salesIntelligenceConfidence || 0) * 100}%` }} className="h-2 bg-primary rounded"></div>
                                  </div>
                                  <span className="text-xs">{Math.round((parsed.salesIntelligenceConfidence || 0) * 100)}%</span>
                                </div>
                              </div>
                              {/* Rapport Builders */}
                              <div>
                                <div className="font-semibold text-primary mb-1">Rapport Builders</div>
                                <div className="mb-2">{parsed.rapportBuilders}</div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">Confidence:</span>
                                  <div className="w-32 h-2 bg-glass-border rounded">
                                    <div style={{ width: `${(parsed.rapportBuildersConfidence || 0) * 100}%` }} className="h-2 bg-primary rounded"></div>
                                  </div>
                                  <span className="text-xs">{Math.round((parsed.rapportBuildersConfidence || 0) * 100)}%</span>
                                </div>
                              </div>
                              {/* Smart Suggestions */}
                              <div>
                                <div className="font-semibold text-primary mb-1">Smart Suggestions</div>
                                <ul className="list-disc pl-5 text-foreground">
                                  {(parsed.smartSuggestions || []).map((s, i) => (
                                    <li key={i}>{s}</li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : activeTab === 'communications' ? (
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
          ) : activeTab === 'disc' ? (
            /* DISC Profile Tab */
            <div className="flex-1">
              <ScrollArea className="h-full p-6">
                {(() => {
                  // Convert communications to DISC format
                  const discCommunications: DISCCommunication[] = communications.map(comm => ({
                    client_name: client?.name || '',
                    type: comm.type as 'call' | 'email' | 'message',
                    subject: comm.subject || '',
                    content: comm.content,
                    date: comm.date
                  }));

                  if (discCommunications.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-muted-foreground">DISC Analysis Unavailable</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Load sample data to enable behavioral analysis
                        </p>
                      </div>
                    );
                  }

                  // Generate DISC profile from communications
                  const discProfile = generateDISCProfileFromCommunications(
                    client?.name || 'Unknown Client',
                    discCommunications
                  );

                  // Add avatar from client data
                  discProfile.avatar = client?.avatar_url;

                  return (
                    <div className="max-w-4xl mx-auto">
                      <DISCSpiderWeb 
                        profile={discProfile} 
                        showDetails={true}
                        showExplanation={true}
                      />
                    </div>
                  );
                })()}
              </ScrollArea>
            </div>
          ) : null}
        </div>

        {/* Transcript Uploader Modal Overlay */}
        {showTranscriptUploader && client && (
          <div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowTranscriptUploader(false)}
          >
            <div 
              className="glass-card border-glass-border shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <TranscriptUploader
                clientId={client.id}
                onUploadComplete={handleUploadComplete}
                onClose={() => setShowTranscriptUploader(false)}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};