package com.schooltrack.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "teacher_subject_assignments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"teacher_id", "class_id", "subject_id", "academic_year_id"})
})
public class TeacherSubjectAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "teacher_id", nullable = false)
    private SubjectTeacherProfile teacher;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "class_id", nullable = false)
    private SchoolClass schoolClass;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "academic_year_id")
    private AcademicYear academicYear;

    public TeacherSubjectAssignment() {}

    public TeacherSubjectAssignment(SubjectTeacherProfile teacher, SchoolClass schoolClass, Subject subject, AcademicYear academicYear) {
        this.teacher = teacher;
        this.schoolClass = schoolClass;
        this.subject = subject;
        this.academicYear = academicYear;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public SubjectTeacherProfile getTeacher() { return teacher; }
    public void setTeacher(SubjectTeacherProfile teacher) { this.teacher = teacher; }
    public SchoolClass getSchoolClass() { return schoolClass; }
    public void setSchoolClass(SchoolClass schoolClass) { this.schoolClass = schoolClass; }
    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }
    public AcademicYear getAcademicYear() { return academicYear; }
    public void setAcademicYear(AcademicYear academicYear) { this.academicYear = academicYear; }
}
