import { Component, OnInit,Input } from '@angular/core';

import {NgbActiveModal, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-confirmnotification',
  templateUrl: './confirmnotification.component.html',
  styleUrls: ['./confirmnotification.component.scss']
})
export class ConfirmnotificationComponent implements OnInit {

  
  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}
