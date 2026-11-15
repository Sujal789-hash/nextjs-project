import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, HeartHandshake, Award, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-dark text-ivory border-t border-forest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-white border border-emerald/40 shadow-md">
                <Sparkles className="w-5 h-5 text-emerald" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">Pitch<span className="text-emerald">Connect</span></span>
                <span className="block text-[10px] tracking-widest uppercase font-semibold text-gold -mt-1">
                  Emerald Luxe Venture
                </span>
              </div>
            </div>
            <p className="text-sm text-sage/80 leading-relaxed">
              The premier institutional matchmaking platform uniting ambitious founders with accredited angel syndicates and venture capital partners.
            </p>
            <div className="flex items-center gap-2 text-xs text-gold">
              <Award className="w-4 h-4" />
              <span>Verified Institutional Network</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-light mb-4">Ecosystem</h4>
            <ul className="space-y-2.5 text-sm text-sage/80">
              <li><Link href="/discover" className="hover:text-white transition-colors">Discover Investors</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Startup Matrix Comparison</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How PitchConnect Works</Link></li>
              <li><Link href="/#testimonials" className="hover:text-white transition-colors">Founder Success Stories</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-light mb-4">For Founders & Investors</h4>
            <ul className="space-y-2.5 text-sm text-sage/80">
              <li><Link href="/register?role=startup" className="hover:text-white transition-colors">Apply as a Founder</Link></li>
              <li><Link href="/register?role=investor" className="hover:text-white transition-colors">Accredited Investor Portal</Link></li>
              <li><Link href="/pitch-decks" className="hover:text-white transition-colors">Pitch Deck Due Diligence</Link></li>
              <li><Link href="/meetings" className="hover:text-white transition-colors">Calendar Scheduling Engine</Link></li>
            </ul>
          </div>

          {/* Compliance & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-light mb-4">Governance</h4>
            <p className="text-xs text-sage/70 leading-relaxed">
              PitchConnect is a technology communications platform for venture networking and scheduling. It does not provide broker-dealer, investment advisory, or legal services.
            </p>
            <div className="flex items-center gap-2 text-xs text-sage/60 pt-2">
              <Shield className="w-4 h-4 text-emerald" />
              <span>256-Bit SSL Encrypted Transmissions</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-forest/60 flex flex-col sm:flex-row items-center justify-between text-xs text-sage/60">
          <p>© {new Date().getFullYear()} PitchConnect Inc. All rights reserved. Emerald Luxe Edition.</p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Protocol</a>
            <a href="#" className="hover:text-white">Security Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

