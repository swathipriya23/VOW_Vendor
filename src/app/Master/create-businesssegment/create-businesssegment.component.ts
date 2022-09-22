import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from, fromEvent } from 'rxjs';
import { Router } from '@angular/router'
import { masterService } from '../master.service'



import { SharedService } from '../../service/shared.service';
import { ToastrService } from 'ngx-toastr';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatRadioChange } from '@angular/material/radio';

interface status {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-create-businesssegment',
  templateUrl: './create-businesssegment.component.html',
  styleUrls: ['./create-businesssegment.component.scss']
})
export class CreateBusinesssegmentComponent implements OnInit {
  @ViewChild('Businesssegment') matBusinesssegmentAutocomplete: MatAutocomplete;
  @ViewChild('BusinesssegmentInput') BusinesssegmentInput: any;

  @ViewChild('segmentdrop') matsegmentdropAutocomplete: MatAutocomplete;
  @ViewChild('segmentdropInput') BusinesssectorInput: any;

  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('modalclose') moDalclose:ElementRef;

//   AddForm: FormGroup;

//   constructor(private formBuilder: FormBuilder,private dataService: masterService,private router: Router) { }

//   ngOnInit(): void {
//     this.AddForm = this.formBuilder.group({
//       code: ['', Validators.required],
//       name: ['', Validators.required],
//       no: ['', Validators.required],
//       description: ['', Validators.required],
//       remarks: ['', Validators.required]
//     })
//   }

//   createFormat() {
//     let data = this.AddForm.controls;
//     let objBusinesssegment = new Businesssegment();
//     objBusinesssegment.code = data['code'].value;
//     objBusinesssegment.name = data['name'].value;
//     objBusinesssegment.no = data['no'].value;
//     objBusinesssegment.description = data['description'].value;
//     objBusinesssegment.remarks = data['remarks'].value;
//     // console.log("objBusinesssegment", objBusinesssegment)
//     return objBusinesssegment;
//   }


//   submitForm() {
//     this.dataService.createBusinessSegmentForm(this.createFormat())
//       .subscribe(res => {
//         // console.log("createBusinessSegmentForm", res);
//         this.router.navigate(['/employeeSummary'], { skipLocationChange: true })
//         return true
//       }
//       )
//   }

// }
// class Businesssegment {
//   code: string;
//   name: string;
//   no: string;
//   description: string;
//   remarks: string;

// }

BSForm: FormGroup;
SegmentForm: FormGroup;
isLoading = false;
BusinesssegmentList:any=[]
sectorList:any = []
currentpagecom_branch=1;
has_nextcom_branch=true;
has_previouscom=true;
status: status[] = [
  {value: 'YES', viewValue: 'YES '},
  {value: 'NO', viewValue: 'NO'}]
floatLabelControl = new FormControl('auto');

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  radioFlag: any = [];
  sectorID: any;
  segmentID: any;

  constructor(private fb: FormBuilder, private shareService: SharedService,
     private toastr:ToastrService, private router: Router, private dataService: masterService ) { }

  ngOnInit(): void {
    this.BSForm = this.fb.group({
      description:['', Validators.required] ,
      name:['', Validators.required] ,
      no:['', Validators.required] ,
      code:[''],
      remarks:['', Validators.required],
      Businesssegment:[''] ,
    })

    this.SegmentForm = this.fb.group({
      code:['', Validators.required] ,
      name:['', Validators.required] ,
      no:['', Validators.required] ,
      description:['', Validators.required],
      remarks:['', Validators.required],
      sector_id:[''] 
    });

    this.dataService.getBusinesssegmentsearch('',1).subscribe(data=>{
      this.BusinesssegmentList=data['data'];
    })
    this.BSForm.get('Businesssegment').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;

      }),
      switchMap(value => this.dataService.getBusinesssegmentsearch(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )

    .subscribe((results: any[]) => {
      this.BusinesssegmentList = results["data"];
      console.log('branch_id=',results)
      console.log('branch_data=',this.BusinesssegmentList)

    })

    this.dataService.getBusinesssectorsearch('',1).subscribe(data=>{
      this.sectorList=data['data'];
    })
    this.SegmentForm.get('sector_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;

      }),
      switchMap(value => this.dataService.getBusinesssectorsearch(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )

    .subscribe((results: any[]) => {
      this.sectorList = results["data"];
      console.log('branch_id=',results)
      console.log('branch_data=',this.sectorList)

    })
  }

  autocompleteScroll_Businesssegment(){
    setTimeout(() => {
      if (this.matBusinesssegmentAutocomplete && this.autocompleteTrigger && this.matBusinesssegmentAutocomplete.panel) {
        fromEvent(this.matBusinesssegmentAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matBusinesssegmentAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)).subscribe(x => {
            const scrollTop = this.matBusinesssegmentAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matBusinesssegmentAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matBusinesssegmentAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_branch === true) {
                this.dataService.getBusinesssegmentsearch( this.BusinesssegmentInput.nativeElement.value, this.currentpagecom_branch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('branch=',results)
                    let datapagination = results["pagination"];
                    this.BusinesssegmentList = this.BusinesssegmentList.concat(datas);
                    if (this.BusinesssegmentList.length >= 0) {
                      this.has_nextcom_branch = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_branch = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  autocompleteScroll_sector(){
    setTimeout(() => {
      if (this.matsegmentdropAutocomplete && this.autocompleteTrigger && this.matsegmentdropAutocomplete.panel) {
        fromEvent(this.matsegmentdropAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsegmentdropAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)).subscribe(x => {
            const scrollTop = this.matsegmentdropAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsegmentdropAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsegmentdropAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_branch === true) {
                this.dataService.getBusinesssectorsearch( this.BusinesssectorInput.nativeElement.value, this.currentpagecom_branch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('branch=',results)
                    let datapagination = results["pagination"];
                    this.sectorList = this.sectorList.concat(datas);
                    if (this.sectorList.length >= 0) {
                      this.has_nextcom_branch = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_branch = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  checker_segment(data){
   console.log(data)
   this.segmentID = data.id

 };
 checker_sector(data){
   console.log(data)
   this.sectorID = data.id
 }
 radioChange(event: MatRadioChange,a) {
  console.log(event.value.value);
  if(event.value.value == 'YES'){
    this.radioFlag = 1
  }
  else if(event.value.value == 'NO'){
    this.radioFlag = 0
  }
  console.log('radio_flag ',this.radioFlag);
}

 addSegment(){
   
 }

  BSSubmit(){
  if (this.BSForm.value.name===""){
    this.toastr.error('Please Enter The BS Name','' ,{timeOut: 1500});
    return false;
  }
  if (this.BSForm.value.name.trim()===""){
    this.toastr.error('Please Enter The BS Name',' WhiteSpace Not Allowed');
    return false;
  }
  if (this.BSForm.value.name.trim().length > 20){
    this.toastr.error('Not more than 20 characters','Please Enter The Valid BS Name' );
    return false;
  }
  if (this.BSForm.value.no===""){
    this.toastr.error('Please Enter The Bs No','' ,{timeOut: 1500});
    return false;
  }
  if (this.BSForm.value.no.trim()===""){
    this.toastr.error('Add no Field',' WhiteSpace Not Allowed');
    return false;
  }
  if (this.BSForm.value.no.trim().length > 3){
    this.toastr.error('Not more than 3 characters','Please Enter valid BS No' );
    return false;
  }
  if(this.radioFlag ==undefined || this.radioFlag==null || this.radioFlag==''){
    this.toastr.error('Please Select The Checkbox Yes or No');
    return false;
  }
    let data = this.BSForm.value
    data['status'] = this.radioFlag
    data['masterbussinesssegment_id'] = this.segmentID
   this.dataService.BSCreateForm(data)
   .subscribe(res => {
    if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
      this.toastr.error("[INVALID_DATA! ...]")
    }
    else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
      this.toastr.warning("Duplicate Data! ...")
    } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
      this.toastr.error("INVALID_DATA!...")
    }
    else if(res.code === "INVALID_DATA" && res.description === "Duplicate Name"){
      this.toastr.warning("Duplicate Data! ...")
    }
     else {
       this.toastr.success("Successfully created!...")
      this.onSubmit.emit();
     }
       console.log("BSForm SUBMIT", res)
       return true
     }) 


  }
  
  SegmentSubmit(){
    if (this.SegmentForm.value.name===""){
      this.toastr.error('Add name Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }
    if (this.SegmentForm.value.name.trim()===""){
      this.toastr.error('Add name Field',' WhiteSpace Not Allowed');
      return false;
    }
    if (this.SegmentForm.value.name.trim().length > 20){
      this.toastr.error('Not more than 20 characters','Enter valid name' );
      return false;
    }
    if (this.SegmentForm.value.no===""){
      this.toastr.error('Add no Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }
    if (this.SegmentForm.value.no.trim()===""){
      this.toastr.error('Add no Field',' WhiteSpace Not Allowed');
      return false;
    }
    if (this.SegmentForm.value.no.trim().length > 3){
      this.toastr.error('Not more than 3 characters','Enter valid no' );
      return false;
    }
      let data = this.SegmentForm.value
      data['sector_id']= this.sectorID
     this.dataService.BSSegmentSave(data)
     .subscribe(res => {
      if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
        this.toastr.error("[INVALID_DATA! ...]")
      }
      else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
        this.toastr.warning("Duplicate Data! ...")
      } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
        this.toastr.error("INVALID_DATA!...")
      }
      else if(res.code === "INVALID_DATA" && res.description === "Duplicate Name"){
        this.toastr.warning("Duplicate Data! ...")
      }
       else {
         this.moDalclose.nativeElement.click();
         this.toastr.success("Successfully created!...")
        // this.onSubmit.emit();
       }
         console.log("SegmentForm SUBMIT", res)
         return true
       }) 
  
  }

  omit_special_char(event)
  {   
    var k;  
    k = event.charCode;  
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }
   onCancelClick() {
    this.onCancel.emit()
   }
  }