import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { EmpresaDto } from '../../dto/empresaDto';
import { OrganizationService } from '../../services';

@Component({
  selector: 'app-editar-empresa',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-empresa.html',
  styleUrls: ['./editar-empresa.css'],
})
export class EditarEmpresa {
  empresaDto: EmpresaDto = new EmpresaDto();
  idEmpresa?: number;
  loading = false;

  constructor(
    private organizationService: OrganizationService,
    private router: Router
  ) {}

  onModificarEmpresa() {
    if (!this.idEmpresa) {
      alert('Debes ingresar el ID de la empresa que deseas actualizar.');
      return;
    }

    if (!this.empresaDto.name || !this.empresaDto.nit || !this.empresaDto.email) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    this.loading = true;
    this.organizationService.actualizar(this.idEmpresa, this.empresaDto).subscribe({
      next: (data) => {
        console.log('Empresa modificada correctamente:', data);
        alert('Cambios guardados con éxito.');
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error al modificar empresa:', error);
        alert('No se pudo modificar la empresa. Intenta nuevamente.');
        this.loading = false;
      },
    });
  }
}
