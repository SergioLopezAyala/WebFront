import { Routes } from '@angular/router';
import { RegistroUsuario } from './autenticacion-y-cuentas/registro-usuario/registro-usuario';
import { CrearActividad } from './gestion-de-actividades/crear-actividad/crear-actividad';
import { RegistroProcesos } from './registro-procesos/registro-procesos';
import { MostrarActividades } from './gestion-de-actividades/mostrar-actividades/mostrar-actividades';
import { HomeScreen } from './home-screen/home-screen/home-screen';
import { ModificarActividad } from './gestion-de-actividades/modificar-actividad/modificar-actividad';

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
    { path: 'home', component: HomeScreen},
    { path: 'modificar-actividad', component: ModificarActividad},
    { path: 'eliminar-actividad', loadComponent: () => import('./gestion-de-actividades/eliminar-actividad/eliminar-actividad').then(m => m.EliminarActividad) },
    {path: 'consultar-actividad',loadComponent: () => import('./gestion-de-actividades/consultar-actividad/consultar-actividad').then(m => m.ConsultarActividad)},
    {path: 'crear-actividad',loadComponent: () => import('./gestion-de-actividades/crear-actividad/crear-actividad').then(m => m.CrearActividad)},
    { path: '**', redirectTo: '' },

];
