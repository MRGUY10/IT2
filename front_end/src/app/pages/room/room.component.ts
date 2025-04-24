import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import {MatTabsModule} from '@angular/material/tabs';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../../services/user/user.service';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SuccessComponent } from '../../modals/success/success.component';
import {NgForOf, NgIf} from "@angular/common";
import {TaskService} from "../../services/task/task.service";
import {TooltipItem} from "chart.js";
import * as XLSX from 'xlsx';
// import {AddTaskDialogComponent} from "../add-task-dialog/add-task-dialog.component";
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import { CandidateServiceService } from '../../services/candidate/candidate-service.service';
import {AccommodationService} from "../../services/AccommodationService/accommodation-service.service";
import {MatButton} from "@angular/material/button";



@Component({
  selector: 'app-candidates',
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
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent implements OnInit {
  @ViewChild('confirmDeleteDialog') confirmDeleteDialog!: TemplateRef<any>;
  openForm: boolean = false;
  rooms: any[] = [];
  filteredRooms: any[] = [];
  filterTerm: string = ''; // Filter term
  validMessage!: string | null;
  loading: boolean = false;
  createRoomForm!: FormGroup;
  user: any;
  errorMessage!: string;
  users: any[] = []; // To store users
  candidate: any[] = [];
  selectedUserId: string = ''; // To store the selected user ID
  typeToDelete: any;
  dialogRef!: MatDialogRef<any>;
  roomToDelete: any;
  editingRoom: any = null; // Holds the task being edited
  openEditForm = false; // Flag to show/hide the edit form moda
  isEditing = false;
  task: any = {}; // This holds the current task being edited


  constructor(
    private accommodationService: AccommodationService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private userService: UserService,
    private CandidateServiceService: CandidateServiceService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private http: HttpClient
  ) {
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
    this.createRoomForm = this.fb.group({
      type: ['', [Validators.required]],
      cost: ['', Validators.required],
      capacity: ['', Validators.required],
      available: [true, Validators.required],


    });

    this.loadrooms(); }

  loadrooms(): void {
    this.accommodationService.getAllRooms().subscribe(
      (data) => {
        console.log('Fetched rooms:', data); // Add this line to check the data
        this.rooms = data;
        this.filteredRooms = data;
      },
      (error) => {
        console.error('Error loading rooms:', error);
      }
    );
  }

  exportTable(format: 'csv' | 'xlsx'): void {
    // Map the filteredTasks to match the table structure
    const exportData = this.filteredRooms.map((room) => ({
      'Room type': room.type, // Example default if name is missing
      Cost: room.cost,
      Deadline: room.available,
    }));

    // Create worksheet from the mapped data
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');

    // Write the file based on the selected format
    if (format === 'csv') {
      XLSX.writeFile(workbook, 'tasks.csv');
    } else if (format === 'xlsx') {
      XLSX.writeFile(workbook, 'tasks.xlsx');
    }
  }
  // Filter tasks based on the search term
  filterRoom(): void {
    console.log('Filtering rooms with term:', this.filterTerm); // Log the filter term
    const term = this.filterTerm.toLowerCase();
    this.filteredRooms = this.rooms.filter((room) =>
      Object.values(room).some((value) => value?.toString().toLowerCase().includes(term))
    );
    console.log('Filtered rooms:', this.filteredRooms); // Log the filtered rooms
  }


  // addTask(): void {
  //   const dialogRef = this.dialog.open(AddTaskDialogComponent, {
  //     width: '400px'
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       // Handle the new task data here (e.g., add to the task list)
  //       console.log('Task added:', result);
  //       this.tasks.push(result); // Add the new task to the tasks list
  //     }
  //   });
  // }

  closeForm(){
    this.openForm = false;
  }
  openModal(){
    this.openForm = true;
  }
  // Open the edit form with the task data
  editRoom(room: any): void {
    this.editingRoom = room; // Set the task to be edited
    this.openEditForm = true; // Open the edit form modal

    // Fetch task details if necessary (e.g., using an API call)
    this.accommodationService.getRoomById(room.id).subscribe((roomData) => {
      // Set form data to pre-populate fields with task details
      this.createRoomForm.setValue({
        type: roomData.type || '',
        cost: roomData.cost || '',
        capacity: roomData.capacity || '',

      });
    });
  }

  // Close the edit form
  closeEditForm(): void {
    this.openEditForm = false; // Close the modal
    this.createRoomForm.reset(); // Reset the form
    this.roomToDelete = null; // Clear the task being edited
  }

  // Handle the form submission
  updateRoom(): void {
    if (this.createRoomForm.valid) {
      const updatedRoom = this.createRoomForm.value;

      // Call a service method to update the task
      this.loadrooms(); // Reload the tasks from the server
      this.loading = false; // Reset loading state
      this.accommodationService.updateRoom(this.editingRoom.id, updatedRoom).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Room Updated',
            detail: 'The Room was updated successfully!',
          });
          this.closeEditForm(); // Close the edit form
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: 'There was an error updating the task.',
          });
          this.loading = false;
        },
      });
    }
  }
  newRoom(): void {
    if (this.createRoomForm.valid) {
      const roomData = this.createRoomForm.value;

      const payload = {
        type: roomData.type,
        cost: roomData.cost,
        capacity : roomData.capacity,
      };

      this.accommodationService.addRoom(payload).subscribe(
        (response) => {
          console.log('Room created successfully:', response);
          this.closeForm(); // Reset and close the form
          this.loadrooms(); // Refresh the task list
        },
        (error) => {
          console.error('Error creating Room:', error);
        }
      );
    }
  }


  deleteRoom(id: number) {
    this.loading = true; // Indicate loading state
    this.accommodationService.deleteRoom(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Room deleted successfully',
        });
        this.loadrooms(); // Reload the tasks from the server
        this.loading = false; // Reset loading state
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete Room',
        });
        this.loading = false; // Reset loading state
      },
    });
  }

  confirmDelete(event: Event, roomId: number) {
    event.stopPropagation(); // Prevent default event propagation
    this.roomToDelete = roomId; // Set the task ID to delete
    this.dialogRef = this.dialog.open(this.confirmDeleteDialog); // Open the confirmation dialog
  }

  ondelnoClick(): void {
    this.dialogRef.close(); // Close the dialog on "No"
  }

  onyesdelClick(): void {
    this.dialogRef.close(); // Close the dialog on "Yes"
    this.deleteRoom(this.roomToDelete); // Call deleteTask with the selected task ID
  }

}

