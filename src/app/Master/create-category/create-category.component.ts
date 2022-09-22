import { Component, OnInit, ViewChild, ElementRef ,Output,EventEmitter} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators,FormArray } from '@angular/forms';
import { from, Observable, fromEvent } from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {MemoService, Department} from "../../service/memo.service";
import { Router } from '@angular/router'
import {MatAutocompleteSelectedEvent,  MatAutocomplete,MatAutocompleteTrigger} from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize } from 'rxjs/operators';
import { NotificationService } from "../../service/notification.service"


@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit {
  @Output() onCancel =new EventEmitter();
  @Output() onSubmit =new EventEmitter();
  @ViewChild('autodept') matAutocompleteDept: MatAutocomplete;
  @ViewChild('employeeDeptInput') employeeDeptInput:any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  AddForm: FormGroup;
  ctrldepartment= new FormControl();
  summaryList = [];
  isLoading = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private readonly RELOAD_TOP_SCROLL_POSITION = 50;
  has_next = true;
  has_previous = true;
  currentpage:number=1;
  departmentList: Array<Department>;
  // @ViewChild('input_dept', { static: true }) input_dept: ElementRef;
  constructor(private formBuilder: FormBuilder,  private memoService: MemoService, private notification: NotificationService, private router:Router) { }

  ngOnInit() {
    this.AddForm = this.formBuilder.group({
      name: ['', Validators.required],
      ctrldepartment: ['', Validators.required],
      remarks: ['', Validators.required],
    });
    
    let deptkeyvalue:String="";
    this.getDepartment(deptkeyvalue);

    this.AddForm.get('ctrldepartment').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.memoService.getDepartmentPage(value,1,'all')
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
  .subscribe((results: any[]) => {
    let datas = results["data"];
    this.departmentList = datas;
    let datapagination=results["pagination"];
    this.departmentList = datas;
    if (this.departmentList.length >= 0) {
      this.has_next=datapagination.has_next;
      this.has_previous=datapagination.has_previous;
      this.currentpage=datapagination.index;
    }
  });
  console.log('this.departmentList',this.departmentList)
  }//endof ngoninit

  autocompleteDeptScroll() {
    setTimeout(() => {
      // console.log('calling autocompleteBToScroll')
      if (
        this.matAutocompleteDept &&
        this.autocompleteTrigger &&
        this.matAutocompleteDept.panel
      ) {
        fromEvent(this.matAutocompleteDept.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocompleteDept.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocompleteDept.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteDept.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteDept.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight-1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
              this.memoService.getDepartmentPage(this.employeeDeptInput.nativeElement.value,this.currentpage+1,'all')
                  .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination=results["pagination"];
                  this.departmentList =this.departmentList.concat(datas);
                  if (this.departmentList.length >= 0) {
                    this.has_next=datapagination.has_next;
                    this.has_previous=datapagination.has_previous;
                    this.currentpage=datapagination.index;
                  }
                  })
                }//if (this.has_next === true)
            }//endof atBottom
          });
      }
    });
  } //endof auto matAutocompleteDept

  public displayFn(department?: Department): string | undefined {
    // console.log('id',department.id);
    // console.log('name',department.name);
    return department ? department.name : undefined;
  }

  get department() {
    return this.AddForm.get('ctrldepartment');
  }

filter(data) {
  // console.log(data.value);
}

createFormate() {
  let data = this.AddForm.controls;
  let memoclass = new Memo();
  // console.log('a',data['ctrldepartment'].value)
  // console.log('b',data['ctrldepartment'].value.id)
  memoclass.department_id = data['ctrldepartment'].value.id;
  memoclass.name = data['name'].value;
  memoclass.remarks = data['remarks'].value;
  // console.log("MemoClaass", memoclass)

  return memoclass;
}

private getDepartment(deptkeyvalue) {
  this.memoService.getDepartmentPage(deptkeyvalue,1,'all')
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.departmentList = datas;
    });
  console.log('getDepartment-cat create',this.departmentList)
}

submitForm() {
  var answer = window.confirm("Save this category?");
    if (answer) {
        //some code
    }
    else {
      return false;
    }
  this.memoService.createCategoryForm(this.createFormate())
      .subscribe(res => {
        this.notification.showSuccess("saved Successfully!...")
        this.onSubmit.emit()
        // console.log("CreateAddForm", res);
        return true
       
      })
  }

  onCancelClick() {
    this.onCancel.emit()
  }

}

class Memo {
  name: string;
  department_id: any;
  remarks: string;
  
}