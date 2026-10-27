package com.schooltrack.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "parents")
public class ParentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    private String occupation;

    @Column(name = "emergency_contact", length = 25)
    private String emergencyContact;

    @Column(name = "relationship_type", length = 30)
    private String relationshipType; // FATHER, MOTHER, GUARDIAN

    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
    private List<StudentProfile> students = new ArrayList<>();

    public ParentProfile() {}

    public ParentProfile(User user, String occupation, String emergencyContact, String relationshipType) {
        this.user = user;
        this.occupation = occupation;
        this.emergencyContact = emergencyContact;
        this.relationshipType = relationshipType;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    public String getRelationshipType() { return relationshipType; }
    public void setRelationshipType(String relationshipType) { this.relationshipType = relationshipType; }
    public List<StudentProfile> getStudents() { return students; }
    public void setStudents(List<StudentProfile> students) { this.students = students; }
}
