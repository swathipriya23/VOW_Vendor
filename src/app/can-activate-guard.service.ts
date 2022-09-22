import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CanActivateGuardService implements CanActivate {

  constructor(private router:Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    
    if (localStorage.getItem("sessionData")) {
      
      return true;
    }
    console.log('calling1',localStorage.getItem("sessionData"))
  // not logged in so redirect to login page with the return url and return false
  console.log('calling2,',state.url);
  //Navigation returnURL
  let url = state.url;
  if (url) {
    localStorage.setItem("returnURL", JSON.stringify(url))
    console.log('return URL found', url)
  };
  // this.router.navigate(['verify'], { queryParams: { returnUrl: state.url }});
  this.router.navigate(['loginlogo'], { queryParams: { returnUrl: state.url }});
  // Navigation for return URL
  return false;
  }
}
