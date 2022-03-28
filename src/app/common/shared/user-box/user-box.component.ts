import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.css']
})
export class UserBoxComponent implements OnInit {

  ngOnInit() {
  }

  constructor(private router: Router) {
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('userprofile');
    this.router.navigateByUrl('account/login');
  }
}
