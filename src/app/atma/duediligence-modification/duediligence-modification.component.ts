import { Component, OnInit, Output, EventEmitter, } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { ShareService } from '../share.service'
import {AtmaService} from '../atma.service';

@Component({
  selector: 'app-duediligence-modification',
  templateUrl: './duediligence-modification.component.html',
  styleUrls: ['./duediligence-modification.component.scss']
})
export class DuediligenceModificationComponent implements OnInit {
 

  @Output() onCancel = new EventEmitter<any>();
  modificationdata: any;
  duenewlist:any;
  dueoldlist:any;


  constructor(private shareService: ShareService,private atmaService:AtmaService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    
    this.modificationdata = this.shareService.modification_due_data.value;
    console.log("due-modify",this.modificationdata)
    this.duenewlist = this.modificationdata.new_data.data
    this.dueoldlist = this.modificationdata.old_data.data
  }

  

  Cancel() {
    this.onCancel.emit()
  }

}
