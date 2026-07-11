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
                // Deduct the inventory seats counter cleanly
                flight.setAvailableSeats(flight.getAvailableSeats() - seats);
                flightRepository.save(flight);

                // Instantiating a new sub-document map instance block matching model definitions
                Booking booking = new Booking();
                booking.setType("Flight");
                booking.setBookingId(flightId);
                booking.setDate(LocalDate.now().toString());
                booking.setQuantity(seats);
                booking.setTotalPrice(price);

                // Security check to avoid NullPointerExceptions on uninitialized lists
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
                // Deduct room availability from the hotel profile
                hotel.setAvailableRooms(hotel.getAvailableRooms() - rooms);
                hotelRepository.save(hotel);

                Booking booking = new Booking();
                booking.setType("Hotel");
                booking.setBookingId(hotelId);
                booking.setDate(LocalDate.now().toString());
                booking.setQuantity(rooms);
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
}