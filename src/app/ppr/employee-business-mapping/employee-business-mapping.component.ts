import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ErrorhandlingService } from '../errorhandling.service';

// import { NotificationService } from 'src/app/rems/notification.service';
// import { NotificationService } from 'src/app/service/notification.service';
import { PprService } from '../ppr.service';
export interface employee {
  branch_code: any
  full_name: any
}
export interface business {
  code: any
  name: any
  id: any
}
export interface branchList {
  id: number
  name: string
}
export interface finyear {
  finyear:any
}
export interface status {
  status:any
}
@Component({
  selector: 'app-employee-business-mapping',
  templateUrl: './employee-business-mapping.component.html',
  styleUrls: ['./employee-business-mapping.component.scss']
})
export class EmployeeBusinessMappingComponent implements OnInit {
  employeeList: any
  employeeBusinesssearch: FormGroup
  employeeBusinessSummarysearch: FormGroup
  isLoading: boolean;
  employeeSummaryList: any;
  businessSummaryList: business[];
  public chipSelectedbusiness: business[] = [];
  businessList: business[]
  public chipSelectedbusinessid = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  businessid: any;
  empbusinessvalue: any;
  has_next: any = true;
  has_previous: any;
  currentpage: any = 1;
  presentpage: any=1;
  isSummaryPagination: boolean;
  finyearList: any;
  finyearid: any;
  status: any;
  statusVal: any;
  branchList: any;
  branchid: any;
  branchsearchList: any;
  branchsearchid: any;

  constructor(private SpinnerService: NgxSpinnerService,private errorHandler: ErrorhandlingService,private pprservice: PprService,private toastr: ToastrService, private formBuilder: FormBuilder) {
    console.log("empbusinessvalue=>",this.empbusinessvalue)
   }
  // @ViewChild('exp') matprodAutocomplete: MatAutocomplete;
  // branch dropdown
  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('branchsearchInput') branchsearchInput: any;
  // branchsearchInput
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;
  @ViewChild('branchsearch') branchsearch: MatAutocomplete;
  @ViewChild('businessInput') businessInput: any
  @ViewChild('businessInputval') businessInputVal: any;
  @ViewChild('businessAuto') matAutocompleteBusiness: MatAutocomplete;
  @ViewChild('businessAutocomplete') matAutocompleteBusinessmap: MatAutocomplete;
  @ViewChild('employeeInput') employeeInputVal: any;
  @ViewChild('emp') matAutocompleteemp: MatAutocomplete;
  @ViewChild('employeeAddInput') employeeAddInputVal: any;
  @ViewChild('empAdd') matAutocompleteempAdd: MatAutocomplete;
  @ViewChild('expInput') expInput: any;
  @ViewChild('exp') matAutocompletebusinessAuto: MatAutocomplete;
  @ViewChild('finyearInput') finyearInput:any
  @ViewChild('fin_year') fin_year:MatAutocomplete
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  ngOnInit(): void {
  //  let value=undefined
    this.empbusinessSearch()
    this.employeeBusinesssearch = this.formBuilder.group({
      employee: [''],
      business: [''],
      branchid:['']
    })
    this.employeeBusinessSummarysearch = this.formBuilder.group({
      employee: [''],
      business: [''],
      branchid:[''],
      finyear:[''],
      statusbs:['']
    })
  }
  // status
  public displayfnstatus(status_info?: status): string | undefined {
    return status_info ? status_info.status : undefined;

  }
   private getstatus(prokeyvalue) {
    this.pprservice.get_status(prokeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.status = datas;

      })
  }
  status_dropdown(){
    let prokeyvalue: String = "";
    this.getstatus(prokeyvalue);
    this.employeeBusinessSummarysearch.get('statusbs').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.pprservice.get_status(value)
          .pipe(
            finalize(() => {
             this.statusVal= value.status
              this.isLoading = false

            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.status = datas;

      })
  }
  // Fin Year
  public displayfnfinyear(finyear_info?: finyear): string | undefined {
    return finyear_info ? finyear_info.finyear : undefined;

  }
  private getfinYear(prokeyvalue) {
    this.pprservice.get_finyear(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.finyearList = datas;

      })
  }
  finyear_dropdown(){
    let prokeyvalue: String = "";
    this.getfinYear(prokeyvalue);
    this.employeeBusinessSummarysearch.get('finyear').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.pprservice.get_finyear(value.finyear, 1)
          .pipe(
            finalize(() => {
              this.finyearid=value.finyear
              this.isLoading = false

            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.finyearList = datas;

      })
  }
  autocompletefinyearScroll(){
    this.has_next = true
    this.currentpage = 1
    setTimeout(() => {
      if (
        this.fin_year &&
        this.autocompleteTrigger &&
        this.fin_year.panel
      ) {
        fromEvent(this.fin_year.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.fin_year.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.fin_year.panel.nativeElement.scrollTop;
            const scrollHeight = this.fin_year.panel.nativeElement.scrollHeight;
            const elementHeight = this.fin_year.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              console.log("has_next=>", this.has_next)
              if (this.has_next === true) {
                console.log("true")
                this.pprservice.get_finyear(this.finyearInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.finyearList = this.finyearList.concat(datas);
                    if (this.finyearList.length >= 0) {
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
  // Employee Add
  public displayfnemp(employee_info?: employee): string | undefined {
    return employee_info ? employee_info.full_name : undefined;

  }
  private getEmployee(prokeyvalue) {
    this.pprservice.get_employee(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;

      })
  }

  employee_dropdown() {
    let prokeyvalue: String = "";
    this.getEmployee(prokeyvalue);
    this.employeeBusinesssearch.get('employee').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.pprservice.get_employee(value, 1)
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

      })
  }
  autocompleteScrollempadd(){
    this.has_next = true
    this.currentpage = 1
    setTimeout(() => {
      if (
        this.matAutocompleteempAdd &&
        this.autocompleteTrigger &&
        this.matAutocompleteempAdd.panel
      ) {
        fromEvent(this.matAutocompleteempAdd.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocompleteempAdd.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocompleteempAdd.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteempAdd.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteempAdd.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              console.log("has_next=>", this.has_next)
              if (this.has_next === true) {
                console.log("true")
                this.pprservice.get_employee(this.employeeAddInputVal.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    if (this.employeeList.length >= 0) {
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
  // End Employee Add

  // Business Add
  private getBusiness(prokeyvalue) {
    this.pprservice.get_business(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessList = datas;

      })
  }

  business_dropdown() {
    let prokeyvalue: String = "";
    this.getBusiness(prokeyvalue);
    this.employeeBusinesssearch.get('business').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.pprservice.get_business(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessList = datas;

      })
  }
  autocompleteScrollmap(){
  console.log("inside")
  this.has_next = true
  this.currentpage = 1
  setTimeout(() => {
    if (
      this.matAutocompleteBusinessmap &&
      this.autocompleteTrigger &&
      this.matAutocompleteBusinessmap.panel
    ) {
      fromEvent(this.matAutocompleteBusinessmap.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matAutocompleteBusinessmap.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matAutocompleteBusinessmap.panel.nativeElement.scrollTop;
          const scrollHeight = this.matAutocompleteBusinessmap.panel.nativeElement.scrollHeight;
          const elementHeight = this.matAutocompleteBusinessmap.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            console.log("has_next=>", this.has_next)
            if (this.has_next === true) {
              console.log("true")
              this.pprservice.get_business(this.businessInputVal.nativeElement.value, this.currentpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.businessList = this.businessList.concat(datas);
                  if (this.businessList.length >= 0) {
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
  autocompleteScrollBusinessAdd(){
    console.log("inside")
    this.has_next = true
    this.currentpage = 1
    setTimeout(() => {
      if (
        this.matAutocompletebusinessAuto &&
        this.autocompleteTrigger &&
        this.matAutocompletebusinessAuto.panel
      ) {
        fromEvent(this.matAutocompletebusinessAuto.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocompletebusinessAuto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocompletebusinessAuto.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebusinessAuto.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebusinessAuto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              console.log("has_next=>", this.has_next)
              if (this.has_next === true) {
                console.log("true")
                this.pprservice.get_business(this.expInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.businessList = this.businessList.concat(datas);
                    if (this.businessList.length >= 0) {
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


  public businessSelected(event: MatAutocompleteSelectedEvent): void {
    console.log('event.option.value', event.option.value)
    this.selectbusinessByName(event.option.value.name, event.option.value);
    this.expInput.nativeElement.value = '';
    console.log('chipSelectedbusinessid', this.chipSelectedbusinessid)
  }
  busid = []
  private selectbusinessByName(business, value) {
    console.log(business)
    let foundprod1 = this.chipSelectedbusiness.filter(pro => pro.name == business);
    if (foundprod1.length) {
      return;
    }
    let foundprod = this.businessList.filter(pro => pro.name = business);
    console.log("foundprod=>", foundprod)
    if (foundprod.length) {
      this.chipSelectedbusiness.push(foundprod[0]);
      // this.chipSelectedbusinessid.push(foundprod[0].id)
      this.chipSelectedbusinessid.push(foundprod[0].name)
    }
    let businessId = this.businessList.findIndex(e => e.id === value.id)
    console.log("bus=>", businessId)
    this.busid.push(this.businessList[businessId].id)
    console.log("busid=>", this.busid)
    console.log(this.chipSelectedbusinessid, this.chipSelectedbusiness)

  }

  public removeditem(item: business): void {
    const index = this.chipSelectedbusiness.indexOf(item);
    if (index >= 0) {
      this.chipSelectedbusiness.splice(index, 1);
      console.log(this.chipSelectedbusiness);
      this.chipSelectedbusinessid.splice(index, 1);
      console.log(this.chipSelectedbusinessid);
      this.busid.splice(index, 1)
      console.log("bsid=>", this.busid)
      this.expInput.nativeElement.value = '';
    }
  }
  ispopUpShow = false
  @ViewChild('closebutton') closebutton;

  // business search end
  // Submit function
  empbusinessSub(searchValue) {
    console.log(searchValue.employee.branch_id)
    console.log("busid=>", this.busid)
    console.log("chipSelectedbusinessid=>", this.chipSelectedbusinessid)
    console.log("log=>",)
    if(this.employeeBusinesssearch.get('employee').value==''){
        this.toastr.error("Please Choose The Employee");

      return false;
    }
    if(this.employeeBusinesssearch.get('business').value==''){
      this.toastr.error("Please Choose Business Segement");

    return false;
  }
  if(this.employeeBusinesssearch.get('branchid').value==''){
    this.toastr.error("Please Choose Branch ");

  return false;
}
    var data = {
      "emp_id": searchValue.employee.id,
      "bs_id": searchValue.business.id,
      "branch_id":searchValue.branchid.id,
    }
    
    
    console.log("emp=>",this.employeeBusinesssearch.get('employee'))
    
      this.pprservice.emp_bus(data, 1)
        .subscribe((results: any[]) => {
          
          console.log("res=>",results['data'])
          
          var already_exist: any[]=[]
          var success_data: any[]=[]
          if(results['status']=="failed"){
            
    this.toastr.error(results['message']);
            
            this.closebutton.nativeElement.click();
          this.employeeBusinesssearch.get('employee').reset('')
          this.employeeBusinesssearch.get('business').reset('')
          this.employeeBusinesssearch.get('branchid').reset('')
          
          this.empbusinessSearch()
        }    else{
                    results['data'].forEach(val=>{
            console.log("val=>",val)
           
              
        
              success_data.push()
              this.toastr.success(val.message,"Successfully");
              this.closebutton.nativeElement.click();

              this.employeeBusinesssearch.get('employee').reset('')
              this.employeeBusinesssearch.get('business').reset('')
              this.employeeBusinesssearch.get('branchid').reset('')
              
              this.empbusinessSearch()
          })

            }
            // if(val.message=="created for user"){
            //   console.log("valuess=>",val.bs_name)
            //   success_data.push(val.bs_name)
            //   this.closebutton.nativeElement.click();
            // this.employeeBusinesssearch.get('employee').reset('')
            // this.employeeBusinesssearch.get('business').reset('')
            // this.employeeBusinesssearch.get('branchid').reset('')
            
            // this.empbusinessSearch()
              
            // }
          
      
        //   if(already_exist.length!=0){
        //     console.log("arraytest=>",already_exist)
        //     var dublicate = already_exist.toString(); 
            
        //     this.closebutton.nativeElement.click();
        //     this.employeeBusinesssearch.get('employee').reset('')
        //     this.employeeBusinesssearch.get('business').reset('')
        //     this.employeeBusinesssearch.get('branchid').reset('')
        
        //     this.empbusinessSearch()


        //   }
        //   if(success_data.length!=0){
        //     console.log("arraytest=>",success_data)
        //     var success = success_data.toString(); 
        //     this.toastr.success(success,"Create For Employee Bs");
            

        //   }    
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }
  // Summary Page filter
  empid
  employee_summary_dropdown() {
    let prokeyvalue: String = "";
    this.getEmployeeSummary(prokeyvalue);
    this.employeeBusinessSummarysearch.get('employee').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.pprservice.get_employee(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
              this.empid=value.id
              console.log(this.empid)
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeSummaryList = datas;

      })
  }
  getEmployeeSummary(prokeyvalue) {
    this.pprservice.get_employee(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeSummaryList = datas;

      })
  }
  public displayfnemployee(employee_info?: employee): string | undefined {
    return employee_info ? employee_info.full_name : undefined;

  }
  autocompleteScrollEmployee() {
    this.has_next = true
    this.currentpage = 1
    setTimeout(() => {
      if (
        this.matAutocompleteemp &&
        this.autocompleteTrigger &&
        this.matAutocompleteemp.panel
      ) {
        fromEvent(this.matAutocompleteemp.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocompleteemp.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocompleteemp.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteemp.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteemp.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              console.log("has_next=>", this.has_next)
              if (this.has_next === true) {
                console.log("true")
                this.pprservice.get_employee(this.employeeInputVal.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeSummaryList = this.employeeSummaryList.concat(datas);
                    if (this.employeeSummaryList.length >= 0) {
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
  // Summary Business Search

  business_Summary_dropdown() {
    let prokeyvalue: String = "";
    this.getBusinessSummary(prokeyvalue);
    this.employeeBusinessSummarysearch.get('business').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.pprservice.get_business(value, 1)
          .pipe(
            finalize(() => {
              this.businessid = value.id
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessSummaryList = datas;

      })
  }
  private getBusinessSummary(prokeyvalue) {
    this.pprservice.get_business(prokeyvalue, 1)
      .subscribe((results: any[]) => {

        let datas = results["data"];
        this.businessSummaryList = datas;

      })
  }
  public displayfnbusiness(business_info?: business): string | undefined {
    return business_info ? business_info.name : undefined;

  }

  public displaybusiness(business_info?: business): string | undefined {
    return business_info ? business_info.name : undefined;

  }
  autocompleteScrollBusiness() {

    console.log("inside")
    this.has_next = true
    this.currentpage = 1
    setTimeout(() => {
      if (
        this.matAutocompleteBusiness &&
        this.autocompleteTrigger &&
        this.matAutocompleteBusiness.panel
      ) {
        fromEvent(this.matAutocompleteBusiness.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocompleteBusiness.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocompleteBusiness.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteBusiness.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteBusiness.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              console.log("has_next=>", this.has_next)
              if (this.has_next === true) {
                console.log("true")
                this.pprservice.get_business(this.businessInputVal.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.businessSummaryList = this.businessSummaryList.concat(datas);
                    if (this.businessSummaryList.length >= 0) {
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
  // end Employee Summary Search
  // Summary Search
  empbusinessSearch(pageNumber=1,pageSize=10) {
    // console.log(searchdata.employee.branch_id)
    console.log("values=>", this.businessid,this.empid,this.finyearid,this.statusVal,this.branchsearchid)
    this.SpinnerService.show();

    this.pprservice.getsummary( this.businessid,this.empid,this.finyearid,this.statusVal, this.branchsearchid,pageNumber,pageSize)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();

        this.empbusinessvalue = results['data']
        let dataPagination = results['pagination'];
        
        if (this.empbusinessvalue.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isSummaryPagination = true;
        } if (this.empbusinessvalue <= 0) {
          this.isSummaryPagination = false;
        }

        
    
        console.log("result=>", results)
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  identificationSize: number = 10;

  nextClick() {
    if (this.has_next === true) {

      this.currentpage = this.presentpage + 1
      this.empbusinessSearch(this.presentpage + 1, 10)
    }

  }

  previousClick() {
    if (this.has_previous === true) {

      this.currentpage = this.presentpage - 1
      this.empbusinessSearch(this.presentpage - 1, 10)
    }
  }
  clearpopup(){
    this.employeeBusinesssearch.get('employee').reset('')
    this.employeeBusinesssearch.get('business').reset('')
    this.employeeBusinesssearch.get('branchid').reset('')
    this.chipSelectedbusiness = []
    this.busid=[]


  }
  cleardetails(){
    this.chipSelectedbusiness = []
          this.chipSelectedbusinessid = []
          this.busid = []
          this.employeeBusinessSummarysearch.get('employee').reset('')
          this.employeeBusinessSummarysearch.get('branchid').reset('')
          this.employeeBusinessSummarysearch.get('business').reset('')
          this.employeeBusinessSummarysearch.get('finyear').reset('')
          this.employeeBusinessSummarysearch.get('statusbs').reset('')

  }
  color = 'accent';

  status_update(status_details){
    console.log(status_details)
    let dataApprove = confirm("Are you sure, Do you want to change the status?")
    if (dataApprove == false) {
      return false;
    }
    if(status_details.status=="Deactivate"){
      let status_activate={
       "id": status_details.id,
        "status":1
      }
      

      this.pprservice.status_update(status_activate).subscribe(supdate=>{
        console.log("active")
        

    this.empbusinessSearch()

      }, error => {
        this.errorHandler.handleError(error);
        
      })
      console.log("true")
    }else{
      let status_deactivate={
        "id": status_details.id,
         "status":0
       }
       this.pprservice.status_update(status_deactivate).subscribe(supdate=>{
         console.log("active")
    this.empbusinessSearch()

       }, error => {
        this.errorHandler.handleError(error);
      
      })
      console.log("false")
    }
  
// {
//     "emp_id":1,
//     "bs_id":2,
//     "finyear":2223,
//     "status":1
// }

  }
  branchname() {
    let prokeyvalue: String = "";
    this.getbranchid(prokeyvalue);
    this.employeeBusinesssearch.get('branchid').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.pprservice.getbranchdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
              this.branchid=value.id
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
        

      })
  }

  private getbranchid(prokeyvalue) {
    this.pprservice.getbranchdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;

      })
  }

  currentpagebra: any = 1
  has_nextbra: boolean = true
  has_previousbra: boolean = true
  autocompletebranchnameScroll() {
    this.has_nextbra = true
    this.has_previousbra = true
    this.currentpagebra = 1
    setTimeout(() => {
      if (
        this.matAutocompletebrach &&
        this.autocompleteTrigger &&
        this.matAutocompletebrach.panel
      ) {
        fromEvent(this.matAutocompletebrach.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletebrach.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletebrach.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebrach.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebrach.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.pprservice.getbranchdropdown(this.branchsearchInput.nativeElement.value, this.currentpagebra + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
                      this.has_nextbra = datapagination.has_next;
                      this.has_previousbra = datapagination.has_previous;
                      this.currentpagebra = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public displayfnbranch(branch?: branchList): string | undefined {
    return branch ? branch.name : undefined;

  }
  branchnamesearch() {
    let prokeyvalue: String = "";
    this.getbranchsearchid(prokeyvalue);
    this.employeeBusinessSummarysearch.get('branchid').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.pprservice.getbranchdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
              this.branchsearchid=value.id
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchsearchList = datas;
        

      })
  }

  private getbranchsearchid(prokeyvalue) {
    this.pprservice.getbranchdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchsearchList = datas;

      })
  }

 
  autocompletebranchsearchScroll() {
    this.has_nextbra = true
    this.has_previousbra = true
    this.currentpagebra = 1
    setTimeout(() => {
      if (
        this.branchsearch &&
        this.autocompleteTrigger &&
        this.branchsearch.panel
      ) {
        fromEvent(this.branchsearch.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.branchsearch.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.branchsearch.panel.nativeElement.scrollTop;
            const scrollHeight = this.branchsearch.panel.nativeElement.scrollHeight;
            const elementHeight = this.branchsearch.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.pprservice.getbranchdropdown(this.branchContactInput.nativeElement.value, this.currentpagebra + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchsearchList = this.branchsearchList.concat(datas);
                    if (this.branchsearchList.length >= 0) {
                      this.has_nextbra = datapagination.has_next;
                      this.has_previousbra = datapagination.has_previous;
                      this.currentpagebra = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public displayfnbranchsearch(branch?: branchList): string | undefined {
    return branch ? branch.name : undefined;

  }
}
