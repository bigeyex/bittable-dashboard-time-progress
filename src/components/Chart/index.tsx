import { useAppSelector } from "../../store/hook"
import { darkModeThemeColor, getLocalUnitAbbrRule } from "../common";
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
    

    let percentage = 100 
    let percentageText = percentage.toFixed(0)
    if (config.percentageNumericDigits) {
        percentageText = percentage.toFixed(config.percentageNumericDigits)
    }
    if (percentage > 100) { percentage = 100 }
    if (percentage < 0) { percentage = 0 }

    const props:GoalChartProps = {
        currentValueText: "10",
        targetValueText: "100",
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