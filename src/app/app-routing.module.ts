import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarServicioComponent } from './pages/consultar-servicio/consultar-servicio.component';

const routes: Routes = [
  //Aquí configuramos las rutas, indicamos en el path la ruta, seguido de los componentes que mostrará esa ruta
  // {path:'home', component: ConsultarServicioComponent},
  {path: 'consultar-servicio', component: ConsultarServicioComponent},
  // {path: '', redirectTo: '/home', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
