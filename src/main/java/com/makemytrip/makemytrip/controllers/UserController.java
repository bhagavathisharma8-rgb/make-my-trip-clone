package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*") // CORS bypass allowed for local client developments
public class UserController {

    @Autowired
    private UserServices userServices;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password) {
        Users user = userServices.login(email, password);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.badRequest().body("Invalid login credentials.");
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Users user) {
        try {
            Users savedUser = userServices.signup(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Signup action failed: " + e.getMessage());
        }
    }

    // 🔍 FETCH SYSTEM PROFILE DETAILED DATA RECORD BY EXPLICIT EMAIL ROUTING
    @GetMapping("/{email}")
    public ResponseEntity<Users> getUserByEmail(@PathVariable String email) {
        Users user = userServices.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    // 📝 EXECUTE PROFILE FIELD EDITS VIA DIRECT DOCUMENT ID STRINGS
    @PutMapping("/edit/{id}")
    public ResponseEntity<?> editprofile(@PathVariable String id, @RequestBody Users updatedUser) {
        Users user = userServices.editprofile(id, updatedUser);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
}