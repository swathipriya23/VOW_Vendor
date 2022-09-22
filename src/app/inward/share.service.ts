import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class ShareService {
  public courierEdit = new BehaviorSubject<string>('');
  public channelEdit = new BehaviorSubject<string>('');
  public documentEdit = new BehaviorSubject<string>('');
  public inwardDetailViews = new BehaviorSubject<string>('');
  public inwardData =  new BehaviorSubject<string>('');
 


  constructor() { }
}
