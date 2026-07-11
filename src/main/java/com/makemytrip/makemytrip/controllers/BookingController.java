package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Users.Booking;
import com.makemytrip.makemytrip.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "*") // Allows your Next.js application to connect securely
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // ✈️ ENDPOINT: PROCESS FLIGHT CHECKOUT RESERVATION
    @PostMapping("/flight")
    public ResponseEntity<?> bookFlight(@RequestBody Map<String, Object> payload) {
        try {
            String userId = (String) payload.get("userId");
            String flightId = (String) payload.get("flightId");
            int seats = Integer.parseInt(payload.get("seats").toString());
            double price = Double.parseDouble(payload.get("price").toString());

            Booking booking = bookingService.bookFlight(userId, flightId, seats, price);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Flight booking failed: " + e.getMessage());
        }
    }

    // 🏨 ENDPOINT: PROCESS HOTEL CHECKOUT RESERVATION
    @PostMapping("/hotel")
    public ResponseEntity<?> bookHotel(@RequestBody Map<String, Object> payload) {
        try {
            String userId = (String) payload.get("userId");
            String hotelId = (String) payload.get("hotelId");
            int rooms = Integer.parseInt(payload.get("rooms").toString());
            double price = Double.parseDouble(payload.get("price").toString());

            Booking booking = bookingService.bookHotel(userId, hotelId, rooms, price);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Hotel booking failed: " + e.getMessage());
        }
    }

    // ❌ TASK 1 ENDPOINT: CANCEL RESERVATION AND CALCULATE AUTOMATIC REFUND
    @PostMapping("/cancel")
    public ResponseEntity<?> cancelBooking(@RequestBody Map<String, Object> payload) {
        try {
            String userId = (String) payload.get("userId");
            String bookingId = (String) payload.get("bookingId");
            String reason = (String) payload.get("reason");

            Booking cancelledBooking = bookingService.cancelBooking(userId, bookingId, reason);
            return ResponseEntity.ok(cancelledBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Cancellation failed: " + e.getMessage());
        }
    }
}