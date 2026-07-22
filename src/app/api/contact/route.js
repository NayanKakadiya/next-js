import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone, service, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // If you want to forward this form data to another API, do it here.
    // Example:
    // await fetch('https://your-backend.example.com/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, phone, service, message }),
    // });

    return NextResponse.json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact form submit error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error while submitting the form.' },
      { status: 500 }
    );
  }
}
