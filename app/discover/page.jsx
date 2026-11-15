'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Search,
  Filter,
  Sparkles,
  Bookmark,
  Calendar,
  Building2,
  DollarSign,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import DashboardLayout from '@/app/dashboard/layout';
import InvestorCard from '@/components/investor/InvestorCard';
import InvestorFilters from '@/components/investor/InvestorFilters';
import BookingModal from '@/components/meetings/BookingModal';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function DiscoverPage() {
  const router = useRouter();
  const [investors, setInvestors] = useState([]);
  const [matchesMap, setMatchesMap] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    industry: 'All',
    stage: 'All',
    location: 'All',
    sortBy: 'match', // 'match' | 'checkSize' | 'name'
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Booking modal state
  const [selectedInvestorForBooking, setSelectedInvestorForBooking] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const [invRes, matchRes, favRes] = await Promise.all([
        fetch('/api/investors'),
        fetch('/api/investors/match'),
        fetch('/api/favorites'),
      ]);

      const invData = invRes.ok ? await invRes.json() : { investors: [] };
      const matchData = matchRes.ok ? await matchRes.json() : { matches: [] };
      const favData = favRes.ok ? await favRes.json() : { favorites: [] };

      setInvestors(invData.investors || []);

      const mMap = {};
      (matchData.matches || []).forEach((m) => {
        mMap[m.investor._id] = m;
      });
      setMatchesMap(mMap);

      setFavorites(
        (favData.favorites || [])
          .filter((f) => f.targetType === 'investor')
          .map((f) => f.targetId.toString())
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilterChange = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      industry: 'All',
      stage: 'All',
      location: 'All',
      sortBy: 'match',
    });
    setCurrentPage(1);
  };

  const handleToggleFavorite = async (investorId) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'investor',
          targetId: investorId,
        }),
      });
      if (res.ok) {
        setFavorites((prev) =>
          prev.includes(investorId)
            ? prev.filter((id) => id !== investorId)
            : [...prev, investorId]
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenBooking = (investor) => {
    setSelectedInvestorForBooking(investor);
    setBookingModalOpen(true);
  };

  const handleOpenMessage = async (investor) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: investor.userId,
          content: `Hello ${investor.fullName}, I am interested in connecting regarding our pitch materials.`,
        }),
      });
      if (res.ok) {
        router.push('/messages');
      }
    } catch (e) {
      router.push('/messages');
    }
  };

  // Filter & Sort
  const filteredInvestors = investors
    .filter((inv) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchName = inv.fullName?.toLowerCase().includes(q);
        const matchOrg = inv.organization?.toLowerCase().includes(q);
        const matchBio = inv.biography?.toLowerCase().includes(q);
        if (!matchName && !matchOrg && !matchBio) return false;
      }
      if (filters.industry !== 'All') {
        const hasInd = inv.preferredIndustries?.some(
          (ind) => ind.toLowerCase() === filters.industry.toLowerCase()
        );
        if (!hasInd) return false;
      }
      if (filters.stage !== 'All') {
        const hasStg = inv.preferredStages?.some(
          (stg) => stg.toLowerCase() === filters.stage.toLowerCase()
        );
        if (!hasStg) return false;
      }
      if (filters.location !== 'All') {
        if (!inv.location?.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'match') {
        const scoreA = matchesMap[a._id]?.matchPercentage || 0;
        const scoreB = matchesMap[b._id]?.matchPercentage || 0;
        return scoreB - scoreA;
      } else if (filters.sortBy === 'checkSize') {
        return b.checkSizeMax - a.checkSizeMax;
      } else {
        return a.fullName.localeCompare(b.fullName);
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredInvestors.length / itemsPerPage) || 1;
  const paginatedInvestors = filteredInvestors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage/60">
          <div>
            <h1 className="text-2xl font-extrabold text-charcoal tracking-tight flex items-center gap-2">
              <span>Investor Discovery & Weighted Matching</span>
            </h1>
            <p className="text-xs text-charcoal-muted mt-1">
              Screen active angel syndicates, institutional general partners, and verified check writers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-charcoal-muted">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="bg-white border border-sage-dark/60 rounded-xl px-3 py-1.5 text-xs font-semibold text-charcoal focus:outline-none focus:border-forest"
            >
              <option value="match">Match Score (Highest)</option>
              <option value="checkSize">Ticket Size ($ Max)</option>
              <option value="name">Partner Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Bar */}
        <InvestorFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-charcoal-muted">
          <span>
            Showing <strong className="text-charcoal">{filteredInvestors.length}</strong> accredited partners
          </span>
          <span className="font-semibold text-forest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald" />
            Transparent 0-100 Compatibility Weights Active
          </span>
        </div>

        {/* Investor Cards Grid */}
        {paginatedInvestors.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-sage/60">
            <Compass className="w-10 h-10 text-forest mx-auto mb-2 opacity-50" />
            <h4 className="text-base font-bold text-charcoal">No investors match your filter query</h4>
            <p className="text-xs text-charcoal-muted mt-1 max-w-md mx-auto">
              Try adjusting your industry sector, location, or check size criteria to explore additional partners.
            </p>
            <Button size="sm" variant="outline" className="mt-4" onClick={handleResetFilters}>
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedInvestors.map((investor) => (
              <InvestorCard
                key={investor._id}
                investor={investor}
                matchData={matchesMap[investor._id]}
                isFavorite={favorites.includes(investor._id.toString())}
                onToggleFavorite={handleToggleFavorite}
                onBookMeeting={handleOpenBooking}
                onMessage={handleOpenMessage}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pt-6 border-t border-sage/60 flex items-center justify-between">
            <span className="text-xs text-charcoal-muted">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Booking Request Modal */}
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          investor={selectedInvestorForBooking}
          onBookingSuccess={() => {
            router.push('/meetings');
          }}
        />
      </div>
    </DashboardLayout>
  );
}

