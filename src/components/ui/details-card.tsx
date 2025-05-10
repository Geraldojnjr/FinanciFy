import React from 'react';
import { InfoCard } from "@/components/ui/info-card";
import { DetailsContent } from "@/components/ui/details-content";
import { DatesGrid } from "@/components/ui/dates-grid";
import { FieldsList } from "@/components/ui/fields-list";

interface DetailsCardProps {
  title: string;
  dates: {
    date: Date | string;
    label: string;
  }[];
  fields: {
    label: string;
    value: React.ReactNode;
  }[];
}

export function DetailsCard({ title, dates, fields }: DetailsCardProps) {
  return (
    <InfoCard title={title}>
      <DetailsContent>
        <DatesGrid dates={dates} />
        <FieldsList fields={fields} />
      </DetailsContent>
    </InfoCard>
  );
} 