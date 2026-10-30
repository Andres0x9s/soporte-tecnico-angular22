
import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import { Ticket } from '../../models/ticket';
import { TicketsApi } from '../../services/tickets-api';

@Component({
  selector: 'app-lista-tickets',
  imports: [],
  templateUrl: './lista-tickets.html',
  styleUrl: './lista-tickets.css'
})
export class ListaTickets implements OnInit {

  private ticketsApi = inject(TicketsApi);

  tickets = signal<Ticket[]>([]);
  cargando = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.cargarTickets();
  }

  cargarTickets(): void {

    this.cargando.set(true);
    this.error.set('');

    this.ticketsApi.obtenerTickets().subscribe({

      next: (datos) => {
        this.tickets.set(datos);
        this.cargando.set(false);
      },

      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar tickets:', err);

        this.error.set(
          'No se pudieron cargar los tickets. Revisa la API.'
        );

        this.cargando.set(false);
      }

    });
  }
}
