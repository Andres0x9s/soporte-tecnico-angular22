
export interface Ticket {
  id: number;
  asunto: string;
  solicitante: string;
  descripcion: string;
  categoria: string;
  prioridad: string;
  estado: string;
  fechaRegistro: string;
}


export type NuevoTicket = Omit<
  Ticket,
  'id' | 'fechaRegistro'
>;
