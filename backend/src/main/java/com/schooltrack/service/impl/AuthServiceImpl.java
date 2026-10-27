package com.schooltrack.service.impl;

import com.schooltrack.dto.*;
import com.schooltrack.entity.*;
import com.schooltrack.exception.BadRequestException;
import com.schooltrack.exception.ResourceNotFoundException;
import com.schooltrack.repository.*;
import com.schooltrack.security.JwtTokenProvider;
import com.schooltrack.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final StudentProfileRepository studentProfileRepository;
    private final ClassTeacherProfileRepository classTeacherProfileRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final CoordinatorProfileRepository coordinatorProfileRepository;
    private final SubjectTeacherProfileRepository subjectTeacherProfileRepository;
    private final ParentProfileRepository parentProfileRepository;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserRepository userRepository,
                           RoleRepository roleRepository,
                           JwtTokenProvider tokenProvider,
                           PasswordEncoder passwordEncoder,
                           StudentProfileRepository studentProfileRepository,
                           ClassTeacherProfileRepository classTeacherProfileRepository,
                           SchoolClassRepository schoolClassRepository,
                           CoordinatorProfileRepository coordinatorProfileRepository,
                           SubjectTeacherProfileRepository subjectTeacherProfileRepository,
                           ParentProfileRepository parentProfileRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.studentProfileRepository = studentProfileRepository;
        this.classTeacherProfileRepository = classTeacherProfileRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.coordinatorProfileRepository = coordinatorProfileRepository;
        this.subjectTeacherProfileRepository = subjectTeacherProfileRepository;
        this.parentProfileRepository = parentProfileRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest loginRequest) {
        String identifier = loginRequest.getUsernameOrEmail().trim();

        // Multi-identifier lookup (username, email, teacherId, rollNumber, phone)
        User user = userRepository.findByIdentifier(identifier)
                .orElseThrow(() -> new BadRequestException("Invalid credentials. Please verify your Teacher ID, Roll Number, Email, or Phone."));

        if (user.getStatus() != null && user.getStatus() != AccountStatus.ACTIVE) {
            throw new DisabledException("Account is " + user.getStatus().name().toLowerCase() + ". Please contact school administration.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return buildAuthResponse(user, jwt);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setTeacherId(user.getTeacherId());
        dto.setRollNumber(user.getRollNumber());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhone(user.getPhone());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setStatus(user.getStatus() != null ? user.getStatus().name() : "ACTIVE");
        dto.setActive(user.isActive());
        dto.setRoles(user.getRoles().stream().map(r -> r.getName().name().replace("ROLE_", "")).collect(Collectors.toList()));
        return dto;
    }

    private AuthResponse buildAuthResponse(User user, String jwt) {
        List<String> roleNames = user.getRoles().stream()
                .map(r -> r.getName().name().replace("ROLE_", ""))
                .collect(Collectors.toList());

        String primaryRole = roleNames.isEmpty() ? "STUDENT" : roleNames.get(0);
        Long profileId = null;
        Long classId = null;
        String className = null;

        if (primaryRole.equals("STUDENT")) {
            var opt = studentProfileRepository.findByUserId(user.getId());
            if (opt.isPresent()) {
                profileId = opt.get().getId();
                if (opt.get().getCurrentClass() != null) {
                    classId = opt.get().getCurrentClass().getId();
                    className = opt.get().getCurrentClass().getName();
                }
            }
        } else if (primaryRole.equals("CLASS_TEACHER")) {
            var opt = classTeacherProfileRepository.findByUserId(user.getId());
            if (opt.isPresent()) {
                profileId = opt.get().getId();
                var classOpt = schoolClassRepository.findByClassTeacherId(opt.get().getId());
                if (classOpt.isPresent()) {
                    classId = classOpt.get().getId();
                    className = classOpt.get().getName();
                }
            }
        } else if (primaryRole.equals("COORDINATOR")) {
            var opt = coordinatorProfileRepository.findByUserId(user.getId());
            if (opt.isPresent()) profileId = opt.get().getId();
        } else if (primaryRole.equals("SUBJECT_TEACHER")) {
            var opt = subjectTeacherProfileRepository.findByUserId(user.getId());
            if (opt.isPresent()) profileId = opt.get().getId();
        } else if (primaryRole.equals("PARENT")) {
            var opt = parentProfileRepository.findByUserId(user.getId());
            if (opt.isPresent()) profileId = opt.get().getId();
        }

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getTeacherId(),
                user.getRollNumber(),
                user.getFullName(),
                roleNames,
                primaryRole,
                profileId,
                classId,
                className
        );
    }

    private String[] splitName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return new String[]{"User", "SchoolTrack"};
        }
        String[] parts = fullName.trim().split("\\s+", 2);
        if (parts.length == 1) {
            return new String[]{parts[0], "Student"};
        }
        return parts;
    }

    private String generateUniqueUsername(String base) {
        String username = base;
        int counter = 1;
        while (userRepository.existsByUsername(username)) {
            username = base + counter;
            counter++;
        }
        return username;
    }
}
