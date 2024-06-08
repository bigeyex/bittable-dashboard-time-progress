import { T } from "../../locales/i18n";
import { useAppSelector } from "../../store/hook"
import { darkModeThemeColor, getDynamicDateRange, getLocalUnitAbbrRule } from "../common";
import Bar from './bar'
import Circular from "./circular";
import SemiCircular from './semiCircular'

export interface GoalChartProps {
    currentValueText: string;
    targetValueText: string;
    color: string;
    percentage: number;
    percentageText: string;
}

export default () => {
    const config = useAppSelector(store => store.config.config)
    const [dateRangeStart, dateRangeEnd] = config.dateType === 'custom' ? 
        config.dateRange.map(v => (new Date(v))) :
        getDynamicDateRange(config.dateType)
    
    let currentValueText: string;
    if (config.dateType !== 'custom') {
        currentValueText = T(config.dateType)
    }
    else {
        const formatDate = (format:string, date:Date) => 
            format.replaceAll('YYYY', date.getFullYear().toString())
                  .replaceAll('YY', date.getFullYear().toString().slice(2))
                  .replaceAll('MM', (date.getMonth()+1).toString().padStart(2, '0'))
                  .replaceAll('DD', date.getDate().toString())
        const dateRangeStartText = formatDate(config.dateFormat, dateRangeStart)
        let rangeEndFormat = config.dateFormat
        // if start and end date have same year/month, merge the format string
        // e.g 2024/05/21-06/30; 2024/05/21-31
        if (dateRangeStart.getFullYear() === dateRangeEnd.getFullYear()) {
            rangeEndFormat = rangeEndFormat.replaceAll('Y', '')
            if (dateRangeStart.getMonth() === dateRangeEnd.getMonth()) {
                rangeEndFormat = rangeEndFormat.replaceAll('M', '')
            }
        }
        rangeEndFormat = rangeEndFormat.replaceAll(/^[$\/]+/gi, '')
        const dateRangeEndText = formatDate(rangeEndFormat, dateRangeEnd)
        currentValueText = dateRangeStartText + ' - ' + dateRangeEndText
    }
    const today = new Date()
    let percentage = 100 * (today.getTime()-dateRangeStart.getTime()) / 
                        (dateRangeEnd.getTime()-dateRangeStart.getTime()) 
    let percentageText = percentage.toFixed(0)
    if (config.percentageNumericDigits) {
        percentageText = percentage.toFixed(config.percentageNumericDigits)
    }
    if (percentage > 100) { percentage = 100 }
    if (percentage < 0) { percentage = 0 }

    const props:GoalChartProps = {
        currentValueText: currentValueText,
        targetValueText: "",    // unused
        color: darkModeThemeColor(config.color),
        percentage: percentage,
        percentageText: percentageText
    }

    if (config.chartType === 'semiCircular') {
        return <SemiCircular {...props} />
    }
    else if (config.chartType === 'circular') {
        return <Circular {...props} />
    }
    else {
        return <Bar {...props}/>
    }
}