import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Beaker, Square, FileText, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const FeatureLab = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Beaker className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Feature Lab</h1>
                <p className="text-sm text-muted-foreground">Development & Testing Environment</p>
              </div>
            </div>
          </div>
          <Badge variant="secondary">Development Mode</Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="modals" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="modals" className="flex items-center space-x-2">
              <Square className="w-4 h-4" />
              <span>Modal Components</span>
            </TabsTrigger>
            <TabsTrigger value="embeddings" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Embeddings</span>
            </TabsTrigger>
            <TabsTrigger value="widgets" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Interactive Widgets</span>
            </TabsTrigger>
          </TabsList>

          {/* Modals Tab */}
          <TabsContent value="modals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modal Components</CardTitle>
                <CardDescription>
                  Develop and test modal dialogs, pop-ups, and overlay components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* Existing Briefing Modal */}
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Briefing Modal</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      AI-powered client psychological analysis
                    </p>
                    <Button 
                      size="sm" 
                      onClick={() => setActiveFeature('briefing-modal')}
                    >
                      Test Component
                    </Button>
                    <Badge variant="outline" className="ml-2">Existing</Badge>
                  </Card>

                  {/* New Modal Placeholders */}
                  <Card className="p-4 border-dashed">
                    <h3 className="font-semibold mb-2">Settings Modal</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      User preferences and configuration
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setActiveFeature('settings-modal')}
                    >
                      Create Component
                    </Button>
                    <Badge variant="secondary" className="ml-2">New</Badge>
                  </Card>

                  <Card className="p-4 border-dashed">
                    <h3 className="font-semibold mb-2">Report Modal</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Generate and export reports
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setActiveFeature('report-modal')}
                    >
                      Create Component
                    </Button>
                    <Badge variant="secondary" className="ml-2">New</Badge>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Embeddings Tab */}
          <TabsContent value="embeddings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document & Content Embeddings</CardTitle>
                <CardDescription>
                  Integrate external content, documents, and AI-powered embeddings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 border-dashed">
                    <h3 className="font-semibold mb-2">Document Viewer</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      PDF, Word, and other document embedding
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setActiveFeature('document-viewer')}
                    >
                      Create Component
                    </Button>
                    <Badge variant="secondary" className="ml-2">New</Badge>
                  </Card>

                  <Card className="p-4 border-dashed">
                    <h3 className="font-semibold mb-2">AI Chat Widget</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Embedded conversational AI interface
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setActiveFeature('chat-widget')}
                    >
                      Create Component
                    </Button>
                    <Badge variant="secondary" className="ml-2">New</Badge>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Widgets Tab */}
          <TabsContent value="widgets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Interactive Widgets</CardTitle>
                <CardDescription>
                  Small interactive components and micro-interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Widget development area - coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Active Feature Development Area */}
        {activeFeature && (
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Development: {activeFeature}</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveFeature(null)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="min-h-[400px] bg-muted/20 rounded-lg p-8 flex items-center justify-center">
                <div className="text-center">
                  <Beaker className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Component Development Area</h3>
                  <p className="text-muted-foreground max-w-md">
                    This is your isolated development space for <strong>{activeFeature}</strong>. 
                    Build and test your component here without affecting the main application.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FeatureLab;
