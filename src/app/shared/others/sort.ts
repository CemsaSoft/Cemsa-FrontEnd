export class Sort {

    private tipoOrden = 1;
    private collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base",
    });


    constructor() {
    }

    public comenzarOrdenamiento(propiedad: string | number, orden: string, tipo = "") {
        if (orden === "desc") {
            this.tipoOrden = -1;
        }
        return (a: { [x: string]: string; }, b: { [x: string]: string; }) => {
            if (tipo === "date") {
                return this.ordenarDatos(new Date(a[propiedad]), new Date(b[propiedad]));
            }
            else {
                return this.collator.compare(a[propiedad], b[propiedad]) * this.tipoOrden;
            }
        }
    }

    private ordenarDatos(a: number | Date, b: number | Date) {
        if (a < b) {
            return -1 * this.tipoOrden;
        } else if (a > b) {
            return 1 * this.tipoOrden;
        } else {
            return 0 * this.tipoOrden;
        }
    }
    
}