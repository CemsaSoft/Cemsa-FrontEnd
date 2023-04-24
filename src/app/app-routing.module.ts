import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarServicioComponent } from './pages/consultar-servicio/consultar-servicio.component';
import { ConsultarCentralComponent} from './pages/consultar-central/consultar-central.component';

const routes: Routes = [
  //Aquí configuramos las rutas, indicamos en el path la ruta, seguido de los componentes que mostrará esa ruta
  // {path:'home', component: ConsultarServicioComponent},
  {path: 'consultar-servicio', component: ConsultarServicioComponent},
  {path: 'consultar-central', component: ConsultarCentralComponent},
  // {path: '', redirectTo: '/home', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
