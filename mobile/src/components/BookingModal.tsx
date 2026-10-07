import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ServiceCategory } from "../data/services";
import { WORKIVO_COLORS, WORKIVO_RADII, WORKIVO_SHADOWS } from "../constants/theme";
import { PrimaryButton } from "./PrimaryButton";
import { useApp } from "../context/AppContext";
import { MobileBooking } from "../lib/supabase";

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  service: ServiceCategory;
  onBookingSuccess?: (booking: MobileBooking) => void;
}

const TIME_SLOTS = [
  "Morning (09:00 AM - 12:00 PM)",
  "Afternoon (12:00 PM - 04:00 PM)",
  "Evening (04:00 PM - 08:00 PM)",
];

const DATES = ["Today", "Tomorrow", "In 2 Days"];

export const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  onClose,
  service,
  onBookingSuccess,
}) => {
  const { createBooking } = useApp();
  const insets = useSafeAreaInsets();

  const [customerName, setCustomerName] = useState("Aarav Patel");
  const [customerPhone, setCustomerPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState("Flat 402, Green Glen Heights, Bellandur, Bengaluru");
  const [notes, setNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<MobileBooking | null>(null);

  const handleConfirm = () => {
    if (!customerName || !customerPhone || !address) {
      alert("Please fill in your name, phone, and address.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const booking = createBooking({
        customerName,
        customerPhone,
        serviceId: service.id,
        serviceName: service.title,
        scheduledDate: selectedDate,
        scheduledTime: selectedSlot,
        address,
        notes,
        priceEstimate: service.priceEstimate,
      });

      setIsSubmitting(false);
      setConfirmedBooking(booking);
      if (onBookingSuccess) {
        onBookingSuccess(booking);
      }
    }, 600);
  };

  const handleClose = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={[
            styles.sheetContainer,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetSubtitle}>Instant Doorstep Booking</Text>
              <Text style={styles.sheetTitle}>Book {service.title}</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={WORKIVO_COLORS.mainText} />
            </TouchableOpacity>
          </View>

          {confirmedBooking ? (
            <View style={styles.successBox}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-sharp" size={36} color="#FFFFFF" />
              </View>
              <Text style={styles.successTitle}>Relief is on the way!</Text>
              <Text style={styles.successSubtitle}>
                Your booking has been confirmed and assigned to a verified pro.
              </Text>

              <View style={styles.bookingRefCard}>
                <View style={styles.refRow}>
                  <Text style={styles.refLabel}>Booking ID</Text>
                  <Text style={styles.refValue}>{confirmedBooking.id}</Text>
                </View>
                <View style={styles.refRow}>
                  <Text style={styles.refLabel}>Scheduled</Text>
                  <Text style={styles.refDetail}>
                    {confirmedBooking.scheduledDate} • {confirmedBooking.scheduledTime.split(" ")[0]}
                  </Text>
                </View>
                <View style={styles.refRow}>
                  <Text style={styles.refLabel}>Assigned Pro</Text>
                  <Text style={styles.refProName}>{confirmedBooking.proAssignedName}</Text>
                </View>
                <View style={styles.refRow}>
                  <Text style={styles.refLabel}>Estimated Price</Text>
                  <Text style={styles.refPrice}>{confirmedBooking.priceEstimate}</Text>
                </View>
              </View>

              <PrimaryButton
                title="View in Live Tracker"
                onPress={handleClose}
                size="md"
                style={{ width: "100%", marginTop: 8 }}
              />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
              {/* Service Info Banner */}
              <View style={styles.serviceBanner}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bannerServiceTitle}>{service.title}</Text>
                  <Text style={styles.bannerEstPrice}>
                    {service.priceEstimate} • {service.duration}
                  </Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={13} color="#F59E0B" />
                  <Text style={styles.ratingText}>{service.rating}</Text>
                </View>
              </View>

              {/* Date Selection */}
              <Text style={styles.fieldLabel}>Select Date</Text>
              <View style={styles.chipsRow}>
                {DATES.map((date) => (
                  <TouchableOpacity
                    key={date}
                    style={[styles.dateChip, selectedDate === date && styles.selectedChip]}
                    onPress={() => setSelectedDate(date)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.dateChipText,
                        selectedDate === date && styles.selectedChipText,
                      ]}
                    >
                      {date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Time Slot Selection */}
              <Text style={styles.fieldLabel}>Preferred Arrival Window</Text>
              <View style={styles.slotsCol}>
                {TIME_SLOTS.map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    style={[styles.slotItem, selectedSlot === slot && styles.selectedSlotItem]}
                    onPress={() => setSelectedSlot(slot)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={selectedSlot === slot ? "radio-button-on" : "radio-button-off"}
                      size={18}
                      color={selectedSlot === slot ? WORKIVO_COLORS.coral : WORKIVO_COLORS.mutedText}
                    />
                    <Text
                      style={[
                        styles.slotText,
                        selectedSlot === slot && styles.selectedSlotText,
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Customer Contact Details */}
              <Text style={styles.fieldLabel}>Your Contact Details</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={WORKIVO_COLORS.mutedText}
                value={customerName}
                onChangeText={setCustomerName}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone (e.g. +91 98765 43210)"
                placeholderTextColor={WORKIVO_COLORS.mutedText}
                keyboardType="phone-pad"
                value={customerPhone}
                onChangeText={setCustomerPhone}
              />

              {/* Doorstep Address */}
              <Text style={styles.fieldLabel}>Doorstep Address</Text>
              <TextInput
                style={[styles.input, { minHeight: 60 }]}
                placeholder="House/Flat number, Street, Landmark, City"
                placeholderTextColor={WORKIVO_COLORS.mutedText}
                multiline
                value={address}
                onChangeText={setAddress}
              />

              {/* Notes */}
              <Text style={styles.fieldLabel}>Special Notes for Pro (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Call 10 mins before reaching, test fan regulator"
                placeholderTextColor={WORKIVO_COLORS.mutedText}
                value={notes}
                onChangeText={setNotes}
              />

              {/* Pricing breakdown */}
              <View style={styles.pricingBox}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceRowLabel}>Inspection &amp; Base Labor</Text>
                  <Text style={styles.priceRowVal}>₹{service.basePrice}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceRowLabel}>Safety Gear &amp; Tool Sanitation</Text>
                  <Text style={styles.priceRowVal}>FREE</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceRowLabel}>Workivo Doorstep Guarantee</Text>
                  <Text style={styles.priceRowVal}>FREE</Text>
                </View>
                <View style={[styles.priceRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Estimated Total</Text>
                  <Text style={styles.totalVal}>₹{service.basePrice}</Text>
                </View>
                <Text style={styles.priceDisclaimer}>
                  * Pay securely via UPI, Card, or Cash only after work is inspected.
                </Text>
              </View>

              <PrimaryButton
                title={`Confirm & Dispatch Pro (₹${service.basePrice})`}
                loading={isSubmitting}
                onPress={handleConfirm}
                size="lg"
                style={{ marginTop: 14, marginBottom: 24 }}
              />
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(18, 30, 28, 0.7)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: WORKIVO_COLORS.warmCream,
    borderTopLeftRadius: WORKIVO_RADII.xl,
    borderTopRightRadius: WORKIVO_RADII.xl,
    maxHeight: "90%",
    paddingTop: 18,
    paddingHorizontal: 20,
    ...WORKIVO_SHADOWS.card3d,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: WORKIVO_COLORS.borderLine,
  },
  sheetSubtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: WORKIVO_COLORS.mutedCoral,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: WORKIVO_COLORS.borderLine,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollBody: {
    paddingBottom: 24,
  },
  serviceBanner: {
    backgroundColor: WORKIVO_COLORS.cardBg,
    padding: 14,
    borderRadius: WORKIVO_RADII.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
  },
  bannerServiceTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  bannerEstPrice: {
    fontSize: 13,
    color: WORKIVO_COLORS.mutedCoral,
    fontWeight: "600",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(245, 158, 11, 0.12)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: WORKIVO_RADII.sm,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B45309",
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: WORKIVO_COLORS.mainText,
    marginTop: 10,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  dateChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: WORKIVO_RADII.md,
    backgroundColor: WORKIVO_COLORS.cardBg,
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
    alignItems: "center",
  },
  selectedChip: {
    backgroundColor: WORKIVO_COLORS.coral,
    borderColor: WORKIVO_COLORS.btn3dShadow,
    borderBottomWidth: 3,
  },
  dateChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: WORKIVO_COLORS.mainText,
  },
  selectedChipText: {
    color: "#2A1210",
    fontWeight: "700",
  },
  slotsCol: {
    gap: 8,
    marginBottom: 8,
  },
  slotItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: WORKIVO_RADII.md,
    backgroundColor: WORKIVO_COLORS.cardBg,
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
  },
  selectedSlotItem: {
    borderColor: WORKIVO_COLORS.coral,
    backgroundColor: "rgba(233, 132, 125, 0.1)",
  },
  slotText: {
    fontSize: 13,
    fontWeight: "600",
    color: WORKIVO_COLORS.mainText,
  },
  selectedSlotText: {
    color: WORKIVO_COLORS.mutedCoral,
    fontWeight: "700",
  },
  input: {
    backgroundColor: WORKIVO_COLORS.cardBg,
    borderRadius: WORKIVO_RADII.md,
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: WORKIVO_COLORS.mainText,
    marginBottom: 10,
  },
  pricingBox: {
    backgroundColor: WORKIVO_COLORS.cardBg,
    padding: 14,
    borderRadius: WORKIVO_RADII.md,
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
    marginTop: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  priceRowLabel: {
    fontSize: 12,
    color: WORKIVO_COLORS.mutedText,
  },
  priceRowVal: {
    fontSize: 12,
    fontWeight: "600",
    color: WORKIVO_COLORS.mainText,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: WORKIVO_COLORS.borderLine,
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  totalVal: {
    fontSize: 16,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  priceDisclaimer: {
    fontSize: 11,
    color: WORKIVO_COLORS.mutedText,
    marginTop: 6,
  },
  successBox: {
    alignItems: "center",
    paddingVertical: 20,
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: WORKIVO_COLORS.softGreen,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
    marginBottom: 6,
  },
  successSubtitle: {
    fontSize: 14,
    color: WORKIVO_COLORS.mainText,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  bookingRefCard: {
    backgroundColor: WORKIVO_COLORS.cardBg,
    borderRadius: WORKIVO_RADII.lg,
    padding: 18,
    width: "100%",
    borderWidth: 2,
    borderColor: WORKIVO_COLORS.borderLine,
    marginBottom: 16,
    gap: 10,
  },
  refRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  refLabel: {
    fontSize: 12,
    color: WORKIVO_COLORS.mutedCoral,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  refValue: {
    fontSize: 14,
    fontWeight: "700",
    backgroundColor: WORKIVO_COLORS.coral,
    color: "#2A1210",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: WORKIVO_RADII.sm,
  },
  refDetail: {
    fontSize: 13,
    color: WORKIVO_COLORS.mainText,
    fontWeight: "600",
  },
  refProName: {
    fontSize: 14,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  refPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: WORKIVO_COLORS.softGreen,
  },
});
