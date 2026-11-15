import mongoose from 'mongoose';

const PitchDeckSchema = new mongoose.Schema(
  {
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      default: 'PitchDeck - Series Seed.pdf',
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number, // in bytes
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    downloadsCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.models.PitchDeck || mongoose.model('PitchDeck', PitchDeckSchema);

