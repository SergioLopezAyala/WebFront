import { Component, OnInit, ViewChild, ElementRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { ActividadService } from '../../services/Activity/actividad-service';
import { ActividadDto } from '../../dto/actividadDto';

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
  selector: 'app-mostrar-actividades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mostrar-actividades.html',
  styleUrls: ['./mostrar-actividades.css'],
})
export class MostrarActividades implements OnInit {
  private svc = inject(ActividadService);
  private ngZone = inject(NgZone);

  activities: ActividadDto[] = [];
  loading = false;
  errorMsg = '';

  @ViewChild('boardRef', { static: true }) boardRef!: ElementRef<HTMLDivElement>;

  dragging: DragState | null = null;
  private save$ = new Subject<ActividadDto>();     // emite el DTO completo a guardar
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.fetchActivities();

    // Debounce de guardado de posición (PUT con DTO completo)
    this.save$
      .pipe(debounceTime(250), takeUntil(this.destroy$))
      .subscribe(dto => {
        this.svc.updatePosition(dto).subscribe({
          error: (err) => console.error('Error guardando posición', err),
        });
      });
  }

  fetchActivities() {
    this.loading = true; this.errorMsg = '';
    this.svc.list().subscribe({
      next: (rows) => {
        // normaliza posiciones
        this.activities = (rows ?? []).map(a => ({
          ...a,
          x: Number.isFinite(a.x as number) ? (a.x as number) : 0,
          y: Number.isFinite(a.y as number) ? (a.y as number) : 0,
        }));
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'No se pudieron cargar las actividades';
        console.error(err);
        this.loading = false;
      }
    });
  }

  onPointerDown(e: PointerEvent, act: ActividadDto, cardEl: HTMLElement) {
  if (!act.id) return;
  const cardRect = cardEl.getBoundingClientRect();
  cardEl.setPointerCapture(e.pointerId);

  this.dragging = {
    id: act.id,
    startMouseX: e.clientX,
    startMouseY: e.clientY,
    startX: act.x ?? 0,
    startY: act.y ?? 0,
    cardW: cardRect.width,
    cardH: cardRect.height,
  };

  const move = (ev: PointerEvent) => this.onPointerMove(ev);
  const up = (ev: PointerEvent) => this.onPointerUp(ev);

  document.addEventListener('pointermove', move);
  document.addEventListener('pointerup', up, { once: true });

  (this as any)._stopDragListeners = () => {
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerup', up);
  };
}


  onPointerMove(e: PointerEvent) {
    if (!this.dragging) return;
    const { id, startMouseX, startMouseY, startX, startY, cardW, cardH } = this.dragging;

    const boardEl = this.boardRef.nativeElement;
    const rect = boardEl.getBoundingClientRect();

    const dx = e.clientX - startMouseX;
    const dy = e.clientY - startMouseY;

    let newX = startX + dx;
    let newY = startY + dy;

    // límites dentro del board
    const maxX = Math.max(0, rect.width - cardW);
    const maxY = Math.max(0, rect.height - cardH);
    newX = Math.min(Math.max(0, newX), maxX);
    newY = Math.min(Math.max(0, newY), maxY);

    // snap opcional a grilla de 10px
    const grid = 10;
    newX = Math.round(newX / grid) * grid;
    newY = Math.round(newY / grid) * grid;

    const idx = this.activities.findIndex(a => a.id === id);
    if (idx >= 0) {
      this.activities[idx] = { ...this.activities[idx], x: newX, y: newY };
    }
  }

  onPointerUp(_e: PointerEvent) {
    if (!this.dragging) return;
    const { id } = this.dragging;
    const dto = this.activities.find(a => a.id === id);
    if (dto) this.save$.next(dto);   // PUT /update/{id} con dto completo
    if ((this as any)._stopDragListeners) (this as any)._stopDragListeners();
    this.dragging = null;
  }

  trackById = (_: number, item: ActividadDto) => item.id;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
