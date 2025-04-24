// src/app/components/transport/transport.component.ts
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SuccessComponent } from '../../modals/success/success.component';
import { NgForOf, NgIf } from "@angular/common";
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import * as XLSX from 'xlsx';

import { TransportService, Transport } from '../../services/transport/transport.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-transport',
  standalone: true,
  imports: [
    MatCheckboxModule,
    DropdownModule,
    MatTabsModule,
    MatIconModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ToastModule,
    ButtonModule,
    SuccessComponent,
    NgForOf,
    FormsModule,
    NgIf,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogTitle,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss']
})
export class TransportComponent implements OnInit {
  @ViewChild('confirmDeleteDialog') confirmDeleteDialog!: TemplateRef<any>;
  
  openForm: boolean = false;
  transports: Transport[] = [];
  filteredTransports: Transport[] = [];
  filterTerm: string = '';
  validMessage!: string | null;
  loading: boolean = false;
  createTransportForm!: FormGroup;
  transportToDelete: number | null = null;
  dialogRef!: MatDialogRef<any>;
  editingTransport: Transport | null = null;
  openEditForm: boolean = false;

  constructor(
    private transportService: TransportService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    // Register custom SVG icons
    this.matIconRegistry.addSvgIcon(
      'view',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/eye-open-svgrepo-com.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'delete',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/trash-2-svgrepo-com.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'edit',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/edit-2-svgrepo-com.svg')
    );
  }

  ngOnInit(): void {
    this.createTransportForm = this.fb.group({
      arrivalDeparture: ['', [Validators.required]],
      cost: ['', [Validators.required, Validators.min(0)]],
    });

    this.loadTransports();
  }

  // Load all transports
  loadTransports(): void {
    this.loading = true;
    this.transportService.getAllTransports().subscribe(
      (data) => {
        console.log('Fetched transports:', data);
        this.transports = data;
        this.filteredTransports = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading transports:', error);
        this.loading = false;
      }
    );
  }

  // Export transports as CSV or Excel
  exportTable(format: 'csv' | 'xlsx'): void {
    const exportData = this.filteredTransports.map((transport) => ({
      'Arrival/Departure': transport.arrivalDeparture,
      'Cost': transport.cost,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transports');

    if (format === 'csv') {
      XLSX.writeFile(workbook, 'transports.csv');
    } else if (format === 'xlsx') {
      XLSX.writeFile(workbook, 'transports.xlsx');
    }
  }

  // Filter transports based on the search term
  filterTransport(): void {
    const term = this.filterTerm.toLowerCase();
    this.filteredTransports = this.transports.filter((transport) =>
      Object.values(transport).some((value) => value?.toString().toLowerCase().includes(term))
    );
  }

  // Open the add transport form modal
  openModal(): void {
    this.openForm = true;
    this.createTransportForm.reset({ arrivalDeparture: '', cost: 0 });
  }

  // Close the add transport form modal
  closeForm(): void {
    this.openForm = false;
    this.validMessage = null;
  }

  // Handle form submission to create a new transport
  newTransport(): void {
    if (this.createTransportForm.valid) {
      const transportData: Transport = this.createTransportForm.value;

      this.transportService.createTransport(transportData).subscribe(
        (response) => {
          console.log('Transport created successfully:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Transport Created',
            detail: 'The transport was created successfully!',
          });
          this.closeForm();
          this.loadTransports();
        },
        (error) => {
          console.error('Error creating transport:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Creation Failed',
            detail: 'There was an error creating the transport.',
          });
        }
      );
    }
  }

  // Open the edit transport form modal
  editTransport(transport: Transport): void {
    this.editingTransport = transport;
    this.openEditForm = true;

    this.createTransportForm.setValue({
      arrivalDeparture: transport.arrivalDeparture,
      cost: transport.cost,
    });
  }

  // Close the edit transport form modal
  closeEditForm(): void {
    this.openEditForm = false;
    this.editingTransport = null;
    this.createTransportForm.reset();
  }

  // Handle form submission to update a transport
  updateTransport(): void {
    if (this.createTransportForm.valid && this.editingTransport) {
      const updatedTransport: Transport = {
        ...this.editingTransport,
        ...this.createTransportForm.value,
      };

      this.transportService.updateTransport(this.editingTransport.id!, updatedTransport).subscribe({
        next: (data) => {
          console.log('Transport updated successfully:', data);
          this.messageService.add({
            severity: 'success',
            summary: 'Transport Updated',
            detail: 'The transport was updated successfully!',
          });
          this.closeEditForm();
          this.loadTransports();
        },
        error: (error) => {
          console.error('Error updating transport:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: 'There was an error updating the transport.',
          });
        },
      });
    }
  }

  // Confirm deletion dialog
  confirmDelete(event: Event, transportId: number): void {
    event.stopPropagation();
    this.transportToDelete = transportId;
    this.dialogRef = this.dialog.open(this.confirmDeleteDialog);
  }

  // Handle deletion confirmation
  ondelnoClick(): void {
    this.dialogRef.close();
  }

  onyesdelClick(): void {
    if (this.transportToDelete !== null) {
      this.deleteTransport(this.transportToDelete);
    }
    this.dialogRef.close();
  }

  // Delete a transport
  deleteTransport(id: number): void {
    this.loading = true;
    this.transportService.deleteTransport(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Transport deleted successfully',
        });
        this.loadTransports();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error deleting transport:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete transport',
        });
        this.loading = false;
      }
    });
  }
}
