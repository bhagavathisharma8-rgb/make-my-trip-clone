package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "users")
public class Users {
    @Id
    private String _id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role;
    private String phoneNumber;
    private List<Booking> bookings;


    // Existing Getters and Setters
    public String get_id() { return _id; }
    public void set_id(String _id) { this._id = _id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }

    // =========================================================
    // 🛠️ INNER STATIC CLASS MATCHING THE TRAINING EXACTLY
    // =========================================================
    public static class Booking {
        private String type;
        private String bookingId;
        private String date; // Format could be string from client
        private int quantity;
        private double totalPrice;
        private boolean isCancelled = false;
        private String cancellationReason;
        private java.time.LocalDateTime cancelledAt;
        private double refundAmount = 0.0;
        private String refundStatus = "NONE";
        private String expectedTimeline;
        // --- ADD THESE NEW PASSENGER METADATA FIELDS HERE ---
        private String passengerName;
        private int passengerAge;
        private String seatPreference;
        private String travelDate;
        private String seatNumber;

        // --- IF YOUR CLASS DOES NOT USE @Data OR @Getter/@Setter LOMBOK ANNOTATIONS, PASTE THESE GETTERS/SETTERS TOO: ---
        public String getPassengerName() { return passengerName; }
        public void setPassengerName(String passengerName) { this.passengerName = passengerName; }

        public int getPassengerAge() { return passengerAge; }
        public void setPassengerAge(int passengerAge) { this.passengerAge = passengerAge; }

        public String getSeatPreference() { return seatPreference; }
        public void setSeatPreference(String seatPreference) { this.seatPreference = seatPreference; }

        public String getTravelDate() { return travelDate; }
        public void setTravelDate(String travelDate) { this.travelDate = travelDate; }

        public String getSeatNumber() { return seatNumber; }
        public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

        // Inner Getters and Setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getBookingId() { return bookingId; }
        public void setBookingId(String bookingId) { this.bookingId = bookingId; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }

        public double getTotalPrice() { return totalPrice; }
        public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

        public boolean isCancelled() { return isCancelled; }
        public void setCancelled(boolean cancelled) { isCancelled = cancelled; }

        public String getCancellationReason() { return cancellationReason; }
        public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }

        public java.time.LocalDateTime getCancelledAt() { return cancelledAt; }
        public void setCancelledAt(java.time.LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; }

        public double getRefundAmount() { return refundAmount; }
        public void setRefundAmount(double refundAmount) { this.refundAmount = refundAmount; }

        public String getRefundStatus() { return refundStatus; }
        public void setRefundStatus(String refundStatus) { this.refundStatus = refundStatus; }

        public String getExpectedTimeline() { return expectedTimeline; }
        public void setExpectedTimeline(String expectedTimeline) { this.expectedTimeline = expectedTimeline; }
    }
}