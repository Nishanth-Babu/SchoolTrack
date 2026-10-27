package com.schooltrack.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class MarkBatchEntryRequest {
    @NotNull(message = "Class ID is required")
    private Long classId;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotNull(message = "Exam ID is required")
    private Long examId;

    @NotEmpty(message = "At least one mark entry is required")
    @Valid
    private List<MarkItemDto> marks;

    public MarkBatchEntryRequest() {}

    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    public Long getExamId() { return examId; }
    public void setExamId(Long examId) { this.examId = examId; }
    public List<MarkItemDto> getMarks() { return marks; }
    public void setMarks(List<MarkItemDto> marks) { this.marks = marks; }
}
