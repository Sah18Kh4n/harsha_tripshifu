import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {

  @Input() onboarding: string;

  constructor() { }

  ngOnInit() {
  }

}
