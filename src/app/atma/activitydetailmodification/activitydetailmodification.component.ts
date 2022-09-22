import { Component, OnInit, Output, EventEmitter, } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { ShareService } from '../share.service'
@Component({
  selector: 'app-activitydetailmodification',
  templateUrl: './activitydetailmodification.component.html',
  styleUrls: ['./activitydetailmodification.component.scss']
})
export class ActivitydetailmodificationComponent implements OnInit {

  
  @Output() onCancel = new EventEmitter<any>();
  constructor(private shareService: ShareService,
  private fb: FormBuilder) { }
  modificationdata: any;
  data = {}


  ngOnInit(): void {
    this.modificationdata = this.shareService.modification_data.value;

  }
  Cancel() {
    this.onCancel.emit()
  }}
