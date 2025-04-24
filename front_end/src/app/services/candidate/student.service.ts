import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'https://isjpreenrollnow.me:8085/api/students';

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/`);
  }

  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  createStudent(student: Student): Observable<Student> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Student>(`${this.apiUrl}/`, student, { headers });
  }

  updateStudent(id: string, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadDocuments(studentId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file, file.name));

    const url = `${this.apiUrl}/${studentId}/documents`;
    return this.http.post<any>(url, formData);
  }

  getDocumentById(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/documents/${id}`, { responseType: 'blob' });
  }

  changeStudentStatus(id: string, status: string): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}/status`, { status });
  }
}

// Define the Student model directly
export interface Student {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  gender: string;
  dateOfBirth: string;
  formerSchool: string;
  graduationDate: string;
  fieldOfStudy: string;
  speciality: string;
  parentName: string;
  parentRelationship: string;
  parentPhoneNumber: string;
}
