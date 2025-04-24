import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CandidateServiceService } from '../../services/candidate/candidate-service.service';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    ToastModule,
    CommonModule,
    BreadcrumbModule
  ],
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.scss']
})
export class CandidateFormComponent {
  mainFormGroup: FormGroup;
  breadcrumbItems: MenuItem[] = [
    { label: 'Candidates', routerLink: '/candidates' },
    { label: 'Create', routerLink: '/candidates/new' }
  ];

  constructor(
    private messageService: MessageService,
    private candidateService: CandidateServiceService
  ) {
    this.mainFormGroup = new FormGroup({
      personalInfo: new FormGroup({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        field: new FormControl('', Validators.required),
        phoneNumber: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        applicationDate: new FormControl('', Validators.required),
        applicationSource: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required)
      }),
      education: new FormGroup({
        institutionName: new FormControl('', Validators.required),
        highestEducation: new FormControl('', Validators.required),
        graduationYear: new FormControl('', Validators.required),
        fieldOfStudy: new FormControl('', Validators.required)
      }),
      workExperience: new FormGroup({
        companyName: new FormControl(''),
        responsibilities: new FormControl(''),
      }),
      parentInfo: new FormGroup({
        fullName: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        phoneNumber: new FormControl('', Validators.required),
        relationshipToCandidate: new FormControl('', Validators.required),
      })
    });
  }

  onSubmit(): void {
    if (this.mainFormGroup.invalid) {
      this.markFormGroupTouched(this.mainFormGroup);
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields'
      });
      return;
    }

    const formValue = this.prepareFormData();

    this.candidateService.createCandidateWithoutheader(formValue).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Candidate created successfully'
        });
        this.mainFormGroup.reset();
      },
      error: (error) => {
        console.error('Error creating candidate:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create candidate. Please try again.'
        });
      }
    });
  }

  private prepareFormData(): any {
    const personalInfo = this.mainFormGroup.get('personalInfo')?.value;
    const parentInfo = this.mainFormGroup.get('parentInfo')?.value;
    const education = this.mainFormGroup.get('education')?.value;
    const workExperience = this.mainFormGroup.get('workExperience')?.value;

    return {
      ...personalInfo,
      parentDetail: parentInfo,
      educationDetail: education,
      employmentDetail: workExperience
    };
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
