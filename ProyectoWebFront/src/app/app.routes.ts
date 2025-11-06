import { Routes } from '@angular/router';
import { RegistroUsuario } from './autenticacion-y-cuentas/registro-usuario/registro-usuario';
import { CrearActividad } from './gestion-de-actividades/crear-actividad/crear-actividad';
import { RegistroProcesos } from './registro-procesos/registro-procesos';
import { MostrarActividades } from './gestion-de-actividades/mostrar-actividades/mostrar-actividades';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },


    { path: 'login', loadComponent: () => import('./autenticacion-y-cuentas/login/login').then(m => m.Login) },
    { path: 'registro-de-empresa', loadComponent: () => import('./autenticacion-y-cuentas/registro-de-empresa/registro-de-empresa').then(m => m.RegistroDeEmpresa) },
    { path: 'editar-proceso', loadComponent: () => import('./gestion-de-procesos/editar-proceso/editar-proceso').then(m => m.EditarProceso) },
    { path: 'eliminar-proceso', loadComponent: () => import('./gestion-de-procesos/eliminar-proceso/eliminar-proceso').then(m => m.EliminarProceso) },
    { path: 'consultar-proceso', loadComponent: () => import('./gestion-de-procesos/consultar-proceso/consultar-proceso').then(m => m.ConsultarProceso) },
    { path: 'eliminar-proceso', loadComponent: () => import('./gestion-de-procesos/eliminar-proceso/eliminar-proceso').then(m => m.EliminarProceso) },
    { path: 'crear-rol-de-proceso', loadComponent: () => import('./gestion-de-roles-de-proceso/crear-rol-de-proceso/crear-rol-de-proceso').then(m => m.CrearRolDeProceso) },
    { path: 'crear-usuario', component: RegistroUsuario},
    { path: 'crear-actividad', component: CrearActividad},
    { path: 'crear-proceso', component: RegistroProcesos},
    { path: 'mostrar-actividades', component: MostrarActividades},
    { path: '**', redirectTo: '' },

];
