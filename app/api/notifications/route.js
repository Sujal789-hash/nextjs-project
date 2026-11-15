import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getNotifications, markNotificationRead } from '@/lib/dataService';

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await getNotifications(user.id);
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, markAll } = body;

    const notifs = await getNotifications(user.id);

    if (markAll) {
      for (const n of notifs) {
        await markNotificationRead(n._id);
      }
    } else if (notificationId) {
      await markNotificationRead(notificationId);
    }

    return NextResponse.json({ success: true, message: 'Notifications updated' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

