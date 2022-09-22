import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { masterService } from '../master.service';

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
export interface Emplistss {
  id: string;
  full_name: string;
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
@Component({
  selector: 'app-empbranch-create',
  templateUrl: './empbranch-create.component.html',
  styleUrls: ['./empbranch-create.component.scss']
})
export class EmpbranchCreateComponent implements OnInit {
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
  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;
  has_next:boolean=true;
  has_previous :boolean=true;
  currentpage = 1;
  createemployss:any=FormGroup;
  isLoading:boolean=false;
  bsdatalist:Array<any>=[];
  pincodelist:Array<any>=[];
  citylist:Array<any>=[];
  districtlist:Array<any>=[];
  statelist:Array<any>=[];
  hiearchylist:Array<any>=[];
  branchdatalist:Array<any>=[];
  employeetypelist:Array<any>=[];
  designationlist:Array<any>=[];
  employeeList:Array<any>=[];
  entityList:Array<any>=[];
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
  minLength:number=10;
  maxLength:number=10;
  reg:any=new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
  constructor(private spinner:NgxSpinnerService,private datepipe:DatePipe,private fb:FormBuilder,private masterservice:masterService,private notification:NotificationService) { }

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
      'conwedday':new FormControl(''),
      'tanno':new FormControl('',[Validators.maxLength(10)]),
      'glno':new FormControl(''),
      'stdno':new FormControl(''),
      'incharge':new FormControl(''),
      'controlofficebranch':new FormControl(''),
      'entity':new FormControl(''),
      'entitydetails':new FormControl(''),
      'gstin':new FormControl(''),
      'Assetcodeprimary':new FormControl('')
    });
    this.createemployss.get('incharge').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.masterservice.getemployeeFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;

      },(error) => {
        this.spinner.hide();
      });
      this.masterservice.getentitysummarysearch_new(1,'').subscribe(data=>{
        this.entityList=data['data'];
      });
      this.createemployss.get('entity').valueChanges.
    pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=> this.masterservice.getentitysummarysearch_new(1,'').pipe(
        finalize(()=>{
          this.isLoading=false;
        }),
      )
      )
    ).subscribe(data=>{
      console.log('2');
      this.entityList=data['data'];
      // console.log(this.bsdatalist)
    });
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
      // console.log(this.hierarchylist);
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
  keypress(event){
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
  public displayFnemp(emp?: Emplistss): string | undefined {
    console.log('id', emp.id);
    console.log('full_name', emp.full_name);
    return emp ? emp.full_name : undefined;
  }
  employeecreatedata(){
    console.log(this.createemployss.value);
    let d:any=/[A-Z]{2}[A-Z]{3}[A-Z]{1}[0-9]{1}[A-Z]{3}/
    if(d.test(this.createemployss.get('Assetcodeprimary').value.trim())){
      console.log(d.test(this.createemployss.get('Assetcodeprimary').value.trim()));
    }
    else{
      this.notification.showWarning('Please Check The Asset Primary Code Not Valid Format');
      this.notification.showWarning('It Must Contain 10 Characters:')
      return false;
    }
    if(this.reg.test(this.createemployss.get('gstin').value.trim())){
      console.log('exe');
    }
    else{
      this.notification.showWarning('Please Check GST No');
      this.notification.showWarning('It Must Contain 15 Digits:')
      return false;
    }
    if(this.createemployss.get('code').value.trim()=='' || this.createemployss.get('code').value==null || this.createemployss.get('code').value==undefined){
      this.notification.showError('Please Select The Code');
      return false;
    }
    if(this.createemployss.get('name').value.trim()=='' || this.createemployss.get('name').value==null || this.createemployss.get('name').value==undefined){
      this.notification.showError('Please Select The Name');
      return false;
    }
    // if(this.createemployss.get('dob').value=='' || this.createemployss.get('dob').value==null || this.createemployss.get('dob').value==undefined){
    //   this.notification.showError('Please Select The DOB');
    //   return false;
    // }
    // if(this.createemployss.get('doj').value=='' || this.createemployss.get('doj').value==null || this.createemployss.get('doj').value==undefined){
    //   this.notification.showError('Please Select The Date Of Joining');
    //   return false;
    // }
    // if(this.createemployss.get('gender').value=='' || this.createemployss.get('gender').value==null || this.createemployss.get('gender').value==undefined){
    //   this.notification.showError('Please Select The Gender');
    //   return false;
    // }
    // if(this.createemployss.get('employeetype').value=='' || this.createemployss.get('employeetype').value.id==null || this.createemployss.get('employeetype').value.id==undefined){
    //   this.notification.showError('Please Select The Department');
    //   return false;
    // }
    // if(this.createemployss.get('designation').value=='' || this.createemployss.get('designation').value.id==null || this.createemployss.get('designation').value.id==undefined){
    //   this.notification.showError('Please Select The Designation');
    //   return false;
    // }
    // if(this.createemployss.get('mobilenumber').value.length !=10 || this.createemployss.get('mobilenumber').value==null || this.createemployss.get('mobilenumber').value==undefined){
    //   this.notification.showError('Please Select The MobileNumber and 10 digits');
    //   return false;
    // }
    // if(this.createemployss.get('emailid').valid==false || this.createemployss.get('emailid').value==null || this.createemployss.get('name').value==undefined){
    //   this.notification.showError('Please Enter The Emailid');
    //   return false;
    // }
    // if(this.createemployss.get('supervisor').value.id==null || this.createemployss.get('supervisor').value.id==null || this.createemployss.get('supervisor').value==undefined || this.createemployss.get('supervisor').value==''){
    //   this.notification.showError('Please Enter The Supervisor');
    //   return false;
    // }
    // if(this.createemployss.get('hierarchy').value.id==null || this.createemployss.get('hierarchy').value.id==null || this.createemployss.get('hierarchy').value==undefined || this.createemployss.get('hierarchy').value==''){
    //   this.notification.showError('Please Enter The Hierarchy');
    //   return false;
    // }
    if(this.createemployss.get('branch').value.id==null || this.createemployss.get('branch').value.id==null || this.createemployss.get('branch').value==undefined || this.createemployss.get('branch').value==''){
      this.notification.showError('Please Enter The Branch');
      return false;
    }
    // if(this.createemployss.get('bsname').value.id==null || this.createemployss.get('bsname').value.id==null || this.createemployss.get('bsname').value==undefined || this.createemployss.get('bsname').value==''){
    //   this.notification.showError('Please Enter The BS Name');
    //   return false;
    // }
    // if(this.createemployss.get('ccname').value.id==null || this.createemployss.get('ccname').value.id==null || this.createemployss.get('ccname').value==undefined || this.createemployss.get('ccname').value==''){
    //   this.notification.showError('Please Enter The CC Name');
    //   return false;
    // }
    if(this.createemployss.get('line1').value==null || this.createemployss.get('line1').value==null || this.createemployss.get('line1').value==undefined || this.createemployss.get('line1').value==''){
      this.notification.showError('Please Enter The Line1');
      return false;
    }
    // if(this.createemployss.get('line2').value==null || this.createemployss.get('line2').value==null || this.createemployss.get('line2').value==undefined || this.createemployss.get('line2').value==''){
    //   this.notification.showError('Please Enter The Line2');
    //   return false;
    // }
    // if(this.createemployss.get('line3').value==null || this.createemployss.get('line3').value==null || this.createemployss.get('line3').value==undefined || this.createemployss.get('line3').value==''){
    //   this.notification.showError('Please Enter The Line3');
    //   return false;
    // }
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
    // if(this.createemployss.get('landline2').value.length !=10 || this.createemployss.get('landline2').value==undefined || this.createemployss.get('landline2').value=="" || this.createemployss.get('landline2').value==''){
    //   this.notification.showError('Please Enter The landline2');
    //   return false;
    // }
    if(this.createemployss.get('contactnumber').value.length !=10 || this.createemployss.get('contactnumber').value==undefined || this.createemployss.get('contactnumber').value=="" || this.createemployss.get('contactnumber').value==''){
      this.notification.showError('Please Enter The Contactnumber');
      return false;
    }
    // if(this.createemployss.get('contactnumber2').value.length !=10 || this.createemployss.get('contactnumber2').value==undefined || this.createemployss.get('contactnumber2').value=="" || this.createemployss.get('contactnumber2').value==''){
    //   this.notification.showError('Please Enter The Contactnumber');
    //   return false;
    // }
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
  //   let data:any={
  //     "code":this.createemployss.get('code').value.trim(),
  //     "full_name":this.createemployss.get('name').value.trim(),
  //     "first_name":"Dwayne",
  //     "middle_name":"Rock",
  //     "last_name":"Johnson",
  //     "dob":this.datepipe.transform(this.createemployss.get('dob').value,'yyyy-MM-dd'),
  //     "doj":this.datepipe.transform(this.createemployss.get('doj').value,'yyyy-MM-dd'),
  //     "department_id":this.createemployss.get('employeetype').value.id,
  //     "gender":Gender[this.createemployss.get('gender').value],
  //     "employee_type":this.createemployss.get('employeetype').value.id,
  //     "designation":this.createemployss.get('designation').value.name,
  //     "phone_no":this.createemployss.get('mobilenumber').value,
  //     "email_id":this.createemployss.get('emailid').value,
  //     "supervisor":this.createemployss.get('supervisor').value.id,
  //     "hierarchy":this.createemployss.get('hierarchy').value.id,
  //     "branch":this.createemployss.get('branch').value.id,
  //     "businesssegment":this.createemployss.get('bsname').value.id,
  //     "costcentre":this.createemployss.get('ccname').value.id,
  //     "contact":{
  //         "type_id":contactType[this.createemployss.get('contacttype').value],
  //         "name":this.createemployss.get('personname').value.trim(),
  //         "designation_id":this.createemployss.get('condesignation').value.id,
  //         "landline":this.createemployss.get('landline1').value,
  //         "landline2":this.createemployss.get('landline1').value,
  //         "mobile":this.createemployss.get('contactnumber').value,
  //         "mobile2":this.createemployss.get('contactnumber2').value,
  //         "email":this.createemployss.get('conemailid').value.trim(),
  //         "dob":this.datepipe.transform(this.createemployss.get('condob').value,'yyyy-MM-dd'),
  //         "wedding_date":this.datepipe.transform(this.createemployss.get('conwedday').value,'yyyy-MM-dd'),
  //         "status":1
  //     },
  //     "address":{
  //         "line1":this.createemployss.get('line1').value.trim(),
  //         "line2":this.createemployss.get('line2').value.trim(),
  //         "line3":this.createemployss.get('line3').value.trim(),
  //         "pincode_id":this.createemployss.get('pincode').value.id,
  //         "city_id":this.createemployss.get('city').value.id,
  //         "district_id":this.createemployss.get('district').value.id,
  //         "state_id":this.createemployss.get('state').value.id
  //     }
  // };
   let data:any={
    
      "code":this.createemployss.get('code').value.trim(), 
      "name":this.createemployss.get('name').value.trim(),
      "tanno":this.createemployss.get('tanno').value,
      "glno":this.createemployss.get('glno').value,
      "stdno":this.createemployss.get('stdno').value,
      "assetcodeprimary":this.createemployss.get('Assetcodeprimary').value.trim(),
      "incharge":this.createemployss.get('incharge').value.full_name,
        "address":{"line1":this.createemployss.get('line1').value.trim(),
        "line2":this.createemployss.get('line2').value.trim(),
         "line3":this.createemployss.get('line3').value.trim(),
        "pincode_id":this.createemployss.get('pincode').value.id,
        "city_id":this.createemployss.get('city').value.id,
        "district_id":this.createemployss.get('district').value.id,
        "state_id":this.createemployss.get('state').value.id
              },
        "contact":{"type_id":contactType[this.createemployss.get('contacttype').value],
        "name":this.createemployss.get('personname').value.trim(),
        "designation_id":this.createemployss.get('condesignation').value.id,
        "landline":this.createemployss.get('landline1').value,
        "landline2":this.createemployss.get('landline1').value,
        "mobile":this.createemployss.get('contactnumber').value,
        "mobile2":this.createemployss.get('landline1').value,
        "email":this.createemployss.get('conemailid').value.trim(),
        "dob":this.datepipe.transform(this.createemployss.get('condob').value,'yyyy-MM-dd'),
        "wedding_date":this.datepipe.transform(this.createemployss.get('conwedday').value,'yyyy-MM-dd')
            },
            "control_office_branch":this.createemployss.get('branch').value.id,
            "entity":this.createemployss.get('entity').value,
            "entity_detail":this.createemployss.get('entity').value,
        "gstin":this.createemployss.get('gstin').value
  
   }  
  this.spinner.show();
    this.masterservice.getemployeebranch(data).subscribe(datas=>{
      console.log(datas);
      if(datas['status']=='success'){
        this.notification.showSuccess(datas['message']);
        this.spinner.hide();
        this.onSubmit.emit();
      }
      else{
        this.notification.showError(datas['code']);
        this.notification.showError(datas['description']);
      }
      this.spinner.hide();
      
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
  autocompleteempScroll() {
    setTimeout(() => {
      if (
        this.matempAutocomplete &&
        this.autocompleteTrigger &&
        this.matempAutocomplete.panel
      ) {
        fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.masterservice.getemployeeFKdd(this.empInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    // console.log("emp", datas)
                    if (this.employeeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  },(error) => {
                    this.spinner.hide();
                  })
              }
            }
          });
      }
    });
  }
}
