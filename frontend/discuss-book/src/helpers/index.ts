import { IAnnotationPoint } from '@syncfusion/ej2-pdfviewer';

export function convertToAnnotationPoints(data: any[]): IAnnotationPoint[] {
    return data.map((item) => ({
        x: item.left, // Mapear "left" a "x"
        y: item.top, // Mapear "top" a "y"
        width: item.width, // Mapear "width" a "width"
        height: item.height, // Mapear "height" a "height"
    }));
}
