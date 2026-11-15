import mongoose from 'mongoose';

const InvestorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      default: 'Managing Partner',
    },
    biography: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    location: {
      type: String,
      required: true,
      default: 'New York, NY',
    },
    investmentInterests: {
      type: [String],
      default: ['AI & Automation', 'B2B Software', 'FinTech'],
    },
    preferredIndustries: {
      type: [String],
      default: ['FinTech', 'AI & Machine Learning', 'SaaS & Enterprise', 'HealthTech'],
    },
    checkSizeMin: {
      type: Number,
      required: true,
      default: 100000, // $100,000
    },
    checkSizeMax: {
      type: Number,
      required: true,
      default: 2000000, // $2,000,000
    },
    preferredStages: {
      type: [String],
      default: ['Pre-Seed', 'Seed', 'Series A'],
    },
    portfolioCompanies: [
      {
        name: { type: String, required: true },
        website: { type: String, default: '' },
        year: { type: Number, default: 2024 },
      },
    ],
    availableMeetingSlots: [
      {
        dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], default: 'Wednesday' },
        startTime: { type: String, default: '10:00' },
        endTime: { type: String, default: '17:00' },
      },
    ],
    contactPreferences: {
      emailMeetingAlerts: { type: Boolean, default: true },
      acceptDirectPitches: { type: Boolean, default: true },
      preferredMeetingLength: { type: Number, default: 30 }, // in minutes
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Investor || mongoose.model('Investor', InvestorSchema);

