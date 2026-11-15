import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import {
  getMeetings,
  createMeeting,
  getStartupByUserId,
  getInvestorById,
  createNotification,
} from '@/lib/dataService';

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let filter = {};
    if (user.role === 'startup') {
      filter.founderUserId = user.id;
    } else if (user.role === 'investor') {
      filter.investorUserId = user.id;
    }

    const meetings = await getMeetings(filter);

    return NextResponse.json({ success: true, count: meetings.length, meetings });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'startup') {
      return NextResponse.json(
        { success: false, message: 'Only startup founders can request pitch meetings' },
        { status: 403 }
      );
    }

    const startup = await getStartupByUserId(user.id);
    if (!startup) {
      return NextResponse.json(
        { success: false, message: 'Please complete your startup profile before booking meetings' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { investorId, date, startTime, endTime, agenda, description } = body;

    if (!investorId || !date || !startTime || !agenda) {
      return NextResponse.json(
        { success: false, message: 'Missing required meeting details (investorId, date, startTime, agenda)' },
        { status: 400 }
      );
    }

    const investor = await getInvestorById(investorId);
    if (!investor) {
      return NextResponse.json({ success: false, message: 'Selected investor not found' }, { status: 404 });
    }

    // Auto-generate virtual meeting room link
    const meetingRoomId = `pc-${Math.random().toString(36).substring(2, 9)}`;
    const meetingLink = `https://meet.google.com/${meetingRoomId}`;

    const newMeeting = await createMeeting({
      startupId: startup._id,
      founderUserId: user.id,
      investorId: investor._id,
      investorUserId: investor.userId,
      date,
      startTime,
      endTime: endTime || `${parseInt(startTime.split(':')[0]) + 1}:00`,
      duration: 30,
      agenda,
      description: description || '',
      status: 'Pending',
      meetingLink,
    });

    // Notify Investor
    await createNotification({
      userId: investor.userId,
      title: 'New Pitch Request',
      message: `${startup.startupName} requested a pitch meeting on ${date} at ${startTime}.`,
      type: 'meeting_request',
      link: '/meetings',
    });

    return NextResponse.json({
      success: true,
      message: 'Pitch meeting request submitted successfully',
      meeting: newMeeting,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error scheduling meeting' },
      { status: 400 }
    );
  }
}

