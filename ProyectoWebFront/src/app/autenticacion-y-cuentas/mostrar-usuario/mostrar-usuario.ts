import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/Usuario/usuario-service';
import { UsuarioDto } from '../../dto/userDto';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mostrar-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mostrar-usuario.html',
  styleUrls: ['./mostrar-usuario.css'],
})
export class MostrarUsuarios implements OnInit {
  usuarios: UsuarioDto[] = [];
  loading = false;
  errorMessage = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.errorMessage = '';
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudieron cargar los usuarios.';
      },
    });
  }

  eliminarUsuario(id?: number) {
    if (!id) return;

    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (!confirmacion) return;

    this.loading = true;
    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => {
        alert('Usuario eliminado con éxito.');
        this.usuarios = this.usuarios.filter((u) => u.id !== id);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
        alert('No se pudo eliminar el usuario. Intenta nuevamente.');
        this.loading = false;
      },
    });
  }

  volver() {
    this.router.navigate(['/home']);
  }
}
