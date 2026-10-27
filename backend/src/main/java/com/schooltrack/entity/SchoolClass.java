package com.schooltrack.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "classes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"grade", "section", "academic_year_id"})
})
public class SchoolClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String grade; // e.g., "10"

    @Column(nullable = false, length = 10)
    private String section; // e.g., "A"

    @Column(nullable = false, length = 50)
    private String name; // e.g., "Grade 10-A"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "class_teacher_id")
    private ClassTeacherProfile classTeacher;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "coordinator_id")
    private CoordinatorProfile coordinator;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "academic_year_id")
    private AcademicYear academicYear;

    public SchoolClass() {}

    public SchoolClass(String grade, String section, String name, ClassTeacherProfile classTeacher, CoordinatorProfile coordinator, AcademicYear academicYear) {
        this.grade = grade;
        this.section = section;
        this.name = name;
        this.classTeacher = classTeacher;
        this.coordinator = coordinator;
        this.academicYear = academicYear;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public ClassTeacherProfile getClassTeacher() { return classTeacher; }
    public void setClassTeacher(ClassTeacherProfile classTeacher) { this.classTeacher = classTeacher; }
    public CoordinatorProfile getCoordinator() { return coordinator; }
    public void setCoordinator(CoordinatorProfile coordinator) { this.coordinator = coordinator; }
    public AcademicYear getAcademicYear() { return academicYear; }
    public void setAcademicYear(AcademicYear academicYear) { this.academicYear = academicYear; }
}
