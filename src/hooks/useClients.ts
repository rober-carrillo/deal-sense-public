import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Client {
  id: string;
  name: string;
  company: string;
  email?: string;
  phone?: string;
  status: 'prospect' | 'active' | 'hot_lead' | 'closed_won' | 'closed_lost';
  deal_value?: number;
  avatar_url?: string;
  honcho_session_id?: string;
  last_contact?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Communication {
  id: string;
  client_id: string;
  type: 'email' | 'call' | 'meeting' | 'message';
  subject?: string;
  content: string;
  summary?: string;
  date: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface AIInsight {
  id: string;
  client_id: string;
  query: string;
  response: string;
  confidence_score?: number;
  honcho_response_id?: string;
  created_at: string;
}

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('last_contact', { ascending: false });
      
      if (error) throw error;
      return data as Client[];
    },
  });
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Client;
    },
    enabled: !!id,
  });
};

export const useClientCommunications = (clientId: string) => {
  return useQuery({
    queryKey: ['communications', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communications')
        .select('*')
        .eq('client_id', clientId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as Communication[];
    },
    enabled: !!clientId,
  });
};

export const useClientInsights = (clientId: string) => {
  return useQuery({
    queryKey: ['insights', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AIInsight[];
    },
    enabled: !!clientId,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single();
      
      if (error) throw error;
      return data as Client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Client> & { id: string }) => {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Client;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', id] });
    },
  });
};