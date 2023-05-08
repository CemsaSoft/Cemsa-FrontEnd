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
import { RouteguardsGuard } from './routeguards.guard';
import { RegistrarClienteComponent } from './pages/registrar-cliente/registrar-cliente.component';

//RUTAS
const routes: Routes = [
  //Aquí configuramos las rutas, indicamos en el path la ruta, seguido de los componentes que mostrará esa ruta
  {path: '', component: IngresarUsuarioComponent},
  {path:'home', component: HomeComponent, canActivate: [RouteguardsGuard]},
  {path:'consultar-servicio', component: ConsultarServicioComponent, canActivate: [RouteguardsGuard]},
  {path:'consultar-central', component: ConsultarCentralComponent, canActivate: [RouteguardsGuard]},
  {path:'modificar-central', component: ModificarCentralComponent, canActivate: [RouteguardsGuard]},
  {path:'registrar-central', component: RegistrarCentralComponent, canActivate: [RouteguardsGuard]},
  {path:'consultar-cliente', component: ConsultarClienteComponent, canActivate: [RouteguardsGuard]},
  {path:'registrar-cliente', component: RegistrarClienteComponent, canActivate: [RouteguardsGuard]},
  {path:'', redirectTo: '/', pathMatch:'full'},
  {path:'**', redirectTo: '/', pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
