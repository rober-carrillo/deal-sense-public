import { formatDistanceToNow } from "date-fns";
import { Building2, DollarSign, Calendar, Phone, Mail, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  prospect: { label: "Prospect", className: "status-prospect" },
  active: { label: "Active", className: "status-active" },
  hot_lead: { label: "Hot Lead", className: "status-hot" },
  closed_won: { label: "Closed Won", className: "status-active" },
  closed_lost: { label: "Closed Lost", className: "status-closed" }
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

  return (
    <Card 
      className="glass-card hover-glow cursor-pointer p-6 group transition-all duration-300"
      onClick={() => onClick(client)}
    >
      {/* Header with Avatar and Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12 ring-2 ring-primary/20">
            <AvatarImage src={client.avatar_url} alt={client.name} />
            <AvatarFallback className="bg-gradient-primary text-white font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {client.name}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Building2 className="w-3 h-3 mr-1" />
              {client.company}
            </div>
          </div>
        </div>
        <div className={`status-indicator ${statusConfig[client.status].className}`}>
          {statusConfig[client.status].label}
        </div>
      </div>

      {/* Deal Value */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground">Deal Value</span>
        </div>
        <span className="text-lg font-bold text-foreground">
          {formatCurrency(client.deal_value)}
        </span>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {client.email && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="w-3 h-3 mr-2 text-accent" />
            {client.email}
          </div>
        )}
        {client.phone && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="w-3 h-3 mr-2 text-accent" />
            {client.phone}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-glass-border">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="w-3 h-3 mr-1" />
          {lastContactTime}
        </div>
        <div className="flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <MessageSquare className="w-3 h-3 mr-1" />
          Generate Briefing
        </div>
      </div>
    </Card>
  );
};