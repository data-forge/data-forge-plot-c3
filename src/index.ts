import { IChartDef } from "@data-forge-plot/chart-def";
import { formatChartDef } from "./lib/format-chart-def";
export { formatChartDef } from "./lib/format-chart-def";
import * as c3 from "c3";

//
// Interface to control and configure a mounted chart.
//
export interface IChart {

    //
    // Unmount the chart.
    //
    unmount(): void;

    //
    // Size the chart to fit its container.
    //
    sizeToFit(): void;
}

//
// Wrapper for a C3 chart.
//
class C3Chart implements IChart {

    //
    // The C3 chart object.
    //
    private chart?: c3.ChartAPI;

    constructor(chart: c3.ChartAPI) {
        this.chart = chart;
    }

    //
    // Unmount the chart.
    //
    public unmount(): void {
        if (this.chart) {
            this.chart.destroy();
            this.chart = undefined;
        }
    }

    //
    // Size the chart to fit its container.
    //
    public sizeToFit(): void {
        if (this.chart) {
            this.chart.resize();
        }
    }
}

//
// Mount the chart on the DOM element.
//
export function mountChart(chartDef: IChartDef, domElement: HTMLElement): IChart {
    const c3ChartDef = formatChartDef(chartDef); //TODO: This can be properly typed to a c3 chart configuration!
    c3ChartDef.bindto = domElement;
    const chart = c3.generate(c3ChartDef);
    const c3Chart = new C3Chart(chart);
    return c3Chart;
}