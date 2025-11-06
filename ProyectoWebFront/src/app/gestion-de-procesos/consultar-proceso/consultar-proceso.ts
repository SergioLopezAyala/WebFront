import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProcesoService } from '../../services/proceso.service';
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
 
}
