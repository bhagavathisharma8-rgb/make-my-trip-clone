package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.Users.Booking;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.UserRepository;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    // ✈️ EXECUTE FLIGHT INVENTORY DECREASE & LOG REGISTRATION
    public Booking bookFlight(String userId, String flightId, int seats, double price) {
        Optional<Users> userOptional = userRepository.findById(userId);
        Optional<Flight> flightOptional = flightRepository.findById(flightId);

        if (userOptional.isPresent() && flightOptional.isPresent()) {
            Users user = userOptional.get();
            Flight flight = flightOptional.get();

            if (flight.getAvailableSeats() >= seats) {
                flight.setAvailableSeats(flight.getAvailableSeats() - seats);
                flightRepository.save(flight);

                Booking booking = new Booking();
                booking.setType("Flight");
                booking.setBookingId(flightId);
                booking.setDate(LocalDateTime.now().toString());
                booking.setQuantity(seats);
                booking.setTotalPrice(price);

                if (user.getBookings() == null) {
                    user.setBookings(new ArrayList<>());
                }
                user.getBookings().add(booking);
                userRepository.save(user);

                return booking;
            } else {
                throw new RuntimeException("Not enough seats available");
            }
        }
        throw new RuntimeException("User or flight not found");
    }

    // 🏨 EXECUTE HOTEL ROOM INVENTORY DECREASE & LOG REGISTRATION
    public Booking bookHotel(String userId, String hotelId, int rooms, double price) {
        Optional<Users> userOptional = userRepository.findById(userId);
        Optional<Hotel> hotelOptional = hotelRepository.findById(hotelId);

        if (userOptional.isPresent() && hotelOptional.isPresent()) {
            Users user = userOptional.get();
            Hotel hotel = hotelOptional.get();

            if (hotel.getAvailableRooms() >= rooms) {
                hotel.setAvailableRooms(hotel.getAvailableRooms() - rooms);
                hotelRepository.save(hotel);

                Booking booking = new Booking();
                booking.setType("Hotel");
                booking.setBookingId(hotelId);
                booking.setDate(LocalDateTime.now().toString());
                booking.setQuantity(rooms);
                booking.setTotalPrice(price);

                if (user.getBookings() == null) {
                    user.setBookings(new ArrayList<>());
                }
                user.getBookings().add(booking);
                userRepository.save(user);

                return booking;
            } else {
                throw new RuntimeException("Not enough rooms available");
            }
        }
        throw new RuntimeException("User or hotel not found");
    }

    // ❌ TASK 1 ENGINE: PROCESS AUTOMATIC CANCELLATION & CALCULATE TIMELINE REFUNDS
    public Booking cancelBooking(String userId, String bookingId, String reason) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User profile not found."));

        if (user.getBookings() == null) {
            throw new RuntimeException("No active reservations found for this account.");
        }

        Booking matchBooking = null;
        for (Booking b : user.getBookings()) {
            if (b.getBookingId().equals(bookingId) && !b.isCancelled()) {
                matchBooking = b;
                break;
            }
        }

        if (matchBooking == null) {
            throw new RuntimeException("Active booking profile matching ID not found or already cancelled.");
        }

        // 1. Mark cancellation metadata fields
        matchBooking.setCancelled(true);
        matchBooking.setCancellationReason(reason);
        LocalDateTime now = LocalDateTime.now();
        matchBooking.setCancelledAt(now);
        matchBooking.setRefundStatus("PENDING");
        matchBooking.setExpectedTimeline("3-5 Business Days");

        // 2. Policy logic check: check if canceled within 24 hours of transaction booking time
        try {
            LocalDateTime bookingTime = LocalDateTime.parse(matchBooking.getDate());
            long hoursElapsed = ChronoUnit.HOURS.between(bookingTime, now);

            if (hoursElapsed <= 24) {
                matchBooking.setRefundAmount(matchBooking.getTotalPrice() * 0.50);
            } else {
                matchBooking.setRefundAmount(matchBooking.getTotalPrice());
            }
        } catch (Exception e) {
            matchBooking.setRefundAmount(matchBooking.getTotalPrice() * 0.50);
        }

        // Create an effectively final variable so the lambdas below can access it safely
        final Booking finalMatch = matchBooking;

        // 3. Automated inventory return restock rule
        if ("Flight".equalsIgnoreCase(finalMatch.getType())) {
            flightRepository.findById(finalMatch.getBookingId()).ifPresent(f -> {
                f.setAvailableSeats(f.getAvailableSeats() + finalMatch.getQuantity());
                flightRepository.save(f);
            });
        } else if ("Hotel".equalsIgnoreCase(finalMatch.getType())) {
            hotelRepository.findById(finalMatch.getBookingId()).ifPresent(h -> {
                h.setAvailableRooms(h.getAvailableRooms() + finalMatch.getQuantity());
                hotelRepository.save(h);
            });
        }

        // Save back state updates directly inside the Mongo collection document layer
        userRepository.save(user);
        return finalMatch;
    }
}