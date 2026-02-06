import { NextResponse } from "next/server";
import { appendSheetData } from "@/lib/sheets";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      experienceTitle,
      tripDate,
      guestName,
      guestEmail,
      guestPhone,
      pickupLocation,
      notes,
      subtotalEUR,
      handlingFeeEUR,
      totalEUR,
      transactionId,
    } = body;

    // Generate booking reference
    const timestamp = Date.now();
    const bookingRef = `ON-${timestamp}`;
    const createdAt = new Date().toISOString();

    // Prepare row for Google Sheets
    const row = [
      bookingRef,
      createdAt,
      experienceTitle,
      tripDate,
      guestName,
      guestEmail,
      guestPhone || "",
      pickupLocation,
      notes || "",
      subtotalEUR,
      handlingFeeEUR,
      totalEUR,
      transactionId,
      "confirmed",
    ];

    // Append to Overnight_Bookings sheet
    await appendSheetData("Overnight_Bookings", [row]);

    return NextResponse.json({
      success: true,
      bookingRef,
      message: "Booking confirmed",
    });
  } catch (error: any) {
    console.error("Overnight booking error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
