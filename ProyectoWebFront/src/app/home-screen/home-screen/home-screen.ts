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

  // ======== PROCESOS ========
  navegarCrearProceso() {
    this.router.navigate(['/crear-proceso']);
  }

  navegarConsultarProceso() {
    this.router.navigate(['/consultar-proceso']);
  }

  navegarEditarProceso() {
    this.router.navigate(['/editar-proceso']);
  }

  // ======== ACTIVIDADES ========
  navegarCrearActividad() {
    this.router.navigate(['/crear-actividad']);
  }

  navegarMostrarActividades() {
    this.router.navigate(['/mostrar-actividades']);
  }

  navegarModificarActividad() {
    this.router.navigate(['/modificar-actividad']);
  }

  // ======== USUARIOS ========
  navegarCrearUsuario() {
    this.router.navigate(['/crear-usuario']);
  }

  navegarEditarUsuario(){
    this.router.navigate(['/modificar-usuario']);
  }

  navegarMostrarUsuarios(){
    this.router.navigate(['mostrar-usuario']);
  }
  // ======== EMPRESA ========
  navegarCrearEmpresa() {
    this.router.navigate(['/registro-de-empresa']);
  }
  navegarMostrarEmpresas(){
    this.router.navigate(['/mostrar-empresas']);
  }

  // ======== HOME ========
  navegarHome() {
    this.router.navigate(['/home']);
  }
}
