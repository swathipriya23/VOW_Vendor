import { Component, OnInit,Output,EventEmitter,ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { from, Observable, fromEvent } from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';
import { Department, MemoService } from "../../service/memo.service";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router } from '@angular/router'
import { ShareService } from '../../Master/share.service'
import {MatAutocompleteSelectedEvent,  MatAutocomplete,MatAutocompleteTrigger} from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize } from 'rxjs/operators';
import { NotificationService } from "../../service/notification.service"

@Component({
  selector: 'app-memo-category-edit',
  templateUrl: './memo-category-edit.component.html',
  styleUrls: ['./memo-category-edit.component.scss']
})
export class MemoCategoryEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>()
  categoryEditForm: FormGroup
  @ViewChild('autodept') matAutocompleteDept: MatAutocomplete;
  @ViewChild('employeeDeptInput') employeeDeptInput:any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  departmentList: Array<Department>;
  isLoading = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private readonly RELOAD_TOP_SCROLL_POSITION = 50;
  has_next = true;
  has_previous = true;
  currentpage:number=1;
  constructor(private fb: FormBuilder, private memoService: MemoService, private notification: NotificationService,
    private shareService: ShareService, private router: Router) { }


  ngOnInit(): void {
    this.categoryEditForm = this.fb.group({
      name: ['', Validators.required],
      department_id: ['', Validators.required],
      remarks: ['', Validators.required],
    })
    let deptkeyvalue:String="";
    this.getDepartment(deptkeyvalue);

    this.categoryEditForm.get('department_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.memoService.getDepartment(value)
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
  })
    this.getCategoryEdit();
  }

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

  public displayFn(dept?: Department): string | undefined {
    // console.log('id',dept.id);
    // console.log('name',dept.name);
    return dept ? dept.name : undefined;
  }

  get dept() {
    return this.categoryEditForm.get('department_id');
  }


  getCategoryEdit() {
    let data: any = this.shareService.categoryEditValue.value;
    // console.log("catedit",data)
    let Name = data.name;
    let Dept = data.department
    let Remarks = data.remarks
    this.categoryEditForm.patchValue({
      name: Name,
      department_id: Dept,
      remarks: Remarks
    })
  }


  private getDepartment(deptkeyvalue) {
    this.memoService.getDepartment(deptkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.departmentList = datas;
      })
  }

  createFormate() {
    let data = this.categoryEditForm.controls;
    let catclass = new CatDetail();
    catclass.name = data['name'].value;
    catclass.department_id = data['department_id'].value.id;
    catclass.remarks = data['remarks'].value;
    // console.log("catclass", catclass)
    return catclass;
  }



  submitForm() {
    var answer = window.confirm("Update this category?");
    if (answer) {
        //some code
    }
    else {
      return false;
    }
    let data: any = this.shareService.categoryEditValue.value
    this.memoService.editCategoryForm(this.createFormate(), data.id)
      .subscribe(result => {
        this.notification.showSuccess("updated Successfully!...")
        this.onSubmit.emit();
        return true 

      }
      )
  }

  onCancelClick() {
    this.onCancel.emit()
  }

}
class CatDetail{
  name:string;
  remarks: string;
  department_id: any;
}