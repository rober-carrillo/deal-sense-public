// FlowGlad client setup for Vite React app
import { supabase } from '@/integrations/supabase/client';

const FLOWGLAD_API_BASE = 'https://api.flowglad.com/v1';

class FlowgladError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'FlowgladError';
  }
}

// Helper to get current user for billing context
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (!user || error) {
    // Return demo user for seamless experience
    return {
      id: 'demo-user-001',
      email: 'demo@dealsense.com',
      user_metadata: {
        full_name: 'Demo User',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  
  return user;
};

// FlowGlad API client with proper error handling
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const secretKey = import.meta.env.VITE_FLOWGLAD_SECRET_KEY;
  
  if (!secretKey) {
    throw new FlowgladError('FlowGlad API key not configured', 503);
  }

  const url = `${FLOWGLAD_API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new FlowgladError(
        `FlowGlad API error: ${response.status} ${response.statusText} - ${errorText}`,
        response.status
      );
    }

    return response.json();
  } catch (fetchError) {
    if (fetchError instanceof FlowgladError) {
      throw fetchError;
    }
    throw new FlowgladError(
      `Network error connecting to FlowGlad: ${fetchError.message}`,
      0
    );
  }
};

export const flowgladClient = {
  // Customer management
  async getCustomer(customerId: string) {
    return makeRequest(`/customers/${customerId}`);
  },

  async createCustomer(customerData: {
    id: string;
    email?: string;
    name?: string;
    metadata?: Record<string, any>;
  }) {
    return makeRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },

  async getOrCreateCustomer(id: string, email?: string, name?: string) {
    try {
      return await this.getCustomer(id);
    } catch (error) {
      if (error.status === 404) {
        return await this.createCustomer({ id, email, name });
      }
      throw error;
    }
  },

  // Billing information
  async getCustomerBilling(customerId: string) {
    return makeRequest(`/customers/${customerId}/billing`);
  },

  // Subscriptions
  async getSubscriptions(customerId: string) {
    return makeRequest(`/customers/${customerId}/subscriptions`);
  },

  async createSubscription(customerId: string, priceId: string) {
    return makeRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: customerId,
        price_id: priceId,
      }),
    });
  },

  // Checkout sessions
  async createCheckoutSession(data: {
    customer_id: string;
    price_id: string;
    success_url: string;
    cancel_url: string;
    metadata?: Record<string, any>;
  }) {
    return makeRequest('/checkout/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Pricing and products
  async getPrices() {
    return makeRequest('/prices');
  },

  async getProducts() {
    return makeRequest('/products');
  },

  // Usage tracking
  async trackUsage(customerId: string, featureKey: string, quantity: number = 1) {
    return makeRequest('/usage', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: customerId,
        feature_key: featureKey,
        quantity,
        timestamp: new Date().toISOString(),
      }),
    });
  },
};
