package com.example.demo.Entities;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Getter
@Setter
@Table(name = "Hotel")
public class HotelEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(nullable=false)
    private String name;

    @Column
    private String city;

    @Column(columnDefinition ="TEXT[]")
    private String[] photos;

    @Column(columnDefinition ="TEXT[]")
    private String[] aminities;

    @Column(nullable=false)
    private Boolean active;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Embedded
    private HotelContactInfo contactInfo;

    @OneToMany(mappedBy = "hotel", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<RoomEntity>  rooms;

    @ManyToOne(optional = false)
    private UserEntity owner;
}