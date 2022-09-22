
import { Component, OnInit, Output, EventEmitter, } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { ShareService } from '../share.service'


@Component({
  selector: 'app-contractmodification',
  templateUrl: './contractmodification.component.html',
  styleUrls: ['./contractmodification.component.scss']
})
export class ContractmodificationComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  constructor(private shareService: ShareService,
    private fb: FormBuilder) { }
  modificationdata: any;
  data = {}
  contractform: FormGroup;
  ngOnInit(): void {
    this.modificationdata = this.shareService.modification_data.value;

    this.contractform = this.fb.group({
      service: [this.modificationdata.new_data.service],
      name: [this.modificationdata.new_data.name],
      remarks: [this.modificationdata.new_data.remarks]

    })







  }
  Cancel() {
    this.onCancel.emit()
  }

}
