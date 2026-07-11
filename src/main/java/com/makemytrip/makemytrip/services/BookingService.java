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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Optional;
import java.util.Random;

@Service
public class BookingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    private Users resolveUser(String userKey) {
        if (userKey == null || userKey.trim().isEmpty()) return null;
        Optional<Users> userOpt = userRepository.findById(userKey);
        if (userOpt.isPresent()) return userOpt.get();
        Users userByEmail = userRepository.findByEmail(userKey.trim());
        if (userByEmail != null) return userByEmail;
        return null;
    }

    // ✈️ ENHANCED FLIGHT INVENTORY DECREASE WITH CO-TRAVELER PROFILE MAPPING
    public Booking bookFlight(String userId, String flightId, int seats, double price,
                              String passengerName, int passengerAge, String seatPreference, String travelDate) {
        Users user = resolveUser(userId);
        Optional<Flight> flightOptional = flightRepository.findById(flightId);

        if (user != null && flightOptional.isPresent()) {
            Flight flight = flightOptional.get();

            if (flight.getAvailableSeats() >= seats) {
                flight.setAvailableSeats(flight.getAvailableSeats() - seats);
                flightRepository.save(flight);

                // Auto-generate assigned seats numbers layout map definitions
                Random random = new Random();
                String seatNumber = (random.nextInt(30) + 1) +
                        ("Window".equalsIgnoreCase(seatPreference) ? "A" : "Aisle".equalsIgnoreCase(seatPreference) ? "C" : "B");

                Booking booking = new Booking();
                booking.setType("Flight");
                booking.setBookingId(flightId);
                booking.setDate(LocalDateTime.now().toString());
                booking.setQuantity(seats);
                booking.setTotalPrice(price);
                booking.setCancelled(false);

                // Save passenger metadata attributes permanently inside document arrays
                booking.setPassengerName(passengerName);
                booking.setPassengerAge(passengerAge);
                booking.setSeatPreference(seatPreference);
                booking.setTravelDate(travelDate);
                booking.setSeatNumber(seatNumber);

                if (user.getBookings() == null) {
                    user.setBookings(new ArrayList<>());
                }
                user.getBookings().add(booking);
                userRepository.save(user);

                return booking;
            } else {
                throw new RuntimeException("Not enough seats available on this flight.");
            }
        }
        throw new RuntimeException("User profile or targeted flight data entry not found.");
    }

    public Booking bookHotel(String userId, String hotelId, int rooms, double price) {
        Users user = resolveUser(userId);
        Optional<Hotel> hotelOptional = hotelRepository.findById(hotelId);

        if (user != null && hotelOptional.isPresent()) {
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
                booking.setCancelled(false);

                if (user.getBookings() == null) {
                    user.setBookings(new ArrayList<>());
                }
                user.getBookings().add(booking);
                userRepository.save(user);

                return booking;
            } else {
                throw new RuntimeException("Not enough hotel rooms available.");
            }
        }
        throw new RuntimeException("User profile or targeted hotel data entry not found.");
    }

    // ❌ DYNAMIC 70% REFUND POLICY CANCELLATION CALCULATOR
    public Booking cancelBooking(String userId, String bookingId, String reason) {
        Users user = resolveUser(userId);
        if (user == null) {
            throw new RuntimeException("User profile session not found for key identifier token.");
        }

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

        matchBooking.setCancelled(true);
        matchBooking.setCancellationReason(reason);
        LocalDateTime now = LocalDateTime.now();
        matchBooking.setCancelledAt(now);
        matchBooking.setRefundStatus("COMPLETED");
        matchBooking.setExpectedTimeline("Instant Payout Succeeded");

        // policy enforcement rule: 70% payout if done 24 hours before flight target travel departure date
        try {
            LocalDate targetTravelDay = LocalDate.parse(matchBooking.getTravelDate());
            long daysToDeparture = ChronoUnit.DAYS.between(LocalDate.now(), targetTravelDay);

            if (daysToDeparture >= 1) {
                matchBooking.setRefundAmount(matchBooking.getTotalPrice() * 0.70);
            } else {
                matchBooking.setRefundAmount(matchBooking.getTotalPrice() * 0.00); // No refund if processed last-minute
            }
        } catch (Exception e) {
            matchBooking.setRefundAmount(matchBooking.getTotalPrice() * 0.70); // Secure fallbacks
        }

        final Booking finalMatch = matchBooking;
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

        userRepository.save(user);
        return finalMatch;
    }
}