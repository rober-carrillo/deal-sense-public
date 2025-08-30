// src/api/flowglad.ts
// Simple client-side API wrapper for Flowglad
// Note: In production, you should proxy these requests through your backend

const FLOWGLAD_API_BASE = 'https://api.flowglad.com/v1';

class FlowgladError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'FlowgladError';
  }
}

const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const secretKey = import.meta.env.VITE_FLOWGLAD_SECRET_KEY;
  
  if (!secretKey || secretKey.includes('your_') || secretKey.includes('test')) {
    throw new FlowgladError('Flowglad not configured for development mode', 503);
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
        `Flowglad API error: ${response.status} ${response.statusText} - ${errorText}`,
        response.status
      );
    }

    return response.json();
  } catch (fetchError) {
    if (fetchError instanceof FlowgladError) {
      throw fetchError;
    }
    // Handle network errors, CORS issues, etc.
    throw new FlowgladError(
      `Network error connecting to Flowglad: ${fetchError.message}`,
      0
    );
  }
};

export const flowgladApi = {
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

  // Webhook verification (for development)
  async verifyWebhook(payload: string, signature: string) {
    return makeRequest('/webhooks/verify', {
      method: 'POST',
      body: JSON.stringify({
        payload,
        signature,
      }),
    });
  },
};
