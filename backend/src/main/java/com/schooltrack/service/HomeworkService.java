package com.schooltrack.service;

import com.schooltrack.dto.HomeworkCompletionRequest;
import com.schooltrack.dto.HomeworkCreateRequest;
import com.schooltrack.dto.HomeworkResponseDto;
import java.util.List;

public interface HomeworkService {
    HomeworkResponseDto createHomework(HomeworkCreateRequest request, String teacherUsername);
    List<HomeworkResponseDto> getHomeworkForClass(Long classId, Long studentId);
    List<HomeworkResponseDto> getHomeworkForTeacher(Long teacherId);
    List<HomeworkResponseDto> getStudentDigitalDiary(Long studentId);
    List<HomeworkResponseDto> getStudentDigitalDiary(Long studentId, String currentUsername);
    HomeworkResponseDto updateHomeworkCompletion(Long homeworkId, Long studentId, HomeworkCompletionRequest request);
    HomeworkResponseDto updateHomeworkCompletion(Long homeworkId, Long studentId, HomeworkCompletionRequest request, String currentUsername);
    void deleteHomework(Long homeworkId, String username);
}
