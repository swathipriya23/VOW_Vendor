import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { masterService } from '../master.service'

@Component({
  selector: 'app-create-hierarchy',
  templateUrl: './create-hierarchy.component.html',
  styleUrls: ['./create-hierarchy.component.scss']
})
export class CreateHierarchyComponent implements OnInit {
  AddForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private dataService: masterService,private router: Router) { }

  ngOnInit(): void {
    this.AddForm = this.formBuilder.group({
      layer: ['', Validators.required],
      order: ['', Validators.required],
      remarks: ['', Validators.required],
      flag: ['', Validators.required]
    })
  }
  createFormat() {
    let data = this.AddForm.controls;
    let objHierarchy = new HIERARCHY();
    objHierarchy.layer = data['layer'].value;
    objHierarchy.order = data['order'].value;
    objHierarchy.remarks = data['remarks'].value;
    objHierarchy.flag = data['flag'].value;
    // console.log("objHierarchy", objHierarchy)
    return objHierarchy;
  }


  submitForm() {
    this.dataService.createHierarchyForm(this.createFormat())
      .subscribe(res => {
        // console.log("createHierarchyForm", res);
        this.router.navigate(['/employeeSummary'], { skipLocationChange: true })
        return true
      }
      )
  }


}
class HIERARCHY {
  layer: string;
  name: string;
  order: any;
  remarks: string;
  flag: string;

}
