import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { updateMeetingStatus, getMeetings, createNotification } from '@/lib/dataService';

export async function PATCH(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { status, rejectionReason, cancellationReason } = body;

    if (!['Accepted', 'Rejected', 'Cancelled', 'Completed'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid meeting status' }, { status: 400 });
    }

    const allMeetings = await getMeetings();
    const targetMeeting = allMeetings.find((m) => m._id.toString() === id.toString());

    if (!targetMeeting) {
      return NextResponse.json({ success: false, message: 'Meeting not found' }, { status: 404 });
    }

    // Role verification
    const isInvestor = targetMeeting.investorUserId?.toString() === user.id.toString();
    const isFounder = targetMeeting.founderUserId?.toString() === user.id.toString();
    const isAdmin = user.role === 'admin';

    if (!isInvestor && !isFounder && !isAdmin) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const updated = await updateMeetingStatus(id, status, {
      rejectionReason: rejectionReason || '',
      cancellationReason: cancellationReason || '',
    });

    // Notify counterpart
    const notifyTargetUserId = isInvestor ? targetMeeting.founderUserId : targetMeeting.investorUserId;
    const notifType =
      status === 'Accepted'
        ? 'meeting_accepted'
        : status === 'Rejected'
        ? 'meeting_rejected'
        : 'meeting_reminder';

    await createNotification({
      userId: notifyTargetUserId,
      title: `Meeting ${status}`,
      message: `Your pitch meeting for ${targetMeeting.date} at ${targetMeeting.startTime} has been marked as ${status}.`,
      type: notifType,
      link: '/meetings',
    });

    return NextResponse.json({
      success: true,
      message: `Meeting successfully ${status.toLowerCase()}`,
      meeting: updated,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

