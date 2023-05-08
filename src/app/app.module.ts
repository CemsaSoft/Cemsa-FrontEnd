import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConsultarServicioComponent } from './pages/consultar-servicio/consultar-servicio.component';
import { ModalComponent } from './shared/modal/modal.component';
import { SortDirective } from './shared/others/directive/sort.directive';
import { ConsultarCentralComponent } from './pages/consultar-central/consultar-central.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CarouselComponent } from './shared/carousel/carousel.component';
import { HomeComponent } from './pages/home/home.component';
import { ModificarCentralComponent } from './pages/modificar-central/modificar-central.component';
import { ConsultarClienteComponent } from './pages/consultar-cliente/consultar-cliente.component';
import { MenuComponent } from './shared/menu/menu.component';
import { RegistrarCentralComponent } from './pages/registrar-central/registrar-central.component';
import { IngresarUsuarioComponent } from './pages/ingresar-usuario/ingresar-usuario.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './core/interceptors/auth-interceptor.service';
//import { TextMaskModule } from 'angular2-text-mask';// npm i angular2-text-mask
@NgModule({
  //Componentes que va a utilizar el módulo
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent, 
    MenuComponent,
    CarouselComponent,
    ModalComponent,
    SortDirective,
    ConsultarCentralComponent,
    ConsultarServicioComponent,
    ModificarCentralComponent, 
    RegistrarCentralComponent,
    ConsultarClienteComponent, 
    IngresarUsuarioComponent,
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
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    }
  ],
  bootstrap: [AppComponent] //Indicamos aquí el Componente principal de donde empezará la aplicación
})
export class AppModule { }
