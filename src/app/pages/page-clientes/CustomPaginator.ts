import { MatLegacyPaginatorIntl as MatPaginatorIntl } from "@angular/material/legacy-paginator";

export function CustomPaginator() {
    const customPaginatorIntl = new MatPaginatorIntl();

    customPaginatorIntl.itemsPerPageLabel = 'Items';

    return customPaginatorIntl;
}