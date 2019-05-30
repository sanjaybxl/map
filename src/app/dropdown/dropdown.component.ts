import {
  Component,
  EventEmitter, OnInit, Input, TemplateRef, ContentChild, Output, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { DropdownItem } from './dropdown.model';

@Component({
  selector: 'gcr-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit, AfterViewInit {
  /** True if area menu is currently shown */
  visible = false;
  dropdownWidth: number;
  dropdownMenuWidth: number;

  /** Width of the dropdown defaults to 160px */
  @Input() size = 160;

  /** Title of dropdown. If not provided, uses text property of selected item */
  @Input() title: string;

  /** Areas to allow navigation between */
  @Input() items: DropdownItem[];

  /** Selected item */
  @Input() selected: DropdownItem;

  /** Template to use for rendering dropdown items */
  @ContentChild('item') itemTemplate: TemplateRef<any>;
  @ContentChild('selectedItemTemplate') selectedItemTemplate: TemplateRef<any>;

  @ViewChild('button') mainButton: ElementRef<HTMLButtonElement>;
  @ViewChild('menu') menu: ElementRef<HTMLDivElement>;

  /** Event emitted when dropdown item selected */
  @Output() itemSelected = new EventEmitter<DropdownItem>();

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log(this.selected);
    
    if (!this.title && !this.selected) {
      this.select(this.items[0]);
    }
  }

  ngAfterViewInit() {
    if (this.menu.nativeElement.offsetWidth < this.size) {
      this.mainButton.nativeElement.style.width = this.size + 'px';
      this.menu.nativeElement.style.width = this.size + 'px';
    } else {
      this.mainButton.nativeElement.style.width = this.menu.nativeElement.offsetWidth + 'px';
      this.menu.nativeElement.style.width = this.menu.nativeElement.offsetWidth + 'px';
    }
    this.cdr.detectChanges();
  }

  /** Open area switcher menu */
  open(event: MouseEvent) {
    event.stopPropagation();
    this.visible = !this.visible;
    console.log(this.visible);
    
    this.menu.nativeElement.style.top = this.mainButton.nativeElement.getBoundingClientRect().bottom + 'px';
    this.menu.nativeElement.style.left = this.mainButton.nativeElement.getBoundingClientRect().left + 'px';

    const windowClickHandler = () => {
      this.close();
      window.removeEventListener('click', windowClickHandler);
    };

    if (this.visible) {
      // listen for clicks outside the menu to close
      window.addEventListener('click', windowClickHandler);
    }
  }

  /** Dropdown item selected */
  dropdownItemSelected(event: MouseEvent, item: DropdownItem) {
    this.select(item);
    event.stopPropagation();
  }

  /** Select a dropdown item */
  select(item: DropdownItem) {
    this.selected = item;
    this.visible = false;
    this.itemSelected.emit(item);
  }

  /** Closes the dropdown menu */
  close() {
    this.visible = false;
  }
}
