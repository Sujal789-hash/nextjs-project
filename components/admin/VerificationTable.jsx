'use client';
import React from 'react';
import { ShieldCheck, Check, X, FileText, ExternalLink } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function VerificationTable({
  verifications = [],
  onReview,
}) {
  if (verifications.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-sage/60">
        <ShieldCheck className="w-8 h-8 text-forest mx-auto mb-2 opacity-40" />
        <p className="text-sm font-semibold text-charcoal">All verifications are up to date</p>
        <p className="text-xs text-charcoal-muted mt-1">No pending compliance dossiers require review.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-sage/60 overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-ivory border-b border-sage/60 text-charcoal-muted uppercase tracking-wider font-bold">
              <th className="p-4">Entity Type</th>
              <th className="p-4">Applicant ID</th>
              <th className="p-4">Submitted Documents</th>
              <th className="p-4">Current Status</th>
              <th className="p-4 text-right">Review Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage/40">
            {verifications.map((item) => (
              <tr key={item._id} className="hover:bg-ivory/30">
                <td className="p-4 font-bold capitalize text-forest">
                  {item.targetType} Accreditation
                </td>
                <td className="p-4 text-charcoal font-mono">
                  {item.userId?.slice(-6) || 'usr_node'}
                </td>
                <td className="p-4">
                  {item.documents?.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-hover hover:underline mr-2"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{doc.name}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </td>
                <td className="p-4">
                  <Badge
                    variant={
                      item.status === 'Approved'
                        ? 'emerald'
                        : item.status === 'Rejected'
                        ? 'red'
                        : 'amber'
                    }
                    size="sm"
                  >
                    {item.status}
                  </Badge>
                </td>
                <td className="p-4 text-right space-x-2">
                  {item.status === 'Pending' ? (
                    <>
                      <Button
                        size="sm"
                        variant="emerald"
                        onClick={() => onReview(item._id, 'Approved')}
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onReview(item._id, 'Rejected')}
                      >
                        <X className="w-3.5 h-3.5 mr-1" />
                        Reject
                      </Button>
                    </>
                  ) : (
                    <span className="text-charcoal-muted text-[11px] italic">
                      Dossier Closed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

