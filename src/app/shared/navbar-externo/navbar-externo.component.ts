import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar-externo',
  templateUrl: './navbar-externo.component.html',
  styleUrls: ['./navbar-externo.component.css']
})
export class NavbarExternoComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    
  }
  isActive(route: string): boolean {
    return window.location.pathname.endsWith(route);
  }
}


