
import { Routes } from '@angular/router';

import { ListaTickets } from './pages/lista-tickets/lista-tickets';

import { FormularioTicket } from './pages/formulario-ticket/formulario-ticket';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tickets',
    pathMatch: 'full'
  },
  {
    path: 'tickets',
    component: ListaTickets
  },
  {
    path: 'tickets/nuevo',
    component: FormularioTicket
  }
];
