import { PropType } from 'vue';

interface DateAdapter<Date> {
    date(value?: any): Date | null;
    format(date: Date, formatString: string): string;
    startOfMonth(date: Date): Date;
    endOfMonth(date: Date): Date;
    startOfYear(date: Date): Date;
    endOfYear(date: Date): Date;
    isAfter(date: Date, comparing: Date): boolean;
    isEqual(date: Date, comparing: Date): boolean;
    isSameDay(date: Date, comparing: Date): boolean;
    isSameMonth(date: Date, comparing: Date): boolean;
    isValid(date: any): boolean;
    isWithinRange(date: Date, range: [Date, Date]): boolean;
    addDays(date: Date, amount: number): Date;
    addMonths(date: Date, amount: number): Date;
    getYear(date: Date): number;
    setYear(date: Date, year: number): Date;
    getDiff(date: Date, comparing: Date | string, unit?: string): number;
    getWeek(date: Date): number;
    getWeekArray(date: Date): (Date | null)[][];
    getWeekdays(): string[];
    getMonth(date: Date): number;
}

interface DateInstance extends DateAdapter<Date> {
    locale: string;
}
type DateOptions = {
    adapter: (new (locale: string) => DateInstance) | DateInstance;
};
interface DateProps {
    displayDate: Date;
    hideAdjacentMonths: boolean;
    modelValue: readonly any[];
}
declare const makeDateProps: <Defaults extends {
    displayDate?: unknown;
    hideAdjacentMonths?: unknown;
    modelValue?: unknown;
} = {}>(defaults?: Defaults | undefined) => {
    displayDate: unknown extends Defaults["displayDate"] ? {
        type: PropType<Date>;
        default: Date;
    } : Omit<{
        type: PropType<Date>;
        default: Date;
    }, "type" | "default"> & {
        type: PropType<unknown extends Defaults["displayDate"] ? Date : Date | Defaults["displayDate"]>;
        default: unknown extends Defaults["displayDate"] ? Date : Date | Defaults["displayDate"];
    };
    hideAdjacentMonths: unknown extends Defaults["hideAdjacentMonths"] ? BooleanConstructor : {
        type: PropType<unknown extends Defaults["hideAdjacentMonths"] ? boolean : boolean | Defaults["hideAdjacentMonths"]>;
        default: unknown extends Defaults["hideAdjacentMonths"] ? boolean : boolean | Defaults["hideAdjacentMonths"];
    };
    modelValue: unknown extends Defaults["modelValue"] ? {
        type: PropType<readonly any[]>;
        default: () => never[];
    } : Omit<{
        type: PropType<readonly any[]>;
        default: () => never[];
    }, "type" | "default"> & {
        type: PropType<unknown extends Defaults["modelValue"] ? readonly any[] : readonly any[] | Defaults["modelValue"]>;
        default: unknown extends Defaults["modelValue"] ? readonly any[] : readonly any[] | Defaults["modelValue"];
    };
};
declare function useDate(props?: DateProps): DateInstance;

export { DateAdapter, DateInstance, DateOptions, makeDateProps, useDate };
