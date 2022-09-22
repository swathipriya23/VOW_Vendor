import { Component, OnInit, Output,ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { from, Observable, fromEvent } from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Category, MemoService,Department } from "../../service/memo.service";
import { Router } from '@angular/router'
import {MatAutocompleteSelectedEvent,  MatAutocomplete,MatAutocompleteTrigger} from '@angular/material/autocomplete';
import { SharedService } from '../../service/shared.service'
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize } from 'rxjs/operators';
import { NotificationService } from "../../service/notification.service"
@Component({
  selector: 'app-subcategory-create',
  templateUrl: './subcategory-create.component.html',
  styleUrls: ['./subcategory-create.component.scss']
})
export class SubcategoryCreateComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('autodept') matAutocompleteDept: MatAutocomplete;
  @ViewChild('employeeDeptInput') employeeDeptInput:any;
  @ViewChild('categoryInput') categoryInput:any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  AddForm: FormGroup;
  summaryList = [];
  categoryList: Array<Category>;
  departmentList: Array<Department>;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private readonly RELOAD_TOP_SCROLL_POSITION = 50;
  has_next = true;
  has_previous = true;
  currentpage:number=1;
  isLoading = false;
  constructor(private formBuilder: FormBuilder, private memoService: MemoService, private router: Router, private notification: NotificationService,
    private shareService: SharedService
  ) { }

  ngOnInit(): void {
    this.AddForm = this.formBuilder.group({
      name: ['', Validators.required],
      ctrldepartment: ['', Validators.required],
      category_id: ['', Validators.required],
      remarks: ['', Validators.required],
    })
    // let catkeyvalue:String="";
    // this.getCategory(catkeyvalue);
    let deptkeyvalue:String="";
    this.getDepartment(deptkeyvalue);


    this.AddForm.get('category_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
          // console.log('inside tap')
          // console.log('this.AddForm.value.ctrldepartment',this.AddForm.value.ctrldepartment.id)
          // this.getDepartment(this.input_dept.nativeElement.value);
      }),
      switchMap(value => this.memoService.getCategory_Dept(value,this.AddForm.value.ctrldepartment.id)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
  .subscribe((results: any[]) => {
    let datas = results["data"];
    this.categoryList = datas;
    console.log("category", datas)
  });

  
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
    this.categoryInput.nativeElement.value = '';
  });

  }// endof ngoninit

  public displayFn(category?: Category): string | undefined {
    console.log('id',category.id);
    console.log('name',category.name);
    return category ? category.name : undefined;
  }

  get category() {
    return this.AddForm.get('category_id');
  }

  focusCategory(e){
    if (this.categoryInput.nativeElement.value === '' && this.AddForm.value.ctrldepartment.id !== undefined){
      this.memoService.getCategory_Dept('',this.AddForm.value.ctrldepartment.id)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;
      });
    }
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

  public displayDeptFn(department?: Department): string | undefined {
    return department ? department.name : undefined;
  }

  get department() {
    return this.AddForm.get('ctrldepartment');
  }

  private getDepartment(deptkeyvalue) {
    this.memoService.getDepartmentPage(deptkeyvalue,1,'all')
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.departmentList = datas;
      });
    console.log('getDepartment-cat create',this.departmentList)
  }

  createFormate() {
    let data = this.AddForm.controls;
    let memoclass = new Memo();
    memoclass.category_id = data['category_id'].value.id;
    memoclass.name = data['name'].value;
    memoclass.remarks = data['remarks'].value;
    return memoclass;
  }

  private getCategory(catkeyvalue) {
    this.memoService.getCategorySearch(catkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;
        console.log("category", datas)
      })
  }


  submitForm() {
    var answer = window.confirm("Save subcategory?");
    if (answer) {
        //some code
    }
    else {
      return false;
    }
    this.memoService.createSubcategoryForm(this.createFormate())
      .subscribe(res => {
        this.notification.showSuccess("saved Successfully!...")
        let catId = res.category.id;
        console.log("SubCategoryCreate", res);
        this.shareService.subCategoryID.next(catId);
        this.onSubmit.emit();
        return true
      })
  }

  onCancelClick() {
    this.onCancel.emit()
  }


}

class Memo {
  code: string;
  name: string;
  category_id: any;
  remarks: string;
}