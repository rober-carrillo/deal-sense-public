// utils/flowglad-purchase.ts
// Direct FlowGlad purchase link integration

export const FLOWGLAD_PURCHASE_URL = 'https://app.flowglad.com/product/prod_Lynf5sLmO4wCamrt36yQk/purchase';

export interface PurchaseRedirectParams {
  customerEmail?: string;
  customerName?: string;
  returnUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}

export const createFlowGladPurchaseUrl = (params: PurchaseRedirectParams = {}) => {
  const {
    customerEmail,
    customerName,
    returnUrl = `${window.location.origin}/billing?success=true`,
    cancelUrl = `${window.location.origin}/billing?canceled=true`,
    metadata = {}
  } = params;

  const urlParams = new URLSearchParams();

  if (customerEmail) {
    urlParams.set('customer_email', customerEmail);
  }

  if (customerName) {
    urlParams.set('customer_name', customerName);
  }

  urlParams.set('return_url', returnUrl);
  urlParams.set('cancel_url', cancelUrl);

  // Add any additional metadata
  Object.entries(metadata).forEach(([key, value]) => {
    urlParams.set(key, value);
  });

  return `${FLOWGLAD_PURCHASE_URL}?${urlParams.toString()}`;
};

export const redirectToFlowGladPurchase = (params: PurchaseRedirectParams = {}) => {
  const purchaseUrl = createFlowGladPurchaseUrl(params);
  
  console.log('🚀 Redirecting to FlowGlad purchase:', purchaseUrl);
  
  // Use window.location.href for immediate redirect
  window.location.href = purchaseUrl;
};
