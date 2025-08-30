// hooks/useBillingFeatures.ts
import { useBilling } from '@/contexts/BillingContext';

export const useBillingFeatures = () => {
  const { billingInfo, loading } = useBilling();

  // Define feature limits based on subscription tier
  const getFeatureLimits = () => {
    const plan = billingInfo?.plan?.name?.toLowerCase() || 'free';
    
    // In development/demo mode, we'll be more generous with the free tier
    switch (plan) {
      case 'free':
        return {
          maxClients: 50, // Increased for demo
          maxInsights: 200, // Increased for demo
          aiChat: true, // Enabled for demo
          advancedAnalytics: false,
          exportData: false,
        };
      case 'pro':
        return {
          maxClients: 100,
          maxInsights: 500,
          aiChat: true,
          advancedAnalytics: true,
          exportData: true,
        };
      case 'enterprise':
        return {
          maxClients: Infinity,
          maxInsights: Infinity,
          aiChat: true,
          advancedAnalytics: true,
          exportData: true,
        };
      default:
        return {
          maxClients: 50,
          maxInsights: 200,
          aiChat: true, // Enabled for demo
          advancedAnalytics: false,
          exportData: false,
        };
    }
  };

  const features = getFeatureLimits();

  const canUseFeature = (featureName: keyof typeof features) => {
    if (loading) return false;
    return features[featureName] === true || features[featureName] === Infinity;
  };

  const getUsagePercentage = (current: number, featureName: 'maxClients' | 'maxInsights') => {
    const limit = features[featureName];
    if (limit === Infinity) return 0;
    return Math.min((current / limit) * 100, 100);
  };

  return {
    features,
    canUseFeature,
    getUsagePercentage,
    currentPlan: billingInfo?.plan?.name || 'Free',
    isSubscribed: billingInfo?.status === 'active',
    loading,
  };
};
