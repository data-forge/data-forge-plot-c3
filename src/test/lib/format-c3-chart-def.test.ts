import "jest";
import { formatChartDef } from "../../lib/format-chart-def";
import { ISerializedDataFrame } from "@data-forge/serialization";
import * as Sugar from "sugar";
import { IAxisSeriesConfig, IYAxisSeriesConfig, ILegendConfig, IChartDef, ChartType, AxisType } from "@data-forge-plot/chart-def";

export interface ITestChartDef {
    data: ISerializedDataFrame;
    x: IAxisSeriesConfig;
    y: IYAxisSeriesConfig[];
    y2?: IYAxisSeriesConfig[];
    legend?: ILegendConfig;
}

describe("format c3 chart", () => {

    it("throws when configuration is invalid", () => {
        expect (() => formatChartDef({} as IChartDef)).toThrow();
    });

    function createMinimalChartDef(testChartDef: ITestChartDef) {
        const chartDef: IChartDef = {
            data: testChartDef.data,
            plotConfig: {
                chartType: ChartType.Line,
                width: 800,
                height: 600,
                x: {},
                y: {},
                y2: {},
                legend: {
                    show: testChartDef.legend 
                        && testChartDef.legend.show !== undefined 
                        && testChartDef.legend.show 
                        || true,
                },
            },

            axisMap: {
                x: testChartDef.x,
                y: testChartDef.y,
                y2: testChartDef.y2 || [],
            },
        };
        return chartDef;
    }

    it("minimal chart def", ()  => {

        const chartDef = createMinimalChartDef({
            data: {
                columnOrder: ["__value__"],
                columns: {
                    __value__: "number",
                },
                index: {
                    type: "number",
                    values: [5, 6],
                },
                values: [
                    {
                        __value__: 10,
                    },
                    {
                        __value__: 20,
                    },
                ],
            },
            x: { series: "__index__" },
            y: [{ series: "__value__" }],
        });

        const c3ChartDef = formatChartDef(chartDef);
        expect(c3ChartDef).toEqual({
            size: {
                width: 800,
                height: 600,
            },
            data: {
                xs: {
                    __value__: "__index__",
                },
                columns: [
                    [
                        "__value__",
                        10,
                        20,
                    ],
                    [
                        "__index__",
                        5,
                        6,
                    ],
                ],
                type: "line",
                axes: {
                    __value__: "y",
                },
                names: {},
            },
            axis: {
                x: {
                    show: true,
                    type: "indexed",
                },
                y: {
                    show: true,
                    type: "indexed",
                },
                y2: {
                    show: false,
                },
            },
            transition: {
                duration: 0,
            },
            point: {
                show: false,
            },
            legend: {
                show: true,
            },
        });
    });

    it("can set x and y axis expicitly", ()  => {

        const chartDef = createMinimalChartDef({
            data: {
                columnOrder: ["a", "b", "c", "d"],
                columns: {
                    a: "number",
                    b: "number",
                    c: "number",
                    d: "number",
                },
                index: {
                    type: "number",
                    values: [ 5, 6 ],
                },
                values: [
                    {
                        a: 10,
                        b: 100,
                        c: 1000,
                        d: 10000,
                    },
                    {
                        a: 20,
                        b: 200,
                        c: 2000,
                        d: 20000,
                    },
                ],
            },
            x: { series: "a" },
            y: [{ series: "b" }],
        });

        const c3ChartDef = formatChartDef(chartDef);
        expect(c3ChartDef).toEqual({
            size: {
                width: 800,
                height: 600,
            },
            data: {
                xs: {
                    b: "a",
                },
                columns: [
                    ["b", 100, 200],
                    ["a", 10, 20],
                ],
                type: "line",
                axes: {
                    b: "y",
                },
                names: {},
            },
            axis: {
                x: {
                    show: true,
                    type: "indexed",
                },
                y: {
                    show: true,
                    type: "indexed",
                },
                y2: {
                    show: false,
                },
            },
            transition: {
                duration: 0,
            },
            point: {
                show: false,
            },
            legend: {
                show: true,
            },
        });
    });

    it("can set second y axis", ()  => {

        const chartDef = createMinimalChartDef({
            data: {
                columnOrder: ["a", "b", "c", "d"],
                columns: {
                    a: "number",
                    b: "number",
                    c: "number",
                    d: "number",
                },
                index: {
                    type: "number",
                    values: [ 5, 6 ],
                },
                values: [
                    {
                        a: 10,
                        b: 100,
                        c: 1000,
                        d: 10000,
                    },
                    {
                        a: 20,
                        b: 200,
                        c: 2000,
                        d: 20000,
                    },
                ],
            },
            x: { series: "a" },
            y: [{ series: "b" }],
            y2: [{ series: "c" }],
        });

        const c3ChartDef = formatChartDef(chartDef);
        expect(c3ChartDef).toEqual({
            size: {
                width: 800,
                height: 600,
            },
            data: {
                xs: {
                    b: "a",
                    c: "a",
                },
                columns: [
                    [
                        "b",
                        100,
                        200,
                    ],
                    [
                        "a",
                        10,
                        20,
                    ],
                    [
                        "c",
                        1000,
                        2000,
                    ],
                ],
                type: "line",
                axes: {
                    b: "y",
                    c: "y2",
                },
                names: {},
            },
            axis: {
                x: {
                    show: true,
                    type: "indexed",
                },
                y: {
                    show: true,
                    type: "indexed",
                },
                y2: {
                    show: true,
                    type: "indexed",
               },
            },
            transition: {
                duration: 0,
            },
            point: {
                show: false,
            },
            legend: {
                show: true,
            },
        });
    });

    it("can set multiple y axis", ()  => {

        const chartDef = createMinimalChartDef({
            data: {
                columnOrder: ["a", "b", "c", "d", "e"],
                columns: {
                    a: "number",
                    b: "number",
                    c: "number",
                    d: "number",
                    e: "number",
                },
                index: {
                    type: "number",
                    values: [ 5, 6 ],
                },
                values: [
                    {
                        a: 10,
                        b: 100,
                        c: 1000,
                        d: 10000,
                        e: 100000,
                    },
                    {
                        a: 20,
                        b: 200,
                        c: 2000,
                        d: 20000,
                        e: 200000,
                    },
                ],
            },
            x: { series: "a" },
            y: [{ series:  "b" }, { series: "c" } ],
            y2: [ { series: "d" }, { series: "e" } ],
        });

        const c3ChartDef = formatChartDef(chartDef);

        expect(c3ChartDef).toEqual({
            size: {
                width: 800,
                height: 600,
            },
            data: {
                xs: {
                    b: "a",
                    c: "a",
                    d: "a",
                    e: "a",
                },
                columns: [
                    [
                        "b",
                        100,
                        200,
                    ],
                    [
                        "a",
                        10,
                        20,
                    ],
                    [
                        "c",
                        1000,
                        2000,
                    ],
                    [
                        "d",
                        10000,
                        20000,
                    ],
                    [
                        "e",
                        100000,
                        200000,
                    ],
                ],
                type: "line",
                axes: {
                    b: "y",
                    c: "y",
                    d: "y2",
                    e: "y2",
                },
                names: {},
            },
            axis: {
                x: {
                    show: true,
                    type: "indexed",
                },
                y: {
                    show: true,
                    type: "indexed",
                },
                y2: {
                    show: true,
                    type: "indexed",
                },
            },
            transition: {
                duration: 0,
            },
            point: {
                show: false,
            },
            legend: {
                show: true,
            },
        });
    });

    it("can set x axis for y axis", ()  => {

        const chartDef = createMinimalChartDef({
            data: {
                columnOrder: ["a", "b", "c", "d", "e"],
                columns: {
                    a: "number",
                    b: "number",
                    c: "number",
                    d: "number",
                    e: "number",
                },
                index: {
                    type: "number",
                    values: [ 5, 6 ],
                },
                values: [
                    {
                        a: 10,
                        b: 100,
                        c: 1000,
                        d: 10000,
                        e: 100000,
                    },
                    {
                        a: 20,
                        b: 200,
                        c: 2000,
                        d: 20000,
                        e: 200000,
                    },
                ],
            },
            x: { series: "__index__" },
            y: [
                {
                    series: "b",
                    x: { series: "a" },
                },
                {
                    series: "c",
                    x: { series: "d" },
                },
            ],
            y2: [
                {
                    series: "e",
                    x: { series: "a" },
                },
            ],
        });

        const c3ChartDef = formatChartDef(chartDef);
        expect(c3ChartDef).toEqual({
            size: {
                width: 800,
                height: 600,
            },
            data: {
                xs: {
                    b: "a",
                    c: "d",
                    e: "a",
                },
                columns: [
                    [
                        "b",
                        100,
                        200,
                    ],
                    [
                        "a",
                        10,
                        20,
                    ],
                    [
                        "c",
                        1000,
                        2000,
                    ],
                    [
                        "d",
                        10000,
                        20000,
                    ],
                    [
                        "e",
                        100000,
                        200000,
                    ],
                ],
                type: "line",
                axes: {
                    b: "y",
                    c: "y",
                    e: "y2",
                },
                names: {},
            },
            axis: {
                x: {
                    show: true,
                    type: "indexed",
                },
                y: {
                    show: true,
                    type: "indexed",
                },
                y2: {
                    show: true,
                    type: "indexed",
                },
            },
            transition: {
                duration: 0,
            },
            point: {
                show: false,
            },
            legend: {
                show: true,
            },
        });
    });

    it("can configure legend", ()  => {

        const chartDef = createMinimalChartDef({
            data: {
                columnOrder: ["a", "b", "c", "d", "e"],
                columns: {
                    a: "number",
                    b: "number",
                    c: "number",
                    d: "number",
                    e: "number",
                },
                index: {
                    type: "number",
                    values: [ 5, 6 ],
                },
                values: [
                    {
                        a: 10,
                        b: 100,
                        c: 1000,
                        d: 10000,
                        e: 100000,
                    },
                    {
                        a: 20,
                        b: 200,
                        c: 2000,
                        d: 20000,
                        e: 200000,
                    },
                ],
            },
            x: { series: "__index__" },
            y: [
                {
                    series: "b",
                    x: { series: "a" },
                },
                {
                    series: "c",
                    x: { series: "d" },
                },
            ],
            y2: [
                {
                    series: "e",
                    x: { series: "a" },
                },
            ],
            legend: {
                show: true,
            },
        });

        const c3ChartDef = formatChartDef(chartDef);
        expect(c3ChartDef).toEqual({
            size: {
                width: 800,
                height: 600,
            },
            data: {
                xs: {
                    b: "a",
                    c: "d",
                    e: "a",
                },
                columns: [
                    [
                        "b",
                        100,
                        200,
                    ],
                    [
                        "a",
                        10,
                        20,
                    ],
                    [
                        "c",
                        1000,
                        2000,
                    ],
                    [
                        "d",
                        10000,
                        20000,
                    ],
                    [
                        "e",
                        100000,
                        200000,
                    ],
                ],
                type: "line",
                axes: {
                    b: "y",
                    c: "y",
                    e: "y2",
                },
                names: {},
            },
            axis: {
                x: {
                    show: true,
                    type: "indexed",
                },
                y: {
                    show: true,
                    type: "indexed",
                },
                y2: {
                    show: true,
                    type: "indexed",
                },
            },
            transition: {
                duration: 0,
            },
            point: {
                show: false,
            },
            legend: {
                show: true,
            },
        });
    });
    
    it("can set min and max values for Y axis", () => {

        const chartDef = createMinimalChartDef({
            data: {
                columnOrder: ["a", "b", "c", "d", "e"],
                columns: {
                    a: "number",
                    b: "number",
                    c: "number",
                    d: "number",
                    e: "number",
                },
                index: {
                    type: "number",
                    values: [ 5, 6 ],
                },
                values: [
                    {
                        a: 10,
                        b: 100,
                        c: 1000,
                        d: 10000,
                        e: 100000,
                    },
                    {
                        a: 20,
                        b: 200,
                        c: 2000,
                        d: 20000,
                        e: 200000,
                    },
                ],
            },
            x: { series: "__index__" },
            y: [
                {
                    series: "b",
                    x: { series: "a" },
                },
                {
                    series: "c",
                    x: { series: "d" },
                },
            ],
            y2: [
                {
                    series: "e",
                    x: { series: "a" },
                },
            ],
            legend: {
                show: true,
            },
        });
    
        chartDef.plotConfig.y!.min = 10;
        chartDef.plotConfig.y!.max = 100;

        chartDef.plotConfig.y2!.min = 2;
        chartDef.plotConfig.y2!.max = 3;

        const c3ChartDef = formatChartDef(chartDef);
        expect(c3ChartDef.axis.y.min).toEqual(10);
        expect(c3ChartDef.axis.y.max).toEqual(100);
        expect(c3ChartDef.axis.y2.min).toEqual(2);
        expect(c3ChartDef.axis.y2.max).toEqual(3);
    });
});
