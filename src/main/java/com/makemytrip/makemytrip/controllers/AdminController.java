package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.*;
import com.makemytrip.makemytrip.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    @Autowired private FlightRepository flightRepository;
    @Autowired private HotelRepository hotelRepository;

    @GetMapping("/flights") public List<Flight> getFlights() { return flightRepository.findAll(); }
    @PostMapping("/flights") public Flight addFlight(@RequestBody Flight f) { return flightRepository.save(f); }
    @PutMapping("/flights/{id}") public ResponseEntity<Flight> updateFlight(@PathVariable String id, @RequestBody Flight fD) {
        return flightRepository.findById(id).map(f -> {
            f.setName(fD.getName()); f.setFrom(fD.getFrom()); f.setTo(fD.getTo());
            f.setPrice(fD.getPrice()); f.setAvailableSeats(fD.getAvailableSeats());
            return ResponseEntity.ok(flightRepository.save(f));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/hotels") public List<Hotel> getHotels() { return hotelRepository.findAll(); }
    @PostMapping("/hotels") public Hotel addHotel(@RequestBody Hotel h) { return hotelRepository.save(h); }
    @PutMapping("/hotels/{id}") public ResponseEntity<Hotel> updateHotel(@PathVariable String id, @RequestBody Hotel hD) {
        return hotelRepository.findById(id).map(h -> {
            h.setName(hD.getName()); h.setLocation(hD.getLocation());
            h.setPricePerNight(hD.getPricePerNight()); h.setAvailableRooms(hD.getAvailableRooms());
            return ResponseEntity.ok(hotelRepository.save(h));
        }).orElse(ResponseEntity.notFound().build());
    }
}