
import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Ticket } from '../../models/ticket';
import { TicketsApi } from '../../services/tickets-api';

@Component({
  selector: 'app-lista-tickets',
  imports: [RouterLink],
  templateUrl: './lista-tickets.html',
  styleUrl: './lista-tickets.css'
})
export class ListaTickets implements OnInit {

  private ticketsApi = inject(TicketsApi);

  tickets = signal<Ticket[]>([]);
  cargando = signal(true);
  error = signal('');
  eliminandoId = signal<number | null>(null);

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
        console.error(err);

        this.error.set(
          'No se pudieron cargar los tickets.'
        );

        this.cargando.set(false);
      }

    });
  }

  eliminar(id: number): void {

    // Solicitar confirmación antes de eliminar
    const confirmar = window.confirm(
      '¿Estás seguro de eliminar este ticket?'
    );

    if (!confirmar) {
      return;
    }

    if (this.eliminandoId() !== null) {
      return;
    }

    this.error.set('');
    this.eliminandoId.set(id);

    this.ticketsApi.eliminarTicket(id).subscribe({

      next: () => {

        // Quitar el ticket de la tabla
        this.tickets.update(lista =>
          lista.filter(ticket => ticket.id !== id)
        );

        this.eliminandoId.set(null);
      },

      error: (err: HttpErrorResponse) => {
        console.error(err);

        this.error.set(
          'No se pudo eliminar el ticket.'
        );

        this.eliminandoId.set(null);
      }

    });
  }

}
