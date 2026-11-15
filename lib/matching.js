/**
 * Transparent Weighted Matching Algorithm (0 - 100)
 * Evaluates compatibility between Startup and Investor
 *
 * Weights:
 * - Industry Alignment: 35%
 * - Check Size / Funding Fit: 35%
 * - Startup Stage Alignment: 30%
 */

export function calculateMatchScore(startup, investor) {
  if (!startup || !investor) {
    return {
      score: 50,
      reasons: ['General venture ecosystem match'],
      matchingPreferences: [],
      suggestedAction: 'Review profile and reach out via in-app message',
    };
  }

  let totalScore = 0;
  const reasons = [];
  const matchingPreferences = [];

  // 1. Industry Alignment (35 points max)
  const investorIndustries = investor.preferredIndustries || [];
  const startupIndustry = startup.industry || '';

  const isExactIndustry = investorIndustries.some(
    (ind) => ind.toLowerCase() === startupIndustry.toLowerCase()
  );

  if (isExactIndustry) {
    totalScore += 35;
    reasons.push(`Direct industry fit: Focused on ${startupIndustry}`);
    matchingPreferences.push(`Target Industry: ${startupIndustry}`);
  } else if (
    investorIndustries.some((ind) =>
      startupIndustry.toLowerCase().includes(ind.toLowerCase()) ||
      ind.toLowerCase().includes(startupIndustry.toLowerCase())
    )
  ) {
    totalScore += 22;
    reasons.push(`Adjacent sector synergy with ${startupIndustry}`);
    matchingPreferences.push(`Broad tech sector alignment`);
  } else {
    totalScore += 8;
    reasons.push('General portfolio diversification candidate');
  }

  // 2. Check Size & Funding Target Alignment (35 points max)
  const fundingReq = Number(startup.fundingRequired) || 0;
  const checkMin = Number(investor.checkSizeMin) || 0;
  const checkMax = Number(investor.checkSizeMax) || 10000000;

  if (fundingReq >= checkMin && fundingReq <= checkMax) {
    totalScore += 35;
    reasons.push(
      `Optimal check size: Funding ask ($${(fundingReq / 1000).toFixed(0)}k) aligns with investor range ($${(checkMin / 1000).toFixed(0)}k - $${(checkMax / 1000).toFixed(0)}k)`
    );
    matchingPreferences.push(
      `Ticket Size Fit ($${(checkMin / 1000).toFixed(0)}k - $${(checkMax / 1000).toFixed(0)}k)`
    );
  } else if (
    (fundingReq >= checkMin * 0.75 && fundingReq <= checkMax * 1.25) ||
    checkMin === 0
  ) {
    totalScore += 22;
    reasons.push('Funding requirement is within flexible co-investment range');
    matchingPreferences.push('Syndicate / Co-investment fit');
  } else {
    totalScore += 10;
    reasons.push('May require syndicate lead or adjusted tranche');
  }

  // 3. Stage Alignment (30 points max)
  const preferredStages = investor.preferredStages || [];
  const startupStage = startup.startupStage || 'Seed';

  const isStageMatch = preferredStages.some(
    (stg) => stg.toLowerCase() === startupStage.toLowerCase()
  );

  if (isStageMatch) {
    totalScore += 30;
    reasons.push(`Direct stage match: Actively deploying at ${startupStage} stage`);
    matchingPreferences.push(`Stage Focus: ${startupStage}`);
  } else {
    // Check adjacent stage
    const stagesOrder = ['Ideation', 'Pre-Seed', 'Seed', 'Series A', 'Series B+'];
    const sIndex = stagesOrder.indexOf(startupStage);
    const hasAdjacent = preferredStages.some((stg) => {
      const idx = stagesOrder.indexOf(stg);
      return idx !== -1 && Math.abs(idx - sIndex) <= 1;
    });

    if (hasAdjacent) {
      totalScore += 18;
      reasons.push(`Adjacent stage profile: Open to bridge or early stage pipeline`);
      matchingPreferences.push(`Adjacent Stage Candidate`);
    } else {
      totalScore += 5;
    }
  }

  // Cap between 0 and 100
  const finalScore = Math.min(Math.max(Math.round(totalScore), 15), 98);

  let suggestedAction = 'Book an introductory 30-min pitch meeting';
  if (finalScore >= 85) {
    suggestedAction = 'High priority: Request immediate pitch slot with full deck attached';
  } else if (finalScore >= 70) {
    suggestedAction = 'Book an introductory 30-min pitch meeting';
  } else {
    suggestedAction = 'Send an inquiry message to verify thesis alignment';
  }

  return {
    score: finalScore,
    reasons,
    matchingPreferences,
    suggestedAction,
  };
}

