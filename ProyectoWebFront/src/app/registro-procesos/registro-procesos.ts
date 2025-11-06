import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProcesoService } from '../services';
import { ProcesoDto } from '../dto/procesoDto';

// Si tienes un enum real del backend, úsalo aquí:
type ProcessStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';

@Component({
  selector: 'app-registro-procesos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro-procesos.html',
  styleUrls: ['./registro-procesos.css'],
})
export class RegistroProcesos implements OnInit {
  // Estados para el <select>
  statuses: ProcessStatus[] = ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED'];
  procesoDto: ProcesoDto = new ProcesoDto();
  // Modelo del formulario (inicialización segura)
  // procesoDto: ProcesoDto = new ProcesoDto({
  //   id: null as any,                // si tu clase espera number | undefined, puedes dejar undefined
  //   name: '',
  //   description: '',
  //   category: null as any,
  //   status: 'DRAFT' as any,
  //   organizationId: null as any,
  //   activityIds: [],
  //   archIds: [],
  //   gatewayIds: [],
  // });

  // Catálogos (ejemplo; normalmente se cargan desde API en ngOnInit)
  activitiesCatalogo = [
    { id: 1, name: 'Crear solicitud' },
    { id: 2, name: 'Validar datos' },
  ];

  archsCatalogo = [
    { id: 10, actividadI: 1, actividadD: 2 },
    { id: 11, actividadI: 2, actividadD: 3 },
  ];

  gatewaysCatalogo = [
    { id: 100, type: 'EXCLUSIVE' },
    { id: 101, type: 'PARALLEL' },
  ];

  // Inputs “rápidos” (agregar por ID)
  quick = {
    activityId: null as number | null,
    archId: null as number | null,
    gatewayId: null as number | null,
  };

  constructor(
    private router: Router,
    private procesoService: ProcesoService
  ) {}

  ngOnInit(): void {
    // Ejemplo de carga desde API:
    // this.miService.getActivities().subscribe(r => this.activitiesCatalogo = r);
    // this.miService.getArches().subscribe(r => this.archsCatalogo = r);
    // this.miService.getGateways().subscribe(r => this.gatewaysCatalogo = r);
    // Normaliza arrays por si vinieran undefined:
    this.procesoDto.activityIds ??= [];
    this.procesoDto.archIds ??= [];
    this.procesoDto.gatewayIds ??= [];
  }

  // ----- Acciones del formulario -----
  onRegistrarProceso() {
    this.crearProceso();
  }

  crearProceso() {
    // Asegura que las listas sean number[] (por si acaso):
    this.procesoDto.activityIds = (this.procesoDto.activityIds ?? []).map(Number);
    this.procesoDto.archIds = (this.procesoDto.archIds ?? []).map(Number);
    this.procesoDto.gatewayIds = (this.procesoDto.gatewayIds ?? []).map(Number);

    this.procesoService.crear(this.procesoDto).subscribe({
      next: (data) => {
        console.log('Proceso creado:', data);
        // redirige a la lista o detalle
        // this.router.navigate(['/procesos']);
      },
      error: (err) => {
        console.error('Error creando proceso', err);
        // aquí puedes setear un mensaje de error para el template
      },
    });
  }

  // ----- Helpers para agregar/quitar IDs -----
  private ensureArrays() {
    this.procesoDto.activityIds ??= [];
    this.procesoDto.archIds ??= [];
    this.procesoDto.gatewayIds ??= [];
  }

  agregarId(kind: 'activity' | 'arch' | 'gateway') {
    this.ensureArrays();

    const map = {
      activity: 'activityId',
      arch: 'archId',
      gateway: 'gatewayId',
    } as const;

    const key = map[kind];
    const value = this.quick[key];

    if (value == null) return;

    const target =
      kind === 'activity'
        ? this.procesoDto.activityIds!
        : kind === 'arch'
        ? this.procesoDto.archIds!
        : this.procesoDto.gatewayIds!;

    if (!target.includes(value)) {
      target.push(value);
    }
    this.quick[key] = null;
  }

  quitarId(kind: 'activity' | 'arch' | 'gateway', index: number) {
    this.ensureArrays();

    const target =
      kind === 'activity'
        ? this.procesoDto.activityIds!
        : kind === 'arch'
        ? this.procesoDto.archIds!
        : this.procesoDto.gatewayIds!;

    if (index >= 0 && index < target.length) {
      target.splice(index, 1);
    }
  }
}
