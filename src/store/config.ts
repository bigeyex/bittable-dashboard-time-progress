import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './index'
import { AppThunk } from './hook'
import { dashboard, IDataCondition, ISeries, DashboardState, IData } from '@lark-base-open/js-sdk'

// Define a type for the slice state
export interface ConfigState {
    color: string
    chartType: string
    percentageNumericDigits: number
    dateType: string
    dateRange: string[]
    dateFormat: string
}

export interface ConfigSliceState {
  config: ConfigState
}

export type ConfigPayload = Partial<ConfigState>

// Define the initial state using that type
const today = new Date()
const initialState: ConfigSliceState = {
  config: {
    color: "rgb(255,198,12)",
    chartType: "bar",
    percentageNumericDigits: 0,
    dateType: "thisMonth",
    dateRange: [
      today.toLocaleDateString(),
      (new Date(today.getFullYear(), today.getMonth()+1, 0)).toLocaleDateString()
    ],
    dateFormat: 'YYYY/MM/DD',
  }
}

export const configSlice = createSlice({
  name: 'config',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setConfigState: (state, action:PayloadAction<ConfigPayload>) => {
        state.config = {...state.config, ...action.payload}
    },
  }
})

export const { setConfigState } = configSlice.actions

// 保存图表配置到多维表格，在确认配置时调用
export const saveConfig = (payload:ConfigPayload):AppThunk => (async (dispatch, getState) => {
  const configState = {...getState().config.config, ...payload}
  dashboard.saveConfig({
    dataConditions: [],
    customConfig: {
      'config': configState 
    }
  })
})

// 从多维表格中读取图表配置
export const loadConfig = ():AppThunk<Promise<ConfigPayload>> => (async (dispatch, getState):Promise<ConfigPayload> => {
  if (dashboard.state === DashboardState.Create) {
    return initialState.config
  }
  const dashboardConfig = await dashboard.getConfig()
  if (dashboardConfig.customConfig && 'config' in dashboardConfig.customConfig) {
    const configState = dashboardConfig.customConfig['config'] as ConfigState
    dispatch(setConfigState(configState))
    return configState
  }
  return initialState.config
})

export default configSlice.reducer