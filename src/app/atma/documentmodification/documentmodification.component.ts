import { Component, OnInit, Output, EventEmitter, } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { ShareService } from '../share.service'
import {AtmaService} from '../atma.service';
@Component({
  selector: 'app-documentmodification',
  templateUrl: './documentmodification.component.html',
  styleUrls: ['./documentmodification.component.scss']
})
export class DocumentmodificationComponent implements OnInit {

 
  @Output() onCancel = new EventEmitter<any>();
  constructor(private shareService: ShareService,private atmaService:AtmaService,
  private fb: FormBuilder) { }
  modificationdata: any;
  data = {}
 multifile=[]
 multifiles=[]


  ngOnInit(): void {
    this.modificationdata = this.shareService.modification_data.value;
    this.multifile=this.modificationdata.new_data.file_id;
    this.multifiles=this.modificationdata.old_data.file_id;
  }
  dataa(datas){
    let values=datas.id
    this.atmaService .downloadfile(values)
   }
  Cancel() {
    this.onCancel.emit()
  }

}
