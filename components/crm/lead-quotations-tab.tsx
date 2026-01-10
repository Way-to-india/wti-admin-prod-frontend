import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/crm-utils';
import { LeadQuotation } from '@/types/crm.types';
import { FileText, Plus } from 'lucide-react';

interface LeadQuotationsTabProps {
  quotations: LeadQuotation[];
  onUploadClick: () => void;
}

export function LeadQuotationsTab({ quotations, onUploadClick }: LeadQuotationsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black">Proposal History</h3>
        <Button
          className="h-10 px-5 rounded-xl transition-all shadow-md group font-bold"
          onClick={onUploadClick}
        >
          <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
          Draft New Proposal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quotations.length === 0 ? (
          <div className="md:col-span-2 p-16 text-center border-2 border-dashed rounded-2xl">
            <FileText className="w-12 h-12 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">No proposals drafted yet.</p>
          </div>
        ) : (
          quotations.map((quotation) => (
            <Card
              key={quotation.id}
              className="hover:shadow-lg transition-all cursor-pointer group rounded-xl overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-extrabold truncate max-w-[200px]">
                        {quotation.fileName}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        V{quotation.version} • {formatDate(quotation.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {quotation.amount && (
                      <span className="text-sm font-black">
                        ₹{quotation.amount.toLocaleString()}
                      </span>
                    )}
                    {quotation.isAccepted ? (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-lg px-2 py-0.5">
                        Approved
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-slate-200 text-slate-400 rounded-lg px-2 py-0.5"
                      >
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
