import { NextResponse } from "next/server";
import { createOvernightBooking } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      guestName,
      guestEmail,
      property,
      roomType,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      currency,
      notes,
    } = body;

    if (!guestName || !guestEmail || !property || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bookingId = `OVN-${Date.now()}`;

    await createOvernightBooking({
      booking_id: bookingId,
      guest_name: guestName,
      guest_email: guestEmail,
      property,
      room_type: roomType || "",
      check_in: checkIn,
      check_out: checkOut,
      guests: guests || 1,
      total_price: totalPrice || null,
      currency: currency || "EUR",
      notes: notes || "",
    });

    return NextResponse.json({
      success: true,
      bookingId,
      message: "Booking request received. We'll confirm within 24 hours.",
    });
  } catch (error) {
    console.error("Error creating overnight booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
