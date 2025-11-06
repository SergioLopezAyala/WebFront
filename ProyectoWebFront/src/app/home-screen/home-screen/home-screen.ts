import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-screen.html',
  styleUrls: ['./home-screen.css'],
})
export class HomeScreen implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  // ======== NAVEGACIÓN: PROCESOS ========
  navegarCrearProceso() {
    this.router.navigate(['/crear-proceso']);
  }

  navegarConsultarProceso() {
    this.router.navigate(['/consultar-proceso']);
  }

  navegarEditarProceso() {
    this.router.navigate(['/editar-proceso']);
  }

  // ======== NAVEGACIÓN: ACTIVIDADES ========
  navegarCrearActividad() {
    this.router.navigate(['/crear-actividad']);
  }

  navegarConsultarActividad() {
    this.router.navigate(['/consultar-actividad']);
  }

  navegarModificarActividad() {
    this.router.navigate(['/modificar-actividad']);
  }

  // ======== NAVEGACIÓN: USUARIOS ========
  navegarCrearUsuario() {
    this.router.navigate(['/crear-usuario']);
  }

  navegarRegistrarEmpresa() {
    this.router.navigate(['/registro-de-empresa']);
  }

  // ======== NAVEGACIÓN: EMPRESAS / HOME ========
  navegarHome() {
    this.router.navigate(['/home']);
  }
}
