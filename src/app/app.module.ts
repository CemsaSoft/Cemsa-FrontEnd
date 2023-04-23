import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConsultarServicioComponent } from './pages/consultar-servicio/consultar-servicio.component';
import { ModalComponent } from './shared/modal/modal.component';
import { SortDirective } from './shared/others/directive/sort.directive';

@NgModule({
  //Componentes que va a utilizar el módulo
  declarations: [
    AppComponent,
    ConsultarServicioComponent,
    ModalComponent,
    SortDirective,
  ],
  //Para importar otros módulos de angular
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  // Inyección de dependencias
  providers: [],
  bootstrap: [AppComponent] //Indicamos aquí el Componente principal de donde empezará la aplicación
})
export class AppModule { }
