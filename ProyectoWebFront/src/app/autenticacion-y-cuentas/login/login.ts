import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit, OnDestroy {
  // ========================================================================
  // PROPIEDADES DEL FORMULARIO
  // ========================================================================
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  
  // ========================================================================
  // ESTADOS DE FOCUS
  // ========================================================================
  emailFocused: boolean = false;
  passwordFocused: boolean = false;
  
  // ========================================================================
  // ESTADOS DE VALIDACIÓN
  // ========================================================================
  emailError: boolean = false;
  passwordError: boolean = false;
  
  // ========================================================================
  // ESTADOS DE UI
  // ========================================================================
  errorMessage: string = '';
  loading: boolean = false;
  showPassword: boolean = false;
  showSuccessAnimation: boolean = false;

  // ========================================================================
  // CONSTRUCTOR
  // ========================================================================
  constructor(
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private router: Router
  ) {
    this.checkRememberedUser();
  }

  // ========================================================================
  // LIFECYCLE HOOKS
  // ========================================================================
  ngOnInit(): void {
    this.setupKeyboardShortcuts();
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
  }

  // ========================================================================
  // MÉTODOS DE INICIALIZACIÓN
  // ========================================================================
  
  /**
   * Verifica si hay un usuario recordado y autocompleta el email
   */
  private checkRememberedUser(): void {
    if (typeof window !== 'undefined') {
      const rememberedEmail = this.localStorage.getItem('rememberedEmail');
      if (rememberedEmail) {
        this.email = rememberedEmail;
        this.rememberMe = true;
      }
    }
  }

  /**
   * Configura atajos de teclado para mejor UX
   */
  private setupKeyboardShortcuts(): void {
    if (typeof window !== 'undefined') {
      // Enter para submit rápido
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && this.isFormValid() && !this.loading) {
          e.preventDefault();
          this.onLogin();
        }
        
        // Escape para limpiar errores
        if (e.key === 'Escape') {
          this.clearErrors();
        }
      });
    }
  }

  // ========================================================================
  // VALIDACIONES
  // ========================================================================
  
  /**
   * Valida el email usando expresión regular
   */
  validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailError = this.email.length > 0 && !emailRegex.test(this.email);
  }

  /**
   * Valida que la contraseña tenga al menos 6 caracteres
   */
  validatePassword(): void {
    this.passwordError = this.password.length > 0 && this.password.length < 6;
  }

  /**
   * Valida todo el formulario antes de enviar
   */
  private validateForm(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailError = !this.email || !emailRegex.test(this.email);
    this.passwordError = !this.password || this.password.length < 6;
    
    return !this.emailError && !this.passwordError;
  }

  /**
   * Verifica si el formulario es válido
   */
  isFormValid(): boolean {
    return this.email.length > 0 && 
           this.password.length >= 6 && 
           !this.emailError && 
           !this.passwordError;
  }

  /**
   * Limpia todos los errores
   */
  private clearErrors(): void {
    this.emailError = false;
    this.passwordError = false;
    this.errorMessage = '';
  }

  // ========================================================================
  // HANDLERS DE EVENTOS DE FOCUS
  // ========================================================================
  
  onEmailFocus(): void {
    this.emailFocused = true;
    this.emailError = false;
  }

  onEmailBlur(): void {
    this.emailFocused = false;
    if (this.email.length > 0) {
      this.validateEmail();
    }
  }

  onPasswordFocus(): void {
    this.passwordFocused = true;
    this.passwordError = false;
  }

  onPasswordBlur(): void {
    this.passwordFocused = false;
    if (this.password.length > 0) {
      this.validatePassword();
    }
  }

  // ========================================================================
  // TOGGLE DE VISIBILIDAD DE CONTRASEÑA
  // ========================================================================
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // ========================================================================
  // FUNCIÓN PRINCIPAL DE LOGIN
  // ========================================================================
  
  /**
   * Maneja el envío del formulario de login
   */
  onLogin(): void {
    // Limpiar errores previos
    this.clearErrors();
    
    // Validar formulario
    if (!this.validateForm()) {
      return;
    }
    
    // Activar estado de carga
    this.loading = true;

    // Preparar credenciales para el backend
    // IMPORTANTE: No cambiar esta estructura - es la que espera el backend
    const credentials: LoginRequest = {
      email: this.email.trim().toLowerCase(),
      password: this.password
    };

    // Llamada al servicio de autenticación
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.handleLoginSuccess(response);
      },
      error: (error) => {
        this.handleLoginError(error);
      }
    });
    this.router.navigate(['/home'])
  }

  // ========================================================================
  // HANDLERS DE RESPUESTA
  // ========================================================================
  
  /**
   * Maneja el éxito del login
   */
  private handleLoginSuccess(response: any): void {
    this.loading = false;
    this.showSuccessAnimation = true;
    
    // Guardar email si se marcó "recordar sesión"
    if (typeof window !== 'undefined') {
      if (this.rememberMe) {
        this.localStorage.setItem('rememberedEmail', this.email);
      } else {
        this.localStorage.removeItem('rememberedEmail');
      }
    }

    // Mostrar animación de éxito y redirigir
    setTimeout(() => {
      console.log('✅ Login exitoso:', response);
      // this.router.navigate(['/crear-proceso']);
    }, 1200);
  }

  /**
   * Maneja los errores del login
   */
  private handleLoginError(error: any): void {
    this.loading = false;
    
    console.error('Error en login:', error);
    
    // Determinar mensaje de error según el código HTTP
    let errorMsg = 'Ha ocurrido un error. Intenta nuevamente.';
    
    if (error.status === 400) {
      errorMsg = 'Por favor verifica tus datos';
    } else if (error.status === 401) {
      errorMsg = 'Email o contraseña incorrectos';
    } else if (error.status === 404) {
      errorMsg = 'Usuario no encontrado';
    } else if (error.status === 429) {
      errorMsg = 'Demasiados intentos. Espera un momento';
    } else if (error.status === 0) {
      errorMsg = 'Sin conexión a internet';
    } else if (error.status >= 500) {
      errorMsg = 'Error del servidor. Intenta más tarde';
    } else if (error.message?.includes('Network') || error.message?.includes('network')) {
      errorMsg = 'Error de conexión. Verifica tu internet';
    }

    this.errorMessage = errorMsg;
    
    // Animación de shake en la tarjeta
    this.shakeCard();
    
    // Auto-limpiar mensaje después de 6 segundos
    setTimeout(() => {
      this.errorMessage = '';
    }, 6000);
  }

  // ========================================================================
  // ANIMACIONES Y EFECTOS VISUALES
  // ========================================================================
  
  /**
   * Aplica animación de shake a la tarjeta de login
   */
  private shakeCard(): void {
    if (typeof window !== 'undefined') {
      const card = document.querySelector('.login-card') as HTMLElement;
      if (card) {
        card.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
          card.style.animation = '';
        }, 500);
      }
    }
  }

  // ========================================================================
  // MÉTODOS AUXILIARES
  // ========================================================================
  
  /**
   * Obtiene el mensaje de error actual
   */
  getErrorMessage(): string {
    if (this.emailError) {
      return 'Por favor ingresa un email válido';
    }
    if (this.passwordError) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return this.errorMessage;
  }

  /**
   * Obtiene el estado del botón de submit
   */
  getSubmitButtonState(): 'loading' | 'disabled' | 'enabled' {
    if (this.loading) return 'loading';
    if (!this.isFormValid()) return 'disabled';
    return 'enabled';
  }
}
