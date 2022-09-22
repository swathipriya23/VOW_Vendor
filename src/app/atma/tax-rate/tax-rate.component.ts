import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable, from, fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { makeStateKey } from '@angular/platform-browser';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
export interface subtaxtauto {
  id: string;
  name: string;
}

@Component({
  selector: 'app-tax-rate',
  templateUrl: './tax-rate.component.html',
  styleUrls: ['./tax-rate.component.scss']
})
export class TaxRateComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  taxRateForm: FormGroup;
  // subtaxDDvalueList: any
  subtaxDDvalueList: Array<subtaxtauto>;
  isLoading = false;
  disableSubmit=true;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  @ViewChild('subtaxdata') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('subtaxdataInput') subtaxdataInput: any;
  constructor(private fb: FormBuilder, private atmaService: AtmaService,private notification:NotificationService) { }


  ngOnInit(): void {
    this.taxRateForm = this.fb.group({
     
      name: ['', Validators.required],
      rate: ['', Validators.required],
      subtax_id: ['', Validators.required],
    })
    let subtaxkeyvalue: String = "";
    this.getSubTaxDDValue(subtaxkeyvalue);
    this.taxRateForm.get('subtax_id').valueChanges
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
  public displaysubtaxdata(subtaxdata?: subtaxtauto): string | undefined {
    console.log('id', subtaxdata.id);
    console.log('name', subtaxdata.name);
    return subtaxdata ? subtaxdata.name : undefined;
  }

  get subtaxdata() {
    return this.taxRateForm.get('subtax_id');
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

  getSubTaxDDValue(subtaxkeyvalue) {
    this.atmaService.subTax_dropdownsearchST(subtaxkeyvalue)
      .subscribe(result => {
        this.subtaxDDvalueList = result['data']
      })
  }



  taxRateCreateForm() {
    if( this.taxRateForm.get('name').value=='' || this.taxRateForm.get('name').value==undefined || this.taxRateForm.get('name').value==""){
      this.notification.showError('Please Enter The Name');
      return false;
    }
    if( this.taxRateForm.get('subtax_id').value.id==undefined || this.taxRateForm.get('subtax_id').value==undefined || this.taxRateForm.get('subtax_id').value==""){
      this.notification.showError('Please Enter The SubTaxName');
      return false;
    }
    if( this.taxRateForm.get('rate').value==undefined || this.taxRateForm.get('rate').value==undefined || this.taxRateForm.get('rate').value==""){
      this.notification.showError('Please Enter The Rate');
      return false;
    }

    
      this.taxRateForm.value.subtax_id= this.taxRateForm.value.subtax_id.id;
    this.atmaService.taxRateCreateForm(this.taxRateForm.value)
      .subscribe(result => {
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showWarning("Duplicate Code & Name ...")
          this.disableSubmit=false;
        } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
         this.disableSubmit=false;

        } else {
          this.notification.showSuccess("Saved Successfully!...")
          this.onSubmit.emit();
        }
      })

}
 

  onCancelClick() {
    this.onCancel.emit()
  }

}
