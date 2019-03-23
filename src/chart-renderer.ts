import { IChartDef } from "./external_to_be_moved/chart-def";
import { formatChartDef } from "./lib/format-chart-def";
import * as c3 from "c3";

//
// Render the chart to the DOM element.
//
export function renderChart(chartDef: IChartDef, domElement: HTMLElement): void {
    const c3ChartDef = formatChartDef(chartDef); //TODO: This can be properly typed to a c3 chart configuration!
    c3ChartDef.bindto = domElement;
    c3.generate(c3ChartDef);
}