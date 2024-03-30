import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { EditarEmpresaModalComponent } from '../editar-empresa-modal/editar-empresa-modal.component';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/shared/services/backend.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { ElementRef } from '@angular/core';
import { DistribuidorElement, TableComponent } from '../table/table.component';
import { CodeService } from 'src/app/shared/services/code.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('cardContent') cardContent!: ElementRef;
  @ViewChild(TableComponent) tableComponent!: TableComponent;
  @Output() contentHeightChanged = new EventEmitter<number>();

  cols: number = 1;
  @Input() username: string = '';
  @Input() role: string = '';

  // controlalos eventos de clic simple y doble
  private singleClick$ = new Subject<void>();
  private doubleClick$ = new Subject<void>();

  private destroy$ = new Subject<void>();

  // variables apra personalziar la tabla
  tileCols!: number;
  tileRows!: number;
  searchBarRowspan!: number;
  largeCardRowspan!: number;
  isPartnerRoute!: boolean;

  sendRequestHoldedCommand(sendBoolean?: boolean): void {
    let url = 'http://localhost:8080/public/syncWithHolded';
    if (sendBoolean === false) {
      url += '?sendBoolean=false';
    }

    this.http.get(url).subscribe(
      (response) => {
        const successMessage = sendBoolean === false
          ? 'Éxito al incorporar los contactos recientes de Holded'
          : 'Exito al incorporar TODOS los contacto de Holded';
        this.snackBar.open(successMessage, 'Close', {
          duration: 1000,
        });
      },
      (error) => {
        console.error(error);
        this.snackBar.open('Error syncing contacts with Holded', 'Close', {
          duration: 1000,
        });
      }
    );
  }
  sendPostRequest(): void {
    this.http.get('/api/sync-with-holded').subscribe(
      (response) => {
        this.snackBar.open('Contacts synced with Holded', 'Close', {
          duration: 1000,
        });
      },
      (error) => {
        console.error(error);
        this.snackBar.open('Error syncing contacts with Holded', 'Close', {
          duration: 1000,
        });
      }
    );
  }

  // se ejecuta cuando se hace clic en el botón "Recientes"
  onRecientesClick(): void {
    console.log('Recientes clicked');
    this.sendRequestHoldedCommand(false);
  }

    // se ejecuta cuando se hace clic en el botón "Todos"

  onTodosClick(): void {
    console.log('Todos clicked');
    this.sendRequestHoldedCommand(true);
  }

  nextPage(): void {
    if(!this.isPartnerRoute ){
      this.tableComponent.changePage(true);
    }
    this.currentPage++;
  }

  previousPage(): void {
    if(!this.isPartnerRoute ){
    this.tableComponent.changePage(false);
    }
    this.currentPage--;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
// para manejar un clic simple
  onSingleClick(): void {
    this.singleClick$.next();
  }

  // para manejar un doble clic
  onDoubleClick(): void {
    this.singleClick$.next();
    this.doubleClick$.next();
  }
  ngOnInit() {
    this.isPartnerRoute = this.router.url.includes('partner');
    this.currentPage=1;
    this.calculatePages();
    this.getSumEmpresas();
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
    this.fetchCountActiveCodes();
    this.getSumEmpresas();
    this.getSumEmpresasRef();
    this.getSumEmpresasPartner();
    this.getSumEmpresasSupra()
    this.getSumLite();
    this.getSumPro();

// TODO: para ahorrar tiempo
    // this.getSumEmpleados();
    // this.getSumEmpresasDistribuidor();
    // this.getCountCodigosDistri();
    // this.getCountLiteVersionClients();
    // this.getCountProVersionClients();
    this.fetchPartnerMetrics();
  }

  private _isSmallScreen!: boolean;
  public get isSmallScreen(): boolean {
    return this._isSmallScreen;
  }
  public set isSmallScreen(value: boolean) {
    this._isSmallScreen = value;
  }
  totalItems = 100; // total number of items to paginate
  pageSize = 10; // initial page size
  currentPage = 1; // initial current page number
  pages: Array<number> = [];


  searchTerm = '';
  data: string[] = ['John', 'Jane', 'Bob', 'Alice'];
  placeholder = 'Introduce una búsqueda...';
  filterValue: string = '';

  sumEmpresas: number = 0;
  sumEmpresasRef: number = 0;

  sumEmpresasSupra: number = 0;
  sumEmpresasPartner: number = 0;

  sumLite: number = 0;
  sumPro: number = 0;
  sumCodigosActivos: number = 0;

  sumEmpresasDistri: number = 0;
  sumEmpleados: number = 0;
  countCodigosDistri: number = 0;
  sumLiteDistri: number = 0;
  sumProDistri: number = 0;
  getSumEmpresas(): void {
    this.http.get('http://localhost:8080/public/sumCompanies').subscribe(
      (response: any) => {
        this.sumEmpresas = response;
      },
      (error) => {
        console.error(error);
        console.log('Error fetching sum of empresas');
      }
    );
  }


  getSumEmpresasRef(): void {
    this.http.get('http://localhost:8080/public/sumReferenciadorCompanies').subscribe(
      (response: any) => {
        this.sumEmpresasRef = response;
      },
      (error) => {
        console.error(error);
        console.log('Error fetching sum of empresas');
      }
    );
  }
  getSumEmpresasPartner(): void {
    this.http.get('http://localhost:8080/public/sumPartnerCompanies').subscribe(
      (response: any) => {
        this.sumEmpresasPartner = response;
      },
      (error) => {
        console.error(error);
        console.log('Error fetching sum of empresas');
      }
    );
  }
  getSumEmpresasSupra(): void {
    this.http.get('http://localhost:8080/public/sumSupraCompanies').subscribe(
      (response: any) => {
        this.sumEmpresasSupra = response;
        console.log(this.sumEmpresasSupra);

      },
      (error) => {
        console.error(error);
        console.log('Error fetching sum of empresas');
      }
    );
  }
  getSumLite(): void {
    this.http.get('http://localhost:8080/public/sumLite').subscribe(
      (response: any) => {
        this.sumLite = response;
      },
      (error) => {
        console.error(error);
        console.log('Error fetching sum of empresas');
      }
    );
  }
  getSumPro(): void {
    this.http.get('http://localhost:8080/public/sumPro').subscribe(
      (response: any) => {
        this.sumPro = response;
      },
      (error) => {
        console.error(error);
        console.log('Error fetching sum of empresas');
      }
    );
  }

    // TODO: para ahorrar tiempo
    fetchPartnerMetrics(): void {
      const distribuidorId = localStorage.getItem('partnerIdClick') || localStorage.getItem('user_partner_id');
      if (distribuidorId) {
        this.http.get<any>(`http://localhost:8080/public/partnerMetrics/${distribuidorId}`).subscribe(
          (data) => {
            this.sumProDistri = data.proVersionClients;
            this.sumLiteDistri = data.liteVersionClients;
            this.sumEmpleados = data.sumEmployees;
            this.countCodigosDistri = data.partnerCodesCount;
            this.sumEmpresasDistri = data.activeClientsCount;
          },
          (error) => {
            console.error('Error fetching partner metrics:', error);
          }
        );
      } else {
        console.log('partnerIdClick or user_partner_id not found in localStorage');
      }
    }

  // Función para manejar el cambio en el filtro
  onFilterChange(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;
    if (this.isPartnerRoute) {
      this.tableComponent.applyFilterClient();
    } else {
      this.tableComponent.applyFilter();
    }


  }

  // Función para abrir un modal de edición de empresa
  openModalEditarEmpresa(): void {
    const dialogRef = this.dialog.open(EditarEmpresaModalComponent, {
      // width: '450px',
      width: this.isSmallScreen ? '25%' : '20%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: this.isSmallScreen ? 'full-screen-dialog' : 'default-dialog'
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }
  openModalAsignar(): void {
    if (this.tableComponent.dataSource.data.length > 0) {
      const firstElement = this.tableComponent.dataSource.data[0] as DistribuidorElement;
      this.tableComponent.openAsignarDistribuidorModal(firstElement);
    } else {
      console.log('No data available in the table');
    }
  }


  get filteredData(): string[] {
    return this.data.filter(item => item.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }
  // actualiza las páginas disponibles en la paginación
  updatePages() {
    this.pages = [];
    const startPage = Math.max(1, this.currentPage - 3);
    const endPage = Math.min(this.totalPages, this.currentPage + 3);
    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }
  }
  //lo de abajo es para el paginador
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;

  }


  isFirstPage(): boolean {
    return this.currentPage === 1;
  }

  isLastPage(): boolean {
    return this.currentPage === this.totalPages;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
  goToPage(page: number) {
    this.currentPage = page;
    this.updatePages();
  }
  calculatePages(): void {
    const totalButtons = 5;
    let startPage = 1;
    let endPage = this.totalPages;

    if (this.totalPages > totalButtons) {
      startPage = Math.max(this.currentPage - 2, 1);
      endPage = Math.min(this.currentPage + 2, this.totalPages);

      if (startPage === 1) {
        endPage = startPage + totalButtons - 1;
      } else if (endPage === this.totalPages) {
        startPage = endPage - totalButtons + 1;
      }
    }

    this.pages = Array.from(Array(endPage - startPage + 1), (_, i) => startPage + i);

  }



  redirectToNewDistribudor() {
    // this.router.navigate(['/admin/addDistri']);
    this.router.navigate(['/panel/admin/nuevoPartner']);
  }
  redirectToNewEmpresa() {
    // this.router.navigate(['/admin/addDistri']);
    this.router.navigate(['/panel/partner/nuevaEmpresa']);
  }

  fetchCountActiveCodes(): void {
    this.codeService.getCountActiveCodes().subscribe(
      (count) => {
        this.sumCodigosActivos = count;
      },
      (error) => {
        console.error(error);
        console.log('Error fetching count of active codes');
      }
    );
  }
  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    public router: Router,
    private backend: BackendService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private codeService: CodeService,
  ) {
    this.getDistribuidores;
    this.router = router;
    this.breakpointObserver
    .observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ])
    .subscribe((result) => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.tileCols = 4;
        this.tileRows = 8;
        this.searchBarRowspan = 3;
        this.largeCardRowspan = 1090;
      } else if (result.breakpoints[Breakpoints.Small]) {
        this.tileCols = 2;
        this.tileRows = 8;
        this.searchBarRowspan = 3;
        this.largeCardRowspan = 1090;
      } else if (result.breakpoints[Breakpoints.Medium]) {
        this.tileCols = 2;
        this.tileRows = 8;
        this.searchBarRowspan = 3; // Adjust the rowspan for the search bar
        this.largeCardRowspan = 1086; // Adjust the rowspan for the large card
      }  else {
        this.tileCols = 1;
        this.tileRows = 8;
        this.searchBarRowspan = 3;
        this.largeCardRowspan = 1090;
      }
    });

  }


  getDistribuidores() {
    this.backend.getDistribudors().subscribe((data) => {
      console.log(data);
      this.data = data;
    });
  }



}
