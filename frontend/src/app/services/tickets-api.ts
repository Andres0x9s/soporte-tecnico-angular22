
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Ticket, NuevoTicket } from '../models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketsApi {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/tickets';

  // GET: Obtener todos los tickets
  obtenerTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  // GET: Obtener un ticket por ID
  obtenerTicket(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(
      `${this.apiUrl}/${id}`
    );
  }

  // POST: Crear ticket
  crearTicket(datos: NuevoTicket): Observable<{
    mensaje: string;
    ticket: Ticket;
  }> {
    return this.http.post<{
      mensaje: string;
      ticket: Ticket;
    }>(this.apiUrl, datos);
  }

  // PUT: Actualizar ticket
  actualizarTicket(
    id: number,
    datos: NuevoTicket
  ): Observable<{
    mensaje: string;
    ticket: Ticket;
  }> {
    return this.http.put<{
      mensaje: string;
      ticket: Ticket;
    }>(`${this.apiUrl}/${id}`, datos);
  }

  // DELETE: Eliminar ticket
  eliminarTicket(id: number): Observable<{
    mensaje: string;
  }> {
    return this.http.delete<{
      mensaje: string;
    }>(`${this.apiUrl}/${id}`);
  }

}
