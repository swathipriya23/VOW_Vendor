import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { masterService } from '../master.service'
import { ElementRef, ViewChild } from '@angular/core';
import { map, startWith, finalize, switchMap, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { NotificationService } from '../../service/notification.service'
import { MatChipInputEvent } from '@angular/material/chips';
import { isBoolean } from 'util';
export interface iEmployeeList {
  full_name: string;
  id: number;
}

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>()
  permissionForm: FormGroup;
  moduleList: Array<any>;
  roleList: Array<any>;
  subMoudleList: Array<any>;
  subMoudleList1: Array<any>;
  employeeIdValue: any=[];
  isModule: boolean;
  isLoading = false;
  finaljson: any;
  permissionModule = [];
  isMaster: boolean;
  isInwardMasteer: boolean;
  public allEmployeeList: iEmployeeList[];
  public chipSelectedEmployee: iEmployeeList[] = [];
  public chipSelectedEmployeeid = [];
  public chipRemovedEmployeeid = [];
  public employeeControl = new FormControl();

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('employeeInput') employeeInput: any;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  constructor(private formBuilder: FormBuilder, private dataService: masterService,
    private notification: NotificationService, private router: Router) { }

  ngOnInit(): void {
    this.permissionForm = this.formBuilder.group({
      module_id: ['', Validators.required],
      role_id: ['', Validators.required],
      submodule_id: [{ value: "", disabled: isBoolean }, Validators.required],
    })
    if (this.employeeControl !== null) {
      this.employeeControl.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.dataService.get_EmployeeList(value)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.allEmployeeList = datas;
          // console.log("alllemployeeeisttt", datas)

        })

    }
    this.getModule();
    this.getRole();
  }

  filter(data) {
    // console.log(data.value);
  }
  filter1(data) {
    // console.log(data.value);
  }

  // createFormat() {
  //   let data = this.permissionForm.controls;
  //   let permission = new Permission();
  //   permission.module_id = data['module_id'].value;
  //   permission.role_id = data['role_id'].value;

  //   // console.log("permission", permission)
  //   return permission;
  // }

  private getModule() {
    this.dataService.getModule()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.moduleList = datas;
        // console.log("DAAAAAAAAAAAAAAAAAA", datas)
        datas.forEach((element) => {
          let subModule = element.submodule;
          if (element.name === "Masters") {
            this.subMoudleList = subModule;
            this.isMaster = element.name === "Masters" ? true : false;
            // console.log("MAterValue", this.subMoudleList)
          } else if (element.name === "iMaster") {
            this.subMoudleList1 = subModule;
            this.isInwardMasteer = element.name === "iMaster" ? true : false;
            // console.log("Imastswrevalue", this.subMoudleList)
          }
        })
        // console.log("><<SSKSK", this.subMoudleList);

      })
  }
  private getRole() {
    this.dataService.getRole()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.roleList = datas;
        // console.log("role", datas)

      })
  }
  // submitForm() {
  //   let memojson: any = [];

  //   if (this.chipSelectedEmployeeid.length !== 0) {
  //     // console.log('addinside')
  //     let x = JSON.stringify(this.chipSelectedEmployeeid)
  //     memojson["add"] = JSON.parse(x)
  //     this.finaljson = JSON.stringify(Object.assign({}, memojson));
  //     this.dataService.addPermission(memojson, this.createFormat())
  //       .subscribe(res => {
  //         this.notification.showSuccess("Assigned Successfully....")
  //         this.router.navigate(['/master'], { skipLocationChange: true })
  //         return true
  //       }
  //       )

  //   }
  //   if (this.chipRemovedEmployeeid.length !== 0) {
  //     // console.log('deleteinside')
  //     let x = JSON.stringify(this.chipRemovedEmployeeid)
  //     memojson["remove"] = JSON.parse(x)
  //     this.finaljson = JSON.stringify(Object.assign({}, memojson));
  //     this.dataService.removeEmployee(memojson, this.createFormat())
  //       .subscribe(res => {
  //         this.notification.showSuccess("deleted Successfully ....")
  //         this.router.navigate(['/master'], { skipLocationChange: true })
  //         return true

  //       }
  //       )
  //   }
  //   this.chipSelectedEmployeeid = [];
  //   this.chipRemovedEmployeeid = [];


  // }

  public removeEmployee(employee: iEmployeeList): void {
    const index = this.chipSelectedEmployee.indexOf(employee);

    this.chipRemovedEmployeeid.push(employee.id)
    // console.log('this.chipRemovedEmployeeid', this.chipRemovedEmployeeid);
    // console.log(employee.id)

    this.chipSelectedEmployee.splice(index, 1);
    // console.log(this.chipSelectedEmployee);
    this.chipSelectedEmployeeid.splice(index, 1);
    // console.log(this.chipSelectedEmployeeid);
    return;
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
      this.employeeIdValue = this.chipSelectedEmployeeid;

    }
  }

  onCancelClick() {
    this.onCancel.emit()
  }

  ddModuleChangee(e) {
    let data = e.submodule.length;
    let sub_module = e.submodule;
    this.subMoudleList = sub_module;
    if (data === 0) {
      this.permissionForm.get('submodule_id').disable();
    }
    else if (sub_module) {
      this.permissionForm.get('submodule_id').enable();
    }

  }


  submitPermission() {
    if( this.employeeIdValue.length==0){
      this.notification.showWarning('Please Select Employee ID or Name');
      return false;
    }
    var answer = window.confirm("Add permission?");
    if (answer) {
        //some code
    }
    else {
      return false;
    }
    this.dataService.addPermission(this.permissionForm.value, this.employeeIdValue)
      .subscribe(result => {
        this.notification.showSuccess(result.message)
      })
  }

}
class Permission {
  module_id: number;
  role_id: number;

}

  