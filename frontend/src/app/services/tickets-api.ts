
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

  // Obtener todos los tickets
  obtenerTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  // Crear un nuevo ticket
  crearTicket(datos: NuevoTicket): Observable<{
    mensaje: string;
    ticket: Ticket;
  }> {
    return this.http.post<{
      mensaje: string;
      ticket: Ticket;
    }>(this.apiUrl, datos);
  }

}
