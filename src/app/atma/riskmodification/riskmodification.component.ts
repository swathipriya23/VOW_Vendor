import { Component, OnInit, Output, EventEmitter, } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { ShareService } from '../share.service'
import {AtmaService} from '../atma.service';

@Component({
  selector: 'app-riskmodification',
  templateUrl: './riskmodification.component.html',
  styleUrls: ['./riskmodification.component.scss']
})
export class RiskmodificationComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  modificationdata: any;
  constructor(private shareService: ShareService,private atmaService:AtmaService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    
    this.modificationdata = this.shareService.modification_data.value;
  }

  Cancel() {
    this.onCancel.emit()
  }

}
