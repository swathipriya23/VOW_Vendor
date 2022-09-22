import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { ShareService } from '../share.service'

@Component({
  selector: 'app-vendormodification',
  templateUrl: './vendormodification.component.html',
  styleUrls: ['./vendormodification.component.scss']
})
export class VendormodificationComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  constructor(private shareService: ShareService,
    private fb: FormBuilder) { }
    modificationdata: any;
    directorNameListold:any;
    directorNameListnew:any;
    // newdirectorname = [];
    // olddirectorname = [];

  ngOnInit(): void {
    this.modificationdata = this.shareService.modification_data.value;
    console.log("vendor-modification",this.modificationdata)
    this.directorNameListnew=this.modificationdata.new_data.director;
    this.directorNameListold=this.modificationdata.old_data.director;
  }

  Cancel() {
    this.onCancel.emit()
  }

}
