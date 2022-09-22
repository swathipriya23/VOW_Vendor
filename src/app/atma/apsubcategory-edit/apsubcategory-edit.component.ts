import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, } from '@angular/forms';
import { AtmaService } from '../atma.service'
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../share.service'
import { NotificationService } from '../notification.service'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
export interface ApCategory {
  id: string;
  name: string;
}

@Component({
  selector: 'app-apsubcategory-edit',
  templateUrl: './apsubcategory-edit.component.html',
  styleUrls: ['./apsubcategory-edit.component.scss']
})
export class ApsubcategoryEditComponent implements OnInit {
  isLoading = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  apSubCategoryEditForm: FormGroup
  categoryList: Array<ApCategory>;
  categoryID: any;
  category_id = new FormControl();
  disableSubmit = true;
  gstlist = [{ 'id': '1', 'show': 'Yes', 'name': 'Y' }, { 'id': '2', 'show': 'No', 'name': 'N' }]
  gstrcmlist = [{ 'id': '1', 'show': 'Yes', 'name': 'Y' }, { 'id': '2', 'show': 'No', 'name': 'N' }]


  constructor(private fb: FormBuilder, private shareService: ShareService,
    private notification: NotificationService,
    private atmaService: AtmaService, private router: Router) { }

  ngOnInit(): void {
    this.apSubCategoryEditForm = this.fb.group({
      category_id: ['', Validators.required],
      expense: ['', Validators.required],
      glno: ['', Validators.required],
      gstblocked: ['', Validators.required],
      gstrcm: ['', Validators.required],
      name: ['', Validators.required],
      no: ['', Validators.required],

    })

    this.getApSubCategoryEdit();

    let apcatkeyvalue: String = "";
    this.getcategory(apcatkeyvalue);
    this.apSubCategoryEditForm.get('category_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.atmaService.getcategory(value)
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

      })

  }

  public displayapcat(apcatname?: ApCategory): string | undefined {
    return apcatname ? apcatname.name : undefined;
  }
  get apcatname() {
    return this.apSubCategoryEditForm.get('category_id');
  }

  private getcategory(apcatkeyvalue) {
    this.atmaService.getcategory(apcatkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;

      })
  }

  getApSubCategoryEdit() {
    let id = this.shareService.apSubCategoryEdit.value
    this.atmaService.getApSubCategoryEdit(id)
      .subscribe((results: any) => {
        let Category = results.category;
        let Expense = results.expense;
        let Glno = results.glno;
        let Gstblocked = results.gstblocked;
        let Gstrcm = results.gstrcm;
        let Name = results.name;
        let No = results.no;


        this.apSubCategoryEditForm.patchValue({
          category_id: Category,
          expense: Expense,
          glno: Glno,
          gstblocked: Gstblocked,
          gstrcm: Gstrcm,
          name: Name,
          no: No

        })
      })
  }

  createFormate() {
    let data = this.apSubCategoryEditForm.controls;
    let apatclass = new apcatsubtype();
    apatclass.category_id = data['category_id'].value.id;
    apatclass.expense = data['expense'].value;
    apatclass.glno = data['glno'].value;
    apatclass.gstblocked = data['gstblocked'].value;
    apatclass.gstrcm = data['gstrcm'].value;
    apatclass.name = data['name'].value;
    apatclass.no = data['no'].value;
    return apatclass;
  }
  apsubcategoryEdit_Form() {
    this.disableSubmit = true;
    if (this.apSubCategoryEditForm.valid) {
      let idValue: any = this.shareService.apSubCategoryEdit.value
      this.atmaService.apSubCategoryEdit(this.createFormate(), idValue.id)
        .subscribe(res => {
          console.log("res", res)
          if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
            this.notification.showWarning("Duplicate! Code Or Name ...")
            this.disableSubmit = false;

          } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
            this.notification.showError("INVALID_DATA!...")
            this.disableSubmit = false;

          } else {
            this.notification.showSuccess("updated Successfully!...")
            this.onSubmit.emit();
          }
        }
        )
    } else {
      this.notification.showError(("INVALID_DATA..."))
      this.disableSubmit = false;
    }

  }

  onCancelClick() {
    this.onCancel.emit()
  }

}

class apcatsubtype {
  category_id: any;
  expense: string;
  glno: string;
  gstblocked: string;
  gstrcm: string;
  name: string;
  no: string;

}