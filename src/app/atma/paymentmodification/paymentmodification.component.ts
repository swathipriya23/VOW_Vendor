
import { Component, OnInit, Output, EventEmitter, } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { ShareService } from '../share.service'
@Component({
  selector: 'app-paymentmodification',
  templateUrl: './paymentmodification.component.html',
  styleUrls: ['./paymentmodification.component.scss']
})
export class PaymentmodificationComponent implements OnInit {


  @Output() onCancel = new EventEmitter<any>();
  constructor(private shareService: ShareService,
    private fb: FormBuilder) { }
  modificationdata: any;
  data = {}
  branchPayment: FormGroup;
  ngOnInit(): void {
    this.modificationdata = this.shareService.modification_data.value;
    this.branchPayment = this.fb.group({
      supplier: [this.modificationdata.new_data.supplier],
      paymode_id: [this.modificationdata.new_data.paymode_id.name],
      bank_id: [this.modificationdata.new_data.bank_id.name],
      branch_id: [this.modificationdata.new_data.branch_id.name],
      account_type: [this.modificationdata.new_data.account_type],
      beneficiary: [this.modificationdata.new_data.beneficiary],
      account_no: [this.modificationdata.new_data.account_no],
      remarks: [this.modificationdata.new_data.remarks],
     })

      this.branchPayment.disable()
  }
  Cancel() {
    this.onCancel.emit()
  }

}
