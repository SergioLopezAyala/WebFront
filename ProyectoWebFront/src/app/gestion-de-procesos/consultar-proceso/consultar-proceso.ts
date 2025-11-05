import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProcesoService, ProcesoDto } from '../../services/proceso.service';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

interface ProcesoView {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  estado: string;
  fecha?: string;
  duracion?: number;
  actividadesProceso?: string[];
  arcosProceso?: string[];
  gatewaysProceso?: string[];
}

@Component({
  selector: 'app-consultar-proceso',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './consultar-proceso.html',
  styleUrls: ['./consultar-proceso.css'],
})
export class ConsultarProceso {
  // Formulario
  searchForm: FormGroup;
  mostrarFiltro = false;

  // Estado de carga
  loading = false;
  errorMessage = '';

  // Modal
  modalOpen = false;
  procesoSeleccionado: ProcesoView | null = null;

  // Datos
  procesos: ProcesoView[] = [];
  todosLosProcesos: ProcesoView[] = [];

  private readonly isBrowser: boolean;

  constructor(
    private readonly fb: FormBuilder,
    private readonly procesoService: ProcesoService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.searchForm = this.fb.group({
      terminoBusqueda: [''],
      filtroFecha: [''],
      filtroDuracion: [0 as number],
      filtroEstado: [''],
    });

    this.cargarProcesos();
  }

  private isProcesoArray(data: unknown): data is ProcesoDto[] {
    return Array.isArray(data);
  }

  cargarProcesos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.procesoService.listar().subscribe({
      next: (procesosBackend: unknown) => {
        try {
          if (!this.isProcesoArray(procesosBackend)) {
            throw new Error('Los datos del backend no son válidos');
          }

          this.todosLosProcesos = procesosBackend.map((p: ProcesoDto, index: number): ProcesoView => {
            const duracionValidada = (() => {
              const d = (p as any)?.duracion;
              return typeof d === 'number' && Number.isFinite(d) ? d : 7;
            })();

            return {
              id: (p as any)?.id ?? index,
              nombre: (p as any)?.nombre ?? 'Sin nombre',
              descripcion: (p as any)?.descripcion ?? 'Sin descripción',
              categoria: (p as any)?.categoria ?? 'Sin categoría',
              estado: (p as any)?.estado ?? 'desconocido',
              fecha: (p as any)?.fecha ?? '2025-10-01',
              duracion: duracionValidada,
              actividadesProceso: Array.isArray((p as any)?.actividadesProceso)
                ? (p as any).actividadesProceso
                : ['Actividad 1', 'Actividad 2'],
              arcosProceso: Array.isArray((p as any)?.arcosProceso)
                ? (p as any).arcosProceso
                : ['Arco 1'],
              gatewaysProceso: Array.isArray((p as any)?.gatewaysProceso)
                ? (p as any).gatewaysProceso
                : ['Gateway 1'],
            };
          });

          this.procesos = [...this.todosLosProcesos];
        } catch (mapError) {
          console.error('Error al procesar datos del backend:', mapError);
          this.errorMessage = 'Error al procesar los datos';
        } finally {
          this.loading = false;
        }
      },
      error: (error: unknown) => {
        console.error('Error al cargar procesos:', error);
        this.errorMessage = 'Error al cargar los procesos. Usando datos de ejemplo.';
        this.loading = false;

        // Fallback de ejemplo
        this.todosLosProcesos = [
          {
            id: 1,
            nombre: 'Gestión de reservas',
            descripcion: 'Proceso para gestionar reservas de servicios',
            categoria: 'servicio',
            estado: 'activo',
            fecha: '2025-10-01',
            duracion: 7,
            actividadesProceso: ['Recepción de solicitud', 'Verificación de disponibilidad', 'Confirmación de reserva'],
            arcosProceso: ['Flujo estándar', 'Flujo de cancelación'],
            gatewaysProceso: ['Gateway de decisión', 'Gateway de fin'],
          },
        ];
        this.procesos = [...this.todosLosProcesos];
      },
    });
  }

  toggleFiltro(): void {
    this.mostrarFiltro = !this.mostrarFiltro;
  }

  filtrarProcesos(): ProcesoView[] {
    const formValue = this.searchForm.value as {
      terminoBusqueda?: string;
      filtroFecha?: string;
      filtroDuracion?: number;
      filtroEstado?: string;
    };

    const term = (formValue.terminoBusqueda || '').trim().toLowerCase();
    if (!this.todosLosProcesos || this.todosLosProcesos.length === 0) return [];

    return this.todosLosProcesos.filter((p) => {
      if (!p) return false;

      const coincideBusqueda =
        term === '' ||
        (p.nombre && p.nombre.toLowerCase().includes(term)) ||
        (p.categoria && p.categoria.toLowerCase().includes(term)) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(term));

      const coincideEstado =
        formValue.filtroEstado && formValue.filtroEstado.trim() !== '' ? p.estado === formValue.filtroEstado : true;

      const coincideFecha =
        formValue.filtroFecha && formValue.filtroFecha.trim() !== '' ? p.fecha === formValue.filtroFecha : true;

      const dur = formValue.filtroDuracion;
      const coincideDuracion = typeof dur === 'number' && dur > 0 ? p.duracion === dur : true;

      return coincideBusqueda && coincideEstado && coincideFecha && coincideDuracion;
    });
  }

  abrirModal(p: ProcesoView): void {
    this.procesoSeleccionado = p;
    this.modalOpen = true;

    if (this.isBrowser) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const modal = document.querySelector('.modal');
        if (modal) (modal as HTMLElement).focus();
      }, 0);
    }
  }

  cerrarModal(): void {
    this.modalOpen = false;
    this.procesoSeleccionado = null;
    if (this.isBrowser) document.body.style.overflow = '';
  }

  onKeyDown(event: Event, proceso?: ProcesoView): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' && proceso) this.abrirModal(proceso);
    if (keyboardEvent.key === 'Escape') {
      if (this.modalOpen) this.cerrarModal();
      else this.toggleFiltro();
    }
  }

  // ---------- Navegación/acciones invocadas desde el HTML ----------
  irCrear(): void {
    // alias de crearNuevoProceso para coincidir con el HTML
    this.crearNuevoProceso();
  }

  eliminarDesdeLista(p: ProcesoView): void {
    // wrapper del botón "Eliminar" en cada item
    this.eliminarProceso(p);
  }

  editarSeleccionado(): void {
    if (!this.procesoSeleccionado) return;
    this.editarProceso(this.procesoSeleccionado);
  }

  eliminarSeleccionado(): void {
    if (!this.procesoSeleccionado) return;
    this.eliminarProceso(this.procesoSeleccionado);
  }
  // ------------------------------------------------------------------

  verDetalles(p: ProcesoView): void {
    this.abrirModal(p);
  }

  editarProceso(p: ProcesoView): void {
    this.router.navigate(['/editar-proceso'], { queryParams: { id: p.id } });
  }

  eliminarProceso(p: ProcesoView): void {
    if (!p) return;
    if (confirm(`¿Eliminar el proceso "${p.nombre}"?`)) {
      this.procesoService.eliminar(p.id).subscribe({
        next: () => {
          // Refresca lista local rápidamente
          this.todosLosProcesos = this.todosLosProcesos.filter(x => x.id !== p.id);
          this.procesos = this.procesos.filter(x => x.id !== p.id);
          this.cerrarModal();
          alert('Proceso eliminado exitosamente');
        },
        error: (error: unknown) => {
          console.error('Error al eliminar proceso:', error);
          alert('Error al eliminar el proceso');
        },
      });
    }
  }

  crearNuevoProceso(): void {
    this.router.navigate(['/crear-proceso']);
  }

  trackByProcesoId(index: number, proceso: ProcesoView): number {
    return proceso.id;
  }
}
