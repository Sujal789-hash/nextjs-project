import mongoose from 'mongoose';

const StartupSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startupName: {
      type: String,
      required: [true, 'Startup name is required'],
      trim: true,
    },
    founderName: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      required: true,
      enum: [
        'FinTech',
        'HealthTech',
        'AI & Machine Learning',
        'CleanTech & Energy',
        'SaaS & Enterprise',
        'EdTech',
        'E-Commerce & Retail',
        'BioTech',
        'Cybersecurity',
        'AgriTech',
        'Other'
      ],
      default: 'SaaS & Enterprise',
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      required: true,
      default: 'San Francisco, CA',
    },
    foundedYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    teamSize: {
      type: String,
      default: '1-10',
    },
    startupStage: {
      type: String,
      enum: ['Ideation', 'Pre-Seed', 'Seed', 'Series A', 'Series B+'],
      default: 'Seed',
    },
    businessModel: {
      type: String,
      enum: ['B2B SaaS', 'B2C', 'Marketplace', 'Enterprise', 'Hardware / DeepTech', 'Other'],
      default: 'B2B SaaS',
    },
    targetAudience: {
      type: String,
      default: 'Mid-market enterprises and growing tech teams',
    },
    fundingRequired: {
      type: Number,
      required: true,
      min: 0,
      default: 500000, // e.g., $500,000
    },
    fundingRaised: {
      type: Number,
      default: 0,
    },
    currentValuation: {
      type: Number,
      default: 3000000, // e.g., $3,000,000
    },
    revenueInfo: {
      arr: { type: Number, default: 0 },
      growthRate: { type: String, default: '15% MoM' },
      payingCustomers: { type: Number, default: 0 },
    },
    pitchDeckUrl: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Startup || mongoose.model('Startup', StartupSchema);

