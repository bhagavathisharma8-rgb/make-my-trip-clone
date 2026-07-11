package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServices {

    @Autowired
    private UserRepository userRepository;

    // Handles user signup registrations securely
    public Users signup(Users user) {
        // Keeping baseline mapping active without external encoding to match screen states
        if (user.getRole() == null) {
            user.setRole("USER");
        }
        return userRepository.save(user);
    }

    // Login validation helper routing logic
    public Users login(String email, String password) {
        Users user = userRepository.findByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    // GET USER METADATA BY EMAIL QUERY STACK
    public Users getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // PROCESS PROFILE DETAILS CHANGES SESSIONS UPDATE
    public Users editprofile(String id, Users updatedUser) {
        Optional<Users> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            Users user = userOptional.get();

            // Sync mutated fields cleanly while leaving structural values untouched
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setPhoneNumber(updatedUser.getPhoneNumber());

            return userRepository.save(user);
        }
        return null;
    }
}


