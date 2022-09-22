import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../../Master/share.service'
import { masterService } from '../../Master/master.service'

@Component({
  selector: 'app-designation-edit',
  templateUrl: './designation-edit.component.html',
  styleUrls: ['./designation-edit.component.scss']
})
export class DesignationEditComponent implements OnInit {
  designationEditForm: FormGroup;

  constructor(private shareService: ShareService, private router:Router,
    private fb: FormBuilder,private dataService: masterService) { }

  ngOnInit(): void {
    this.designationEditForm = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required]
  })
  this.getDesignationEdit();
  }
  getDesignationEdit() {
    let data:any = this.shareService.designationEditValue.value;
    // console.log("designationEDITvAUE", data)
    let Name = data.name
    let Code = data.code
    this.designationEditForm.patchValue({
      name:Name,
      code:Code
    })

  }
  submitForm(){
    let data:any=this.shareService.designationEditValue.value
    this.dataService.designationEditForm(this.designationEditForm.value,data.id)
    .subscribe(result => {
      this.router.navigate(['/employeeSummary'], { skipLocationChange: true })
      return true

    }
    )
    
  }

}
