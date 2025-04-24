package org.crm.student.application_management_service.service;

import org.crm.student.application_management_service.model.Candidate;
import org.crm.student.application_management_service.model.Document;
import org.crm.student.application_management_service.repository.CandidateRepository;
import org.crm.student.application_management_service.repository.DocumentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DocumentServiceTest {

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private MultipartFile file;

    @InjectMocks
    private DocumentService documentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testUploadDocument() throws IOException {
        Integer candidateId = 1;
        String documentType = "ID";
        String originalFilename = "testfile.txt";
        Path uploadPath = Paths.get("uploads/");
        Path filePath = uploadPath.resolve(originalFilename);

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);

        Document document = new Document();
        document.setCandidate(candidate);
        document.setDocumentType(documentType);
        document.setFilePath(filePath.toString());
        document.setUploadDate(LocalDate.now());
        document.setExpiryDate(LocalDate.now().plusYears(1));
        document.setVersion(1);

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(file.getOriginalFilename()).thenReturn(originalFilename);
        doNothing().when(file).transferTo(filePath);
        when(documentRepository.save(any(Document.class))).thenReturn(document);

        Document result = documentService.uploadDocument(candidateId, file, documentType);

        assertNotNull(result);
        assertEquals(candidate, result.getCandidate());
        assertEquals(documentType, result.getDocumentType());
        assertEquals(filePath.toString(), result.getFilePath());
        assertEquals(LocalDate.now(), result.getUploadDate());
        assertEquals(LocalDate.now().plusYears(1), result.getExpiryDate());
        assertEquals(1, result.getVersion());

        verify(candidateRepository, times(1)).findById(candidateId);
        verify(file, times(1)).transferTo(filePath);
        verify(documentRepository, times(1)).save(any(Document.class));
    }
}
