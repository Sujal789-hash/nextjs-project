'use client';
import React from 'react';
import {
  Building2,
  MapPin,
  DollarSign,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Bookmark,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function InvestorCard({
  investor,
  matchData,
  onBookMeeting,
  onMessage,
  onToggleFavorite,
  isFavorite = false,
}) {
  const checkMinFormatted = `$${(investor.checkSizeMin / 1000).toFixed(0)}k`;
  const checkMaxFormatted = `$${(investor.checkSizeMax / 1000000).toFixed(1)}M`;

  return (
    <Card className="flex flex-col justify-between hover:shadow-card-hover border-sage/60 transition-all duration-300 relative group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-sage/40">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-forest-dark text-white overflow-hidden border-2 border-emerald/40 shadow-sm relative shrink-0">
              {investor.profileImage ? (
                <img
                  src={investor.profileImage}
                  alt={investor.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-lg text-emerald">
                  {investor.fullName?.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-base font-bold text-charcoal group-hover:text-forest transition-colors">
                  {investor.fullName}
                </h4>
                {investor.isVerified && (
                  <Badge variant="gold" size="sm">
                    <CheckCircle2 className="w-3 h-3 text-gold-dark" />
                    Verified Partner
                  </Badge>
                )}
              </div>
              <p className="text-xs font-semibold text-emerald-hover flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
                {investor.title} • {investor.organization}
              </p>
              <p className="text-xs text-charcoal-muted flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-forest" />
                {investor.location}
              </p>
            </div>
          </div>

          {/* Match Score Badge or Favorite */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            {matchData && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-forest text-white text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald" />
                <span>{matchData.matchPercentage || matchData.score}% Match</span>
              </div>
            )}
            <button
              onClick={() => onToggleFavorite && onToggleFavorite(investor._id)}
              className={`p-2 rounded-xl transition-colors ${
                isFavorite
                  ? 'text-gold bg-gold/15'
                  : 'text-charcoal-muted hover:text-gold hover:bg-sage/40'
              }`}
              title="Bookmark Investor"
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-gold' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-charcoal-muted mt-3 line-clamp-3 leading-relaxed">
          {investor.biography}
        </p>

        {/* Check Size Pill */}
        <div className="mt-4 p-3 bg-ivory rounded-xl border border-sage/60 flex items-center justify-between text-xs">
          <span className="font-semibold text-charcoal flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-forest" />
            Check Size Sweet Spot:
          </span>
          <span className="font-extrabold text-forest">
            {checkMinFormatted} – {checkMaxFormatted}
          </span>
        </div>

        {/* Preferred Stages & Industries */}
        <div className="mt-4 space-y-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block mb-1">
              Preferred Sectors
            </span>
            <div className="flex flex-wrap gap-1.5">
              {investor.preferredIndustries?.map((ind) => (
                <Badge key={ind} variant="sage" size="sm">
                  {ind}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block mb-1">
              Stage Deployment
            </span>
            <div className="flex flex-wrap gap-1.5">
              {investor.preferredStages?.map((stg) => (
                <Badge key={stg} variant="forest" size="sm">
                  {stg}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Why Recommended Highlight (if matchData present) */}
        {matchData?.reasons && matchData.reasons.length > 0 && (
          <div className="mt-4 p-2.5 rounded-xl bg-sage-light border border-emerald/20 text-[11px] text-forest space-y-1">
            <span className="font-bold flex items-center gap-1 text-emerald-hover">
              <Sparkles className="w-3 h-3" />
              Thesis Alignment:
            </span>
            <p className="leading-snug">{matchData.reasons[0]}</p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-sage/40 flex items-center gap-2">
        <Button
          size="sm"
          variant="primary"
          className="flex-1"
          onClick={() => onBookMeeting && onBookMeeting(investor)}
        >
          <Calendar className="w-3.5 h-3.5 mr-1" />
          Request Pitch Slot
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onMessage && onMessage(investor)}
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
}

