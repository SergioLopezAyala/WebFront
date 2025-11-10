  import { Component, Input, Output, EventEmitter, OnInit, signal, computed } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { ActividadDto } from '../../dto/actividadDto';
import { ActividadService } from '../../services/Activity/actividad-service';
import { Router } from '@angular/router';

  @Component({
    selector: 'app-mostrar-actividades',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './mostrar-actividades.html',
    styleUrls: ['./mostrar-actividades.css'],
  })
  export class MostrarActividades implements OnInit {
    constructor(
      private actividadService: ActividadService,
      private router: Router
    ){}

    @Output() orderChange = new EventEmitter<ActividadDto[]>();

    activities: ActividadDto[] = [];

    /** Estado de Drag & Drop */
    draggedIndex: number | null = null;
    overIndex: number | null = null;

    ngOnInit(): void {

      this.actividadService.list().subscribe((rows) => this.activities = rows);
      
    }

    onDragStart(index: number, event: DragEvent) {
      this.draggedIndex = index;
      document.querySelector('.board')?.classList.add('drag-active');
      event.dataTransfer?.setData('text/plain', String(index));
    }

    onDragOver(event: DragEvent) {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    }

    onDragEnter(index: number) {
      this.overIndex = index;
    }

    onDragLeave() {
      this.overIndex = null;
    }

    onDrop(targetIndex: number, event: DragEvent) {
      event.preventDefault();
      const fromIndex = this.draggedIndex;
      if (fromIndex === null || fromIndex === targetIndex) {
        this.resetDragState();
        return;
      }

      // Intercambiar elementos
      [this.activities[fromIndex], this.activities[targetIndex]] = [
        this.activities[targetIndex],
        this.activities[fromIndex],
      ];

      this.resetDragState();
      this.orderChange.emit(this.activities.slice());

      // Si quieres persistir en el backend:
      // this.actividadService.guardarOrden(this.activities).subscribe();
    }

    onDragEnd() {
      document.querySelector('.board')?.classList.remove('drag-active');
      this.resetDragState();
    }
    
    getCardPosition(cardElement: HTMLElement) {
      const rect = cardElement.getBoundingClientRect();
      console.log('X:', rect.left, 'Y:', rect.top);
      console.log('Width:', rect.width, 'Height:', rect.height);
    }

    private resetDragState() {
      this.draggedIndex = null;
      this.overIndex = null;
    }

    /** trackBy para @for */
    trackById = (_: number, item: ActividadDto) => item.id;
    
    onDropOutside(event: DragEvent) {
    event.preventDefault();
    // Optional visual feedback or cleanup
    this.resetDragState();
    }

   eliminarActividad(id?: number) {
    if (!id) return;
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta actividad?');
    if (!confirmacion) return;

    this.actividadService.delete(id).subscribe({
      next: () => {
        alert('Actividad eliminada con éxito.');
        this.activities = this.activities.filter((a) => a.id !== id);
      },
      error: (error) => {
        console.error('Error al eliminar actividad:', error);
        alert('No se pudo eliminar la actividad. Intenta nuevamente.');
      },
    });
  }

    cancelar() {
    this.router.navigate(['/home']);
  }
  }
