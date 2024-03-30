import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-custom-file-input',
  templateUrl: './custom-file-input.component.html',
  styleUrls: ['./custom-file-input.component.scss']
})

// El input para subir el contracto
export class CustomFileInputComponent {
  // El tipo de archivo que admite (solo pdf)
  @Input() accept = '';
  //  Emite un evento cuando se selecciona un archivo.
  @Output() fileSelected = new EventEmitter<File>();

  //Obtenemos la referencia ddel elemento #fileInput en el HTML
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  //En lso métodos, accedemos al elemento en el DOM y manipulamos su comportamiento para poder arrastrar y soltar

  // se ejecuta cuando cambia el valor del campo ,emite el evento fileSelected con el archivo
  onFileInputChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileSelected.emit(file);
    }
  }
  //Se ejecuta cuando se suelta un archivo sobre el área del componente.
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.fileInput.nativeElement.parentElement!.classList.remove('drag-over');

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.fileSelected.emit(file);
    }
  }
// se ejecuta cuando se arrastra un archivo sobre el área del componente.
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    //  Añade una clase CSS para indicar que se está arrastrando un archivo sobre él
    this.fileInput.nativeElement.parentElement!.classList.add('drag-over');
  }

  // Se ejecuta cuando se quita un archivo del área del componente mientras se arrastra
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // elimina la clase CSS para indicar que ya no se arastra un archivo
    this.fileInput.nativeElement.parentElement!.classList.remove('drag-over');
  }
}

