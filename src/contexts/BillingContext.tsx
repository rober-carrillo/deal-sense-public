// contexts/BillingContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { getCurrentUser } from '@/lib/flowglad-client';
import { getCustomerBilling, getPricingPlans, getOrCreateCustomer, handleBillingRedirect } from '@/utils/billing';
import { useToast } from '@/hooks/use-toast';

interface BillingContextType {
  user: User | null;
  customerId: string | null;
  billingInfo: any | null;
  pricingPlans: any[];
  loading: boolean;
  refreshBilling: () => Promise<void>;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};

interface BillingProviderProps {
  children: React.ReactNode;
  loadBilling?: boolean;
}

export const BillingProvider: React.FC<BillingProviderProps> = ({ 
  children, 
  loadBilling = false 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [billingInfo, setBillingInfo] = useState<any | null>(null);
  // Initialize with default plans to ensure they always show
  const [pricingPlans, setPricingPlans] = useState<any[]>([
    {
      id: 'prod_Lynf5sLmO4wCamrt36yQk',
      name: 'Deal Sense Pro',
      description: 'Full access to all Deal Sense features',
      price: 29,
      interval: 'month',
      features: [
        'Unlimited clients',
        'AI-powered insights',
        'Advanced analytics',
        'Priority support',
        'Custom integrations'
      ],
    }
  ]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshBilling = async () => {
    if (!customerId) return;
    
    try {
      setLoading(true);
      console.log('💳 Loading billing data...');
      
      // Use Promise.allSettled to handle errors gracefully
      const [billingResult, plansResult] = await Promise.allSettled([
        getCustomerBilling(customerId),
        getPricingPlans(),
      ]);
      
      // Handle billing data
      if (billingResult.status === 'fulfilled') {
        setBillingInfo(billingResult.value);
        console.log('✅ Billing info loaded:', billingResult.value);
      } else {
        console.warn('❌ Failed to load billing data:', billingResult.reason);
        setBillingInfo({
          plan: { name: 'Free', id: 'price_free' },
          status: 'active',
          current_period_end: null,
          invoices: [],
        });
      }
      
      // Handle pricing plans
      if (plansResult.status === 'fulfilled' && plansResult.value?.length > 0) {
        setPricingPlans(plansResult.value);
        console.log('✅ Pricing plans loaded from FlowGlad:', plansResult.value?.length, 'plans');
      } else {
        console.warn('❌ Failed to load pricing plans from FlowGlad, keeping default plans');
        // Keep the default plans that were set in state initialization
      }
    } catch (error) {
      console.error('❌ Critical error in refreshBilling:', error);
      // Set minimal fallback data
      setBillingInfo({
        plan: { name: 'Free', id: 'price_free' },
        status: 'active',
        current_period_end: null,
        invoices: [],
      });
      setPricingPlans([]);
    } finally {
      setLoading(false);
      console.log('🏁 Billing refresh complete');
    }
  };

  useEffect(() => {
    const initializeBilling = async () => {
      try {
        console.log('🔄 Initializing billing context...');
        const currentUser = await getCurrentUser();
        setUser(currentUser as User);
        console.log('👤 Current user:', currentUser?.email);

        // Since we always have a user now (mock or real), always load billing
        if (currentUser) {
          // Ensure customer exists in FlowGlad
          console.log('🏗️ Creating/getting customer...');
          await getOrCreateCustomer(
            currentUser.id,
            currentUser.email,
            currentUser.user_metadata?.full_name || currentUser.email
          );

          // Use user ID as customer ID for FlowGlad
          const customerIdValue = currentUser.id;
          setCustomerId(customerIdValue);
          console.log('🆔 Customer ID:', customerIdValue);
          
          if (customerIdValue) {
            console.log('💳 Refreshing billing data...');
            await refreshBilling();
          }
        }
      } catch (error) {
        console.error('❌ Error initializing billing:', error);
        // Set fallback data even on error
        setBillingInfo({
          plan: { name: 'Free', id: 'free' },
          status: 'active',
          current_period_end: null,
          invoices: [],
        });
        // Keep the default plans that were set in state initialization
        console.log('✅ Using default pricing plans');
      } finally {
        setLoading(false);
        console.log('✅ Billing initialization complete');
      }
    };

    initializeBilling();
  }, []); // Remove loadBilling dependency since we always want to load

  // Handle billing redirects (success/cancel)
  useEffect(() => {
    const redirect = handleBillingRedirect();
    if (redirect) {
      toast({
        title: redirect.type === 'success' ? 'Success!' : 'Canceled',
        description: redirect.message,
        variant: redirect.type === 'success' ? 'default' : 'destructive',
      });

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Refresh billing info on success
      if (redirect.type === 'success') {
        setTimeout(refreshBilling, 1000);
      }
    }
  }, [toast]);

  const value: BillingContextType = {
    user,
    customerId,
    billingInfo,
    pricingPlans,
    loading,
    refreshBilling,
  };

  return (
    <BillingContext.Provider value={value}>
      {children}
    </BillingContext.Provider>
  );
};
