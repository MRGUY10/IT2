package org.crm.student.application_management_service.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "candidate_details")
@Data
public class Candidate{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String firstName;

    private String lastName;

    private String country;

    private String city;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String phoneNumber;

    private LocalDateTime applicationDate;

    private String applicationSource;

    private String field;

    // Relationships
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "parent_detail_id")
    private Parent parentDetail;



    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "employment_detail_id")
    private EmploymentDetails employmentDetail;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "education_detail_id")
    private EducationDetails educationDetail;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_image_id")
    private ProfilePhoto profilePhoto;




    @Enumerated(EnumType.STRING)
    private Status status;
    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = Status.NEW;
        }
    }
    public void setInstitutionName(String institutionName) {
    }
    public void setGraduationYear(int graduationYear) {
    }

}
