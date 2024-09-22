import { GoalChartProps } from "."
import { SemiCircularPart } from "./circularPart"
import { useResizeDetector } from 'react-resize-detector';

import './semiCircular.scss'
import { createRef, useEffect, useRef } from "react";
import ReactECharts from 'echarts-for-react';
import { getLongTextClass, isConfigLayout } from "../common";
import { dashboard } from "@lark-base-open/js-sdk";


export default ({currentValueText, targetValueText, color, percentage, percentageText, isDarkMode, chartBgColor}:GoalChartProps) => {    const chartRef = createRef<ReactECharts>()
    const { width, height, ref } = useResizeDetector({
        refreshMode: 'debounce',
        refreshRate: 10,
        onResize: () => {
            chartRef.current?.getEchartsInstance().resize({width: width, height: height!*2})
        }
      });

    useEffect(() => {
        chartRef.current?.getEchartsInstance().resize()
    }, [])

    return <div className={'goalchartSemiCircularContainer' + (isConfigLayout() ? ' config' : '')} 
                style={{ background: chartBgColor }}>
        <div className="semiCircle">
            <div className="textRegion">
                <div className="percentage">{percentageText}%</div>
                <div className={"detailNumbers" + getLongTextClass(currentValueText, targetValueText, percentageText, 16)}>
                    <div className="currentValue" style={{color: `${color}`}}>{currentValueText}</div>
                </div>
            </div>
            <div ref={ref} className="chartRegion">
            <SemiCircularPart ref={chartRef} className="circularPart" color={color} isDarkMode={isDarkMode} percentage={percentage < 9 && percentage > 0 ? 9 : percentage}/>            </div>
        </div>
    </div>
}