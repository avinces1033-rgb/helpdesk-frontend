import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  // URL del backend desplegado en Render
  private apiUrl = 'https://helpdesk-backend-wro5.onrender.com/tickets';

  private actualizarListaSubject = new Subject<void>();
  actualizarLista$ = this.actualizarListaSubject.asObservable();

  private ticketSeleccionadoSubject = new BehaviorSubject<any>(null);
  ticketSeleccionado$ = this.ticketSeleccionadoSubject.asObservable();

  constructor(private http: HttpClient) {}

  obtenerTickets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearTicket(ticket: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ticket);
  }

  actualizarTicket(id: number, ticket: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, ticket);
  }

  eliminarTicket(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  notificarActualizacion(): void {
    this.actualizarListaSubject.next();
  }

  seleccionarTicket(ticket: any): void {
    this.ticketSeleccionadoSubject.next(ticket);
  }
}