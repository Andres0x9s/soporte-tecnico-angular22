
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-formulario-ticket',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-ticket.html',
  styleUrl: './formulario-ticket.css'
})
export class FormularioTicket {

  mensaje = '';

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

  guardar() {
    this.mensaje = '';
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      return;
    }

    console.log(
      'Datos del ticket:',
      this.formulario.getRawValue()
    );

    this.mensaje =
      'Formulario válido. Aún no se guarda en la base de datos.';
  }
}
