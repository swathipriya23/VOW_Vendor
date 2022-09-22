import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable, from, fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { ShareService } from '../share.service'
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { abort } from 'process';
export interface taxtauto {
  id: string;
  name: string;
}
@Component({
  selector: 'app-sub-tax-edit',
  templateUrl: './sub-tax-edit.component.html',
  styleUrls: ['./sub-tax-edit.component.scss']
})
export class SubTaxEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('taxdata') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('SCROLLtaxInput') SCROLLtaxInput: any;
  subTaxCreateForm: FormGroup;
  taxDDvalueList: any
  subTaxId: number;
  isLoading = false;
  disableSubmit=true;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  constructor(private shareService: ShareService, private fb: FormBuilder,
    private atmaService: AtmaService, private notification: NotificationService) { }

  ngOnInit(): void {
    this.subTaxCreateForm = this.fb.group({
    
      name: ['', Validators.required],
      glno: ['', Validators.required],
      remarks: ['', Validators.required],
      tax_id: ['', Validators.required],
    })
    this.getsubTaxEditForm()
    // this.getTaxDDValue();
    // ------
let query: String = "";
this.getTaxDDValue(query);

this.subTaxCreateForm.get('tax_id').valueChanges
  .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
      console.log('inside tap')

    }),
    switchMap(value => this.atmaService.Tax_dropdownsearchST(value, 1)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
    )
  )
  .subscribe((results: any[]) => {
    let datas = results["data"];
    this.taxDDvalueList = datas;
    console.log("raisor", datas)

  })
// 
// this.getTaxDDValue();

  }
  autocompletetaxScroll() {
    setTimeout(() => {
      if (
        this.matAutocomplete &&
        this.autocompleteTrigger &&
        this.matAutocomplete.panel
      ) {
        fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.Tax_dropdownsearchST(this.SCROLLtaxInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.taxDDvalueList = this.taxDDvalueList.concat(datas);
                    // console.log("emp", datas)
                    if (this.taxDDvalueList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  getTaxDDValue(q) {
    this.atmaService.Taxdropdownsearch(q)
      .subscribe(result => {
        this.taxDDvalueList = result['data']
      })
  }

  getsubTaxEditForm() {
    let data: any = this.shareService.subTaxEdit.value;
    this.subTaxId = data.id
    let Code = data.code;
    let Name = data.name;
    let Glno = data.glno;
    let Remarks = data.remarks;
    let taxValue = data.tax;
    let taxId = taxValue.id;

    this.subTaxCreateForm.patchValue({
      name: Name,
      code: Code,
      glno: Glno,
      remarks: Remarks,
      tax_id: taxValue

    })
  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  subTaxEditForm() {
    console.log(this.subTaxCreateForm.value);
    if(this.subTaxCreateForm.get('name').value==undefined || this.subTaxCreateForm.get('name').value==null || this.subTaxCreateForm.get('name').value=="" || this.subTaxCreateForm.get('name').value==''){
      this.notification.showError('Please Enter The Name');
      return false;
    }
    if(this.subTaxCreateForm.get('glno').value==undefined || this.subTaxCreateForm.get('glno').value==null || this.subTaxCreateForm.get('glno').value=="" || this.subTaxCreateForm.get('glno').value==''){
      this.notification.showError('Please Enter The GLNO');
      return false;
    }
    if(this.subTaxCreateForm.get('remarks').value==undefined || this.subTaxCreateForm.get('remarks').value==null || this.subTaxCreateForm.get('remarks').value=="" || this.subTaxCreateForm.get('remarks').value==''){
      this.notification.showError('Please Enter The Sub Tax Remarks');
      return false;
    }
    if(this.subTaxCreateForm.get('tax_id').value==undefined || this.subTaxCreateForm.get('tax_id').value==null || this.subTaxCreateForm.get('tax_id').value=="" || this.subTaxCreateForm.get('tax_id').value==''){
      this.notification.showError('Please Select  The Tax Name');
      return false;
    }
    // this.disableSubmit=true;
    // if(this.subTaxCreateForm.valid){
    this.subTaxCreateForm.value.tax_id= this.subTaxCreateForm.value.tax_id.id;
    this.atmaService.subTaxEditForm(this.subTaxId, this.subTaxCreateForm.value)
      .subscribe(result => {
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showWarning("Duplicate Code & Name ...")
          this.disableSubmit=false;
        } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
          this.disableSubmit=false;
        }
        this.notification.showSuccess("Updated Successfully...")
        this.onSubmit.emit();
      })
    // }
    //   else{
    //     this.notification.showError("INVALID_DATA!...")
    //     this.disableSubmit=false;
    //   }
  }

  onCancelClick() {
    this.onCancel.emit()
  }

  public displaytaxdata(taxtest?: taxtauto): string | undefined {
    console.log('id', taxtest.id);
    console.log('name', taxtest.name);
    return taxtest ? taxtest.name : undefined;
  }

  get taxtest() {
    return this.subTaxCreateForm.get('tax_id');
  }
}



