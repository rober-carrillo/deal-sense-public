// pages/Billing.tsx
import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Package, Check, ExternalLink } from 'lucide-react';
import { useBilling } from '@/contexts/BillingContext';

const Billing: React.FC = () => {
  const { user, customerId, billingInfo, pricingPlans, loading } = useBilling();

  const handleSubscribe = () => {
    // Simply redirect to FlowGlad purchase page
    window.location.href = 'https://app.flowglad.com/product/prod_Lynf5sLmO4wCamrt36yQk/purchase';
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your Deal Sense subscription powered by FlowGlad
          </p>
          {user && (
            <p className="text-sm text-muted-foreground mt-2">
              Account: {user.user_metadata?.full_name || user.email}
            </p>
          )}
        </div>

        {/* FlowGlad Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              FlowGlad Integration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  ✅ Direct Purchase Link
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Using FlowGlad direct purchase integration
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Customer ID: {customerId || user?.id || 'Loading...'}
              </p>
              <p className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                <strong>Note:</strong> Clicking "Subscribe with FlowGlad" will redirect you to FlowGlad's secure checkout page
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Subscription */}
        {billingInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{billingInfo.plan?.name || 'Free Plan'}</p>
                    <p className="text-sm text-muted-foreground">
                      {billingInfo.plan?.description || 'Basic features included'}
                    </p>
                  </div>
                  <Badge variant={billingInfo.status === 'active' ? 'default' : 'secondary'}>
                    {billingInfo.status || 'Active'}
                  </Badge>
                </div>
                
                {billingInfo.current_period_end && (
                  <p className="text-sm text-muted-foreground">
                    Next billing: {new Date(billingInfo.current_period_end).toLocaleDateString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Plans */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
          
          {loading ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Loading Plans...</h3>
                <p className="text-muted-foreground">
                  Fetching subscription plans from FlowGlad...
                </p>
              </CardContent>
            </Card>
          ) : pricingPlans.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Plans Available</h3>
                <p className="text-muted-foreground">
                  Plans will be loaded from your FlowGlad account.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pricingPlans.map((plan) => (
                <Card key={plan.id} className="relative">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {plan.name}
                    </CardTitle>
                    <div className="text-3xl font-bold">
                      ${plan.price || 0}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{plan.interval || 'month'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {plan.description}
                    </p>
                    
                    {plan.features && (
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    <Button
                      className="w-full"
                      onClick={handleSubscribe}
                      variant="default"
                    >
                      Subscribe with FlowGlad
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Integration Info */}
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <ExternalLink className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Powered by FlowGlad</h3>
            <p className="text-sm text-muted-foreground">
              This billing system is integrated with FlowGlad for secure payment processing.
              <br />
              API Key: {import.meta.env.VITE_FLOWGLAD_SECRET_KEY ? '✅ Configured' : '❌ Missing'}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
