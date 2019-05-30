import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'gcr-icon',
  templateUrl: './gcr-icon.component.html',
  styleUrls: ['./gcr-icon.component.scss']
})
export class IconComponent implements OnInit {
  isPredixIcon: boolean;
  isSelected: boolean = false;
  @Input() icon: string;
  @Input() readonly: boolean = false;
  @Input() isToggleIcon: boolean;
  @Output() iconSelect: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    if (this.icon.slice(0, 3) === 'px-') {
      this.isPredixIcon = true;
    } else {
      this.isPredixIcon = false;
    }
  }

  toggleIcon(event: Event) {
    if (this.isToggleIcon) {
        this.isSelected = !this.isSelected;
        this.iconSelect.emit(this.isSelected);
    }

  }
}
