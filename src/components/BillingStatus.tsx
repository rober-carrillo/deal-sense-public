// components/BillingStatus.tsx
import React from 'react';
import { useBilling } from '@/contexts/BillingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const BillingStatus: React.FC = () => {
  const { user, billingInfo, pricingPlans, loading } = useBilling();

  const getStatusIcon = () => {
    if (loading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (pricingPlans && pricingPlans.length > 0) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (loading) return 'Loading billing system...';
    if (pricingPlans && pricingPlans.length > 0) return `System ready (${pricingPlans.length} plans loaded)`;
    return 'System initializing...';
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Billing System Status</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm">{getStatusText()}</span>
          </div>
          <div className="flex gap-2">
            <Badge variant={user ? "default" : "secondary"}>
              {user ? "User Ready" : "No User"}
            </Badge>
            <Badge variant={billingInfo ? "default" : "secondary"}>
              {billingInfo ? "Billing Ready" : "Billing Loading"}
            </Badge>
          </div>
        </div>
        
        {/* Debug info in development */}
        {import.meta.env.DEV && (
          <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
            <div>User: {user?.email || 'None'}</div>
            <div>Plans: {pricingPlans?.length || 0} loaded</div>
            <div>Current Plan: {billingInfo?.plan?.name || 'Unknown'}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
