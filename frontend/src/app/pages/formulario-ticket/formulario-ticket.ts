
import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  ActivatedRoute
} from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';

import { TicketsApi } from '../../services/tickets-api';

@Component({
  selector: 'app-formulario-ticket',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-ticket.html',
  styleUrl: './formulario-ticket.css'
})
export class FormularioTicket implements OnInit {

  private ticketsApi = inject(TicketsApi);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  idTicket: number | null = null;

  mensaje = signal('');
  guardando = signal(false);
  cargando = signal(false);
  errorCarga = signal(false);

  formulario = new FormGroup({

    asunto: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(150)
      ]
    }),

    solicitante: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(100)
      ]
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

  ngOnInit(): void {

    // Obtener el ID desde la URL
    const idTexto = this.route.snapshot.paramMap.get('id');

    // Si no hay ID, estamos creando un ticket
    if (idTexto === null) {
      return;
    }

    const id = Number(idTexto);

    if (!Number.isSafeInteger(id) || id <= 0) {
      this.errorCarga.set(true);
      this.mensaje.set('El ID del ticket no es válido.');
      return;
    }

    this.idTicket = id;
    this.cargando.set(true);

    // Obtener el ticket desde Express
    this.ticketsApi.obtenerTicket(id).subscribe({

      next: (ticket) => {

        // Completar el formulario
        this.formulario.patchValue({
          asunto: ticket.asunto,
          solicitante: ticket.solicitante,
          descripcion: ticket.descripcion,
          categoria: ticket.categoria,
          prioridad: ticket.prioridad,
          estado: ticket.estado
        });

        this.cargando.set(false);
      },

      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.errorCarga.set(true);

        this.mensaje.set(
          err.status === 404
            ? 'El ticket no existe.'
            : 'No se pudo cargar el ticket.'
        );
      }
    });
  }

  guardar(): void {

    this.mensaje.set('');
    this.formulario.markAllAsTouched();

    if (
      this.formulario.invalid ||
      this.guardando() ||
      this.cargando() ||
      this.errorCarga()
    ) {
      return;
    }

    this.guardando.set(true);

    const datos = this.formulario.getRawValue();

    // Determinar si creamos o actualizamos
    const peticion = this.idTicket === null
      ? this.ticketsApi.crearTicket(datos)
      : this.ticketsApi.actualizarTicket(
          this.idTicket,
          datos
        );

    peticion.subscribe({

      next: () => {
        this.guardando.set(false);

        // Regresar al listado
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
            typeof err.error?.error === 'string'
              ? err.error.error
              : 'No se pudo guardar el ticket.'
          );
        }
      }

    });
  }

}

