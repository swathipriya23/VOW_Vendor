import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../service/data.service'
import { SharedService } from '../../service/shared.service'
import { masterService } from '../../Master/master.service'
import { Observable } from 'rxjs';
import { ElementRef, ViewChild } from '@angular/core';
import { COMMA, ENTER, X } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { map, startWith, finalize, switchMap, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MemoService } from "../../service/memo.service";
import { NotificationService } from '../../service/notification.service'
import { Router } from '@angular/router'

export interface iDepartmentList {
  name: string;
  id: number;
}

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.scss']
})
export class EmployeeViewComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>()
  @Output() onSubmit = new EventEmitter();

  employeeDataList = [];
  empvalue: any;
  empId: any;
  permissionArray = [];

  isShownModule: boolean
  isShownDepartment: boolean
  isShownPermission: boolean

  DeptAddForm: FormGroup;
  public allDepartmentList: iDepartmentList[];
  public chipSelectedDept: iDepartmentList[] = [];
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  public chipSelectedDeptid = [];
  public chipRemovedDeptid = [];
  public deptControl = new FormControl();
  public Admin: boolean = false;
  public Memo: boolean = false;

  isLoading = false;
  finaljson: any;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('deptInput') deptInput: any;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;



  constructor(private router: Router, private formBuilder: FormBuilder, private dataServices: masterService,
    private notification: NotificationService, private sharedService: SharedService,
    private dataService: DataService, private memoService: MemoService) { }


  ngOnInit(): void {

    this.DeptAddForm = this.formBuilder.group({


    })
    if (this.deptControl !== null) {
      this.deptControl.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.memoService.getDepartment(value)

            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.allDepartmentList = datas;
        })

    }

    this.getemployeeView(this.empvalue);
    //this.employeeToDepartment()
    // this.getModuleMappingList();
  }


  employeeToDepartment() {
    if (this.empId === undefined) {
      this.sharedService.empView.subscribe(data => {
        this.empId = data;
      });
    }
    this.getDepartmentList(1)
  }

  private getDepartmentList(pageNumber) {
    if (this.empId === undefined) {
      this.notification.showError("Invalid empid...")
      return false;
    }

    this.memoService.get_empTodeptMapping(this.empId, pageNumber)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.chipSelectedDept = datas;
        let datapagination = results["pagination"];
        if (this.chipSelectedDept.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      });
  }

  nextClickDepartment() {
    if (this.has_next === true) {
      this.getDepartmentList(this.currentpage + 1)
    }
  }

  previousClickDepartment() {
    if (this.has_previous === true) {
      this.getDepartmentList(this.currentpage - 1)
    }
  }

  getemployeeView1(employee) {
    employee = this.sharedService.employeeView.value;
    let idValue = employee.id
    // console.log("bbb", idValue)
    this.empId = idValue
    // console.log("idddd", this.empId)
    this.employeeDataList.push(employee)
    console.log("viewwww", this.employeeDataList)
  }

  getemployeeView(employee) {
    employee = this.sharedService.empView.value;
    let idValue = employee
    this.empId = idValue
    if (this.empId === undefined) {
      this.notification.showError("Invalid empid...")
      return false;
    }
    this.memoService.getSingleEmployee_new(this.empId)
      .subscribe((results: any[]) => {
        let datas = results;
        this.employeeDataList.push(datas)
      })
  }

  SubmitClick() {
    // console.log("adminclick",this.Admin);
    // console.log("memoclick",this.Memo);
    if (this.empId === undefined) {
      this.notification.showError("Invalid empid...")
      return false;
    }
    let memojson: any = [];
    if (this.chipSelectedDeptid.length !== 0) {
      // console.log('addinside')
      let x = JSON.stringify(this.chipSelectedDeptid)
      memojson["department_id"] = JSON.parse(x)
      this.finaljson = JSON.stringify(Object.assign({}, memojson));
      this.memoService.adddept_Toemployee(memojson, this.empId, this.Admin, this.Memo)
        .subscribe(res => {
          // console.log("res",res)
          let code = res.code
          if (code === "PERMISSION DENIED") {
            this.notification.showError("Permission Denied...")
          } else {
            this.notification.showSuccess("Saved Successfully....")
            this.onSubmit.emit()
            return true
          }
        }
        )

    }
    if (this.chipRemovedDeptid.length !== 0) {
      // console.log('deleteinside')
      let x = JSON.stringify(this.chipRemovedDeptid)
      memojson["department_id"] = JSON.parse(x)
      this.finaljson = JSON.stringify(Object.assign({}, memojson));
      this.memoService.removedept_Fromemployee(memojson, this.empId)
        .subscribe(res => {
          this.notification.showSuccess("deleted Successfully ....")
          this.onSubmit.emit()
          return true

        }
        )
    }
    this.chipSelectedDeptid = [];
    this.chipRemovedDeptid = [];
  }

  public removeEmployeeDept(employeedept: iDepartmentList): void {
    const index = this.chipSelectedDept.indexOf(employeedept);

    this.chipRemovedDeptid.push(employeedept.id)
    // console.log('this.chipRemovedDeptid', this.chipRemovedDeptid);
    // console.log(employeedept.id)

    this.chipSelectedDept.splice(index, 1);
    this.chipSelectedDeptid.splice(index, 1);
    return;
  }

  public employeedeptSelected(event: MatAutocompleteSelectedEvent): void {
    // console.log('employeedeptSelected', event.option.value);
    this.selectEmployeeDeptByName(event.option.value.name);
    this.deptInput.nativeElement.value = '';
  }
  private selectEmployeeDeptByName(employeedeptName) {
    // console.log('selectEmployeeDeptByName', employeedeptName)
    let foundEmployeeDept1 = this.chipSelectedDept.filter(employeedept => employeedept.name == employeedeptName);
    if (foundEmployeeDept1.length) {
      // console.log('found in chips');
      return;
    }
    let foundEmployeeDept = this.allDepartmentList.filter(employeedept => employeedept.name == employeedeptName);
    if (foundEmployeeDept.length) {
      // console.log('founde', foundEmployeeDept[0].id);
      this.chipSelectedDept.push(foundEmployeeDept[0]);
      this.chipSelectedDeptid.push(foundEmployeeDept[0].id)
      // console.log(this.chipSelectedDeptid);
    }
  }

  getPermissionList() {
    if (this.empId === undefined) {
      this.sharedService.empView.subscribe(data => {
        this.empId = data;
        // console.log("empId_modulebased",this.empId)
      });
    }
    // console.log("moduletab",this.empId)
    this.dataServices.getPermissionList1(this.empId)
      .subscribe((results: any[]) => {
        // console.log("Sssssssss", results)
        let datas = results["data"];
        datas.forEach((element) => {
          let masterRole = element.role;
          masterRole.forEach(masRoles => {
            let role_code = masRoles.code;
            let role_id = masRoles.id;
            let role_name = masRoles.name;
            let masterRoleDatas = {
              "code": role_code,
              "name": role_name,
              "role_id": role_id,
              "parent_name": element.name,
              "parent_id": element.id,
              "logo": element.log,
              "url": element.url,
            }
            this.permissionArray.push(masterRoleDatas)
          });

          let subModule = element.submodule;
          subModule.forEach(subElement => {
            let suModuleRole = subElement.role;
            suModuleRole.forEach(subModRoles => {
              let role_code = subModRoles.code;
              let role_id = subModRoles.id;
              let name = subModRoles.name;
              let subModuleRoleDatas = {
                "code": role_code,
                "name": name,
                "role_id": role_id,
                "parent_name": subElement.name,
                "parent_id": subElement.id,
                "submodule": element.name,
                "submodule_id": element.id,
                "logo": subElement.log,
                "url": subElement.url,

              }
              this.permissionArray.push(subModuleRoleDatas)
            });
          });
        })
        // console.log("m", this.permissionArray)
      })
  }

  permissionDelete(data) {
    // console.log("Deleee", data)
    this.dataServices.removePermission(data, this.empId)
      .subscribe(result => {
        this.notification.showSuccess(result.message)
        this.permissionArray = [];
        this.getPermissionList()
        // console.log("ssPOOOOOOO", result)
      })
  }

  departmentBtn() {
    this.isShownDepartment = true;
    this.isShownModule = false;
    this.isShownPermission = false;
    // console.log("department clicked")
    this.employeeToDepartment();

  }
  moduleBtn() {
    this.isShownDepartment = false;
    this.isShownModule = true;
    this.isShownPermission = false;
    // console.log("module clicked")
    this.getPermissionList();
  }

  onCancelClick() {
    this.onCancel.emit()
  }
}

class Memo {
  employee_id: any;
}