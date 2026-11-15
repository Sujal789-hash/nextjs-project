import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import {
  getConversations,
  getMessages,
  createMessage,
  findUserById,
  createNotification,
  getStore,
} from '@/lib/dataService';

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      const messages = await getMessages(conversationId);
      return NextResponse.json({ success: true, messages });
    }

    const conversations = await getConversations(user.id);

    // Hydrate participant details
    const hydrated = await Promise.all(
      conversations.map(async (c) => {
        const otherParticipantId = c.participants.find(
          (p) => p.toString() !== user.id.toString()
        );
        const otherUser = otherParticipantId
          ? await findUserById(otherParticipantId)
          : null;

        return {
          ...c,
          counterpart: otherUser
            ? {
                id: otherUser._id,
                fullName: otherUser.fullName,
                role: otherUser.role,
                avatar: otherUser.avatar,
              }
            : { fullName: 'Venture Partner', role: 'member' },
        };
      })
    );

    return NextResponse.json({ success: true, conversations: hydrated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, recipientId, content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, message: 'Message content cannot be empty' }, { status: 400 });
    }

    let targetConvId = conversationId;

    // If starting a fresh chat without conversationId
    if (!targetConvId && recipientId) {
      const store = getStore();
      const existing = store.conversations.find((c) =>
        c.participants.includes(user.id) && c.participants.includes(recipientId)
      );

      if (existing) {
        targetConvId = existing._id;
      } else {
        const newConv = {
          _id: 'conv_' + Date.now(),
          participants: [user.id, recipientId],
          lastMessage: {
            text: content,
            senderId: user.id,
            createdAt: new Date().toISOString(),
          },
          unreadCounts: {
            [recipientId]: 1,
            [user.id]: 0,
          },
          createdAt: new Date().toISOString(),
        };
        store.conversations.unshift(newConv);
        targetConvId = newConv._id;
      }
    }

    const newMsg = await createMessage({
      conversationId: targetConvId,
      senderId: user.id,
      senderName: user.fullName || 'Member',
      senderRole: user.role,
      content: content.trim(),
      readBy: [user.id],
    });

    if (recipientId) {
      await createNotification({
        userId: recipientId,
        title: 'New Message Received',
        message: `${user.fullName || 'A contact'} sent you a message: "${content.substring(0, 50)}..."`,
        type: 'message',
        link: '/messages',
      });
    }

    return NextResponse.json({
      success: true,
      message: newMsg,
      conversationId: targetConvId,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

