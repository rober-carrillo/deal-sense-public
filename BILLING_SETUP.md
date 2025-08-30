# Deal Sense - Flowglad Billing Integration

This document outlines the billing setup for Deal Sense using Flowglad.

## Overview

The billing system is integrated into your Vite React app and provides:
- User subscription management
- Feature gating based on subscription tiers
- Usage tracking for billing purposes
- Checkout flow for upgrading plans

## Files Created/Modified

### Core Billing Files
- `src/lib/flowglad.ts` - Flowglad client configuration
- `src/api/flowglad.ts` - API wrapper for Flowglad endpoints
- `src/utils/billing.ts` - Billing utility functions
- `src/contexts/BillingContext.tsx` - React context for billing state
- `src/hooks/useBillingFeatures.ts` - Hook for feature gating
- `src/pages/Billing.tsx` - Billing management page

### Modified Files
- `src/App.tsx` - Added BillingProvider and /billing route
- `src/pages/Index.tsx` - Added usage tracking and feature gating
- `src/components/DashboardLayout.tsx` - Added billing navigation

## Features

### 1. Subscription Tiers
- **Free**: 10 clients, 50 insights, basic features
- **Pro**: 100 clients, unlimited insights, AI chat
- **Enterprise**: Unlimited clients, all features

### 2. Feature Gating
AI insights are gated behind subscription tiers. Free users see an upgrade prompt.

### 3. Usage Tracking
The app tracks:
- Client creation
- AI insight generation
- Feature usage for billing purposes

### 4. Billing Page
Navigate to `/billing` to:
- View current subscription
- See usage statistics
- Upgrade plans
- Manage billing

## Environment Variables

Ensure you have these in your `.env` file:
```
VITE_FLOWGLAD_SECRET_KEY=your_flowglad_secret_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

## Next Steps

1. **Configure Flowglad Dashboard**:
   - Set up your products and pricing in Flowglad
   - Configure webhooks for subscription events
   - Set up your Stripe integration

2. **Production Considerations**:
   - Move API calls to a backend server (don't expose secret keys)
   - Set up proper webhook handling
   - Add error boundaries for billing failures

3. **Testing**:
   - Test subscription flows in Stripe test mode
   - Verify feature gating works correctly
   - Test usage tracking and billing updates

## Usage

### Checking User Features
```typescript
import { useBillingFeatures } from '@/hooks/useBillingFeatures';

const { canUseFeature, getUsagePercentage } = useBillingFeatures();

if (canUseFeature('aiChat')) {
  // User can use AI features
}

const clientUsage = getUsagePercentage(currentClients, 'maxClients');
```

### Tracking Usage
```typescript
import { trackUsage } from '@/utils/billing';

// Track when user generates an insight
await trackUsage('ai_insight_generation', 1);
```

### Managing Subscriptions
Users can manage their billing at `/billing` which includes:
- Current plan status
- Usage statistics
- Upgrade options
- Billing history

## Development Notes

Since this is a Vite React app (not Next.js), the billing integration:
- Uses client-side API calls (should be moved to backend in production)
- Includes error handling for missing/invalid API responses
- Provides fallback behavior when billing services are unavailable

For production, consider setting up a backend proxy to handle Flowglad API calls securely.
