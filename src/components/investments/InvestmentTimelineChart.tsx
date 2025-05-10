import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/contexts/FinanceContext";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/utils/format";
import { Investment } from "@/types/finance";
import { generateTimelineData } from "@/utils/investment";

interface InvestmentTimelineChartProps {
  investmentId?: string; // Optional, if provided, will show timeline for specific investment
  investment?: Investment; // Optional, direct investment object
}

export function InvestmentTimelineChart({ investmentId, investment }: InvestmentTimelineChartProps) {
  const { investments } = useFinance();
  const timelineData = generateTimelineData(investments, investmentId, investment);
  
  // If no data, show a message
  if (!timelineData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução do Portfólio</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Sem dados de investimento para exibir</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução do Portfólio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timelineData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip 
                formatter={(value) => [formatCurrency(Number(value)), "Valor"]} 
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
