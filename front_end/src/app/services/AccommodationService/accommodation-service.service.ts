import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import {map, Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AccommodationService {
  private baseUrl = 'https://isjpreenrollnow.me:8084/api/rooms'; // Update with the correct Spring Boot API base URL

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  // Handle errors from HTTP requests
  private handleError(error: any) {
    console.error('API call error:', error);
    return throwError(() => new Error('Something went wrong! Please try again later.'));
  }

  // Get all rooms
  getAllRooms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create a new room
  addRoom(room: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.baseUrl}`, room, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing room
  updateRoom(roomId: number, roomData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${roomId}`, roomData).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a room
  deleteRoom(roomId: number): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.baseUrl}/${roomId}`, { observe: 'response' }).pipe(
      catchError(this.handleError)
    );
  }

  // Mark a room as reserved (by a student)
  reserveRoom(roomId: number, studentId: number): Observable<any> {
    const payload = { reservedBy: studentId };
    return this.http.patch<any>(`${this.baseUrl}/rooms/${roomId}/reserve`, payload).pipe(
      catchError(this.handleError)
    );
  }

  // Get room by ID
  getRoomById(roomId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${roomId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get the total number of rooms in the system (for capacity checking)
  getTotalRooms(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/rooms/total`).pipe(
      catchError(this.handleError)
    );
  }

  // Reserve a room and check if capacity exceeds
  reserveRoomWithCapacityCheck(roomId: number, studentId: number): Observable<any> {
    return this.getRoomById(roomId).pipe(
      catchError(this.handleError),
      // Check room capacity before proceeding
      map((room: any) => {
        if (room.available && room.capacity > 0) {
          return this.reserveRoom(roomId, studentId);
        } else {
          throw new Error('Room is unavailable or at full capacity.');
        }
      })
    );
  }
}
