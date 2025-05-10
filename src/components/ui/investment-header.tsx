import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { CategoryBadge } from "@/components/ui/category-badge";
import { Edit, Trash } from "lucide-react";
import { Category } from "@/types/finance";

interface InvestmentHeaderProps {
  title: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  category?: Category;
}

export function InvestmentHeader({
  title,
  onBack,
  onEdit,
  onDelete,
  category
}: InvestmentHeaderProps) {
  return (
    <PageHeader
      title={title}
      onBack={onBack}
      actions={[
        {
          icon: Edit,
          label: "Editar",
          variant: "outline",
          size: "sm",
          onClick: onEdit
        },
        {
          icon: Trash,
          label: "Excluir",
          variant: "destructive",
          size: "sm",
          onClick: onDelete
        }
      ]}
    >
      {category && (
        <CategoryBadge
          name={category.name}
          color={category.color}
          className="ml-2"
        />
      )}
    </PageHeader>
  );
} 