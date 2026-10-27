package com.schooltrack.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "timetable_slots",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"class_id", "day_of_week", "period_number"})
       })
public class TimetableSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "day_of_week", nullable = false, length = 20)
    private String dayOfWeek; // MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY

    @Column(name = "period_number", nullable = false)
    private Integer periodNumber; // 1 to 8

    @Column(name = "start_time", nullable = false, length = 15)
    private String startTime; // e.g. "08:30 AM"

    @Column(name = "end_time", nullable = false, length = 15)
    private String endTime; // e.g. "09:15 AM"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "class_id", nullable = false)
    private SchoolClass schoolClass;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "teacher_id")
    private SubjectTeacherProfile teacher;

    @Column(name = "room_number", length = 30)
    private String roomNumber;

    public TimetableSlot() {}

    public TimetableSlot(String dayOfWeek, Integer periodNumber, String startTime, String endTime,
                         SchoolClass schoolClass, Subject subject, SubjectTeacherProfile teacher, String roomNumber) {
        this.dayOfWeek = dayOfWeek;
        this.periodNumber = periodNumber;
        this.startTime = startTime;
        this.endTime = endTime;
        this.schoolClass = schoolClass;
        this.subject = subject;
        this.teacher = teacher;
        this.roomNumber = roomNumber;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public Integer getPeriodNumber() { return periodNumber; }
    public void setPeriodNumber(Integer periodNumber) { this.periodNumber = periodNumber; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public SchoolClass getSchoolClass() { return schoolClass; }
    public void setSchoolClass(SchoolClass schoolClass) { this.schoolClass = schoolClass; }

    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }

    public SubjectTeacherProfile getTeacher() { return teacher; }
    public void setTeacher(SubjectTeacherProfile teacher) { this.teacher = teacher; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
}
