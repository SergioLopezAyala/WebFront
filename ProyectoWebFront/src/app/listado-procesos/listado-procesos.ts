import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProcesoService } from '../services/proceso.service';
import { Router } from '@angular/router';
import { ProcesoDto } from '../dto/procesoDto';

@Component({
  selector: 'app-listado-procesos',
  imports: [FormsModule],
  templateUrl: './listado-procesos.html',
  styleUrl: './listado-procesos.css'
})
export class ListadoProcesos {
  procesos: ProcesoDto[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private procesoService: ProcesoService,
    private router: Router
  ) {
    this.cargarProcesos();
  }

  cargarProcesos() {
    this.loading = true;
    this.errorMessage = '';
    
    this.procesoService.listar().subscribe({
      next: (procesos) => {
        this.procesos = procesos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar procesos:', error);
        this.errorMessage = 'Error al cargar los procesos';
        this.loading = false;
      }
    });
  }

  editarProceso(proceso: ProcesoDto) {
    if (proceso.id) {
      this.router.navigate(['/editar-proceso'], { queryParams: { id: proceso.id } });
    }
  }

  eliminarProceso(proceso: ProcesoDto) {
    if (!proceso.id) return;
    
    if (confirm('¿Está seguro de que desea eliminar este proceso?')) {
      this.procesoService.eliminar(proceso.id).subscribe({
        next: () => {
          this.cargarProcesos();
          alert('Proceso eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar proceso:', error);
          alert('Error al eliminar el proceso');
        }
      });
    }
  }

  volver() {
    this.router.navigate(['/crear-proceso']);
  }
}
