import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router'
import { Validators, FormArray } from '@angular/forms';
import { SharedService } from '../../service/shared.service'
import { DataService } from '../../service/data.service'
import { ElementRef, ViewChild } from '@angular/core';
import { map, startWith, finalize, switchMap, debounceTime, distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NotificationService } from '../../service/notification.service'
import { MatChipInputEvent } from '@angular/material/chips';

export interface iEmployeeList {
  full_name: string;
  id: number;
}
export interface iDepartmentList {
  name: string;
  id: number;
}

@Component({
  selector: 'app-department-view',
  templateUrl: './department-view.component.html',
  styleUrls: ['./department-view.component.scss']
})
export class DepartmentViewComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  EmpAddForm: FormGroup;
  employeeList: Array<any>
  empId: Array<any>
  deptId: any;
  deptValue: any;
  deptNameee: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  departmentDataList = []
  data = []

  isLoading = false;
  finaljson: any;

  public allEmployeeList: iEmployeeList[];
  public chipSelectedEmployee: iEmployeeList[] = [];
  public chipSelectedEmployeeid = [];
  public chipRemovedEmployeeid = [];
  public employeeControl = new FormControl();
  public allDepartmentList: iDepartmentList[];
  public chipSelectedDepartment: iDepartmentList[] = [];
  public chipSelectedDepartmentid = [];
  public departmentControl = new FormControl();
  public isAdminUser: boolean = false;
  public Admin: boolean = false;
  public Memo: boolean = false;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('employeeInput') employeeInput: any;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('departmentInput') departmentInput: any;
  @ViewChild('autoDept') matAutocompleteDept: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  constructor(private formBuilder: FormBuilder, private notification: NotificationService,
    private dataService: DataService, private router: Router, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.EmpAddForm = this.formBuilder.group({

    })
    if (this.employeeControl !== null) {
      this.employeeControl.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.dataService.get_EmployeeList(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          let datapagination = results["pagination"];
          this.allEmployeeList = datas;
          // console.log("alllemployeeeisttt", datas)
          if (this.allEmployeeList.length >= 0) {
            this.has_next = datapagination.has_next;
            // console.log('this.has_next', this.has_next);
            this.has_previous = datapagination.has_previous;
            this.currentpage = datapagination.index;
          }

        })

    }
    if (this.departmentControl !== null) {
      this.departmentControl.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.dataService.get_DepartmentList(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          let datapagination = results["pagination"];
          this.allDepartmentList = datas;
          // console.log("allldepartmentlisttt", datas)
          if (this.allDepartmentList.length >= 0) {
            this.has_next = datapagination.has_next;
            // console.log('this.has_next', this.has_next);
            this.has_previous = datapagination.has_previous;
            this.currentpage = datapagination.index;
          }

        })

    }
    // this.getDepartmentView(this.deptValue);
    // this.getDepartmentToEmployeeList(this.deptId);
    // this.getDepartmentName(this.deptId);
    this.getDepartmentView();
    this.getDepartmentToEmployeeList(this.deptId);
    this.getDepartmentName(this.deptId);
  }

  // create(){
  //   let memoclass = new Memo();
  //   memoclass.confidential=this.Confidential;
  //   // console.log("click",memoclass)
  // }

  // onCheckBoxChangeAdmin() {
  //   // console.log("click",this.Admin);
  // }
  // onCheckBoxChangeMemo() {
  //   if (this.memo === true) {
  //     // console.log("memoclicked", this.memo)
  //   } else {
  //     this.memo = false;
  //     // console.log("memounclick", this.memo)
  //   }
  // }
   
   

  submitForm() {
    // console.log("adminclick",this.Admin);
    // console.log("memoclick",this.Memo);
    let memojson: any = [];
    if (this.chipSelectedEmployeeid.length !== 0) {
      // console.log('addinside')
      let x = JSON.stringify(this.chipSelectedEmployeeid)
      memojson["employee_id"] = JSON.parse(x)
      this.finaljson = JSON.stringify(Object.assign({}, memojson));
      this.dataService.addemp_Todepartment(memojson, this.deptId, this.Admin, this.Memo)
        .subscribe(res => {
          // console.log("res",res)
          let code = res.code
          if (code === "PERMISSION DENIED"){   
            this.notification.showError("Permission Denied...")
          } else {
            this.notification.showSuccess("Assigned Successfully....")
            this.getDepartmentToEmployeeList(this.deptId);
            return true
          }          
        }
        )

    }
    this.chipSelectedEmployeeid = [];

  }

  autocompleteEmployeeScroll() {
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
            // console.log('fetchmoredata', scrollTop, elementHeight, scrollHeight, atBottom);
            if (atBottom) {
              // fetch more data
              // console.log('fetchmoredata1', this.has_next);
              // console.log(this.employeeInput.nativeElement.value);
              if (this.has_next === true) {
                this.dataService.get_EmployeeList(this.employeeInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.allEmployeeList = this.allEmployeeList.concat(datas);
                    // console.log("emp", datas)
                    if (this.allEmployeeList.length >= 0) {
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

  autocompleteDepartmentScroll() {
    setTimeout(() => {
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
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            // console.log('fetchmoredataa', scrollTop, elementHeight, scrollHeight, atBottom);
            if (atBottom) {
              // fetch more data
              // console.log('fetchmoredata2', this.has_next);
              // console.log(this.departmentInput.nativeElement.value);
              if (this.has_next === true) {
                this.dataService.get_DepartmentList(this.departmentInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.allDepartmentList = this.allDepartmentList.concat(datas);
                    // console.log("dept", datas)
                    if (this.allDepartmentList.length >= 0) {
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

  public removeEmployee(employee: iEmployeeList): void {
    const index = this.chipSelectedEmployee.indexOf(employee);

    // this.chipRemovedEmployeeid.push(employee.id)
    // // console.log('this.chipRemovedEmployeeid', this.chipRemovedEmployeeid);
    // // console.log(employee.id)
    if (index >= 0) {

      this.chipSelectedEmployee.splice(index, 1);
      // console.log(this.chipSelectedEmployee);
      this.chipSelectedEmployeeid.splice(index, 1);
      // console.log(this.chipSelectedEmployeeid);
      this.employeeInput.nativeElement.value = '';
    }

  }

  public employeeSelected(event: MatAutocompleteSelectedEvent): void {
    // console.log('employeeSelected', event.option.value.full_name);
    this.selectEmployeeByName(event.option.value.full_name);
    this.employeeInput.nativeElement.value = '';
  }
  private selectEmployeeByName(employeeName) {
    let foundEmployee1 = this.chipSelectedEmployee.filter(employee => employee.full_name == employeeName);
    if (foundEmployee1.length) {
      // console.log('found in chips');
      return;
    }
    let foundEmployee = this.allEmployeeList.filter(employee => employee.full_name == employeeName);
    if (foundEmployee.length) {
      // We found the employeecc name in the allEmployeeList list
      // console.log('founde', foundEmployee[0].id);
      this.chipSelectedEmployee.push(foundEmployee[0]);
      this.chipSelectedEmployeeid.push(foundEmployee[0].id)
      // console.log(this.chipSelectedEmployeeid);
    }
  }

  public removeDepartment(department: iDepartmentList): void {
    const index = this.chipSelectedDepartment.indexOf(department);

    if (index >= 0) {

      this.chipSelectedDepartment.splice(index, 1);
      // console.log(this.chipSelectedDepartment);
      this.chipSelectedDepartmentid.splice(index, 1);
      // console.log(this.chipSelectedDepartmentid);
      this.departmentInput.nativeElement.value = '';
    }

  }
  public departmentSelected(event: MatAutocompleteSelectedEvent): void {
    // console.log('departmentSelected', event.option.value.name);
    this.selectDepartmentByName(event.option.value.name);
    this.departmentInput.nativeElement.value = '';
    // console.log("ss-----")
    this.getDepartmentName(event.option.value.id)
    // console.log("id--------", event.option.value.id)
    this.getDepartmentToEmployeeList(event.option.value.id)
    // console.log("id1-----", event.option.value.id)
  }
  private selectDepartmentByName(departmentName) {
    let foundDepartment1 = this.chipSelectedDepartment.filter(department => department.name == departmentName);
    if (foundDepartment1.length) {
      // console.log('found in chips');
      return;
    }
    let foundDepartment = this.allDepartmentList.filter(department => department.name == departmentName);
    if (foundDepartment.length) {
      // We found the employeecc name in the allEmployeeList list
      // console.log('founde', foundDepartment[0].id);
      this.chipSelectedDepartment.push(foundDepartment[0]);
      this.chipSelectedDepartmentid.push(foundDepartment[0].id)
      // console.log(this.chipSelectedDepartmentid);
    }
  }

  getDepartmentView() {
    this.deptId = this.sharedService.departmentView.value;
  }

  getDepartmentView1(deptValue) {
    deptValue = this.sharedService.departmentView.value;
    let deptName = deptValue.name
    this.deptNameee = deptName
    // console.log("deptNameee", this.deptNameee)
    let idValue = deptValue.id
    // console.log("idValue", idValue)
    this.deptId = idValue
    // console.log("deptId", this.deptId)
  }

  getDepartmentName(id) {
    this.dataService.get_Department(id)
      .subscribe((results: any[]) => {
        let value = results;
        console.log(value);
        this.isAdminUser=results['isadmin'];

        let array: any = [];
        array.push(value)
        this.chipSelectedDepartment = array
        // console.log("d", this.chipSelectedDepartment)
      })
  }

  private getDepartmentToEmployeeList(id) {
    this.departmentDataList = []
    this.dataService.getDepartmentToEmployeeList(id)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        datas.forEach((element) => {
          let employee = element;
          let idd = employee.id
          let Code = element.code;
          let Name = element.full_name;
          let cancreate=element.can_create;
          let isadmin=element.isadmin;
          if (idd !== undefined) {
          this.dataService.get_empTodeptMapping(idd)
            .subscribe((res: any[]) => {
              let deptData = res["data"];
              this.data = deptData
              let deptArray = []
              for (let i = 0; i < deptData.length; i++) {
                let deptname = {
                  "deptId": deptData[i].id,
                  "deptName": deptData[i].name,
                }
                deptArray.push(deptname)
              }
              let deptname = deptArray
              let list = {
                "ID": idd,
                "code": Code,
                "empName": Name,
                "deptName": deptname,
                "can_create":cancreate,
                "isadmin":isadmin
              }
              this.departmentDataList.push(list)
            })
          }
        })
      })
  }
  departmentClick(datas) {
    // console.log("click", datas)
    let ids = datas.deptId
    this.deptId = ids
    // console.log("deptId", ids)
    this.getDepartmentName(ids);
    this.getDepartmentToEmployeeList(ids)
  }

  deleteEmployee(data) {
    let memojson1: any = [];
    let value = data.ID
    let array: any = [];
    array.push(value)
    memojson1["employee_id"] = array
    this.finaljson = JSON.stringify(Object.assign({}, memojson1));
    this.dataService.employeeDelete(memojson1, this.deptId)
      .subscribe(result => {
        if(result['code'] !=undefined){
          this.notification.showError(result['code']);
          this.notification.showError(result['description']);
        }
        else{
          this.notification.showSuccess("Successfully deleted....")
          this.getDepartmentToEmployeeList(this.deptId);
          return true
        }
        // console.log("deleteemployee", result)
       

      })
  }

  onCancelClick() {
    this.onCancel.emit()
  }
}
// class Memo {
//   confidential;any;
// }
