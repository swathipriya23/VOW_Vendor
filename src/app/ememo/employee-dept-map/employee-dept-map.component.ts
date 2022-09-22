import { Component, OnInit } from '@angular/core';

import { Observable } from "rxjs";

import { MemoService } from "../../service/memo.service";
import { SharedService } from '../../service/shared.service'
import { Router } from '@angular/router'

export interface iDepartmentList {
  name: string;
  id: number;
}

@Component({
  selector: 'app-employee-dept-map',
  templateUrl: './employee-dept-map.component.html',
  styleUrls: ['./employee-dept-map.component.scss']
})
export class EmployeeDeptMapComponent implements OnInit {

  employeeList: Array<any>;

  constructor(private sharedService: SharedService, private router: Router,
    private memoService: MemoService) { }


  ngOnInit(): void {
    this.getEmployee()
  }



  private getEmployee() {
    this.memoService.getEmployee()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
        // console.log("employeee", datas)


      })
  }

  employeeView(data) {
    // console.log("employeeViee", data)
    this.sharedService.employeeView.next(data)
    this.router.navigateByUrl('/ememo/employeeView', data)

  }

}