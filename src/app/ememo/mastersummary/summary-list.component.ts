import { Component, OnInit } from '@angular/core';
import { DataService} from '../../service/data.service'
import {SharedService} from '../../service/shared.service'
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'app-summary-list',
  templateUrl: './summary-list.component.html',
  styleUrls: ['./summary-list.component.scss']
})
export class SummaryListComponent implements OnInit {

  employeeList: Array<any>;
  categoryList: Array<any>
  subCategoryList: Array<any>
  departmentList: Array<any>
  selectedItem: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  constructor(private dataService: DataService, private router: Router,private shareService:SharedService) { }

  ngOnInit(): void {
    this.getEmployeeList();
    this.getCategoryList();
    this.getSubCategoryList();
    this.getDepartmentList();
  }

  private getEmployeeList() {
    this.dataService.getEmployeeList()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
        // console.log("employeLISSSSS", datas)
      })
  }

  private getCategoryList() {
    this.dataService.getCategoryList()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;
        // console.log("CAtegoryList", datas)
      })
  }





  private getSubCategoryList() {
    this.dataService.getSubCategoryList()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subCategoryList = datas;
        // console.log("SUBCATE", datas)
      })
  }
  private getDepartmentList() {
    this.dataService.getDepartmentList()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.departmentList = datas;
        // console.log("DEPT", datas)

      })
  }




  departmentEdit(data: any) {
    this.shareService.deptEditValue.next(data)
    this.router.navigateByUrl('/ememo/deptEdit',{ skipLocationChange: true })
    return data;
  }


  subCategoryEdit(data: any) {
    this.shareService.subCategoryEditValue.next(data)
    this.router.navigateByUrl('/ememo/subCategoryEdit',{ skipLocationChange: true })
    return data;
  }

  categoryEdit(data: any) {
    this.shareService.categoryEditValue.next(data)
    this.router.navigateByUrl('/ememo/categoryEdit',{ skipLocationChange: true })
    return data;
  }




}
