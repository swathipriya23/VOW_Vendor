import { ViewContainerRef } from '@angular/core';
import { Directive } from '@angular/core';

@Directive({
  selector: '[appComponentLoader]'
})
export class ComponentLoaderDirective {

  constructor(public viewContainerRef: ViewContainerRef)
  {
  }

}
