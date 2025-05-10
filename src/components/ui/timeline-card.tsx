import React from 'react';
import { InfoCard } from "@/components/ui/info-card";
import { InvestmentTimelineChart } from "@/components/investments/InvestmentTimelineChart";
import { Investment } from "@/types/finance";

interface TimelineCardProps {
  investment: Investment;
}

export function TimelineCard({ investment }: TimelineCardProps) {
  return (
    <InfoCard title="Evolução do Investimento">
      <InvestmentTimelineChart investment={investment} />
    </InfoCard>
  );
} 