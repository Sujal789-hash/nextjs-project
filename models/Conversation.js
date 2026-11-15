import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup',
    },
    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investor',
    },
    lastMessage: {
      text: { type: String, default: '' },
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now },
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

ConversationSchema.index({ participants: 1 });

export default mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);

