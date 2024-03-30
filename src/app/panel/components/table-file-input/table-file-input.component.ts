import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table-file-input',
  templateUrl: './table-file-input.component.html',
  styleUrls: ['./table-file-input.component.scss']
})
export class TableFileInputComponent {
  @Output() fileSelected = new EventEmitter<File>();

  constructor() {}

  ngOnInit(): void {}

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.fileSelected.emit(event.target.files[0]);
    }
  }
}
