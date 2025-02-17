import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { parse } from 'date-fns';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ApprovedBook {
  category: string,
  titleBook: string,
  vendor: string,
  equipment: string
}

@Component({
  selector: 'app-dialog-alert',
  templateUrl: './dialog-alert.component.html',
  styleUrls: ['./dialog-alert.component.css']
})

export class DialogAlertComponent implements AfterViewInit {

  displayedColumns: string[] = ['model', 'version', 'equipment', 'vendor'];
  dataSource = new MatTableDataSource([])

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<DialogAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

  async ngAfterViewInit() {
    this.dataSource.data = this.data
    this.dataSource.paginator = this.paginator
  }

  navigate(bookId: number, itemId: number) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`admin/myreviews/${bookId}/item/${itemId}`])
    )
    window.open(url, '_blank')
    this.dialogRef.close()
  }

}
