import { NextResponse } from "next/server";
import { createDayTripBooking } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      tripSlug,
      tripTitle,
      tripDate,
      guests,
      basePriceMAD,
      addons,
      addonsPriceMAD,
      totalMAD,
      totalEUR,
      guestName,
      guestEmail,
      guestPhone,
      pickupLocation,
      notes,
      paypalTransactionId,
    } = body;

    // Create booking in Supabase
    const booking = await createDayTripBooking({
      trip_slug: tripSlug,
      trip_title: tripTitle,
      trip_date: tripDate,
      guests: guests,
      base_price_mad: basePriceMAD,
      addons: addons, // comma-separated addon names
      addons_price_mad: addonsPriceMAD,
      total_mad: totalMAD,
      total_eur: totalEUR,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      pickup_location: pickupLocation,
      notes: notes,
      paypal_transaction_id: paypalTransactionId,
      status: "confirmed",
    });

    if (!booking) {
      throw new Error("Failed to create booking");
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.booking_id,
      message: "Booking confirmed",
    });
  } catch (error: any) {
    console.error("Day trip booking error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
