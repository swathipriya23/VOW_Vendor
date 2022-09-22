import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../../Master/share.service'
import { masterService } from '../master.service'

@Component({
  selector: 'app-hierarchy-edit',
  templateUrl: './hierarchy-edit.component.html',
  styleUrls: ['./hierarchy-edit.component.scss']
})
export class HierarchyEditComponent implements OnInit {
  hierarchyEditForm: FormGroup;

  constructor(private shareService: ShareService, private router:Router,
    private fb: FormBuilder,private dataService: masterService) { }

  ngOnInit(): void {
    this.hierarchyEditForm = this.fb.group({
      layer: ['', Validators.required],
      order: ['', Validators.required],
      remarks: ['', Validators.required],
      flag: ['', Validators.required]
    })
    this.getHierarchyEdit();
  }
  getHierarchyEdit() {
    let data:any = this.shareService.hierarchyEditValue.value;
    // console.log("hierarchyEDITvAUE", data)
    let Layer = data.layer
    let Order = data.order
    let Remarks = data.remarks
    let Flag = data.flag
    
    this.hierarchyEditForm.patchValue({
      layer:Layer,
      order:Order,
      remarks:Remarks,
      flag:Flag   
    })

  }

  submitForm(){
    let data:any=this.shareService.hierarchyEditValue.value
    this.dataService.hierarchyEditForm(this.hierarchyEditForm.value,data.id)
    .subscribe(result => {
      this.router.navigate(['/employeeSummary'], { skipLocationChange: true })
      return true

    }
    )
    
  }

}
