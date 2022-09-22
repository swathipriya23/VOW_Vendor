import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';

export interface Department {
  id: string;
  value: string;
}

const AllDepartment: Department[] = [
  {id: '1', value: 'Information Technology'},
  {id: '5', value: 'Sales'},
  {id: '6', value: 'Purchase'},
  {id: '7', value: 'Computer Science'}
];

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  getAllDepartment() {
    return of(AllDepartment);
  }

  public empData = new BehaviorSubject(null);

  constructor() { }

  empDataTransfer(data){
    this.empData.next(data)
  }
}
