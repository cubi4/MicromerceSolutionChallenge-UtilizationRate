import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from "material-react-table";
import { useMemo } from "react";
import sourceData from "./source-data.json";
import type { SourceDataType, TableDataType } from "./types";

/**
 * Example of how a tableData object should be structured.
 *
 * Each `row` object has the following properties:
 * @prop {string} person - The full name of the employee.
 * @prop {number} past12Months - The value for the past 12 months.
 * @prop {number} y2d - The year-to-date value.
 * @prop {number} may - The value for May.
 * @prop {number} june - The value for June.
 * @prop {number} july - The value for July.
 * @prop {number} netEarningsPrevMonth - The net earnings for the previous month.
 */

const tableData: TableDataType[] = (sourceData as unknown as SourceDataType[]).map(
    (dataRow, index) => {
        const person = `${dataRow?.employees?.firstname} ${dataRow?.employees?.lastname}`;

        const past12Months =
            dataRow?.employees?.workforceUtilisation?.utilisationRateLastTwelveMonths;
        const past12MonthsPercentage = parseFloat(past12Months ?? "0") * 100;

        const y2d = dataRow?.employees?.workforceUtilisation?.utilisationRateYearToDate;
        const y2dPercentage = parseFloat(y2d ?? "0") * 100;

        const june = dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.find(
            (month) => month.month === "June"
        )?.utilisationRate;
        const junePercentage = parseFloat(june ?? "0") * 100;

        const july = dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.find(
            (month) => month.month === "July"
        )?.utilisationRate;
        const julyPercentage = parseFloat(july ?? "0") * 100;


        // changed May to August because lastThreeMonths just contains june-august
        const august = dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.find(
            (month) => month.month === "August"
        )?.utilisationRate;
        const augustPercentage = parseFloat(august ?? "0") * 100;


        /*  
        IDEA: netEarningsPrevMonth = EarningsLastMonth - salaryMonth
        PROBLEM: Access to potentialEarningsByMonth 

        const salaryMonth =
            dataRow?.employees?.statusAggregation?.monthlySalary != "null"
                ? dataRow?.employees?.statusAggregation?.monthlySalary
                : 0;
                
        const EarningsLastMonth = dataRow?.employees?.costsByMonth?.potentialEarningsByMonth.find(
            (entry) => entry.month === "2024-08").costs
        );
        */



        /*
        AlternativeIDEA:  netEarningsPrevMonth = quarterEarnings/3 - salaryMonth
        PROBLEM: quarterEarnings distributed equally on months => unrealistic
                can not access quarterEarnings aswell 
                
        const quarterEarnings = dataRow?.employees?.workforceUtilisation?.quarterEarnings;
        */

        //To have a Value for netEarningsPrevMonth, I will use the monthlyCostDifference as Plan C
        const netEarningsPrevMonth = dataRow?.employees?.workforceUtilisation?.monthlyCostDifference ?? 0;


        const row: TableDataType = {
            person: `${person}`,
            past12Months: `${past12MonthsPercentage}%`,
            y2d: `${y2dPercentage}%`,
            june: `${junePercentage}%`,
            july: `${julyPercentage}%`,
            august: `${augustPercentage}%`,
            netEarningsPrevMonth: `${netEarningsPrevMonth} EUR`,
        };

        return row;
    }
);

const Example = () => {
    const columns = useMemo<MRT_ColumnDef<TableDataType>[]>(
        () => [
            {
                accessorKey: "person",
                header: "Person",
            },
            {
                accessorKey: "past12Months",
                header: "Past 12 Months",
            },
            {
                accessorKey: "y2d",
                header: "Y2D",
            },
            {
                accessorKey: "june",
                header: "June",
            },
            {
                accessorKey: "july",
                header: "July",
            },
            {
                accessorKey: "august",
                header: "August",
            },
            {
                accessorKey: "netEarningsPrevMonth",
                header: "Net Earnings Prev Month",
            },
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: tableData,
    });

    return <MaterialReactTable table={table} />;
};

export default Example;
