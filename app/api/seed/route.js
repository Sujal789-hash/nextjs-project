import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { initialMockData } from '@/lib/mockData';
import User from '@/models/User';
import Startup from '@/models/Startup';
import Investor from '@/models/Investor';
import PitchDeck from '@/models/PitchDeck';
import Meeting from '@/models/Meeting';
import Review from '@/models/Review';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import Notification from '@/models/Notification';
import Favorite from '@/models/Favorite';
import Verification from '@/models/Verification';
import { getStore } from '@/lib/dataService';

export async function POST() {
  try {
    const conn = await connectDB();
    const isMongo = !!(conn && conn.connection && conn.connection.readyState === 1);

    if (isMongo) {
      console.log('Seeding MongoDB collections...');
      // Clear collections
      await Promise.all([
        User.deleteMany({}),
        Startup.deleteMany({}),
        Investor.deleteMany({}),
        PitchDeck.deleteMany({}),
        Meeting.deleteMany({}),
        Review.deleteMany({}),
        Conversation.deleteMany({}),
        Message.deleteMany({}),
        Notification.deleteMany({}),
        Favorite.deleteMany({}),
        Verification.deleteMany({}),
      ]);

      // Insert seed
      await User.insertMany(initialMockData.users);
      await Startup.insertMany(initialMockData.startups);
      await Investor.insertMany(initialMockData.investors);
      await PitchDeck.insertMany(initialMockData.pitchDecks);
      await Meeting.insertMany(initialMockData.meetings);
      await Review.insertMany(initialMockData.reviews);
      await Conversation.insertMany(initialMockData.conversations);
      await Message.insertMany(initialMockData.messages);
      await Notification.insertMany(initialMockData.notifications);
      await Favorite.insertMany(initialMockData.favorites);
      await Verification.insertMany(initialMockData.verifications);

      return NextResponse.json({
        success: true,
        message: 'MongoDB database successfully seeded with Emerald Luxe demo data.',
      });
    } else {
      // Reset local store
      global.__pitchconnect_store__ = JSON.parse(JSON.stringify(initialMockData));
      return NextResponse.json({
        success: true,
        message: 'In-memory data store reset to default seed records.',
      });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

