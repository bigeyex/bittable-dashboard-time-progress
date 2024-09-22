import { DashboardState, dashboard, bitable } from "@lark-base-open/js-sdk";

export let isDarkMode = false;

export const isConfigLayout = () => {
    return dashboard.state === DashboardState.Config || dashboard.state === DashboardState.Create
}

export const getDynamicDateRange = (dateType:string) => {
  const today = new Date()
  if (dateType === 'thisQuarter') {
    const quarterStartMonthList = [0, 0, 0, 3, 3, 3, 6, 6, 6, 9, 9, 9]
    const quarterStartMonth = quarterStartMonthList[today.getMonth()]
    return [
      new Date(today.getFullYear(), quarterStartMonth, 0),
      quarterStartMonth < 9 ? new Date(today.getFullYear(), quarterStartMonth+3, 0)
        : new Date(today.getFullYear()+1, 0, 0)
    ]
  }
  else if (dateType === 'thisYear') {
    return [
      new Date(today.getFullYear(), 0, 1),
      new Date(today.getFullYear()+1, 0, 0)
    ]
  }
  else { // dateType === 'thisMonth'
    return [
      new Date(today.getFullYear(), today.getMonth(), 1),
      new Date(today.getFullYear(), today.getMonth()+1, 0)
    ]
  }
}

export const themeColors = [
    'rgba(31, 35, 41, 1)', 'rgba(51, 109, 244, 1)', 'rgba(122, 53, 240, 1)',
    'rgba(53, 189, 75, 1)', 'rgba(45, 190, 171, 1)', 'rgba(255, 198, 10, 1)',
    'rgba(255, 129, 26, 1)', 'rgba(245, 74, 69, 1)'
]

type UnitAbbrRule = { size:number, suffix:string }
type LocalUnitAbbrRuleSet = { [key:string]: UnitAbbrRule }
type UnitAbbrRuleSet = { [key:string]: LocalUnitAbbrRuleSet }
const unitAbbrRules:UnitAbbrRuleSet = {
  'zh': {
    'none' : { size:1, suffix:'' },
    'k' : { size:1000, suffix:T('K') },
    'wan' : { size:10000, suffix:T('WAN') },
    'm' : { size:1000000, suffix:T('M') },
    'kwan' : { size:10000000, suffix:T('QIANWAN') },
    'yi' : { size:100000000, suffix:T('YI') },
  },
  'default': {
    'none' : { size:1, suffix:'' },
    'k' : { size:1000, suffix:T('K') },
    'm' : { size:1000000, suffix:T('M') },
  },
}

export const getLocalUnitAbbrRule = () => {
  if (i18n.language in unitAbbrRules) {
    return unitAbbrRules[i18n.language]
  }
  else {
    return unitAbbrRules['default']
  }
}

export const getLocalUnitAbbrNumber = (number: number, abbrRule:string) => {
  const abbrRuleSet = getLocalUnitAbbrRule()
  if (!(abbrRule in abbrRuleSet)) {
    abbrRule = 'none'
  }
  const rule = abbrRuleSet[abbrRule]
  return (number / rule.size) + rule.suffix
}

export const themeKeyLookup:{[key:string]: number} = {
  'rgba(31, 35, 41, 1)': 0,
  'rgba(51, 109, 244, 1)': 1,
  'rgba(122, 53, 240, 1)': 2,
  'rgba(53, 189, 75, 1)': 3,
  'rgba(45, 190, 171, 1)': 4,
  'rgba(255, 198, 10, 1)': 5,
  'rgba(255, 129, 26, 1)': 6,
  'rgba(245, 74, 69, 1)': 7,
}

export const getLongTextClass = (currentValueText:string, targetValueText:string, percentageText:string, firstThreshold=18, secondThreshold=28) => {
  const fullTextLength = currentValueText.length + targetValueText.length + `${percentageText}%`.length
    let longTextClass = ''
    if (fullTextLength > secondThreshold) {
        longTextClass = ' longLongText'
    }
    else if (fullTextLength > firstThreshold) {
        longTextClass = ' longText'
    }
    return longTextClass
}

import { useLayoutEffect } from "react";
import i18n, { T } from "../locales/i18n";

export function onDrakModeChange(callback:() => void) {
  useLayoutEffect(() => {
    dashboard.onThemeChange((res) => {
      callback()
    })
  }, [])
}