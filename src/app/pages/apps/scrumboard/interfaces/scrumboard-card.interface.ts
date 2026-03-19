import { ScrumboardAttachment } from './scrumboard-attachment.interface';
import { DateTime } from 'luxon';
import { ScrumboardComment } from './scrumboard-comment.interface';
import { ScrumboardUser } from './scrumboard-user.interface';
import { ScrumboardLabel } from './scrumboard-label.interface';

export interface ScrumboardCard {
  id: number;
  title: string;
  description?: string;
  fecha?: string;
  cliente?: string;
  destino?: string;
  peso?: string;
  diesel?: string;
  seFacturo?: boolean;
  clienteRetorno?: string;
  destinoRetorno?: string;
  pesoRetorno?: string;
  dieselRetorno?: string;
  configuracion?: string;
  operador?: string;
  economico?: string;
  monto?: string;
  dueDate?: {
    date: DateTime;
    done: boolean;
  };
  comments?: ScrumboardComment[];
  attachments?: ScrumboardAttachment[];
  //users?: ScrumboardUser[];
  labels?: ScrumboardLabel[];
  //cover?: ScrumboardAttachment;
}
