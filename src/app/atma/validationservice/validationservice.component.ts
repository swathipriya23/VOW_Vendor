import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-validationservice',
  templateUrl: './validationservice.component.html',
  styleUrls: ['./validationservice.component.scss']
})
export class ValidationserviceComponent implements OnInit {
  

  constructor() {



   }

  ngOnInit(): void {
  }
  // / Only AlphaNumeric
  keyPressAlphaNumeric(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}
