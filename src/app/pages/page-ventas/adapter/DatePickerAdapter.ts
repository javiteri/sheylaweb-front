import { NativeDateAdapter} from "@angular/material/core";
import { formatDate } from '@angular/common';
import { Injectable } from "@angular/core";

export const PICK_FORMATS = {
    parse: {dateInput: {year: 'numeric',month: 'numeric',day: 'numeric'}},
    display: {
        dateInput: 'dd/MM/YYYY',
        monthYearLabel: {year: 'numeric', month: 'short'},
        dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
        monthYearA11yLabel: {year: 'numeric', month: 'long'}
    },
  };
  
@Injectable()
export class PickDateAdapter extends NativeDateAdapter {

    override parse(value: any, parseFormat?: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            
            if(str[2] && str[2].length == 4){
                const year = Number(str[2]);
                const month = Number(str[1]) - 1;
                const date = Number(str[0]);
                
                return new Date(year, month, date);
            }
            
          }
          const timestamp = typeof value === 'number' ? value : Date.parse(value);
          return isNaN(timestamp) ? super.parse(value, parseFormat) : new Date(timestamp);
        
    }

    override format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'dd/MM/YYYY') {
            return formatDate(date,'dd/MM/YYYY',this.locale);
        } else {
            return date.toDateString();
        }
    }
  }