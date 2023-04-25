//SISTEMA
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//COMPONENTES
import { ConsultarServicioComponent } from './pages/consultar-servicio/consultar-servicio.component';
import { ConsultarCentralComponent} from './pages/consultar-central/consultar-central.component';
import { HomeComponent } from './pages/home/home.component';

//RUTAS
const routes: Routes = [
  //Aquí configuramos las rutas, indicamos en el path la ruta, seguido de los componentes que mostrará esa ruta
  {path:'', component: HomeComponent},
  {path:'home', component: HomeComponent},
  {path:'consultar-servicio', component: ConsultarServicioComponent},
  {path:'consultar-central', component: ConsultarCentralComponent},
  {path:'', redirectTo: '/', pathMatch:'full'},
  {path:'**', redirectTo: '/', pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
