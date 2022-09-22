import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class faShareService {
  public assetcategoryedit = new BehaviorSubject<string>('');
  public regular = new BehaviorSubject<any>('');
  public quantity = new BehaviorSubject<any>('');
  public checklist = new BehaviorSubject<any>('');
  public button = new BehaviorSubject<any>('');
  public checkerlist = new BehaviorSubject<any>('');
  public asset_id=new BehaviorSubject<any>('');
  public splitData=new BehaviorSubject<any>('');
  public view_id=new BehaviorSubject<any>('');
  public bucket_id=new BehaviorSubject<any>('');



  constructor() { }
}
