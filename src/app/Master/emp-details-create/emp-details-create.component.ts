import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, Output, ViewChild,EventEmitter } from '@angular/core';
import { FormGroup,FormArray,FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { masterService } from '../master.service';

import { NotificationService } from 'src/app/service/notification.service';

import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

import { Router } from '@angular/router';

export interface designationdata{
  id:string;
  name:string;
}
export interface branchdata{
  id:string;
  name:string;
}
export interface bsdata{
  id:string;
  name:string;
}
export interface ccdata{
  id:string;
  name:string;
}
export interface pincode{
  id:string;
  no:string;
}
export interface city{
  id:string;
  name:string;
}
export interface disrict{
  id:string;
  name:string;
}
export interface state{
  id:string;
  name:string;
}
export interface codedesignation{
  id:string;
  name:string;
}
export interface hirerarchy{
  id:string;
  layer:string;
}
export interface department{
  id:string;
  name:string;
}
export interface supervisor{
  id:string;
  full_name:string;
}
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};


class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-emp-details-create',
  templateUrl: './emp-details-create.component.html',
  styleUrls: ['./emp-details-create.component.scss'],
  providers:[{provide:DateAdapter,useClass:PickDateAdapter},
  {provide:MAT_DATE_FORMATS,useValue:PICK_FORMATS}]
})
export class EmpDetailsCreateComponent implements OnInit {
  // @Output() subcan:EventEmitter;
  @Output() onSubmit=new EventEmitter<any>();
  @Output() onCancel=new EventEmitter<any>();
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('designauto') matdesign:MatAutocomplete;
  @ViewChild('designInput') designinput:ElementRef;
  @ViewChild('branchinfo') matbranch:MatAutocomplete;
  @ViewChild('branchInput') branchinput:ElementRef;
  @ViewChild('bsinfo') matbsdata:MatAutocomplete;
  @ViewChild('bsInput') bsinput:ElementRef;
  @ViewChild('ccinfo') matccdata:MatAutocomplete;
  @ViewChild('ccInput') ccinput:ElementRef;
  @ViewChild('pincodeinfo') matpincode:MatAutocomplete;
  @ViewChild('pincodeInput') pincodeinput:ElementRef;
  @ViewChild('cityinfo') matcity:MatAutocomplete;
  @ViewChild('cityInput') cityinput:ElementRef;
  @ViewChild('districtinfo') matdistrict:MatAutocomplete;
  @ViewChild('districtInput') districtinput:ElementRef;
  @ViewChild('stateinfo') matstate:MatAutocomplete;
  @ViewChild('stateInput') stateinput:ElementRef;
  @ViewChild('condesigninfo') matcondesign:MatAutocomplete;
  @ViewChild('condesignInput') condesigninput:ElementRef;
  @ViewChild('hierarchyinfo') mathierchy:MatAutocomplete;
  @ViewChild('hirarchyInput') hierarchyinput:ElementRef;
  @ViewChild('deptinfo') matdept:MatAutocomplete;
  @ViewChild('deptInput') deptinput:ElementRef;
  @ViewChild('superinfo') matsuper:MatAutocomplete;
  @ViewChild('superInput') superinput:ElementRef;
  createemployss:any=FormGroup;
  isLoading :boolean=false;
  designationlist:Array<any>=[];
  hiearchylist:Array<any>=[];
  bsdatalist:Array<any>=[];
  ccdatalist:Array<any>=[];
  branchdatalist:Array<any>=[];
  pincodelist:Array<any>=[];
  citylist:Array<any>=[];
  districtlist:Array<any>=[];
  statelist:Array<any>=[];
  codedesignationlist:Array<any>=[];
  employeetypelist:Array<any>=[];
  hierarchylist:Array<any>=[];
  supervisorlist:Array<any>=[];
  designpage:number=1;
  has_designpre:boolean=false;
  has_designnext:boolean=false;
  date:any=new Date();
  has_bsnxt:boolean=true;
  has_bspre:boolean=false;
  has_bspage:number=1;

  has_ccnxt:boolean=true;
  has_ccpre:boolean=false;
  has_ccpage:number=1;

  has_branchnxt:boolean=true;
  has_bracchpre:boolean=false;
  has_branchpage:number=1;
  has_pincodenxt:boolean=true;
  has_pincodepre:boolean=false;
  has_pincodepage:number=1;
  has_citynxt:boolean=true;
  has_citypre:boolean=false;
  has_citypage:number=1;
  has_districtnxt:boolean=true;
  has_districtpre:boolean=false;
  has_districtpage:number=1;
  has_statenxt:boolean=true;
  has_statepre:boolean=false;
  has_statepage:number=1;
  has_hiernxt:boolean=true;
  has_hierpre:boolean=false;
  has_hierpage:number=1;
  has_deptnxt:boolean=true;
  has_deptpre:boolean=false;
  has_deptpage:number=1;
  has_supernxt:boolean=true;
  has_superpre:boolean=false;
  has_superpage:number=1;
  constructor(private router:Router,private datepipe:DatePipe,private spinner:NgxSpinnerService,private notification:NotificationService,private fb:FormBuilder,private masterservice:masterService) { }

  ngOnInit(): void {
    this.createemployss=this.fb.group({
      'code':new FormControl('',Validators.required),
      'name':new FormControl('',Validators.required),
      'dob':new FormControl(''),
      'doj':new FormControl(''),
      'gender':new FormControl(''),
      'employeetype':new FormControl(''),
      'designation':new FormControl(''),
      'mobilenumber':new FormControl('',[Validators.minLength(10),Validators.maxLength(10)]),
      'emailid':new FormControl('',[Validators.email]),
      'supervisor':new FormControl(''),
      'hierarchy':new FormControl(''),
      'branch':new FormControl(''),
      'bsname':new FormControl(''),
      'ccname':new FormControl(''),
      'line1':new FormControl(''),
      'line2':new FormControl(''),
      'line3':new FormControl(''),
      'pincode':new FormControl(''),
      'city':new FormControl(''),
      'district':new FormControl(''),
      'state':new FormControl(''),
      'contacttype':new FormControl(''),
      'personname':new FormControl(''),
      'condesignation':new FormControl(''),
      'landline1':new FormControl('',[Validators.minLength(10),Validators.maxLength(10)]),
      'landline2':new FormControl('',[Validators.minLength(10),Validators.maxLength(10)]),
      'contactnumber':new FormControl('',[Validators.minLength(10),Validators.maxLength(10)]),
      'contactnumber2':new FormControl('',[Validators.minLength(10),Validators.maxLength(10)]),
      'conemailid':new FormControl('',[Validators.email]),
      'condob':new FormControl(''),
      'conwedday':new FormControl('')
    });
    
    // this.createemployss.get('branch').valueChanges.
    // pipe(
    //   tap(()=>{
    //     this.isLoading=true;
    //   }),
    //   switchMap((value:any)=>this.faservice.getassetbranchdata(this.createemployss.get('branch').value,1).pipe(
    //     finalize(()=>{
    //      this.isLoading=false;
    //     })
    //   )
    //   )
    // ).subscribe((data:any[])=>{
    //   console.log('1');
    //   console.log(data);
    //   this.branchdatalist=data['data'];
    //   console.log(this.branchdatalist);
    // });
    this.createemployss.get('bsname').valueChanges.
    pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.masterservice.getbsdatafilter(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        }),
      )
      )
    ).subscribe(data=>{
      console.log('2');
      this.bsdatalist=data['data'];
      console.log(this.bsdatalist)
    });
    this.createemployss.get('pincode').valueChanges.
    pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.masterservice.getPinCodeDropDownscroll(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      )
      )
    ).subscribe(data=>{
      console.log('3');
      this.pincodelist=data['data'];
      console.log( this.pincodelist);
    });
    this.createemployss.get('city').valueChanges.
    pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.masterservice.getCityList('','asc',1,10).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      )
      )
    ).subscribe(data=>{
      console.log('4');
      this.citylist=data['data'];
      console.log(this.citylist);
    });
    this.createemployss.get('district').valueChanges.
    pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.masterservice.getDistrictList('','asc',1,10).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      )
      )
    ).subscribe(data=>{
      console.log('5');
      this.districtlist=data['data'];
      console.log(this.districtlist);
    });
    this.createemployss.get('state').valueChanges.
    pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.masterservice.getStateList('','asc',1,10).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      )
      )
    ).subscribe(data=>{
      console.log('6');
      this.statelist=data['data'];
      console.log(this.statelist);
    });
    this.createemployss.get('hierarchy').valueChanges.
    pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.masterservice.getHierarchyList("", 'asc', 1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      )
      )
    ).subscribe(data=>{
      console.log('7');
      this.hiearchylist=data['data'];
      console.log(this.hierarchylist);
    });
    this.createemployss.get('employeetype').valueChanges.
    pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.masterservice.getlistdepartment(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      )
      )
    ).subscribe(data=>{
      console.log('7');
      this.employeetypelist=data['data'];
      // console.log(this.hierarchylist);
    });
    this.createemployss.get('supervisor').valueChanges.
    pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.masterservice.getlistdepartmentsenoor(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      )
      )
    ).subscribe(data=>{
      console.log('7');
      this.supervisorlist=data['data'];
      // console.log(this.hierarchylist);
    });
    this.createemployss.get('branch').valueChanges.
    pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.masterservice.getbranchdatafilter(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      )
      )
    ).subscribe(data=>{
      this.branchdatalist=data['data'];
    });
    this.createemployss.get('ccname').valueChanges.
    pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.masterservice.getccdatafilter(this.createemployss.get('bsname').value.id,value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      )
      )
    ).subscribe(data=>{
      this.ccdatalist=data['data'];
    });


  }
  getdatadesignation(data ?:designationdata):string | undefined{
    return data?data.name:undefined;
  }
  getdatabranch(data?:branchdata):string | undefined{
    return data? data.name:undefined;
  }
  getbsdatainterface(data?:bsdata):string | undefined{
    return data?data.name:undefined;
  }
  gerccdatainterface(data?:ccdata):string| undefined{
    return data?data.name:undefined;
  }
  getpincodeinterface(data?:pincode):string | undefined{
    return data?data.no:undefined;
  }
  getcityinterface(data?:city):string | undefined{
    return data?data.name:undefined;
  }
  getdistrictinterface(data?:disrict):string | undefined{
    return data ? data.name:undefined;
  }
  getstateinterface(data ?:state):string | undefined{
    return data ? data.name:undefined;
  }
  gethierarchyinterface(data ?:hirerarchy): string | undefined{
    return data ? data.layer:undefined;
  }
  getdepartmentinterface(data ?:department):string | undefined{
    return data? data.name:undefined;
  }
  getsupervisorinterface(data ?:supervisor):string | undefined{
    return data ?data.full_name:undefined;
  }
  getdesignation(){
    this.masterservice.getDesignationList('','asc',this.designpage,'').subscribe(data=>{
      this.designationlist=data['data'];
      let pagination:any=data['pagination'];
      this.has_designnext=pagination.has_next;
      this.has_designpre=pagination.has_previous;
      this.designpage=pagination.index;
    });
    console.log('1',this.designationlist);
    this.createemployss.get('designation').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.masterservice.getDesignationList('','asc',this.designpage,value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((data: any[]) => {
      this.designationlist=data['data'];
    });
  }
  // gethierarchydata(){
  //   this.masterservice.getHierarchyList().subscribe(data=>{
  //     this.hiearchylist=data['data'];
  //   })

  // }
  getbranchsdata(){
    let d:any='';
    if(this.createemployss.get('branch').value == null || this.createemployss.get('branch').value=='' || this.createemployss.get('branch').value==undefined){
      d='';
    }
    else{
      d=this.createemployss.get('branch').value;
    }
    this.masterservice.getbranchdatafilter(d,1).subscribe(data=>{
      this.branchdatalist=data['data'];
    });
   
  }
  getbsdata(){
    let d:any='';
    if(this.createemployss.get('bsname').value == null || this.createemployss.get('bsname').value=='' || this.createemployss.get('bsname').value==undefined){
      d='';
    }
    else{
      d=this.createemployss.get('bsname').value;
    }
    this.masterservice.getbsdatafilter(d,1).subscribe(data=>{
      this.bsdatalist=data['data'];
    });
  }
  getccdata(){
    if(this.createemployss.get('bsname').value.id == null || this.createemployss.get('bsname').value=='' || this.createemployss.get('bsname').value.id==undefined){
     this.notification.showError('Please select The BS Name');
     return false;
    }
    let d:any=this.createemployss.get('bsname').value.id;
    console.log(this.createemployss.get('bsname').value.id);
    this.masterservice.getccdatafilter(this.createemployss.get('bsname').value.id,'',1).subscribe(data=>{
      this.ccdatalist=data['data'];
    });
   
  }
  getpincodedata(){
    let d:any='';
    if(this.createemployss.get('pincode').value.id == null || this.createemployss.get('pincode').value=='' || this.createemployss.get('pincode').value.id==undefined){
      d='';
    }
    else{
      d=this.createemployss.get('pincode').value;
    }
    this.masterservice.getPinCodeDropDownscroll('',1).subscribe(data=>{
      this.pincodelist=data['data'];
    });
  }
  getpinlistfocus(data:any){
    console.log(data);
    this.createemployss.get('city').patchValue(data['city']);
    this.createemployss.get('district').patchValue(data['district']);
    this.createemployss.get('state').patchValue(data['state']);
  }
  getcityfocus(data:any){
    console.log(data);
    this.createemployss.get('pincode').patchValue(data['pincode']);
    this.createemployss.get('district').patchValue(data['district']);
    this.createemployss.get('state').patchValue(data['state']);
  }
  getcitydata(){
    let d:any='';
    if(this.createemployss.get('city').value.id == null || this.createemployss.get('city').value=='' || this.createemployss.get('city').value.id==undefined){
      d='';
    }
    else{
      d=this.createemployss.get('city').value;
    }
    this.masterservice.getCityDropDownscroll('',1).subscribe(data=>{
      this.citylist=data['data'];
    });

  }
  getdistrictdata(){
    let d:any='';
    if(this.createemployss.get('district').value.id == null || this.createemployss.get('district').value=='' || this.createemployss.get('district').value.id==undefined){
      d='';
    }
    else{
      d=this.createemployss.get('district').value;
    }
    this.masterservice.getDistrictList('','asc',1,10).subscribe(data=>{
      this.districtlist=data['data'];
    });
  }
  getstatedata(){
    let d:any='';
    if(this.createemployss.get('state').value.id == null || this.createemployss.get('state').value=='' || this.createemployss.get('state').value.id==undefined){
      d='';
    }
    else{
      d=this.createemployss.get('state').value;
    }
    this.masterservice.getStateList('','asc',1,10).subscribe(data=>{
      this.statelist=data['data'];
    });
  }
  getcontactdesignationdata(){
    let d:any='';
    if(this.createemployss.get('condesignation').value.id == null || this.createemployss.get('condesignation').value=='' || this.createemployss.get('condesignation').value.id==undefined){
      d='';
    }
    else{
      d=this.createemployss.get('condesignation').value;
    }
  }
  gethierarchydata(){
    let d:any='';
    if(this.createemployss.get('hierarchy').value.id == null || this.createemployss.get('hierarchy').value=='' || this.createemployss.get('hierarchy').value.id==undefined){
      d='';
    }
    else{
      d=this.createemployss.get('hierarchy').value;
    }
    this.masterservice.getHierarchyList("",'asc', 1, d).subscribe(data=>{
      this.hierarchylist=data['data'];
    });
  }
  getdepartmentdata(){
    let d:any='';
    if(this.createemployss.get('employeetype').value.id == null || this.createemployss.get('employeetype').value=='' || this.createemployss.get('employeetype').value.id==undefined){
      d='';
    }
    else{
      d=this.createemployss.get('employeetype').value;
    }
    this.masterservice.getlistdepartment(1, d).subscribe(data=>{
      this.employeetypelist=data['data'];
    });
  }
  getsupervisorlist(){
    let d:any='';
    if(this.createemployss.get('supervisor').value == null || this.createemployss.get('supervisor').value=='' || this.createemployss.get('supervisor').value.id==undefined){
      d='';
    }
    else{
      d=this.createemployss.get('supervisor').value;
    }
    this.masterservice.getlistdepartmentsenoor(1,d).subscribe(data=>{
      this.supervisorlist=data['data'];
    });
  }
  autocompleteDeptScrolldesign() {
    setTimeout(() => {
      if (
        this.matdesign &&
        this.autocompleteTrigger &&
        this.matdesign.panel
      ) {
        fromEvent(this.matdesign.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matdesign.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matdesign.panel.nativeElement.scrollTop;
            const scrollHeight = this.matdesign.panel.nativeElement.scrollHeight;
            const elementHeight = this.matdesign.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_designnext === true) {
                this.masterservice.getDesignationList('','asc',this.designpage+1,this.designinput.nativeElement.value)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.designationlist = this.designationlist.concat(datas);
                    if (this.designationlist.length >= 0) {
                      this.has_designnext = datapagination.has_next;
                      this.has_designpre = datapagination.has_previous;
                      this.designpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteDeptScrollbranch() {
    setTimeout(() => {
      if (
        this.matbranch &&
        this.autocompleteTrigger &&
        this.matbranch.panel
      ) {
        fromEvent(this.matbranch.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranch.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbranch.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranch.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranch.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_branchnxt === true) {
                this.masterservice.getbranchdatafilter(this.branchinput.nativeElement.value,this.has_branchpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchdatalist = this.branchdatalist.concat(datas);
                    if (this.branchdatalist.length >= 0) {
                      this.has_branchnxt = datapagination.has_next;
                      this.has_bracchpre = datapagination.has_previous;
                      this.has_branchpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteScrollbs() {
    setTimeout(() => {
      if (
        this.matbsdata &&
        this.autocompleteTrigger &&
        this.matbsdata.panel
      ) {
        fromEvent(this.matbsdata.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbsdata.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbsdata.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbsdata.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbsdata.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_branchnxt === true) {
                this.masterservice.getbsdatafilter(this.bsinput.nativeElement.value,this.has_bspage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.bsdatalist = this.bsdatalist.concat(datas);
                    if (this.bsdatalist.length >= 0) {
                      this.has_bsnxt = datapagination.has_next;
                      this.has_bspre = datapagination.has_previous;
                      this.has_bspage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteScrollpincode() {
    setTimeout(() => {
      if (
        this.matpincode &&
        this.autocompleteTrigger &&
        this.matpincode.panel
      ) {
        fromEvent(this.matpincode.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matpincode.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matpincode.panel.nativeElement.scrollTop;
            const scrollHeight = this.matpincode.panel.nativeElement.scrollHeight;
            const elementHeight = this.matpincode.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_pincodenxt === true) {
                this.masterservice.getPinCodeDropDownscroll(this.pincodeinput.nativeElement.value,this.has_pincodepage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.pincodelist = this.pincodelist.concat(datas);
                    if (this.pincodelist.length >= 0) {
                      this.has_pincodenxt = datapagination.has_next;
                      this.has_pincodepre = datapagination.has_previous;
                      this.has_pincodepage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteScrollcity() {
    setTimeout(() => {
      if (
        this.matcity &&
        this.autocompleteTrigger &&
        this.matcity.panel
      ) {
        fromEvent(this.matcity.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcity.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcity.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcity.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcity.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_citynxt === true) {
                this.masterservice.getCityDropDownscroll(this.cityinput.nativeElement.value,this.has_citypage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.citylist = this.citylist.concat(datas);
                    if (this.citylist.length >= 0) {
                      this.has_citynxt = datapagination.has_next;
                      this.has_citypre = datapagination.has_previous;
                      this.has_citypage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteScrolldistrict() {
    setTimeout(() => {
      if (
        this.matdistrict &&
        this.autocompleteTrigger &&
        this.matdistrict.panel
      ) {
        fromEvent(this.matdistrict.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matdistrict.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matdistrict.panel.nativeElement.scrollTop;
            const scrollHeight = this.matdistrict.panel.nativeElement.scrollHeight;
            const elementHeight = this.matdistrict.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_districtnxt === true) {
                this.masterservice.getDistrictList('','asc',this.has_districtpage+1,10)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.districtlist = this.districtlist.concat(datas);
                    if (this.districtlist.length >= 0) {
                      this.has_districtnxt = datapagination.has_next;
                      this.has_districtpre = datapagination.has_previous;
                      this.has_districtpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteScrollstate() {
    setTimeout(() => {
      if (
        this.matstate &&
        this.autocompleteTrigger &&
        this.matstate.panel
      ) {
        fromEvent(this.matstate.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matstate.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matstate.panel.nativeElement.scrollTop;
            const scrollHeight = this.matstate.panel.nativeElement.scrollHeight;
            const elementHeight = this.matstate.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_statenxt === true) {
                this.masterservice.getStateList('','asc',this.has_statepage+1,10)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.statelist = this.statelist.concat(datas);
                    if (this.statelist.length >= 0) {
                      this.has_statenxt = datapagination.has_next;
                      this.has_statepre = datapagination.has_previous;
                      this.has_statepage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteScrollhierarchy() {
    setTimeout(() => {
      if (
        this.mathierchy &&
        this.autocompleteTrigger &&
        this.mathierchy.panel
      ) {
        fromEvent(this.mathierchy.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mathierchy.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mathierchy.panel.nativeElement.scrollTop;
            const scrollHeight = this.mathierchy.panel.nativeElement.scrollHeight;
            const elementHeight = this.mathierchy.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_hiernxt === true) {
                this.masterservice.getHierarchyList("",'asc', this.has_hierpage+1, this.hierarchyinput.nativeElement.value)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.hierarchylist = this.hierarchylist.concat(datas);
                    if (this.hierarchylist.length >= 0) {
                      this.has_hiernxt = datapagination.has_next;
                      this.has_hierpre = datapagination.has_previous;
                      this.has_hierpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteScrolldept() {
    setTimeout(() => {
      if (
        this.matdept &&
        this.autocompleteTrigger &&
        this.matdept.panel
      ) {
        fromEvent(this.matdept.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matdept.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matdept.panel.nativeElement.scrollTop;
            const scrollHeight = this.matdept.panel.nativeElement.scrollHeight;
            const elementHeight = this.matdept.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_deptnxt === true) {
                this.masterservice.getlistdepartment(this.has_deptpage+1,this.deptinput.nativeElement.value)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeetypelist = this.employeetypelist.concat(datas);
                    if (this.employeetypelist.length >= 0) {
                      this.has_deptnxt = datapagination.has_next;
                      this.has_deptpre = datapagination.has_previous;
                      this.has_deptpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompleteScrollsuper() {
    setTimeout(() => {
      if (
        this.matsuper &&
        this.autocompleteTrigger &&
        this.matsuper.panel
      ) {
        fromEvent(this.matsuper.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsuper.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsuper.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsuper.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsuper.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_supernxt === true) {
                this.masterservice.getEmployee('','asc', this.has_superpage+1,10)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.supervisorlist = this.supervisorlist.concat(datas);
                    if (this.supervisorlist.length >= 0) {
                      this.has_supernxt = datapagination.has_next;
                      this.has_superpre = datapagination.has_previous;
                      this.has_superpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  employeecreatedata(){
    console.log(this.createemployss.value)
    if(this.createemployss.get('code').value.trim()=='' || this.createemployss.get('code').value==null || this.createemployss.get('code').value==undefined){
      this.notification.showError('Please Select The Code');
      return false;
    }
    if(this.createemployss.get('name').value.trim()=='' || this.createemployss.get('name').value==null || this.createemployss.get('name').value==undefined){
      this.notification.showError('Please Select The Name');
      return false;
    }
    if(this.createemployss.get('dob').value=='' || this.createemployss.get('dob').value==null || this.createemployss.get('dob').value==undefined){
      this.notification.showError('Please Select The DOB');
      return false;
    }
    if(this.createemployss.get('doj').value=='' || this.createemployss.get('doj').value==null || this.createemployss.get('doj').value==undefined){
      this.notification.showError('Please Select The Date Of Joining');
      return false;
    }
    if(this.createemployss.get('gender').value=='' || this.createemployss.get('gender').value==null || this.createemployss.get('gender').value==undefined){
      this.notification.showError('Please Select The Gender');
      return false;
    }
    if(this.createemployss.get('employeetype').value=='' || this.createemployss.get('employeetype').value.id==null || this.createemployss.get('employeetype').value.id==undefined){
      this.notification.showError('Please Select The Department');
      return false;
    }
    if(this.createemployss.get('designation').value=='' || this.createemployss.get('designation').value.id==null || this.createemployss.get('designation').value.id==undefined){
      this.notification.showError('Please Select The Designation');
      return false;
    }
    if(this.createemployss.get('mobilenumber').value.length !=10 || this.createemployss.get('mobilenumber').value==null || this.createemployss.get('mobilenumber').value==undefined){
      this.notification.showError('Please Select The MobileNumber and 10 digits');
      return false;
    }
    if(this.createemployss.get('emailid').valid==false || this.createemployss.get('emailid').value==null || this.createemployss.get('name').value==undefined){
      this.notification.showError('Please Enter The Emailid');
      return false;
    }
    if(this.createemployss.get('supervisor').value.id==null || this.createemployss.get('supervisor').value.id==null || this.createemployss.get('supervisor').value==undefined || this.createemployss.get('supervisor').value==''){
      this.notification.showError('Please Enter The Supervisor');
      return false;
    }
    if(this.createemployss.get('hierarchy').value.id==null || this.createemployss.get('hierarchy').value.id==null || this.createemployss.get('hierarchy').value==undefined || this.createemployss.get('hierarchy').value==''){
      this.notification.showError('Please Enter The Hierarchy');
      return false;
    }
    if(this.createemployss.get('branch').value.id==null || this.createemployss.get('branch').value.id==null || this.createemployss.get('branch').value==undefined || this.createemployss.get('branch').value==''){
      this.notification.showError('Please Enter The Branch');
      return false;
    }
    if(this.createemployss.get('bsname').value.id==null || this.createemployss.get('bsname').value.id==null || this.createemployss.get('bsname').value==undefined || this.createemployss.get('bsname').value==''){
      this.notification.showError('Please Enter The BS Name');
      return false;
    }
    if(this.createemployss.get('ccname').value.id==null || this.createemployss.get('ccname').value.id==null || this.createemployss.get('ccname').value==undefined || this.createemployss.get('ccname').value==''){
      this.notification.showError('Please Enter The CC Name');
      return false;
    }
    if(this.createemployss.get('line1').value==null || this.createemployss.get('line1').value==null || this.createemployss.get('line1').value==undefined || this.createemployss.get('line1').value==''){
      this.notification.showError('Please Enter The Line1');
      return false;
    }
    if(this.createemployss.get('line2').value==null || this.createemployss.get('line2').value==null || this.createemployss.get('line2').value==undefined || this.createemployss.get('line2').value==''){
      this.notification.showError('Please Enter The Line2');
      return false;
    }
    if(this.createemployss.get('line3').value==null || this.createemployss.get('line3').value==null || this.createemployss.get('line3').value==undefined || this.createemployss.get('line3').value==''){
      this.notification.showError('Please Enter The Line3');
      return false;
    }
    if(this.createemployss.get('pincode').value.id==null || this.createemployss.get('pincode').value.id==undefined || this.createemployss.get('pincode').value==undefined || this.createemployss.get('pincode').value==''){
      this.notification.showError('Please Enter The Pincode');
      return false;
    }
    if(this.createemployss.get('city').value.id==null || this.createemployss.get('city').value.id==undefined || this.createemployss.get('city').value==undefined || this.createemployss.get('city').value==''){
      this.notification.showError('Please Enter The City');
      return false;
    }
    if(this.createemployss.get('district').value.id==null || this.createemployss.get('district').value.id==undefined || this.createemployss.get('district').value==undefined || this.createemployss.get('district').value==''){
      this.notification.showError('Please Enter The District');
      return false;
    }
    if(this.createemployss.get('state').value.id==null || this.createemployss.get('state').value.id==undefined || this.createemployss.get('state').value==undefined || this.createemployss.get('state').value==''){
      this.notification.showError('Please Enter The State');
      return false;
    }
    if(this.createemployss.get('contacttype').value==null || this.createemployss.get('contacttype').value==undefined || this.createemployss.get('contacttype').value=="" || this.createemployss.get('contacttype').value==''){
      this.notification.showError('Please Enter The ContactType');
      return false;
    }
    if(this.createemployss.get('landline1').value.length !=10 || this.createemployss.get('landline1').value==undefined || this.createemployss.get('landline1').value=="" || this.createemployss.get('landline1').value==''){
      this.notification.showError('Please Enter The landline1');
      return false;
    }
    if(this.createemployss.get('landline2').value.length !=10 || this.createemployss.get('landline2').value==undefined || this.createemployss.get('landline2').value=="" || this.createemployss.get('landline2').value==''){
      this.notification.showError('Please Enter The landline2');
      return false;
    }
    if(this.createemployss.get('contactnumber').value.length !=10 || this.createemployss.get('contactnumber').value==undefined || this.createemployss.get('contactnumber').value=="" || this.createemployss.get('contactnumber').value==''){
      this.notification.showError('Please Enter The Contactnumber');
      return false;
    }
    if(this.createemployss.get('contactnumber2').value.length !=10 || this.createemployss.get('contactnumber2').value==undefined || this.createemployss.get('contactnumber2').value=="" || this.createemployss.get('contactnumber2').value==''){
      this.notification.showError('Please Enter The Contactnumber');
      return false;
    }
    if(this.createemployss.get('conemailid').valid==false || this.createemployss.get('conemailid').value==undefined || this.createemployss.get('conemailid').value=="" || this.createemployss.get('conemailid').value==''){
      this.notification.showError('Please Enter The Contact mailId');
      return false;
    }
    if(this.createemployss.get('condob').value==null || this.createemployss.get('condob').value==undefined || this.createemployss.get('condob').value=="" || this.createemployss.get('condob').value==''){
      this.notification.showError('Please Enter The Contact DOB');
      return false;
    }
    if(this.createemployss.get('conwedday').value==null || this.createemployss.get('conwedday').value==undefined || this.createemployss.get('conwedday').value=="" || this.createemployss.get('conwedday').value==''){
      this.notification.showError('Please Enter The Contact DOB');
      return false;
    }
    console.log(this.createemployss.value);
    let Gender:any={'Male':1,"Female":2,"TransGender":3};
    let contactType={'EMPLOYEE':5,'GROUP123':10,'Individual':10};
    let data:any={
      "code":this.createemployss.get('code').value.trim(),
      "full_name":this.createemployss.get('name').value.trim(),
      "first_name":"Dwayne",
      "middle_name":"Rock",
      "last_name":"Johnson",
      "dob":this.datepipe.transform(this.createemployss.get('dob').value,'yyyy-MM-dd'),
      "doj":this.datepipe.transform(this.createemployss.get('doj').value,'yyyy-MM-dd'),
      "department_id":this.createemployss.get('employeetype').value.id,
      "gender":Gender[this.createemployss.get('gender').value],
      "employee_type":this.createemployss.get('employeetype').value.id,
      "designation":this.createemployss.get('designation').value.name,
      "phone_no":this.createemployss.get('mobilenumber').value,
      "email_id":this.createemployss.get('emailid').value,
      "supervisor":this.createemployss.get('supervisor').value.id,
      "hierarchy":this.createemployss.get('hierarchy').value.id,
      "branch":this.createemployss.get('branch').value.id,
      "businesssegment":this.createemployss.get('bsname').value.id,
      "costcentre":this.createemployss.get('ccname').value.id,
      "contact":{
          "type_id":contactType[this.createemployss.get('contacttype').value],
          "name":this.createemployss.get('personname').value.trim(),
          "designation_id":this.createemployss.get('condesignation').value.id,
          "landline":this.createemployss.get('landline1').value,
          "landline2":this.createemployss.get('landline1').value,
          "mobile":this.createemployss.get('contactnumber').value,
          "mobile2":this.createemployss.get('contactnumber2').value,
          "email":this.createemployss.get('conemailid').value.trim(),
          "dob":this.datepipe.transform(this.createemployss.get('condob').value,'yyyy-MM-dd'),
          "wedding_date":this.datepipe.transform(this.createemployss.get('conwedday').value,'yyyy-MM-dd'),
          "status":1
      },
      "address":{
          "line1":this.createemployss.get('line1').value.trim(),
          "line2":this.createemployss.get('line2').value.trim(),
          "line3":this.createemployss.get('line3').value.trim(),
          "pincode_id":this.createemployss.get('pincode').value.id,
          "city_id":this.createemployss.get('city').value.id,
          "district_id":this.createemployss.get('district').value.id,
          "state_id":this.createemployss.get('state').value.id
      }
  };
    this.spinner.show();
    this.masterservice.getlistdepartmentcreate(data).subscribe(datas=>{
      console.log(datas);
      this.spinner.hide();
      this.onSubmit.emit();
      // this.router.navigate(['/master/master']);
    },
    (error)=>{
      this.spinner.hide();
      this.notification.showError(error.status+error.statusText);
    }
    );
  }
  employessreset(){
    this.createemployss.reset('');
    this.onCancel.emit();
    // this.router.navigate(['/master/master']);
  }
  minLength:number=10;
  maxLength:number=10;
  keypress(event){
    // let a=event.target.value;
    // console.log(this.createemployss.get('mobilenumber').value.length);
    // if(this.createemployss.get('mobilenumber').value.length<=10){
    //   this.createemployss.get('mobilenumber').patchValue(a.slice(0,10));
    // }
    // const input = event.target.value;
    // if (input.length === 0 && event.which === 48) {
    //   event.preventDefault();
    // }
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
    // console.log(event.keyCode);
    // console.log(event.code);
    // let charCode = (event.which) ? event.which : event.keyCode;
    // if((charCode<47 || charCode>58)){
    //   console.log('y');
    //   // event.preventDefault();
    //   // event.stopPropagation();
    //   event.preventDefault();

    //   console.log('n');
    //   return false;
    // }
    // else{
    //   // event.preventDefault();
    //   // event.stopPropagation();
    //   // event.preventDefault();

    //   // console.log('n');
    //   return true;
     
    // }
  }
}
