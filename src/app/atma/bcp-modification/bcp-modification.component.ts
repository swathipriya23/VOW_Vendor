import { Component, OnInit, Output, EventEmitter, } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { ShareService } from '../share.service'
import {AtmaService} from '../atma.service';

@Component({
  selector: 'app-bcp-modification',
  templateUrl: './bcp-modification.component.html',
  styleUrls: ['./bcp-modification.component.scss']
})
export class BcpModificationComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  modificationdata: any;
  bcpnewlist:any;
  bcpoldlist:any;
  
  constructor(private shareService: ShareService,private atmaService:AtmaService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    
    this.modificationdata = this.shareService.modification_bcp_data.value;
    console.log("bcp-modify",this.modificationdata)
    this.bcpnewlist = this.modificationdata.new_data.data
    this.bcpoldlist = this.modificationdata.old_data.data
  }

  Cancel() {
    this.onCancel.emit()
  }


}
