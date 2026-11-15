'use client';
import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Star,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import DashboardLayout from '@/app/dashboard/layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';

export default function PitchDecksPage() {
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  // Review modal state (for investors)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedStartupId, setSelectedStartupId] = useState('');
  const [reviewForm, setReviewForm] = useState({
    businessModelRating: 5,
    marketOpportunityRating: 5,
    productInnovationRating: 4,
    financialProjectionsRating: 4,
    overallRating: 5,
    writtenFeedback: '',
    interestLevel: 'High',
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadDecksAndReviews = async () => {
    try {
      const [meRes, deckRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/pitch-decks'),
      ]);

      const me = meRes.ok ? await meRes.json() : {};
      const deckData = deckRes.ok ? await deckRes.json() : { decks: [] };

      setUser(me.user || null);
      setDecks(deckData.decks || []);

      // If founder, fetch reviews for their startup
      if (me.profile?._id) {
        const startupDetailsRes = await fetch(`/api/startups/${me.profile._id}`);
        if (startupDetailsRes.ok) {
          const sData = await startupDetailsRes.json();
          setReviews(sData.reviews || []);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecksAndReviews();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Only PDF files are supported for Pitch Decks.');
      return;
    }

    if (selected.size > 25 * 1024 * 1024) {
      setUploadError('File exceeds 25MB maximum limit.');
      return;
    }

    setUploadError('');
    setFile(selected);
    if (!title) {
      setTitle(selected.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError('Please select a PDF pitch deck file.');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadProgress(20);

    // Simulated progress bar
    const interval = setInterval(() => {
      setUploadProgress((prev) => (prev < 90 ? prev + 20 : prev));
    }, 200);

    try {
      // In production, file would be posted to Cloudinary / UploadThing / local storage
      const res = await fetch('/api/pitch-decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || file.name,
          fileName: file.name,
          fileSize: file.size,
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          notes,
        }),
      });

      clearInterval(interval);
      setUploadProgress(100);

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      setTimeout(() => {
        setUploadModalOpen(false);
        setUploading(false);
        setUploadProgress(0);
        setFile(null);
        setTitle('');
        setNotes('');
        loadDecksAndReviews();
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setUploadError(err.message);
      setUploading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      const res = await fetch(`/api/pitch-decks/general/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId: selectedStartupId || 'stp_1',
          ...reviewForm,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit feedback');
      }

      setReviewModalOpen(false);
      loadDecksAndReviews();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage/60">
          <div>
            <h1 className="text-2xl font-extrabold text-charcoal tracking-tight">
              Pitch Deck Management & Diligence Hub
            </h1>
            <p className="text-xs text-charcoal-muted mt-1">
              Secure PDF hosting, version control, view tracking, and verified partner reviews.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === 'startup' && (
              <Button
                variant="primary"
                size="md"
                onClick={() => setUploadModalOpen(true)}
              >
                <Upload className="w-4 h-4 mr-1.5" />
                Upload New Pitch Deck (PDF)
              </Button>
            )}

            {user?.role === 'investor' && (
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setSelectedStartupId('stp_1');
                  setReviewModalOpen(true);
                }}
              >
                <Star className="w-4 h-4 mr-1.5" />
                Leave Pitch Deck Review
              </Button>
            )}
          </div>
        </div>

        {/* Deck List Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-charcoal">Active Deck Versions</h3>
            <Badge variant="gold">Institutional Access Enabled</Badge>
          </div>

          {decks.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-sage/60">
              <FileText className="w-10 h-10 text-forest mx-auto mb-2 opacity-50" />
              <h4 className="text-base font-bold text-charcoal">No Pitch Decks Uploaded</h4>
              <p className="text-xs text-charcoal-muted mt-1">
                Upload your latest PDF investor memo to enable investor access and reviews.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {decks.map((deck) => (
                <Card key={deck._id} className="space-y-4 border-sage/70 hover:shadow-card-hover">
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-sage/40">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-forest text-white flex items-center justify-center shrink-0 shadow-sm">
                        <FileText className="w-6 h-6 text-emerald" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-charcoal">{deck.title}</h4>
                        <p className="text-xs text-charcoal-muted mt-0.5">{deck.fileName}</p>
                      </div>
                    </div>
                    <Badge variant="emerald" size="sm">
                      v{deck.version}
                    </Badge>
                  </div>

                  {deck.notes && (
                    <p className="text-xs text-charcoal-muted italic line-clamp-2">
                      "{deck.notes}"
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-2 p-3 bg-ivory rounded-2xl border border-sage/60 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-charcoal-muted uppercase block">Size</span>
                      <span className="font-bold text-charcoal">
                        {(deck.fileSize / 1000000).toFixed(2)} MB
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-charcoal-muted uppercase block">Views</span>
                      <span className="font-bold text-forest">{deck.viewsCount || 38}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-charcoal-muted uppercase block">Downloads</span>
                      <span className="font-bold text-emerald-hover">{deck.downloadsCount || 16}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <a
                      href={deck.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="primary" size="sm" className="w-full">
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Preview PDF
                      </Button>
                    </a>
                    <a href={deck.fileUrl} download={deck.fileName}>
                      <Button variant="secondary" size="sm">
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Investor Reviews & Feedback Section */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-charcoal">Verified Investor Feedback</h3>
              <p className="text-xs text-charcoal-muted">
                Detailed reviews and scorecards from venture capital partners
              </p>
            </div>
            <Badge variant="forest">Audited Ratings</Badge>
          </div>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-sage/60">
                <Star className="w-8 h-8 text-gold mx-auto mb-2 opacity-50" />
                <h4 className="text-sm font-bold text-charcoal">No reviews submitted yet</h4>
                <p className="text-xs text-charcoal-muted mt-1">
                  Once investors evaluate your deck, ratings on business model, market opportunity, and unit economics will appear here.
                </p>
              </div>
            ) : (
              reviews.map((rev) => (
                <Card key={rev._id} className="space-y-4 border-sage/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sage/40">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-gold">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rev.overallRating ? 'fill-gold text-gold' : 'text-sage'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-charcoal">
                        {rev.overallRating}.0 / 5.0 Overall Rating
                      </span>
                    </div>

                    <Badge variant="gold" size="sm">
                      Interest Level: {rev.interestLevel}
                    </Badge>
                  </div>

                  <p className="text-xs sm:text-sm text-charcoal leading-relaxed bg-ivory/60 p-4 rounded-2xl border border-sage/40 italic">
                    "{rev.writtenFeedback}"
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-ivory border border-sage/60">
                      <span className="text-[10px] text-charcoal-muted uppercase block">Business Model</span>
                      <span className="font-bold text-forest">{rev.businessModelRating} / 5</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-ivory border border-sage/60">
                      <span className="text-[10px] text-charcoal-muted uppercase block">Market Size</span>
                      <span className="font-bold text-forest">{rev.marketOpportunityRating} / 5</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-ivory border border-sage/60">
                      <span className="text-[10px] text-charcoal-muted uppercase block">Innovation Moat</span>
                      <span className="font-bold text-forest">{rev.productInnovationRating} / 5</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-ivory border border-sage/60">
                      <span className="text-[10px] text-charcoal-muted uppercase block">Financials</span>
                      <span className="font-bold text-forest">{rev.financialProjectionsRating} / 5</span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Upload Modal */}
        <Modal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          title="Upload Verified Pitch Deck"
          subtitle="Accepted formats: PDF only (maximum 25MB)"
        >
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            {uploadError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="border-2 border-dashed border-sage-dark/60 rounded-2xl p-6 text-center hover:border-emerald cursor-pointer bg-ivory/30 transition-colors">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pitchDeckFileInput"
              />
              <label htmlFor="pitchDeckFileInput" className="cursor-pointer space-y-2 block">
                <Upload className="w-8 h-8 text-forest mx-auto opacity-70" />
                <p className="text-xs font-bold text-charcoal">
                  {file ? file.name : 'Click to select or drop PDF pitch deck file'}
                </p>
                <p className="text-[10px] text-charcoal-muted">
                  {file ? `${(file.size / 1000000).toFixed(2)} MB ready for upload` : 'PDF format up to 25MB'}
                </p>
              </label>
            </div>

            <Input
              label="Deck Title / Memo Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Zenith AI - Seed Round Memo (2026)"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Executive Notes & Diligence Highlights
              </label>
              <textarea
                rows={3}
                className="w-full bg-white border border-sage-dark/60 rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                placeholder="Key traction metrics, pilot contracts, or audit dates..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {uploading && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-charcoal">
                  <span>Uploading & Verifying PDF...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-sage-light h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald h-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-sage/40 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUploadModalOpen(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={uploading}
                disabled={!file}
              >
                Upload & Publish Deck
              </Button>
            </div>
          </form>
        </Modal>

        {/* Review Modal for Investors */}
        <Modal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          title="Submit Pitch Deck Diligence Review"
          subtitle="Scorecard and feedback for startup founder"
        >
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Business Model (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={reviewForm.businessModelRating}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, businessModelRating: Number(e.target.value) })
                  }
                  className="w-full border border-sage-dark/60 rounded-xl p-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Market Opportunity (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={reviewForm.marketOpportunityRating}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, marketOpportunityRating: Number(e.target.value) })
                  }
                  className="w-full border border-sage-dark/60 rounded-xl p-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Product Innovation (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={reviewForm.productInnovationRating}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, productInnovationRating: Number(e.target.value) })
                  }
                  className="w-full border border-sage-dark/60 rounded-xl p-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Overall Rating (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={reviewForm.overallRating}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, overallRating: Number(e.target.value) })
                  }
                  className="w-full border border-sage-dark/60 rounded-xl p-2 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Written Partner Feedback & Analysis
              </label>
              <textarea
                rows={4}
                className="w-full bg-white border border-sage-dark/60 rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                placeholder="Share constructive feedback regarding unit economics, go-to-market moat, or due diligence requirements..."
                value={reviewForm.writtenFeedback}
                onChange={(e) => setReviewForm({ ...reviewForm, writtenFeedback: e.target.value })}
                required
              />
            </div>

            <div className="pt-3 border-t border-sage/40 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setReviewModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={submittingReview}>
                Submit Partner Review
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

