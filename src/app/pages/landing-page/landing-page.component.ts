import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
// declare const Particles: any; 
declare const $: any;
// Inicialización de la página de navegación
class NavigationPage {
  currentId: string | null = null; // Propiedad definida aquí
  currentTab: any = null; // Propiedad para currentTab
  tabContainerHeight = 70;
  lastScroll = 0;
  constructor() {
    // this.currentId = null;
    // this.currentTab = null;
    // this.tabContainerHeight = 70;
    // this.lastScroll = 0;
    let self = this;
    $(".nav-tab").click((event: Event) => { // Usar una función de flecha aquí
      self.onTabClick(event, $(this));
    });
    $(window).scroll(() => {
      this.onScroll();
    });
    $(window).resize(() => {
      this.onResize();
    });
  }

  onTabClick(event: Event, element: any) {
    event.preventDefault();
    let scrollTop =
      $(element.attr("href")).offset().top - this.tabContainerHeight + 1;
    $("html, body").animate({ scrollTop: scrollTop }, 600);
  }

  onScroll() {
    this.checkHeaderPosition();
    this.findCurrentTabSelector(this.currentTab); // Elimina el argumento 'element' aquí
    this.lastScroll = $(window).scrollTop();
  }

  onResize() {
    if (this.currentId) {
      this.setSliderCss();
    }
  }

  checkHeaderPosition() {
    const headerHeight = 75;
    if ($(window).scrollTop() > headerHeight) {
      $(".nav-container").addClass("nav-container--scrolled");
    } else {
      $(".nav-container").removeClass("nav-container--scrolled");
    }
    let offset =
      $(".nav").offset().top +
      $(".nav").height() -
      this.tabContainerHeight -
      headerHeight;
    if (
      $(window).scrollTop() > this.lastScroll &&
      $(window).scrollTop() > offset
    ) {
      $(".nav-container").addClass("nav-container--move-up");
      $(".nav-container").removeClass("nav-container--top-first");
      $(".nav-container").addClass("nav-container--top-second");
    } else if (
      $(window).scrollTop() < this.lastScroll &&
      $(window).scrollTop() > offset
    ) {
      $(".nav-container").removeClass("nav-container--move-up");
      $(".nav-container").removeClass("nav-container--top-second");
      $(".nav-container-container").addClass("nav-container--top-first");
    } else {
      $(".nav-container").removeClass("nav-container--move-up");
      $(".nav-container").removeClass("nav-container--top-first");
      $(".nav-container").removeClass("nav-container--top-second");
    }
  }

  findCurrentTabSelector(element: any) {
    let newCurrentId = null;
    let newCurrentTab;
    // let self = this;
    // $(".nav-tab").each((index: number, tab: any) => {
    //   let id = $(tab).attr("href");
    //   let offsetTop = $(id).offset().top - this.tabContainerHeight;
    //   let offsetBottom =
    //     $(id).offset().top + $(id).height() - this.tabContainerHeight;
    //   if (
    //     $(window).scrollTop() > offsetTop &&
    //     $(window).scrollTop() < offsetBottom
    //   ) {
    //     newCurrentId = id;
    //     newCurrentTab = $(tab);
    //   }
    // });
  
    if (this.currentId != newCurrentId || this.currentId === null) {
      this.currentId = newCurrentId;
      this.currentTab = newCurrentTab;
      this.setSliderCss();
    }
  }

  setSliderCss() {
    let width = 0;
    let left = 0;
    if (this.currentTab) {
      width = this.currentTab.css("width");
      left = this.currentTab.offset().left;
    }
    $(".nav-tab-slider").css("width", width);
    $(".nav-tab-slider").css("left", left);
  }
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  currentId : any;
  constructor(private router: Router) { }
  ngOnInit() {
    // Inicialización de Particles
//     const particles = Particles.init({
//       selector: ".background",
//       color: ["#03dac6", "#ff0266", "#000000"],
//   connectParticles: true,
//   responsive: [
//     {
//       breakpoint: 768,
//       options: {
//         color: ["#faebd7", "#03dac6", "#ff0266"],
//         maxParticles: 43,
//         connectParticles: false
//       }
//     }
//   ]
// });
    
    // new NavigationPage();
  }
  // @HostListener('window:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     this.router.navigate(['/ingresar-usuario']);
  //   }
  // }
}