import { ShareService } from '../share.service'
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { DataService } from '../inward.service'
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { NotificationService } from '../notification.service'

@Component({
  selector: 'app-courier-edit',
  templateUrl: './courier-edit.component.html',
  styleUrls: ['./courier-edit.component.css']
})
export class CourierEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  courierEditForm: FormGroup;
  pinCodeList: Array<any>;
  cityList: Array<any>;
  stateList: Array<any>;
  districtList: Array<any>;
  designationList: Array<any>;
  contactTypeList: Array<any>;
  constructor(private shareService: ShareService, private router: Router,
    private notification: NotificationService,
    private dataService: DataService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.courierEditForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      type: ['', Validators.required],
      contactperson: ['', Validators.required],

      address: this.fb.group({
        line1: ['', Validators.required],
        pincode_id: ['', Validators.required],
        city_id: ['', Validators.required],
        district_id: ['', Validators.required],
        state_id: ['', Validators.required],
        line2: ['', Validators.required],
        line3: ['', Validators.required],
      }),

      contact: this.fb.group({
        designation_id: ['', Validators.required],
        email: ['', Validators.required],
        landline: ['', Validators.required],
        landline2: ['', Validators.required],
        mobile: ['', Validators.required],
        mobile2: ['', Validators.required],
        name: ['', Validators.required],
        type_id: ['', Validators.required],

      }),
    })




    this.getCourierEdit();
    this.getPinCode();
    this.getCity();
    this.getDistrict();
    this.getState();
    this.getDesignation();
    this.getContactType();
  }






  getCourierEdit() {
    let id = this.shareService.courierEdit.value;
    this.dataService.getCourierEdit(id)
      .subscribe((results: any) => {
        // console.log("EDit.............", results)
        let datas = results
        let Code = results?.code;
        let Name = results?.name;
        let Type = results?.type;
        let contactPerson = results?.contactperson;
        let Address = results?.address_id;
        let Line = Address?.line1;
        let pinCode = Address?.pincode_id?.id;
        let City = Address?.city_id?.id;
        let State = Address?.state_id?.id;
        let District = Address?.district_id?.id;
        let addressLandLine2 = Address?.line2;
        let addressLandLine3 = Address?.line3;
        let Contact = results?.contact_id;
        let Designation = Contact?.designation_id;
        let contactType = Contact?.type_id;
        let contactName = Contact?.name;
        let Email = Contact?.email;
        let landline1 = Contact?.landline;
        let landline2 = Contact?.landline2;
        let mobileNo1 = Contact?.mobile;
        let mobileNo2 = Contact?.mobile2
        this.courierEditForm.patchValue({
          code: Code,
          name: Name,
          type: Type,
          contactperson: contactPerson,
          address: {
            line1: Line,
            pincode_id: pinCode,
            city_id: City,
            state_id: State,
            district_id: District,
            line2: addressLandLine2,
            line3: addressLandLine3,
          },
          contact: {
            designation_id: Designation,
            type_id: contactType,
            name: contactName,
            email: Email,
            landline: landline1,
            landline2: landline2,
            mobile: mobileNo1,
            mobile2: mobileNo2
          }
        })
      })
  }

  private getPinCode() {
    this.dataService.getPinCode()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;
      })
  }


  private getCity() {
    this.dataService.getCity()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
      })
  }
  private getState() {
    this.dataService.getState()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
      })
  }
  private getDistrict() {
    this.dataService.getDistrict()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;
      })
  }
  private getDesignation() {
    this.dataService.getDesignation()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.designationList = datas;
      })
  }
  private getContactType() {
    this.dataService.getContactType()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.contactTypeList = datas;
      })
  }




  editCourierForm() {
    let idValue: any = this.shareService.courierEdit.value
    let data = this.courierEditForm.value
    this.dataService.editCourierForm(data, idValue.id)
      .subscribe(res => {
        this.notification.showSuccess("Updated Successfully!...")
        this.onSubmit.emit();
        // console.log("Res>>>>>>>>>>>>>>", res)
        return true
      })
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  onCancelClick() {
    this.onCancel.emit()
  }

}
