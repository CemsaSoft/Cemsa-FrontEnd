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
import { MenuAdminComponent } from './shared/menu-admin/menu-admin.component';
import { RegistrarCentralComponent } from './pages/registrar-central/registrar-central.component';
import { IngresarUsuarioComponent } from './pages/ingresar-usuario/ingresar-usuario.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './core/interceptors/auth-interceptor.service';
import { RegistrarClienteComponent } from './pages/registrar-cliente/registrar-cliente.component';
import { MenuClienteComponent } from './shared/menu-cliente/menu-cliente.component';
import { ConsultarFumigacionesComponent } from './pages/consultar-fumigaciones/consultar-fumigaciones.component';
import { MenuUsuarioComponent } from './shared/menu-usuario/menu-usuario.component';
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
import { OlvidoPasswordComponent } from './pages/olvido-password/olvido-password.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterInternoComponent } from './shared/footer-interno/footer-interno.component';
import { CardComponent } from './shared/card/card.component';
import { StepComponent } from './shared/step/step.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatStepperModule} from '@angular/material/stepper';
import { StepperComponent } from './shared/stepper/stepper.component';

import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SidebarClienteComponent } from './shared/sidebar-cliente/sidebar-cliente.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';

import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { NavbarExternoComponent } from './shared/navbar-externo/navbar-externo.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import {MatCardModule} from '@angular/material/card';
import {Component} from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDividerModule} from '@angular/material/divider';


//import { TextMaskModule } from 'angular2-text-mask';// npm i angular2-text-mask
@NgModule({
  //Componentes que va a utilizar el módulo
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent, 
    MenuAdminComponent,
    CarouselComponent,
    ModalComponent,
    SortDirective,
    ConsultarCentralComponent,
    ConsultarServicioComponent,
    ModificarCentralComponent, 
    RegistrarCentralComponent,
    ConsultarClienteComponent, 
    IngresarUsuarioComponent,
    RegistrarClienteComponent,
    MenuClienteComponent,
    ConsultarFumigacionesComponent,
    MenuUsuarioComponent,
    ModificarPasswordComponent,
    ConsultarCuentaComponent,
    ConsultarCentralesClienteComponent,
    ConsultarPanelesMonitoreoComponent,
    ConsultarMedicionesActualesComponent,
    RegistrarServicioComponent,
    ConsultarReportesComponent,
    RegistrarFumigacionComponent,
    RegistrarAlarmaConfigComponent,
    ConsultarAlarmaConfigComponent,
    ConsultarAlarmaComponent,
    OlvidoPasswordComponent,
    RegistrarServicioComponent,
    SidebarComponent,
    FooterInternoComponent,
    CardComponent,
    StepComponent,
    StepperComponent,
    SidebarClienteComponent,
    NavbarExternoComponent,
    LandingPageComponent,
  ],
  //Para importar otros módulos de angular
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTabsModule, 
    MatIconModule,
    MatGridListModule,
    MatSortModule,
    MatTableModule,
    MatBadgeModule,
    MatCardModule,
    MatDividerModule, 
    MatProgressBarModule,
  ],
  // Inyección de dependencias
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, // Cambia 'es-ES' por la configuración regional que desees
  ],  
  bootstrap: [AppComponent] //Indicamos aquí el Componente principal de donde empezará la aplicación
})
export class AppModule { }
