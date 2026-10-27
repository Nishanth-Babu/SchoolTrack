package com.schooltrack.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "leave_types")
public class LeaveType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String name; // Medical Leave, Casual Leave, Family Event, Sports/Competitions

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "max_days")
    private Integer maxDays;

    public LeaveType() {}

    public LeaveType(String name, String description, Integer maxDays) {
        this.name = name;
        this.description = description;
        this.maxDays = maxDays;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getMaxDays() { return maxDays; }
    public void setMaxDays(Integer maxDays) { this.maxDays = maxDays; }
}
