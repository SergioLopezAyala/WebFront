import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaDto } from '../../dto/empresaDto';
import { Router } from '@angular/router';
import { OrganizationService } from '../../services';

@Component({
  selector: 'app-mostrar-empresas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mostrar-empresa.html',
  styleUrls: ['./mostrar-empresa.css'],
})
export class MostrarEmpresa implements OnInit {
  empresas: EmpresaDto[] = [];
  loading = false;
  errorMessage = '';

  constructor(private organizationService: OrganizationService, private router: Router) {}

  ngOnInit() {
    this.cargarEmpresas();
  }

  cargarEmpresas() {
    this.loading = true;
    this.errorMessage = '';

    this.organizationService.listar().subscribe({
      next: (data) => {
        this.empresas = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudieron cargar las empresas.';
      },
    });
  }
  eliminarEmpresa(id?: number) {
    if (!id) return;

    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta empresa?');
    if (!confirmacion) return;

    this.loading = true;
    this.organizationService.eliminar(id).subscribe({
      next: () => {
        alert('Empresa eliminada con éxito.');
      },
      error: (error) => {
        console.error('Error al eliminar empresa:', error);
        alert('No se pudo eliminar la empresa. Intenta nuevamente.');
        this.loading = false;
      },
    });
  }


  volver() {
    this.router.navigate(['/home']);
  }
}
