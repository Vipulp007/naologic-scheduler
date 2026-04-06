package com.example.demo.Entities;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;

@Getter
@Setter
@Table(name = "Hotel")
public class HotelEntity {

    @Id
    @GeneratedValue(strategy = GeneratedValue.identity)
    private Long Id;
}