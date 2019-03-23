import { renderChart } from "./chart-renderer";

async function main(): Promise<void> {

    const response = await fetch("chart-def.json");
    const chartDef = await response.json();
    renderChart(chartDef, document.getElementById("chart")!);

};

main()
    .catch(err => {
        console.error("Error rendering chart.");
        console.error(err && err.stack || err);
    });
