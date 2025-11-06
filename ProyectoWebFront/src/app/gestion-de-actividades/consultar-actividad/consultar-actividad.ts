import { Component, Inject, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

import { ActividadService } from '../../services/Activity/actividad-service';
import { ActividadDto } from '../../dto/actividadDto';
import { Subject, debounceTime, takeUntil } from 'rxjs';

type ActividadView = ActividadDto;

type DragState = {
  id: number;
  startMouseX: number;
  startMouseY: number;
  startX: number;
  startY: number;
  cardW: number;
  cardH: number;
};

@Component({
  selector: 'app-consultar-actividad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './consultar-actividad.html',
  styleUrls: ['./consultar-actividad.css'],
})
export class ConsultarActividad implements OnInit, OnDestroy {
  form: FormGroup;

  loading = false;
  errorMessage = '';

  actividades: ActividadView[] = [];
  todas: ActividadView[] = [];

  // modal
  modalOpen = false;
  seleccionada: ActividadView | null = null;

  private readonly isBrowser: boolean;

  // === Dragging ===
  @ViewChild('boardRef', { static: true }) boardRef!: ElementRef<HTMLDivElement>;
  dragging: DragState | null = null;
  private save$ = new Subject<ActividadDto>();
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private actividadesSrv: ActividadService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.form = this.fb.group({
      q: [''],
      type: [''],
    });
  }

  ngOnInit(): void {
    this.cargar();

    // Debounce de guardado de posición para evitar spam de PUT
    this.save$.pipe(debounceTime(250), takeUntil(this.destroy$)).subscribe((dto) => {
      if (!dto.id) return;
      // Usa tu método update/PUT; si tienes updatePosition, úsalo:
      if ((this.actividadesSrv as any).updatePosition) {
        (this.actividadesSrv as any).updatePosition(dto).subscribe({
          error: (err: any) => console.error('Error guardando posición', err),
        });
      } else if ((this.actividadesSrv as any).update) {
        (this.actividadesSrv as any).update(dto.id, dto).subscribe({
          error: (err: any) => console.error('Error guardando posición', err),
        });
      }
    });
  }

  cargar(): void {
    this.loading = true;
    this.errorMessage = '';
    this.actividadesSrv.list().subscribe({
      next: (lista) => {
        this.todas = (Array.isArray(lista) ? lista : []).map((a) => ({
          ...a,
          x: Number.isFinite(a.x as number) ? (a.x as number) : 0,
          y: Number.isFinite(a.y as number) ? (a.y as number) : 0,
        }));
        if (this.todas.length === 0) {
          this.errorMessage = 'No hay actividades. Usando datos de ejemplo.';
          this.todas = [
            { id: 1, name: 'Revisión inicial', type: 'manual', description: 'Primera revisión', x: 100, y: 200 },
          ];
        }
        this.actividades = [...this.todas];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar actividades. Usando datos de ejemplo.';
        this.todas = [
          { id: 1, name: 'Revisión inicial', type: 'manual', description: 'Primera revisión', x: 100, y: 200 },
        ];
        this.actividades = [...this.todas];
        this.loading = false;
      },
    });
  }

  aplicarBusqueda(): void {
    const { q, type } = this.form.value as { q?: string; type?: string };
    const term = (q || '').toLowerCase().trim();
    const t = (type || '').toLowerCase().trim();

    this.actividades = this.todas.filter((a) => {
      const byQ =
        !term ||
        (a.name && a.name.toLowerCase().includes(term)) ||
        (a.description && a.description.toLowerCase().includes(term)) ||
        (String(a.id || '')).includes(term);
      const byType = !t || (a.type && a.type.toLowerCase() === t);
      return byQ && byType;
    });
  }

  // ========= DnD handlers (Pointer Events) =========
  onPointerDown(e: PointerEvent, act: ActividadDto, cardEl: HTMLElement) {
    if (!act.id) return;
    e.preventDefault(); // evita selección/drag fantasma
    const cardRect = cardEl.getBoundingClientRect();

    cardEl.setPointerCapture(e.pointerId); // capture → escuchamos en el propio elemento

    this.dragging = {
      id: act.id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: act.x ?? 0,
      startY: act.y ?? 0,
      cardW: cardRect.width,
      cardH: cardRect.height,
    };
  }

  onPointerMove(e: PointerEvent) {
    if (!this.dragging) return;
    const { id, startMouseX, startMouseY, startX, startY, cardW, cardH } = this.dragging;

    const rect = this.boardRef.nativeElement.getBoundingClientRect();

    const dx = e.clientX - startMouseX;
    const dy = e.clientY - startMouseY;

    let newX = startX + dx;
    let newY = startY + dy;

    const maxX = Math.max(0, rect.width - cardW);
    const maxY = Math.max(0, rect.height - cardH);
    newX = Math.min(Math.max(0, newX), maxX);
    newY = Math.min(Math.max(0, newY), maxY);

    // snap opcional
    const grid = 10;
    newX = Math.round(newX / grid) * grid;
    newY = Math.round(newY / grid) * grid;

    const i = this.actividades.findIndex((a) => a.id === id);
    if (i >= 0) this.actividades[i] = { ...this.actividades[i], x: newX, y: newY };
  }

  onPointerUp(_e: PointerEvent) {
    if (!this.dragging) return;
    const { id } = this.dragging;
    const dto = this.actividades.find((a) => a.id === id);
    if (dto) this.save$.next(dto);
    this.dragging = null;
  }

  // ================================================

  trackById(_i: number, it: ActividadView) {
    return it.id!;
  }

  abrirModal(a: ActividadView) {
    this.seleccionada = a;
    this.modalOpen = true;
    if (this.isBrowser) document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.modalOpen = false;
    this.seleccionada = null;
    if (this.isBrowser) document.body.style.overflow = '';
  }

  irCrear() {
    this.router.navigate(['/crear-actividad']);
  }

  irModificar(a: ActividadView) {
    this.router.navigate(['/modificar-actividad'], { queryParams: { id: a.id } });
  }

  eliminar(a: ActividadView) {
    if (!a.id) return;
    if (!confirm(`¿Eliminar la actividad "${a.name}" (id ${a.id})?`)) return;
    this.actividadesSrv.delete(a.id).subscribe({
      next: () => this.cargar(),
      error: () => alert('Error al eliminar.'),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
