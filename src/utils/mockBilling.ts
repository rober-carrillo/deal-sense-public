// utils/mockBilling.ts
// Simplified billing data for demo purposes

export const MOCK_PRICING_PLANS = [
  {
    id: 'price_free',
    name: 'Free',
    description: 'Perfect for getting started with Deal Sense',
    price: 0,
    interval: 'month',
    features: [
      'Up to 50 clients',
      'Basic AI insights',
      'Email support',
      'Standard dashboard'
    ],
  },
  {
    id: 'price_pro',
    name: 'Pro',
    description: 'For growing sales teams',
    price: 29,
    interval: 'month',
    features: [
      'Up to 100 clients',
      'Unlimited AI insights',
      'Advanced analytics',
      'Priority support',
      'Export capabilities'
    ],
  },
  {
    id: 'price_enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: 99,
    interval: 'month',
    features: [
      'Unlimited clients',
      'Custom AI models',
      'Advanced integrations',
      'Dedicated support',
      'Custom reporting',
      'API access'
    ],
  },
];

export const MOCK_BILLING_INFO = {
  plan: { name: 'Free', id: 'price_free' },
  status: 'active',
  current_period_end: null,
  invoices: [],
  usage: {
    clients: 4,
    insights_generated: 12,
  }
};

// Simplified functions that always return mock data
export const getMockPricingPlans = async () => {
  console.log('📦 Using mock pricing plans');
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_PRICING_PLANS;
};

export const getMockBillingInfo = async (customerId: string) => {
  console.log('💳 Using mock billing info for customer:', customerId);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_BILLING_INFO;
};

export const mockCreateCheckoutSession = async (customerId: string, priceId: string) => {
  console.log('🛒 Mock checkout session for:', { customerId, priceId });
  // In a real app, this would redirect to Stripe
  return {
    url: `https://checkout.stripe.com/mock?price=${priceId}&customer=${customerId}`,
    id: 'cs_mock_' + Math.random().toString(36).substr(2, 9)
  };
};
