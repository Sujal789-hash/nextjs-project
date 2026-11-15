import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getPitchDecks, addPitchDeck, getStartupByUserId, createNotification } from '@/lib/dataService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startupId = searchParams.get('startupId');

    if (!startupId) {
      const user = getUserFromRequest(request);
      if (user) {
        const startup = await getStartupByUserId(user.id);
        if (startup) {
          const decks = await getPitchDecks(startup._id);
          return NextResponse.json({ success: true, decks });
        }
      }
      return NextResponse.json({ success: true, decks: [] });
    }

    const decks = await getPitchDecks(startupId);
    return NextResponse.json({ success: true, decks });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'startup') {
      return NextResponse.json({ success: false, message: 'Only founders can upload pitch decks' }, { status: 401 });
    }

    const startup = await getStartupByUserId(user.id);
    if (!startup) {
      return NextResponse.json(
        { success: false, message: 'Please create your startup profile before uploading a pitch deck' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, fileName, fileSize, fileUrl, notes } = body;

    if (!fileName || !fileUrl) {
      return NextResponse.json({ success: false, message: 'Invalid file upload data' }, { status: 400 });
    }

    // Check PDF extension
    if (!fileName.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ success: false, message: 'Only PDF documents are permitted for pitch decks' }, { status: 400 });
    }

    // Size limit 25MB
    if (fileSize && fileSize > 25 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'Pitch deck file size exceeds 25MB limit' }, { status: 400 });
    }

    const existingDecks = await getPitchDecks(startup._id);
    const version = existingDecks.length + 1;

    const deck = await addPitchDeck({
      startupId: startup._id,
      title: title || `${startup.startupName} - Pitch Deck (v${version})`,
      fileName,
      fileSize: fileSize || 3500000,
      fileUrl,
      version,
      notes: notes || '',
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Pitch deck uploaded and verified successfully',
      deck,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

