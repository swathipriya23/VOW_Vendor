import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { DataService } from '../../service/data.service'
import { SharedService } from '../../service/shared.service'

@Component({
  selector: 'app-priority-edit',
  templateUrl: './priority-edit.component.html',
  styleUrls: ['./priority-edit.component.scss']
})
export class PriorityEditComponent implements OnInit {

  priorityEditForm: FormGroup;

  constructor(private sharedService: SharedService,private router:Router,private dataService: DataService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.priorityEditForm = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required]
  })
  this.getPriorityEdit();
  }
  getPriorityEdit() {
    let data:any = this.sharedService.priorityEditValue.value;
    // console.log("priorityEDITvAUE", data)
    let Code = data.code
    let Name = data.name
    this.priorityEditForm.patchValue({
      code:Code,
      name:Name
    })

  }
  submitForm(){
    let data:any=this.sharedService.priorityEditValue.value
    this.dataService.priorityEditForm(this.priorityEditForm.value,data.id)
    .subscribe(result => {
      this.router.navigate(['/ememo/memoMaster'], { skipLocationChange: true })
      return true

    }
    )
    
  }

}
