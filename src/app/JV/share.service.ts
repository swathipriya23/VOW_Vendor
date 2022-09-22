import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor() { }

  public jvlist = new BehaviorSubject<string>('');
}
