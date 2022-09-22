import { Component, OnInit, Output,ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { from, fromEvent, Observable } from 'rxjs';
import { MemoService, Category, Department, } from "../../service/memo.service";
import { Router } from '@angular/router'
import { ShareService } from '../../Master/share.service'
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, map, takeUntil } from 'rxjs/operators';
import {MatAutocompleteSelectedEvent,  MatAutocomplete,MatAutocompleteTrigger} from '@angular/material/autocomplete';
import { NotificationService } from "../../service/notification.service"
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-memo-sub-category-edit',
  templateUrl: './memo-sub-category-edit.component.html',
  styleUrls: ['./memo-sub-category-edit.component.scss']
})
export class MemoSubCategoryEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>()
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('autodept') matAutocompleteDept: MatAutocomplete;
  @ViewChild('employeeDeptInput') employeeDeptInput:any;
  @ViewChild('categoryInput') categoryInput:any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  idValue: number;
  editSubForm: FormGroup
  categoryList: Array<Category>;
  departmentList: Array<Department>;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private readonly RELOAD_TOP_SCROLL_POSITION = 50;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  isLoading = false;
  constructor(private formBuilder: FormBuilder, private shareService: ShareService, private notification: NotificationService
    , private memoService: MemoService, private router: Router) { }

  ngOnInit(): void {
    this.editSubForm = this.formBuilder.group({
      name: ['', Validators.required],
      ctrldepartment: ['', Validators.required],
      remarks: ['', Validators.required],
      category: ['', Validators.required],
    })
    // let catkeyvalue: String = "";
    // this.getCategory(catkeyvalue);
    let deptkeyvalue:String="";
    this.getDepartment(deptkeyvalue);

    this.editSubForm.get('category').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.memoService.getCategory_Dept(value,this.editSubForm.value.ctrldepartment.id)
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
        // console.log("category", datas)
      });
    this.editSubForm.get('ctrldepartment').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.memoService.getDepartmentPage(value, 1, 'all')
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
        let datapagination = results["pagination"];
        this.departmentList = datas;
        if (this.departmentList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
        this.categoryInput.nativeElement.value = '';
      });
    this.getEditSubCategory();
  }

  public displayFn(cat?: Category): string | undefined {
    // console.log('id',cat.id);
    // console.log('name',cat.name);
    return cat ? cat.name : undefined;
  }

  get cat() {
    return this.editSubForm.get('category');
  }

  getEditSubCategory() {
    let data: any = this.shareService.subCategoryEditValue.value
    // console.log('getEditSubCategory', data);
    this.idValue = data.id;
    let Name = data.name;
    let Category = data.category;
    let Remarks = data.remarks
    this.editSubForm.patchValue({
      name: Name,
      category: Category,
      ctrldepartment: data.department,
      remarks: Remarks
    }, { emitEvent: false });
  }

  focusCategory(e){
    if (this.categoryInput.nativeElement.value === '' && this.editSubForm.value.ctrldepartment.id !== undefined){
      this.memoService.getCategory_Dept('',this.editSubForm.value.ctrldepartment.id)
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
    return this.editSubForm.get('ctrldepartment');
  }

  private getDepartment(deptkeyvalue) {
    this.memoService.getDepartmentPage(deptkeyvalue,1,'all')
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.departmentList = datas;
      });
    // console.log('getDepartment-cat create',this.departmentList)
  }


  private getCategory(catKeyValue) {
    this.memoService.getCategorySearch(catKeyValue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;
      })
  }

  editSubCategoryForm() {
    var answer = window.confirm("Update this subcategory?");
    if (answer) {
      //some code
    }
    else {
      return false;
    }
    this.memoService.editSubcategoryForm(this.editSubForm.value, this.idValue)
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