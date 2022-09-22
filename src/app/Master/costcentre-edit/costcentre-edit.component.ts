import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../../Master/share.service'
import { masterService } from '../master.service'

@Component({
  selector: 'app-costcentre-edit',
  templateUrl: './costcentre-edit.component.html',
  styleUrls: ['./costcentre-edit.component.scss']
})
export class CostcentreEditComponent implements OnInit {
  costCentreEditForm: FormGroup;

  constructor(private shareService: ShareService, private router:Router,
    private fb: FormBuilder,private dataService: masterService) { }

  ngOnInit(): void {
    this.costCentreEditForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      no: ['', Validators.required],
      description: ['', Validators.required],
      remarks: ['', Validators.required]
    })
    this.getCostCentreEdit();
  }
  getCostCentreEdit() {
    let data:any = this.shareService.costCentreEditValue.value;
    // console.log("costcentreEDITvAUE", data)
    let Code = data.code
    let Name = data.name
    let No = data.no
    let Description = data.description
    let Remarks = data.remarks
    this.costCentreEditForm.patchValue({
      code:Code,
      name:Name,
      no:No,
      description:Description,
      remarks:Remarks
    })

  }

  submitForm(){
    let data:any=this.shareService.costCentreEditValue.value
    this.dataService.costCentreEditForm(this.costCentreEditForm.value,data.id)
    .subscribe(result => {
      this.router.navigate(['/employeeSummary'], { skipLocationChange: true })
      return true

    }
    )
    
  }

}
