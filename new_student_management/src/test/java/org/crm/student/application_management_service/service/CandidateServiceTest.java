package org.crm.student.application_management_service.service;

import org.crm.student.application_management_service.model.Candidate;
import org.crm.student.application_management_service.model.Status;
import org.crm.student.application_management_service.repository.CandidateRepository;
import org.crm.student.application_management_service.repository.ProfilePhotoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CandidateServiceTest {

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private ProfilePhotoRepository profilePhotoRepository;

    @InjectMocks
    private CandidateService candidateService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveAll() {
        // Add your test logic here
    }

    @Test
    void testDoesCandidateExist() {
        when(candidateRepository.existsByFirstNameAndLastName("John", "Doe")).thenReturn(true);
        assertTrue(candidateService.doesCandidateExist("John Doe"));
    }

    @Test
    void testGetCandidateById() {
        Candidate candidate = new Candidate();
        candidate.setId(1);
        when(candidateRepository.findById(1)).thenReturn(Optional.of(candidate));
        assertEquals(candidate, candidateService.getCandidateById(1).orElse(null));
    }

    @Test
    void testDeleteCandidate() {
        Candidate candidate = new Candidate();
        candidate.setId(1);
        when(candidateRepository.findById(1)).thenReturn(Optional.of(candidate));
        candidateService.deleteCandidate(1);
        verify(candidateRepository, times(1)).deleteById(1);
    }

    @Test
    void testUpdateCandidate() {
        Candidate candidate = new Candidate();
        candidate.setStatus(Status.STUDENT);
        candidate.setEmail("test@example.com");
        candidate.setFirstName("John");
        candidate.setPhoneNumber("1234567890");

        candidateService.updateCandidate(candidate);

        verify(candidateRepository, times(1)).save(candidate);
        verify(notificationService, times(1)).sendEmailNotification(
                eq("test@example.com"),
                eq("Your Candidate Application has been Updated"),
                eq("John")
        );
        verify(notificationService, times(1)).sendSmsNotification(
                eq("1234567890"),
                eq("Dear John, your application status has been updated to STUDENT.")
        );
    }
}
