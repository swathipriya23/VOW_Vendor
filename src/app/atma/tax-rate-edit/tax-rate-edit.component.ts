import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable, from, fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { AtmaService } from '../atma.service'
import { ShareService } from '../share.service'
import { NotificationService } from '../notification.service'
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { I } from '@angular/cdk/keycodes';
export interface subtaxtauto {
  id: string;
  name: string;
}

@Component({
  selector: 'app-tax-rate-edit',
  templateUrl: './tax-rate-edit.component.html',
  styleUrls: ['./tax-rate-edit.component.scss']
})
export class TaxRateEditComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  taxRateEditForm: FormGroup;
  // subtaxDDvalueList: any;
  subtaxDDvalueList: Array<subtaxtauto>;
  isLoading = false;
  taxRateId: number;
  disableSubmit=true;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  @ViewChild('subtaxdata') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('subtaxdataInput') subtaxdataInput: any;
  constructor(private shareService: ShareService, private fb: FormBuilder, private notification: NotificationService,
    private atmaService: AtmaService) { }


  ngOnInit(): void {
    this.taxRateEditForm = this.fb.group({
 
      name: ['', Validators.required],
      rate: ['', Validators.required],
      subtax_id: ['', Validators.required],
    });
    let subtaxkeyvalue: String = "";
    this.getSubTaxDDValue(subtaxkeyvalue);
    //this.getSubTaxDDValue();
    this.getTaxRateEdit();
    this.taxRateEditForm.get('subtax_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')
      }),
      switchMap(value => this.atmaService.subTax_dropdownsearch(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.subtaxDDvalueList = datas;
    })

  }
  autocompleteSUBtaxScroll() {
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
                this.atmaService.subTax_dropdownsearch(this.subtaxdataInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.subtaxDDvalueList = this.subtaxDDvalueList.concat(datas);
                    // console.log("emp", datas)
                    if (this.subtaxDDvalueList.length >= 0) {
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

  getTaxRateEdit() {
    let data: any = this.shareService.taxRateEdit.value;
    this.taxRateId = data.id
    let Name = data.name;
    let Code = data.code;
    let Rate = data.rate;
    let subRaxId = data.subtax_id;
    //let subTax_id = subRaxId.id
    this.taxRateEditForm.patchValue({
      name: Name,
      code: Code,
      rate: Rate,
      subtax_id: subRaxId
    })
  }
  public displaysubtaxdata(subtaxdata?: subtaxtauto): string | undefined {
    console.log('id', subtaxdata.id);
    console.log('name', subtaxdata.name);
    return subtaxdata ? subtaxdata.name : undefined;
  }

  get subtaxdata() {
    return this.taxRateEditForm.get('subtax_id');
  }
  getSubTaxDDValue(subtaxkeyvalue) {
    this.atmaService.subTax_dropdownsearchST(subtaxkeyvalue)
      .subscribe(result => {
        this.subtaxDDvalueList = result['data']
      })
  }



  taxRateEdit() {
    // this.disableSubmit=true;
    // if(this.taxRateEditForm.valid){
    if(this.taxRateEditForm.get('name').value=="" || this.taxRateEditForm.get('name').value==undefined || this.taxRateEditForm.get('name').value==null || this.taxRateEditForm.get('name').value==''){
      this.notification.showError('Please Enter The Name');
      return false;
    }
    if(this.taxRateEditForm.get('rate').value=="" || this.taxRateEditForm.get('rate').value==undefined || this.taxRateEditForm.get('rate').value==null || this.taxRateEditForm.get('rate').value==''){
      this.notification.showError('Please Enter The Rate');
      return false;
    }
    if(this.taxRateEditForm.get('subtax_id').value=="" || this.taxRateEditForm.get('subtax_id').value==undefined || this.taxRateEditForm.get('subtax_id').value==null || this.taxRateEditForm.get('subtax_id').value==''){
      this.notification.showError('Please Select The subtax');
      return false;
    }
      this.taxRateEditForm.value.subtax_id= this.taxRateEditForm.value.subtax_id.id;
    this.atmaService.taxRateEdit(this.taxRateId, this.taxRateEditForm.value)
      .subscribe(result => {
        console.log("TaxRayedfit",result)
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showWarning("Duplicate Code & Name ...")
          this.disableSubmit=false;
        } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
          this.disableSubmit=false;
        } else {
          this.notification.showSuccess("Updates Successfully!...")
          this.onSubmit.emit();
        }
      });
    // }else{
    //     this.disableSubmit=false;
    //     this.notification.showError("INVALID_DATA!...")
    //   }
  }

  onCancelClick() {
    this.onCancel.emit()
  }
}
