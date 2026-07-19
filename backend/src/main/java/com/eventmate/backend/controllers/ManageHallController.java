package com.eventmate.backend.controllers;

import com.eventmate.backend.models.ManageHall;
import com.eventmate.backend.repositories.ManageHallRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/managehalls")
@CrossOrigin(origins = {"http://localhost:5173", "https://eventmate-pi.vercel.app"}) // Allow React frontend
public class ManageHallController {

    @Autowired
    private ManageHallRepository manageHallRepository;

    // GET all halls
    @GetMapping
    public List<ManageHall> getAllHalls() {
        return manageHallRepository.findAll();
    }

    // POST add a new hall
    @PostMapping
    public ManageHall addHall(@RequestBody ManageHall hall) {
        return manageHallRepository.save(hall);
    }
}
