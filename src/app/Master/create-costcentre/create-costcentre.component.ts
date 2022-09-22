import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, from, fromEvent } from 'rxjs';
import { Router } from '@angular/router'
import { masterService } from '../master.service'
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-create-costcentre',
  templateUrl: './create-costcentre.component.html',
  styleUrls: ['./create-costcentre.component.scss']
})
export class CreateCostcentreComponent implements OnInit {
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
//     let objCostcentre = new Costcentre();
//     objCostcentre.code = data['code'].value;
//     objCostcentre.name = data['name'].value;
//     objCostcentre.no = data['no'].value;
//     objCostcentre.description = data['description'].value;
//     objCostcentre.remarks = data['remarks'].value;
//     // console.log("objCostcentre", objCostcentre)
//     return objCostcentre;
//   }


//   submitForm() {
//     this.dataService.createCostCentreForm(this.createFormat())
//       .subscribe(res => {
//         // console.log("createCostCentreForm", res);
//         // console.log(this.dataService.ComingFrom)
//         this.router.navigate(['/employeeSummary'], { skipLocationChange: true })
//         return true
//       }
//       )
//   }

// }
// class Costcentre {
//   code: string;
//   name: string;
//   no: string;
//   description: string;
//   remarks: string;

// }




  CCForm: FormGroup;
  isLoading = false;
  BusinesssegmentList:any=[]
  currentpagecom_branch=1;
  has_nextcom_branch=true;
  has_previouscom=true;

  @ViewChild('Businesssegment') matBusinesssegmentAutocomplete: MatAutocomplete;
  @ViewChild('BusinesssegmentInput') BusinesssegmentInput: any;

  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  bsCode: any;
  bsName: any;
  bsID: any;

  constructor(private fb: FormBuilder, private shareService: SharedService,
    private toastr:ToastrService, private router: Router, private dataService: masterService ) { }
  ngOnInit(): void {
    this.CCForm = this.fb.group({
      Businesssegment:[''],
      bsname:['', Validators.required],
      bscode:[''],
      name:['', Validators.required],
      no:['', Validators.required],
      code:[''],
      remarks:[''],
      description:['', Validators.required]
    })

  this.dataService.getBusinesssegmentname('',1).subscribe(data=>{
      this.BusinesssegmentList=data['data'];
    })
    this.CCForm.get('bsname').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;

      }),
      switchMap(value => this.dataService.getBusinesssegmentname(value,1)
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
                this.dataService.getBusinesssegmentname( this.BusinesssegmentInput.nativeElement.value, this.currentpagecom_branch + 1)
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

  checker_segment(data){
   console.log(data)
   this.bsCode = data.code;
   this.CCForm.get('bscode').patchValue(data.code);
   this.bsName = data.name
   this.bsID = data.id
 };


  CCSubmit(){
    if (this.CCForm.value.bsname===""){
      this.toastr.error('Please Select The BS Name','' ,{timeOut: 1500});
      return false;
    }
    // if (this.CCForm.value.bscode===""){
    //   this.toastr.error('Add code Field','Empty value inserted' ,{timeOut: 1500});
    //   return false;
    // }
    if (this.CCForm.value.code===""){
      this.toastr.error('Add code Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }
    if (this.CCForm.value.name===""){
      this.toastr.error('Please Enter The CC Name','' ,{timeOut: 1500});
      return false;
    }
    if (this.CCForm.value.name.trim()===""){
      this.toastr.error('Please Enter CC Name','');
      return false;
    }
    // if (this.CCForm.value.name.trim().length > 20){
    //   this.toastr.error('Not more than 20 characters','Enter valid name' );
    //   return false;
    // }
    if (this.CCForm.value.no===""){
      this.toastr.error('Please Enter CC No','' ,{timeOut: 1500});
      return false;
    }
    if (this.CCForm.value.no.trim()===""){
      this.toastr.error('Please Enter CC No','');
      return false;
    }
    if (this.CCForm.value.no.trim().length > 20){
      this.toastr.error('Not more than 20 characters','Enter valid CC No' );
      return false;
    }
    if (this.CCForm.value.remarks===""){
      this.toastr.error('Please Enter The Remarkd','' ,{timeOut: 1500});
      return false;
    }
    if (this.CCForm.value.remarks.trim()===""){
      this.toastr.error('Please Enter The Remarkd','');
      return false;
    }
    if (this.CCForm.value.remarks.trim().length > 20){
      this.toastr.error('Not more than 20 characters','Enter valid Remarks' );
      return false;
    }
    if (this.CCForm.value.description===""){
      this.toastr.error('Please Enter The Description','' ,{timeOut: 1500});
      return false;
    }
    if (this.CCForm.value.description.trim()===""){
      this.toastr.error('Please Enter The Description','');
      return false;
    }
    if (this.CCForm.value.description.trim().length > 20){
      this.toastr.error('Not more than 20 characters','Enter valid Description' );
      return false;
    }  


    let data = this.CCForm.value
    data['no'] = parseInt((this.CCForm.get('no').value))
    data['businesssegment_id'] = this.bsID
    data['status'] = 1
    console.log('CC Data',data)
   this.dataService.CCCreateForm(data)
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
       this.toastr.success("Successfully Created")
      this.onSubmit.emit();
     }
       console.log("CCForm SUBMIT", res)
       return true
     }) 


  }

  omit_special_char(event)
  {   
    var k;  
    k = event.charCode;  
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }
  omit_special_charnew(event)
  {   
    var k;  
    k = event.charCode;  
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32); 
  }
  
  
  onCancelClick(){
    this.onCancel.emit()
  }
  }






