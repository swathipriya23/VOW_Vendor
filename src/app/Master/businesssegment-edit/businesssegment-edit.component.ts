import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../../Master/share.service'
import { masterService } from '../master.service'

@Component({
  selector: 'app-businesssegment-edit',
  templateUrl: './businesssegment-edit.component.html',
  styleUrls: ['./businesssegment-edit.component.scss']
})
export class BusinesssegmentEditComponent implements OnInit {
  businessSegmentEditForm: FormGroup;

  constructor(private shareService: ShareService, private router:Router,
    private fb: FormBuilder,private dataService: masterService) { }

  ngOnInit(): void {
    this.businessSegmentEditForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      no: ['', Validators.required],
      description: ['', Validators.required],
      remarks: ['', Validators.required]
    })
    this.getBusinessSegmentEdit();
  }

  getBusinessSegmentEdit() {
    let data:any = this.shareService.businessSegmentEditValue.value;
    // console.log("businesssegmentEDITvAUE", data)
    let Code = data.code
    let Name = data.name
    let No = data.no
    let Description = data.description
    let Remarks = data.remarks
    this.businessSegmentEditForm.patchValue({
      code:Code,
      name:Name,
      no:No,
      description:Description,
      remarks:Remarks
    })

  }

  submitForm(){
    let data:any=this.shareService.businessSegmentEditValue.value
    this.dataService.businessSegmentEditForm(this.businessSegmentEditForm.value,data.id)
    .subscribe(result => {
      this.router.navigate(['/employeeSummary'], { skipLocationChange: true })
      return true

    }
    )
    
  }

}
