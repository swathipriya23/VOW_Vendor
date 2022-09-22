import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../../Master/share.service'
import { masterService } from '../master.service'

@Component({
  selector: 'app-ccbs-edit',
  templateUrl: './ccbs-edit.component.html',
  styleUrls: ['./ccbs-edit.component.scss']
})
export class CcbsEditComponent implements OnInit {
  ccbsMappingEditForm: FormGroup;
  costCentreList: Array<any>;
  businessSegmentList: Array<any>;
  
  constructor(private shareService: ShareService, private router:Router,
    private fb: FormBuilder,private dataService: masterService) { }

  ngOnInit(): void {
    this.ccbsMappingEditForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      no: ['', Validators.required],
      glno: ['', Validators.required],
      costcentre: ['', Validators.required],
      businesssegment: ['', Validators.required],
      description: ['', Validators.required],
      remarks: ['', Validators.required]
    })
    this.getCostCentre();
    this.getBusinessSegment();
    this.getCCBSMappingEdit();
   
    
  }

getCCBSMappingEdit() {
  let data:any = this.shareService.ccbsMappingEditValue.value;
  // console.log("ccbsmappingEDITvAUE", data)
  let Code = data.code
  let Name = data.name
  let No = data.no
  let Glno = data.glno
  let costcentre = data["costcentre"];
  let id = costcentre['id'];
  let name = costcentre['name']
  let ids = id
  let businesssegment = data["businesssegment"];
  let id1 = businesssegment['id'];
  let name1 = businesssegment['name']
  let ids1 = id1
  let Description = data.description
  let Remarks = data.remarks
  this.ccbsMappingEditForm.patchValue({
    "code":Code,
    "name":Name,
    "no":No,
    "glno":Glno,
    "costcentre":ids,
    "businesssegment":ids1,
    "description":Description,
    "remarks":Remarks
  })
  // console.log("ccbs", this.shareService.ccbsMappingEditValue.value)

}

private getCostCentre() {
  this.dataService.getCostCentre()
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.costCentreList = datas;
      // console.log("ccEdit",datas)

    })
}
private getBusinessSegment() {
  this.dataService.getBusinessSegment()
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.businessSegmentList = datas;
      // console.log("bsEdit",datas)

    })
}
submitForm(){
  let data:any=this.shareService.ccbsMappingEditValue.value
  this.dataService.ccbsMappingEditForm(this.ccbsMappingEditForm.value,data.id)
  .subscribe(result => {
    this.router.navigate(['/employeeSummary'], { skipLocationChange: true })
    return true

  })
  
}
kyenbdata(event:any){
  let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
  console.log(d.test(event.key))
  if(d.test(event.key)==true){
    return false;
  }
  return true;
}

}
