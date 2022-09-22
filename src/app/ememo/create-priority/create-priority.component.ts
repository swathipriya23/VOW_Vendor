import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { DataService } from '../../service/data.service'

@Component({
  selector: 'app-create-priority',
  templateUrl: './create-priority.component.html',
  styleUrls: ['./create-priority.component.scss']
})
export class CreatePriorityComponent implements OnInit {
  priorityAddForm: FormGroup;
 // @Output() onCancel = new EventEmitter<any>();
 // @Output() onSubmit = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder,private dataService: DataService,
    private router: Router) { }

  ngOnInit(): void {
    this.priorityAddForm = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required] 
    })
  }

  createFormat() {
    let data = this.priorityAddForm.controls;
    let objPriority = new Priority();
    objPriority.name = data['name'].value;
    objPriority.code = data['code'].value;
    // console.log("objPriority", objPriority)
    return objPriority;
  }
  submitForm() {
    this.dataService.createPriorityForm(this.createFormat())
      .subscribe(res => {
        // console.log("createpriorityform", res);
       // this.onSubmit.emit();
       this.router.navigate(['/ememo/memoMaster'], { skipLocationChange: true })
        return true
      }
      )
  }

  // onCancelClick() {
  //   this.onCancel.emit()
  // }

}
class Priority {
  code: string;
  name: string;

}