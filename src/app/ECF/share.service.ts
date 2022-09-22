import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor() { }
  public ecfheader = new BehaviorSubject<string>('');
  public ecfapproveheader = new BehaviorSubject<string>('');
  public invheaderid = new BehaviorSubject<string>('');
  public ecfheaderedit = new BehaviorSubject<string>('');
  public coview = new BehaviorSubject<string>('');
  public salesheaderedit =  new BehaviorSubject<string>('');
}
