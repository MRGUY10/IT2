package org.crm.student.application_management_service.service;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import jakarta.transaction.Transactional;
import org.crm.student.application_management_service.model.*;
import org.crm.student.application_management_service.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CandidateService {

        @Autowired
        private CandidateRepository candidateRepository;
        @Autowired
        private NotificationService notificationService;

        @Autowired
        private ProfilePhotoRepository profilePhotoRepository;

    public void saveAll(List<Candidate> candidates) {
        candidateRepository.saveAll(candidates);
    }

    private LocalDate parseDate(String date) {
        try {
            return LocalDate.parse(date);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format: " + date, e);
        }
    }

    private LocalDateTime parseDateTime(String dateTime) {
        try {
            return LocalDateTime.parse(dateTime);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid datetime format: " + dateTime, e);
        }
    }
    public boolean doesCandidateExist(String candidateFullName) {
        // Split the full name into first and last name
        String[] nameParts = candidateFullName.split(" ");
        if (nameParts.length != 2) {
            // Handle the case where the full name doesn't contain exactly two parts
            return false;
        }

        String firstName = nameParts[0];
        String lastName = nameParts[1];

        // Use the repository method to check existence
        return candidateRepository.existsByFirstNameAndLastName(firstName, lastName);
    }
        public Optional<Candidate> getCandidateById(Integer id) {
            return candidateRepository.findById(id);
        }



    public void deleteCandidate(Integer id) {
        Optional<Candidate> candidate = candidateRepository.findById(id);
        candidate.ifPresent(c -> {
            // Manually delete the associated ProfilePhoto if it exists
            if (c.getProfilePhoto() != null) {
                profilePhotoRepository.delete(c.getProfilePhoto());
            }
            // Delete the Candidate
            candidateRepository.deleteById(id);
        });
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }


        public void updateCandidate(Candidate candidate) {
            candidateRepository.save(candidate);

            // Check if the candidate's status is STUDENT
            if (candidate.getStatus() == Status.STUDENT) {
                try {
                    notificationService.sendEmailNotification(
                        candidate.getEmail(),
                        "Your Candidate Application has been Updated",
                        candidate.getFirstName()
                    );
                } catch (Exception e) {
                    // Log the email notification error
                    System.err.println("Failed to send email notification: " + e.getMessage());
                }

                try {
                    notificationService.sendSmsNotification(
                        candidate.getPhoneNumber(),
                        "Dear " + candidate.getFirstName() + ", your application status has been updated to STUDENT."
                    );
                } catch (Exception e) {
                    // Log the SMS notification error
                    System.err.println("Failed to send SMS notification: " + e.getMessage());
                }
            }

        }

    private Status parseStatus(String status) {
            try {
                return Status.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                System.err.println("Invalid status: " + status + ". Defaulting to NEW.");
                return Status.NEW; // Default value
            }
        }

        private boolean candidateExists(String firstName, String lastName) {
            return candidateRepository.findByFirstNameAndLastName(firstName, lastName).isPresent();
        }

}


