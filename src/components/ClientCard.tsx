import { formatDistanceToNow } from "date-fns";
import { Building2, DollarSign, Calendar, Phone, Mail, MessageSquare, Sparkles, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Client {
  id: string;
  name: string;
  company: string;
  email?: string;
  phone?: string;
  status: 'prospect' | 'active' | 'hot_lead' | 'closed_won' | 'closed_lost';
  deal_value?: number;
  avatar_url?: string;
  last_contact?: string;
  notes?: string;
}

interface ClientCardProps {
  client: Client;
  onClick: (client: Client) => void;
}

const statusConfig = {
  prospect: { 
    label: "Prospect", 
    className: "status-prospect",
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30"
  },
  active: { 
    label: "Active", 
    className: "status-active",
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30"
  },
  hot_lead: { 
    label: "Hot Lead", 
    className: "status-hot",
    gradient: "from-red-500/20 to-rose-500/20",
    border: "border-red-500/30"
  },
  closed_won: { 
    label: "Closed Won", 
    className: "status-active",
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30"
  },
  closed_lost: { 
    label: "Closed Lost", 
    className: "status-closed",
    gradient: "from-gray-500/20 to-slate-500/20",
    border: "border-gray-500/30"
  }
};

export const ClientCard = ({ client, onClick }: ClientCardProps) => {
  const initials = client.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const formatCurrency = (amount?: number) => {
    if (!amount) return "—";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const lastContactTime = client.last_contact 
    ? formatDistanceToNow(new Date(client.last_contact), { addSuffix: true })
    : "Never";

  const config = statusConfig[client.status];

  return (
    <Card 
      className="card-elevated group cursor-pointer overflow-hidden border-border/30 hover:border-primary/30 transition-all duration-300"
      onClick={() => onClick(client)}
    >
      {/* Header with Gradient Background */}
      <div className={`relative p-6 pb-4 bg-gradient-to-br ${config.gradient}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-12 h-12 ring-2 ring-white/20 shadow-lg">
                <AvatarImage src={client.avatar_url} alt={client.name} />
                <AvatarFallback className="bg-gradient-primary text-white font-bold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {client.name}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Building2 className="w-3 h-3 mr-1" />
                {client.company}
              </div>
            </div>
          </div>
          <Badge className={`${config.className} text-xs font-semibold`}>
            {config.label}
          </Badge>
        </div>
      </div>

      {/* Deal Value Section */}
      <div className="px-6 py-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Deal Value</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(client.deal_value)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              Pipeline
            </div>
            <div className="w-16 h-2 bg-muted/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent"
                style={{ 
                  width: client.status === 'closed_won' ? '100%' : 
                         client.status === 'hot_lead' ? '80%' : 
                         client.status === 'active' ? '60%' : '30%' 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="px-6 py-4 space-y-2">
        {client.email && (
          <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            <Mail className="w-3 h-3 mr-3 text-accent" />
            <span className="truncate">{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            <Phone className="w-3 h-3 mr-3 text-accent" />
            <span>{client.phone}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="px-6 py-4 bg-muted/10 border-t border-border/30 group-hover:bg-primary/5 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Last contact {lastContactTime}</span>
          </div>
          <div className="flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <MessageSquare className="w-3 h-3 mr-1" />
            <span className="font-medium">Generate AI Insights</span>
          </div>
        </div>
      </div>
    </Card>
  );
};