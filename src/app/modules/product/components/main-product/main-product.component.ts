import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-product',
  templateUrl: './main-product.component.html',
  styleUrls: ['./main-product.component.css']
})
export class MainProductComponent implements OnInit {

  issidebar: boolean;
  sidebarSpacing: string;

  constructor() { }

  ngOnInit() {
  }

  updatedsidebarOnSubmit(sidebar: boolean): void {
    this.issidebar = sidebar;
  }

  onToggleSidebar(sidebarState) {
    if (sidebarState === 'open') {
      this.sidebarSpacing = 'contracted';
    } else {
      this.sidebarSpacing = 'expanded';
    }
  }
}
