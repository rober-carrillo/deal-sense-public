import { ReactNode } from "react";
import { Search, Brain, Users, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-primary">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Briefing Room</h1>
                <p className="text-xs text-muted-foreground">AI Sales Intelligence</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search clients, companies, deals..."
                  className="pl-10 glass-card border-glass-border bg-glass-bg focus:border-primary"
                />
              </div>
            </div>

            {/* Stats Pills */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1.5 glass-card rounded-lg">
                <Users className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">12 Active</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 glass-card rounded-lg">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">$1.2M Pipeline</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};