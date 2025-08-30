import { ReactNode, useEffect, useState } from "react";
import { Sparkles, Zap, TrendingUp, Search, Bell, Settings, CreditCard, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/flowglad";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Ultra-Modern Header */}
      <header className="border-b border-border/40 backdrop-blur-xl bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Next-Gen Logo */}
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-glow transition-all duration-300">
                  <Sparkles className="w-6 h-6 text-white animate-glow" />
                </div>
                <div className="absolute -inset-1 bg-gradient-primary rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Deal Sense</h1>
                <p className="text-xs text-muted-foreground font-medium">AI-Powered Sales Intelligence</p>
              </div>
            </div>

            {/* Modern Search */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Search clients, insights, conversations..."
                  className="pl-12 pr-4 py-3 glass-card border-border/30 bg-background/40 focus:border-primary/50 focus:bg-background/60 transition-all duration-300 text-sm"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-2 py-0.5 text-xs bg-muted/30 rounded border text-muted-foreground">⌘K</kbd>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center space-x-3">
              {/* AI Status */}
              <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-xs font-semibold text-primary">AI Online</span>
              </div>

              {/* Quick Actions */}
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></div>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={() => navigate('/billing')}
                title="Billing"
              >
                <CreditCard className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" size="sm" className="p-2">
                <Settings className="w-4 h-4" />
              </Button>

              {/* User Avatar */}
              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover:shadow-glow transition-all duration-300 cursor-pointer">
                  {currentUser?.user_metadata?.avatar_url ? (
                    <img 
                      src={currentUser.user_metadata.avatar_url} 
                      alt={currentUser.user_metadata?.full_name || currentUser.email}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success border-2 border-background rounded-full"></div>
                
                {/* User tooltip */}
                {currentUser && (
                  <div className="absolute top-12 right-0 bg-background border border-border rounded-lg p-3 shadow-lg min-w-48 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    <p className="font-medium text-sm">{currentUser.user_metadata?.full_name || 'Demo User'}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-success">● Online</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Modern Spacing */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {children}
      </main>

      {/* Floating Status Bar */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="flex items-center space-x-2 px-4 py-2 glass-card rounded-full shadow-xl border border-border/30">
          <TrendingUp className="w-4 h-4 text-success animate-float" />
          <span className="text-sm font-medium text-muted-foreground">All systems operational</span>
        </div>
      </div>
    </div>
  );
};