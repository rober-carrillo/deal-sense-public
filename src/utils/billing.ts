// utils/billing.ts
import { flowgladClient } from '@/lib/flowglad-client';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/lib/flowglad-client';
import { getMockPricingPlans, getMockBillingInfo, mockCreateCheckoutSession } from './mockBilling';

// Get or create customer in FlowGlad
export const getOrCreateCustomer = async (userId: string, userEmail?: string, userName?: string) => {
  try {
    // Try to get existing customer
    const customer = await flowgladClient.getCustomer(userId);
    return customer;
  } catch (error: any) {
    if (error.status === 404) {
      // Customer doesn't exist, create new one
      return await flowgladClient.createCustomer({
        id: userId,
        email: userEmail,
        name: userName,
        metadata: {
          created_from: 'deal-sense-app',
          created_at: new Date().toISOString(),
        },
      });
    }
    // If FlowGlad is not available, return a mock customer
    console.warn('FlowGlad API not available, using mock customer data');
    return {
      id: userId,
      email: userEmail,
      name: userName,
      created_at: new Date().toISOString(),
    };
  }
};

// Get customer billing information
export const getCustomerBilling = async (customerId: string) => {
  try {
    console.log('💳 Fetching billing info from FlowGlad for customer:', customerId);
    const billing = await flowgladClient.getCustomerBilling(customerId);
    return billing;
  } catch (error) {
    console.warn('❌ FlowGlad billing not available, using mock data for demo');
    return await getMockBillingInfo(customerId);
  }
};

// Create a checkout session
export const createCheckoutSession = async (customerId: string, priceId: string) => {
  try {
    console.log('🛒 Creating checkout session with FlowGlad');
    const session = await flowgladClient.createCheckoutSession({
      customer_id: customerId,
      price_id: priceId,
      success_url: `${window.location.origin}/billing?success=true`,
      cancel_url: `${window.location.origin}/billing?canceled=true`,
      metadata: {
        source: 'deal-sense-app',
      },
    });
    return session;
  } catch (error) {
    console.warn('❌ FlowGlad checkout not available, using mock for demo');
    return await mockCreateCheckoutSession(customerId, priceId);
  }
};

// Get available pricing plans
export const getPricingPlans = async () => {
  try {
    console.log('💰 Fetching pricing plans from FlowGlad');
    const plans = await flowgladClient.getPrices();
    return plans;
  } catch (error) {
    console.warn('❌ FlowGlad pricing not available, using mock data for demo');
    return await getMockPricingPlans();
  }
};

// Track usage for billing purposes
export const trackUsage = async (featureKey: string, quantity: number = 1) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // If no authenticated user, use our default user
    if (!user) {
      const defaultUser = await getCurrentUser();
      if (defaultUser) {
        await flowgladClient.trackUsage(defaultUser.id, featureKey, quantity);
      }
      return;
    }

    await flowgladClient.trackUsage(user.id, featureKey, quantity);
  } catch (error) {
    console.warn('Usage tracking unavailable:', error);
    // Don't throw - usage tracking failures shouldn't break the app
    // In development, we can log this for debugging
    console.log(`[MOCK] Tracked usage: ${featureKey} x${quantity}`);
  }
};

// Helper to handle billing-related redirects
export const handleBillingRedirect = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');
  const canceled = urlParams.get('canceled');

  if (success === 'true') {
    return {
      type: 'success',
      message: 'Subscription activated successfully! Welcome to your new plan.',
    };
  }

  if (canceled === 'true') {
    return {
      type: 'canceled',
      message: 'Subscription setup was canceled. You can try again anytime.',
    };
  }

  return null;
};
