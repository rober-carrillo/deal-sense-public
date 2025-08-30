import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DISCProfile, getTypeColor, getTypeDescription } from "@/types/disc";

interface DISCSpiderWebProps {
  profile: DISCProfile;
  size?: number;
  showDetails?: boolean;
}

export const DISCSpiderWeb: React.FC<DISCSpiderWebProps> = ({ 
  profile, 
  size = 300, 
  showDetails = true 
}) => {
  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);
  
  const center = size / 2;
  const radius = (size - 80) / 2; // Leave margin for labels
  
  // Calculate axis points (4 axes: D, I, S, C)
  const axes = useMemo(() => {
    const axisData = [
      { type: 'D', label: 'Dominance', angle: 0, score: profile.scores.dominance },
      { type: 'I', label: 'Influence', angle: 90, score: profile.scores.influence },
      { type: 'S', label: 'Steadiness', angle: 180, score: profile.scores.steadiness },
      { type: 'C', label: 'Conscientiousness', angle: 270, score: profile.scores.conscientiousness }
    ];

    return axisData.map(axis => {
      const angleRad = (axis.angle - 90) * Math.PI / 180; // Adjust so D starts at top
      const endX = center + Math.cos(angleRad) * radius;
      const endY = center + Math.sin(angleRad) * radius;
      const scoreX = center + Math.cos(angleRad) * (radius * axis.score / 100);
      const scoreY = center + Math.sin(angleRad) * (radius * axis.score / 100);
      const labelX = center + Math.cos(angleRad) * (radius + 25);
      const labelY = center + Math.sin(angleRad) * (radius + 25);

      return {
        ...axis,
        endX,
        endY,
        scoreX,
        scoreY,
        labelX,
        labelY,
        color: getTypeColor(axis.type as any)
      };
    });
  }, [profile.scores, center, radius]);

  // Create the score polygon path
  const scorePath = useMemo(() => {
    const points = axes.map(axis => `${axis.scoreX},${axis.scoreY}`).join(' ');
    return `M ${points.split(' ')[0]} L ${points.split(' ').slice(1).join(' L ')} Z`;
  }, [axes]);

  // Generate concentric rings (20, 40, 60, 80, 100)
  const rings = [20, 40, 60, 80, 100];

  return (
    <TooltipProvider>
      <Card className="w-full">
        {showDetails && (
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Avatar className="w-12 h-12">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <CardTitle className="text-xl">{profile.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  DISC Behavioral Profile
                </p>
              </div>
            </div>
            <div className="flex justify-center space-x-2">
              <Badge variant="outline" style={{ color: getTypeColor(profile.primaryType) }}>
                Primary: {profile.primaryType}
              </Badge>
              {profile.secondaryType && (
                <Badge variant="secondary" style={{ color: getTypeColor(profile.secondaryType) }}>
                  Secondary: {profile.secondaryType}
                </Badge>
              )}
            </div>
          </CardHeader>
        )}
        
        <CardContent className="flex justify-center">
          <div className="relative">
            <svg width={size} height={size} className="overflow-visible">
              {/* Background rings */}
              {rings.map((ring, i) => (
                <circle
                  key={ring}
                  cx={center}
                  cy={center}
                  r={(radius * ring) / 100}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                  opacity={0.1}
                />
              ))}

              {/* Grid lines (axes) */}
              {axes.map((axis, i) => (
                <g key={axis.type}>
                  <line
                    x1={center}
                    y1={center}
                    x2={axis.endX}
                    y2={axis.endY}
                    stroke="currentColor"
                    strokeWidth={1}
                    opacity={0.2}
                  />
                  
                  {/* Axis labels */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <g 
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredAxis(axis.type)}
                        onMouseLeave={() => setHoveredAxis(null)}
                      >
                        <circle
                          cx={axis.labelX}
                          cy={axis.labelY}
                          r={20}
                          fill={axis.color}
                          opacity={hoveredAxis === axis.type ? 0.8 : 0.6}
                          className="transition-opacity"
                        />
                        <text
                          x={axis.labelX}
                          y={axis.labelY}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="fill-white text-sm font-bold"
                        >
                          {axis.type}
                        </text>
                      </g>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="text-center">
                        <p className="font-semibold">{getTypeDescription(axis.type as any)}</p>
                        <p className="text-sm mt-1">Score: {axis.score}/100</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </g>
              ))}

              {/* Score polygon */}
              <path
                d={scorePath}
                fill={`url(#gradient-${profile.id})`}
                stroke={getTypeColor(profile.primaryType)}
                strokeWidth={2}
                opacity={0.7}
              />

              {/* Score points */}
              {axes.map((axis, i) => (
                <circle
                  key={`point-${axis.type}`}
                  cx={axis.scoreX}
                  cy={axis.scoreY}
                  r={4}
                  fill={axis.color}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}

              {/* Gradient definition */}
              <defs>
                <radialGradient id={`gradient-${profile.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={getTypeColor(profile.primaryType)} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={getTypeColor(profile.primaryType)} stopOpacity={0.1} />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </CardContent>

        {/* Score Summary */}
        {showDetails && (
          <div className="px-6 pb-4">
            <div className="grid grid-cols-2 gap-3">
              {axes.map((axis) => (
                <div key={axis.type} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: axis.color }}
                    />
                    <span className="text-sm font-medium">{axis.type}</span>
                  </div>
                  <span className="text-sm font-mono">{axis.score}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Badge variant="outline" className="text-xs">
                Confidence: {profile.confidence}%
              </Badge>
            </div>
          </div>
        )}
      </Card>
    </TooltipProvider>
  );
};

export default DISCSpiderWeb;
