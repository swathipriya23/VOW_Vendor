import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  srcUrl: string = "https://sts.northernarc.com/adfs/oauth2/logout";
  counter = 0;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setIntrvl();
  }
  setIntrvl() {
    setInterval(() => this.startGame2(), 1000);
  }
  startGame2() {
    this.counter = this.counter + 1;
    if (this.counter === 10) {
      this.router.navigateByUrl('/loginlogo');
    }
  }
}


