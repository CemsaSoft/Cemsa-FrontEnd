//SISTEMA
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//COMPONENTES
import { ConsultarServicioComponent } from './pages/consultar-servicio/consultar-servicio.component';
import { ConsultarCentralComponent} from './pages/consultar-central/consultar-central.component';
import { HomeComponent } from './pages/home/home.component';
import { ModificarCentralComponent } from './pages/modificar-central/modificar-central.component';
import { RegistrarCentralComponent } from './pages/registrar-central/registrar-central.component';
import { ConsultarClienteComponent } from './pages/consultar-cliente/consultar-cliente.component';
import { IngresarUsuarioComponent } from './pages/ingresar-usuario/ingresar-usuario.component';
import { OlvidoPasswordComponent } from './pages/olvido-password/olvido-password.component';
import { RouteguardsGuard } from './routeguards.guard';
import { RegistrarClienteComponent } from './pages/registrar-cliente/registrar-cliente.component';
import { ConsultarFumigacionesComponent } from './pages/consultar-fumigaciones/consultar-fumigaciones.component';
import { ModificarPasswordComponent } from './pages/modificar-password/modificar-password.component';
import { ConsultarCuentaComponent } from './pages/consultar-cuenta/consultar-cuenta.component';
import { ConsultarCentralesClienteComponent } from './pages/consultar-centrales-cliente/consultar-centrales-cliente.component';
import { ConsultarPanelesMonitoreoComponent } from './pages/consultar-paneles-monitoreo/consultar-paneles-monitoreo.component';
import { ConsultarMedicionesActualesComponent } from './pages/consultar-mediciones-actuales/consultar-mediciones-actuales.component';
import { RegistrarServicioComponent } from './pages/registrar-servicio/registrar-servicio.component';
import { ConsultarReportesComponent } from './pages/consultar-reportes/consultar-reportes.component';
import { RegistrarFumigacionComponent } from './pages/registrar-fumigacion/registrar-fumigacion.component';
import { RegistrarAlarmaConfigComponent } from './pages/registrar-alarma-config/registrar-alarma-config.component';
import { ConsultarAlarmaConfigComponent } from './pages/consultar-alarma-config/consultar-alarma-config.component';
import { ConsultarAlarmaComponent } from './pages/consultar-alarma/consultar-alarma.component';
import { NoLoginGuard } from './nologuin.guard';

//RUTAS
let routes: Routes = [];

if (localStorage.getItem('rol') === '1') 
{
   //Aquí configuramos las rutas, indicamos en el path la ruta, seguido de los componentes que mostrará esa ruta
   routes = [
   
    {path: '', component: IngresarUsuarioComponent},
    {path:'olvido-password', component: OlvidoPasswordComponent},    
    {path:'home', component: HomeComponent, canActivate: [RouteguardsGuard]},
    {path:'consultar-servicio', component: ConsultarServicioComponent, canActivate: [RouteguardsGuard]},
    {path:'registrar-servicio', component: RegistrarServicioComponent, canActivate: [RouteguardsGuard]},
    {path:'consultar-central', component: ConsultarCentralComponent, canActivate: [RouteguardsGuard]},
    {path:'modificar-central', component: ModificarCentralComponent, canActivate: [RouteguardsGuard]},
    {path:'registrar-central', component: RegistrarCentralComponent, canActivate: [RouteguardsGuard]},
    {path:'consultar-cliente', component: ConsultarClienteComponent, canActivate: [RouteguardsGuard]},
    {path:'registrar-cliente', component: RegistrarClienteComponent, canActivate: [RouteguardsGuard]},
    {path:'modificar-password', component: ModificarPasswordComponent, canActivate: [RouteguardsGuard]},
    {path:'consultar-cuenta', component: ConsultarCuentaComponent, canActivate: [RouteguardsGuard]},

    {path: '', redirectTo: '/', pathMatch:'full'},
    {path:'**', redirectTo: '/', pathMatch:'full'},
  ];
} else 
{
    routes = [
      //Aquí configuramos las rutas, indicamos en el path la ruta, seguido de los componentes que mostrará esa ruta
      {path:'home', component: HomeComponent, canActivate: [RouteguardsGuard ]},
      {path:'consultar-fumigaciones', component: ConsultarFumigacionesComponent, canActivate: [RouteguardsGuard]},
      {path:'registrar-fumigaciones', component: RegistrarFumigacionComponent, canActivate: [RouteguardsGuard]},
      {path:'modificar-password', component: ModificarPasswordComponent, canActivate: [RouteguardsGuard]},
      {path:'consultar-cuenta', component: ConsultarCuentaComponent, canActivate: [RouteguardsGuard]},
      {path:'consultar-central-cliente', component: ConsultarCentralesClienteComponent, canActivate: [RouteguardsGuard]},
      {path:'consultar-paneles-monitoreo', component: ConsultarPanelesMonitoreoComponent, canActivate: [RouteguardsGuard]},
      {path:'consultar-mediciones-actuales', component: ConsultarMedicionesActualesComponent, canActivate: [RouteguardsGuard]},
      {path:'consultar-reportes', component: ConsultarReportesComponent, canActivate: [RouteguardsGuard]},
      {path:'consultar-alarma-config', component: ConsultarAlarmaConfigComponent, canActivate: [RouteguardsGuard]},
      {path:'registrar-alarma-config', component: RegistrarAlarmaConfigComponent, canActivate: [RouteguardsGuard]},
      {path:'consultar-alarma', component: ConsultarAlarmaComponent, canActivate: [RouteguardsGuard]},
  
      {path: '', component: IngresarUsuarioComponent},
      {path: 'olvido-password', component: OlvidoPasswordComponent},    
      {path: '', redirectTo: '/', pathMatch:'full'},
      {path:'**', redirectTo: '/', pathMatch:'full'},
    ];
}
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
