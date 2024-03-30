import { Component, Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()

// Es el resultados por página de la tabla
// Lo único que hago es cambiarle el label
export class CustomPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Resultados por página';
  verLabel = 'Ver';

   // Sobrescribe el método getRangeLabel de MatPaginatorIntl

  //  override getRangeLabel = (page: number, pageSize: number, length: number) => {
  //   if (length === 0 || pageSize === 0) {
  //     return `0 ${this.verLabel} ${length}`;
  //   }
  //   length = Math.max(length, 0);
  //   const startIndex = page * pageSize;
  //   const endIndex =
  //     startIndex < length
  //       ? Math.min(startIndex + pageSize, length)
  //       : startIndex + pageSize;
  //   return `${startIndex + 1} - ${endIndex} ${this.verLabel} ${length}`;
  // };
}
