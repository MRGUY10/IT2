// src/app/transport.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Define the Transport interface
export interface Transport {
  id?: number;
  arrivalDeparture: string;
  cost: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransportService {

  // Base URL of the Spring Boot API
  private baseUrl = 'https://isjpreenrollnow.me:8084/api/transports';

  constructor(private http: HttpClient) { }

  /**
   * Create a new Transport
   * @param transport Transport object to create
   * @returns Observable of the created Transport
   */
  createTransport(transport: Transport): Observable<Transport> {
    return this.http.post<Transport>(this.baseUrl, transport)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get all Transports
   * @returns Observable of Transport array
   */
  getAllTransports(): Observable<Transport[]> {
    return this.http.get<Transport[]>(this.baseUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get a Transport by ID
   * @param id Transport ID
   * @returns Observable of the Transport
   */
  getTransportById(id: number): Observable<Transport> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Transport>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update a Transport
   * @param id Transport ID
   * @param transport Updated Transport object
   * @returns Observable of the updated Transport
   */
  updateTransport(id: number, transport: Transport): Observable<Transport> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<Transport>(url, transport)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Delete a Transport
   * @param id Transport ID
   * @returns Observable of void
   */
  deleteTransport(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors
   * @param error HttpErrorResponse
   * @returns Observable throwing an error message
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
