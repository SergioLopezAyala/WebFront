// Si tienes un enum real del backend, úsalo:
export type ProcessStatus = 'DRAFT' | 'PUBLISHED' | 'INACTIVE' ;

export class ProcesoDto {
  id: number | null = null;
  name: string = '';
  description: string = '';
  category: string | null = null;
  status: ProcessStatus = 'DRAFT';
  organizationId: number | null = null;

  // ¡NO opcionales! Siempre arrays:
  activityIds: number[] = [];
  archIds: number[] = [];
  gatewayIds: number[] = [];

  constructor(init?: Partial<ProcesoDto>) {
    Object.assign(this, init);
    // protección extra si te llega undefined desde fuera
    this.activityIds ??= [];
    this.archIds ??= [];
    this.gatewayIds ??= [];
  }
}
