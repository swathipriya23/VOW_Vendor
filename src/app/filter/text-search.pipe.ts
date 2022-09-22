import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textSearch'
})
export class TextSearchPipe implements PipeTransform {

  transform(items: any, field: any[], defaultFilter: any): any {
    if(!items){
      return [];
    }

    if(!field || !defaultFilter) {
      return items;
    }

    return items.filter(singleItems => {
      let itemFound: boolean;
      for (let i = 0;i < field.length; i++) {
        if (singleItems[field[i]].toLowerCase().indexOf(defaultFilter.toLowerCase()) !== -1) {
          itemFound = true;
          break;
        }
      }
      return itemFound;
    }
    );
  }

}