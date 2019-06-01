import { Component, OnInit } from '@angular/core';
import { DropdownItem } from '../dropdown/dropdown.model';

@Component({
  selector: 'app-forecasted-weather',
  templateUrl: './forecasted-weather.component.html',
  styleUrls: ['./forecasted-weather.component.scss']
})
export class ForecastedWeatherComponent implements OnInit {

  constructor() { }
  dropDownItems: DropdownItem[] = [
    { text: 'Alarms', colors: ['rgb(120, 0, 12)', 'rgb(244, 67, 54)', 'rgb(233, 30, 99)', 'black'] },
    { text: 'Network', colors: ['red', 'green'] },
    { text: 'Orders', colors: ['red', 'green'] },
    { text: 'Storm Assist', colors: ['red', 'green'] }
  ];
  selectedItem: DropdownItem = 
    { text: 'Alarms', colors: ['rgb(120, 0, 12)', 'rgb(244, 67, 54)', 'rgb(233, 30, 99)'] }

  ngOnInit() {
  }

  onSelected(event:any) {
    this.selectedItem = event;
  }
}
