import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista.html',
  styleUrl: './lista.css'
})
export class Lista implements OnInit {

  tickets: any[] = [];
  ticketsOriginales: any[] = [];
  textoBusqueda: string = '';

  constructor(
    private ticketService: TicketService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTickets();

    this.ticketService.actualizarLista$.subscribe(() => {
      this.cargarTickets();
    });
  }

  cargarTickets(): void {
    this.ticketService.obtenerTickets().subscribe({
      next: (data: any[]) => {
        console.log('Tickets recibidos:', data);

        this.ticketsOriginales = [...data];
        this.tickets = [...data];

        this.changeDetector.detectChanges();
      },

      error: (error) => {
        console.error('Error al cargar tickets:', error);
        this.ticketsOriginales = [];
        this.tickets = [];
      }
    });
  }

  buscarTickets(): void {
    const texto = this.textoBusqueda.toLowerCase().trim();

    if (texto === '') {
      this.tickets = [...this.ticketsOriginales];
      return;
    }

    this.tickets = this.ticketsOriginales.filter(ticket =>
      String(ticket.titulo ?? '').toLowerCase().includes(texto) ||
      String(ticket.descripcion ?? '').toLowerCase().includes(texto) ||
      String(ticket.categoria ?? '').toLowerCase().includes(texto) ||
      String(ticket.estado ?? '').toLowerCase().includes(texto) ||
      String(ticket.prioridad ?? '').toLowerCase().includes(texto)
    );
  }

  editarTicket(ticket: any): void {
    this.ticketService.seleccionarTicket(ticket);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  eliminarTicket(id: number): void {
    const confirmar = confirm(
      '¿Está segura de eliminar este ticket?'
    );

    if (!confirmar) {
      return;
    }

    this.ticketService.eliminarTicket(id).subscribe({
      next: () => {
        this.cargarTickets();
        this.ticketService.notificarActualizacion();
      },

      error: (error) => {
        console.error('Error al eliminar el ticket:', error);
      }
    });
  }
}