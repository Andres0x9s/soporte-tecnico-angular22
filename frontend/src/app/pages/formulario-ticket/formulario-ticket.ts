
import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TicketsApi } from '../../services/tickets-api';

@Component({
  selector: 'app-formulario-ticket',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-ticket.html',
  styleUrl: './formulario-ticket.css'
})
export class FormularioTicket {

  private ticketsApi = inject(TicketsApi);
  private router = inject(Router);

  mensaje = signal('');
  guardando = signal(false);

  formulario = new FormGroup({

    asunto: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(5)
      ]
    }),

    solicitante: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    descripcion: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(10)
      ]
    }),

    categoria: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    prioridad: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    estado: new FormControl('Pendiente', {
      nonNullable: true,
      validators: [Validators.required]
    })

  });

  guardar(): void {

    this.mensaje.set('');
    this.formulario.markAllAsTouched();

    // No enviar datos inválidos
    if (this.formulario.invalid || this.guardando()) {
      return;
    }

    this.guardando.set(true);

    // Obtener los datos del formulario
    const datos = this.formulario.getRawValue();

    // Enviar los datos a Express
    this.ticketsApi.crearTicket(datos).subscribe({

      next: () => {
        this.guardando.set(false);

        // Regresar al listado de tickets
        this.router.navigate(['/tickets']);
      },

      error: (err: HttpErrorResponse) => {
        this.guardando.set(false);

        if (err.status === 0) {
          this.mensaje.set(
            'No se pudo conectar con el servidor.'
          );
        } else {
          this.mensaje.set(
            err.error?.error ??
            'Ocurrió un error al guardar el ticket.'
          );
        }
      }

    });
  }
}
