import { Component, OnInit, Output, EventEmitter, } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { ShareService } from '../share.service'

@Component({
  selector: 'app-branchmodification',
  templateUrl: './branchmodification.component.html',
  styleUrls: ['./branchmodification.component.scss']
})
export class BranchmodificationComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  constructor(private shareService: ShareService,
    private fb: FormBuilder) { }
  modificationdata: any;
  data = {}
  branchForm: FormGroup;
  ngOnInit(): void {
    this.modificationdata = this.shareService.modification_data.value;

    // this.branchForm = this.fb.group({
    //   name: [this.modificationdata.new_data.name],
    //   remarks: [this.modificationdata.new_data.remarks ],
    //   limitdays: [this.modificationdata.new_data.limitdays],
    //   creditterms: [this.modificationdata.new_data.creditterms],
    //   panno: [this.modificationdata.new_data.panno],
    //   gstno: [this.modificationdata.new_data.gstno],
    //   address: this.fb.group({
    //     line1: [this.modificationdata.new_data.address_id.line1,],
    //     pincode_id: [this.modificationdata.new_data.address_id.pincode_id.no,],
    //     city_id: [this.modificationdata.new_data.address_id.city_id.name,],
    //     district_id: [this.modificationdata.new_data.address_id.district_id.name,],
    //     state_id: [this.modificationdata.new_data.address_id.state_id.name,],
    //     line2: [this.modificationdata.new_data.address_id.line2,],
    //     line3: [this.modificationdata.new_data.address_id.line3,],
    //   }),
    //   contact: this.fb.group({
    //     designation_id: [this.modificationdata.new_data.contact_id.designation_id.name],
    //     email: [this.modificationdata.new_data.contact_id.email],
    //     landline: [this.modificationdata.new_data.contact_id.landline],
    //     landline2: [this.modificationdata.new_data.contact_id.landline2 ],
    //     mobile: [this.modificationdata.new_data.contact_id.mobile],
    //     mobile2: [this.modificationdata.new_data.contact_id.mobile2],
    //     name: [this.modificationdata.new_data.contact_id.name],
    //     dob: [this.modificationdata.new_data.contact_id.dob],
    //     wedding_date: [this.modificationdata.new_data.contact_id.wedding_date],
    //     type_id: [this.modificationdata.new_data.contact_id.type_id.name],

    //   }),})

      // this.branchForm.disable()



    


  }
  Cancel() {
    this.onCancel.emit()
  }

}
