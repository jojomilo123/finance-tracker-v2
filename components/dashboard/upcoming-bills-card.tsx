import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Calendar, CreditCard, CheckCircle2 } from "lucide-react";

export interface UpcomingBillItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  daysRemaining: number;
  accountName: string;
}

interface UpcomingBillsCardProps {
  bills: UpcomingBillItem[];
  onPay?: (id: string, name: string) => void;
}

export function UpcomingBillsCard({ bills, onPay }: UpcomingBillsCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" /> Tagihan Merekrut &amp; Langganan
        </CardTitle>
        <span className="text-xs text-muted-foreground">Bulan Ini</span>
      </CardHeader>
      <CardContent className="space-y-3">
        {bills && bills.length > 0 ? (
          bills.map((bill) => (
            <div
              key={bill.id}
              className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/60 hover:bg-accent/40 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{bill.name}</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Jatuh Tempo: {bill.dueDate} ({bill.daysRemaining} hari lagi)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold font-mono text-foreground">
                  {formatCurrency(bill.amount)}
                </span>
                {onPay && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-lg text-xs"
                    onClick={() => onPay(bill.id, bill.name)}
                  >
                    Bayar
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">
            Tidak ada tagihan yang akan jatuh tempo dalam waktu dekat.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
