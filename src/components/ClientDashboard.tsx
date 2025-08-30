import React from "react";
import { Client, Communication, AIInsight } from "@/hooks/useClients";
import { Button } from "@/components/ui/button";

interface ClientDashboardProps {
  client: Client;
  communications: Communication[];
  insights: AIInsight[];
  onGenerateMeetingPrep: () => void;
  onExportProfile: () => void;
  onUpdateStrategy: () => void;
  onFlagConcerns: () => void;
  onTrackEngagement: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  client,
  communications,
  insights,
  onGenerateMeetingPrep,
  onExportProfile,
  onUpdateStrategy,
  onFlagConcerns,
  onTrackEngagement,
}) => {
  // Helper to get the latest structured insight (if available)
  let latestInsight: any = null;
  if (insights && insights.length > 0) {
    try {
      latestInsight = JSON.parse(insights[0].response);
    } catch {
      latestInsight = null;
    }
  }

  // Fallbacks if no structured insight
  const personality = latestInsight?.personalityProfile || "No personality profile available.";
  const personalityConfidence = latestInsight?.personalityConfidence ?? 0.92;
  const salesIntel = latestInsight?.salesIntelligence || "No sales intelligence available.";
  const salesIntelConfidence = latestInsight?.salesIntelligenceConfidence ?? 0.88;
  const rapport = latestInsight?.rapportBuilders || "No rapport builders available.";
  const rapportConfidence = latestInsight?.rapportBuildersConfidence ?? 0.80;
  const smartSuggestions = latestInsight?.smartSuggestions || [
    "Schedule a technical deep dive with IT team",
    "Send ROI calculator with benchmarks",
    "Connect with CEO for peer-to-peer intro"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Panel */}
      <div className="col-span-1 bg-white rounded-lg shadow p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2">Profile</h2>
        <div className="flex items-center gap-4">
          <img src={client.avatar_url} alt={client.name} className="w-16 h-16 rounded-full" />
          <div>
            <div className="font-semibold text-lg">{client.name}</div>
            <div className="text-sm text-gray-500">{client.company}</div>
            <div className="text-xs text-gray-400">{client.email}</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="font-semibold">Deal Value:</div>
          <div>${client.deal_value?.toLocaleString()}</div>
          <div className="font-semibold mt-2">Status:</div>
          <div>{client.status}</div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={onGenerateMeetingPrep} variant="outline">📋 Generate Meeting Prep</Button>
          <Button onClick={onExportProfile} variant="outline">📊 Export Client Profile</Button>
          <Button onClick={onUpdateStrategy} variant="outline">🎯 Update Strategy</Button>
          <Button onClick={onFlagConcerns} variant="destructive">⚠️ Flag Concerns</Button>
          <Button onClick={onTrackEngagement} variant="outline">📈 Track Engagement</Button>
        </div>
      </div>

      {/* Insights Panel */}
      <div className="col-span-1 bg-white rounded-lg shadow p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2">AI Insights</h2>
        {/* Structured Insight Sections */}
        <div className="mb-4">
          <h3 className="font-semibold">Personality Profile <span className="ml-2 text-xs text-blue-500">({Math.round(personalityConfidence*100)}%)</span></h3>
          <div className="w-full bg-gray-200 rounded h-2 mb-1"><div className="bg-blue-400 h-2 rounded" style={{width: `${personalityConfidence*100}%`}} /></div>
          <div className="text-sm text-gray-700">{personality}</div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Sales Intelligence <span className="ml-2 text-xs text-blue-500">({Math.round(salesIntelConfidence*100)}%)</span></h3>
          <div className="w-full bg-gray-200 rounded h-2 mb-1"><div className="bg-blue-400 h-2 rounded" style={{width: `${salesIntelConfidence*100}%`}} /></div>
          <div className="text-sm text-gray-700">{salesIntel}</div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Rapport Builders <span className="ml-2 text-xs text-blue-500">({Math.round(rapportConfidence*100)}%)</span></h3>
          <div className="w-full bg-gray-200 rounded h-2 mb-1"><div className="bg-blue-400 h-2 rounded" style={{width: `${rapportConfidence*100}%`}} /></div>
          <div className="text-sm text-gray-700">{rapport}</div>
        </div>
        {/* Smart Suggestions */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Smart Suggestions</h3>
          <ul className="list-disc pl-5 text-sm text-green-700">
            {smartSuggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      </div>

      {/* Communications & Timeline Panel */}
      <div className="col-span-1 bg-white rounded-lg shadow p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2">Communications Timeline</h2>
        {/* Timeline, sentiment, topics, deal stage, etc. */}
        <div className="mb-4">
          <div className="font-semibold">Recent Activity</div>
          <ul className="divide-y divide-gray-200">
            {communications.map((comm, idx) => (
              <li key={idx} className="py-2">
                <div className="flex justify-between">
                  <span className="font-medium">{comm.type.toUpperCase()}</span>
                  <span className="text-xs text-gray-400">{new Date(comm.date).toLocaleDateString()}</span>
                </div>
                <div className="text-sm text-gray-700">{comm.subject}</div>
                <div className="text-xs text-gray-500">Sentiment: Positive | Topics: Integration, ROI | Stage: {client.status}</div>
              </li>
            ))}
          </ul>
        </div>
        {/* Data Visualizations Placeholder */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Data Visualizations</h3>
          <div className="flex flex-col gap-2">
            <div className="bg-blue-100 rounded p-2 text-xs">[Engagement Heatmap]</div>
            <div className="bg-blue-100 rounded p-2 text-xs">[Topic Interest Chart]</div>
            <div className="bg-blue-100 rounded p-2 text-xs">[Communication Frequency Graph]</div>
          </div>
        </div>
        {/* Intelligence Widgets Placeholder */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Intelligence Widgets</h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-green-100 rounded p-2 text-xs">Communication Health Score: 87%</div>
            <div className="bg-yellow-100 rounded p-2 text-xs">Deal Risk Assessment: Low</div>
            <div className="bg-purple-100 rounded p-2 text-xs">Competitive Analysis: Favorable</div>
            <div className="bg-pink-100 rounded p-2 text-xs">Stakeholder Mapping: 3 Key Contacts</div>
            <div className="bg-blue-100 rounded p-2 text-xs">Next Best Action: Schedule QBR</div>
          </div>
        </div>
      </div>
    </div>
  );
};
