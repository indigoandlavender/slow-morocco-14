"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface PricingEUR {
  transfers: { label: string; amount: number };
  room: { label: string; amount: number };
  camel: { label: string; amount: number };
  coordination: { label: string; amount: number };
}

interface OvernightBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  experienceTitle: string;
  pricingEUR: PricingEUR;
  totalEUR: number;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

// ============================================================================
// CALENDAR COMPONENT
// ============================================================================

function Calendar({
  selectedDate,
  onSelectDate,
  minDaysFromNow = 3,
}: {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  minDaysFromNow?: number;
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + minDaysFromNow);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const formatDateStr = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const isBeforeMinDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    return date < minDate;
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    if (prev >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prev);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const canGoPrev = new Date(year, month - 1, 1) >= new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-8 h-8 flex items-center justify-center text-foreground/40 hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="10,2 5,8 10,14" />
          </svg>
        </button>
        <span className="text-sm tracking-wide text-foreground/70">
          {monthNames[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="6,2 11,8 6,14" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center text-[10px] tracking-wider text-foreground/30 uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startingDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = formatDateStr(year, month, day);
          const isDisabled = isBeforeMinDate(year, month, day);
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={day}
              onClick={() => !isDisabled && onSelectDate(dateStr)}
              disabled={isDisabled}
              className={`
                aspect-square flex items-center justify-center text-sm relative transition-all
                ${isDisabled ? "cursor-not-allowed text-foreground/20" : "cursor-pointer hover:bg-foreground/5"}
                ${isSelected ? "bg-foreground text-white" : ""}
                ${!isDisabled && !isSelected ? "text-foreground/70" : ""}
              `}
            >
              <span className="relative z-10">{day}</span>
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-foreground/40 mt-4">
        Reserve well in advance — Agafay camps book quickly.
      </p>
    </div>
  );
}

// ============================================================================
// PAYPAL COMPONENT
// ============================================================================

function PayPalButton({
  amount,
  description,
  onSuccess,
  onError,
}: {
  amount: string;
  description: string;
  onSuccess: (transactionId: string) => void;
  onError: (err: any) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const buttonsInstance = useRef<any>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const renderButton = async () => {
      if (!window.paypal) {
        const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
        if (!existingScript) {
          const script = document.createElement("script");
          script.src = `https://www.paypal.com/sdk/js?client-id=AWVf28iPmlVmaEyibiwkOtdXAl5UPqL9i8ee9yStaG6qb7hCwNRB2G95SYwbcikLnBox6CGyO-boyAvu&currency=EUR`;
          script.async = true;
          document.body.appendChild(script);
          await new Promise((resolve) => {
            script.onload = resolve;
          });
        } else {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      if (!isMounted.current || !containerRef.current || !window.paypal) return;

      if (buttonsInstance.current) {
        try {
          await buttonsInstance.current.close();
        } catch (e) {}
      }

      containerRef.current.innerHTML = "";

      try {
        buttonsInstance.current = window.paypal.Buttons({
          style: {
            layout: "vertical",
            color: "black",
            shape: "rect",
            label: "pay",
            height: 50,
          },
          createOrder: (_data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: description.substring(0, 127),
                  amount: {
                    value: amount,
                    currency_code: "EUR",
                  },
                },
              ],
            });
          },
          onApprove: async (_data: any, actions: any) => {
            try {
              const order = await actions.order.capture();
              const transactionId = order.purchase_units?.[0]?.payments?.captures?.[0]?.id || order.id;
              onSuccess(transactionId);
            } catch (err) {
              onError(err);
            }
          },
          onError: (err: any) => {
            onError(err);
          },
        });

        if (isMounted.current && containerRef.current) {
          await buttonsInstance.current.render(containerRef.current);
        }
      } catch (err) {
        console.error("PayPal render error:", err);
      }

      if (isMounted.current) {
        setLoading(false);
      }
    };

    renderButton();

    return () => {
      isMounted.current = false;
      if (buttonsInstance.current) {
        try {
          buttonsInstance.current.close();
        } catch (e) {}
      }
    };
  }, [amount, description, onSuccess, onError]);

  return (
    <div>
      {loading && (
        <div className="h-[50px] flex items-center justify-center">
          <div className="w-5 h-5 border border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      )}
      <div ref={containerRef} className={loading ? "hidden" : ""} />
    </div>
  );
}

// ============================================================================
// MAIN MODAL COMPONENT
// ============================================================================

export default function OvernightBookingModal({
  isOpen,
  onClose,
  experienceTitle,
  pricingEUR,
  totalEUR,
}: OvernightBookingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);

  // Form state
  const [tripDate, setTripDate] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [notes, setNotes] = useState("");

  // Booking state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setTripDate("");
        setGuestName("");
        setGuestEmail("");
        setGuestPhone("");
        setPickupLocation("");
        setNotes("");
        setIsSubmitting(false);
        setBookingComplete(false);
        setBookingRef("");
      }, 300);
    }
  }, [isOpen]);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Calculate totals with 2.5% handling fee
  const HANDLING_FEE_PERCENT = 2.5;
  
  const subtotalEUR = totalEUR;
  const handlingFeeEUR = Math.round(subtotalEUR * HANDLING_FEE_PERCENT) / 100;
  const grandTotalEUR = subtotalEUR + handlingFeeEUR;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const canProceedStep1 = tripDate !== "";
  const canProceedStep2 = guestName.trim() !== "" && guestEmail.trim() !== "" && pickupLocation.trim() !== "";

  const handlePaymentSuccess = useCallback(
    async (transactionId: string) => {
      setIsSubmitting(true);

      try {
        const response = await fetch("/api/overnight-booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            experienceTitle,
            tripDate,
            guestName,
            guestEmail,
            guestPhone,
            pickupLocation,
            notes,
            subtotalEUR,
            handlingFeeEUR,
            totalEUR: grandTotalEUR,
            transactionId,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setBookingRef(data.bookingRef || transactionId.slice(-8).toUpperCase());
          setBookingComplete(true);
        } else {
          console.error("Booking save failed:", data.error);
          setBookingRef(transactionId.slice(-8).toUpperCase());
          setBookingComplete(true);
        }
      } catch (err) {
        console.error("Booking save error:", err);
        setBookingRef(transactionId.slice(-8).toUpperCase());
        setBookingComplete(true);
      }

      setIsSubmitting(false);
    },
    [experienceTitle, tripDate, guestName, guestEmail, guestPhone, pickupLocation, notes, subtotalEUR, handlingFeeEUR, grandTotalEUR]
  );

  const handlePaymentError = useCallback((err: any) => {
    console.error("Payment error:", err);
    alert("Payment failed. Please try again.");
  }, []);

  if (!mounted) return null;
  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-background max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center hover:bg-foreground/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Booking Complete */}
        {bookingComplete ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-foreground/5 flex items-center justify-center">
              <svg className="w-8 h-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl mb-4">Booking Confirmed</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for booking with Slow Morocco. We've sent confirmation details to {guestEmail}.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Reference: <span className="font-mono">{bookingRef}</span>
            </p>
            <button
              onClick={onClose}
              className="inline-block border border-foreground px-8 py-3 text-xs tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Step 1: Date */}
            {step === 1 && (
              <div className="p-10">
                <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-2">
                  Step 1 of 3
                </p>
                <h2 className="font-serif text-2xl mb-8">Select Your Date</h2>

                <Calendar
                  selectedDate={tripDate}
                  onSelectDate={setTripDate}
                  minDaysFromNow={3}
                />

                {tripDate && (
                  <div className="mt-6 p-4 bg-foreground/[0.03]">
                    <p className="text-sm text-muted-foreground">Selected:</p>
                    <p className="font-serif">{formatDate(tripDate)}</p>
                    <p className="text-xs text-muted-foreground mt-1">2:00 PM departure</p>
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!canProceedStep1}
                    className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-60 transition-opacity"
                  >
                    Continue
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="5,2 10,7 5,12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="p-10">
                <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-2">
                  Step 2 of 3
                </p>
                <h2 className="font-serif text-2xl mb-8">Your Details</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/40 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full border-b border-foreground/20 pb-3 focus:outline-none focus:border-foreground bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/40 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full border-b border-foreground/20 pb-3 focus:outline-none focus:border-foreground bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/40 mb-2">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full border-b border-foreground/20 pb-3 focus:outline-none focus:border-foreground bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/40 mb-2">
                      Pickup Location (hotel/riad name) *
                    </label>
                    <input
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full border-b border-foreground/20 pb-3 focus:outline-none focus:border-foreground bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/40 mb-2">
                      Special Requests (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="w-full border-b border-foreground/20 pb-3 focus:outline-none focus:border-foreground bg-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase hover:opacity-60 transition-opacity"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="9,2 4,7 9,12" />
                    </svg>
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2}
                    className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-60 transition-opacity"
                  >
                    Continue
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="5,2 10,7 5,12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="p-10">
                <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-2">
                  Step 3 of 3
                </p>
                <h2 className="font-serif text-2xl mb-8">Payment</h2>

                {/* Summary */}
                <div className="bg-foreground/[0.03] p-6 mb-6">
                  <p className="font-serif text-lg mb-2">{experienceTitle}</p>
                  <p className="text-sm text-foreground/50 mb-4">{formatDate(tripDate)}</p>
                  
                  <div className="space-y-2 pt-4 border-t border-foreground/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/50">Private experience for 2</span>
                      <span>€{subtotalEUR}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/50">Handling fee ({HANDLING_FEE_PERCENT}%)</span>
                      <span>€{handlingFeeEUR.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base pt-3 border-t border-foreground/10 mt-3">
                      <span className="font-medium">Total</span>
                      <span className="font-serif text-xl">€{grandTotalEUR.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* PayPal Button */}
                <PayPalButton
                  amount={grandTotalEUR.toFixed(2)}
                  description={`${experienceTitle} - ${formatDate(tripDate)}`}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />

                {isSubmitting && (
                  <p className="text-center text-sm text-foreground/50 mt-4">
                    Processing...
                  </p>
                )}

                <button
                  onClick={() => setStep(2)}
                  className="mt-6 flex items-center gap-2 text-xs tracking-[0.15em] uppercase hover:opacity-60 transition-opacity"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="9,2 4,7 9,12" />
                  </svg>
                  Back
                </button>

                <p className="text-center mt-6 text-[11px] text-foreground/30">
                  <a href="/contact" className="hover:text-foreground/50 transition-colors">Send us a note</a>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
