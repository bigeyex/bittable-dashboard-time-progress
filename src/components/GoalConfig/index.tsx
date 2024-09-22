import React, { useCallback, useEffect, useState } from 'react';
import { IDashboardTheme, FieldType, IDataRange, IField, ITable, SourceType, base } from '@lark-base-open/js-sdk';
import { Form, Button, Divider, Select, useFieldApi, useFormApi } from '@douyinfe/semi-ui';
import IconFormular from '/src/assets/icons/icon-formular.svg?react'
import IconMore from '/src/assets/icons/icon-more.svg?react'
import { DashboardState, bitable, dashboard } from "@lark-base-open/js-sdk";
// import '../../assets/semi-feishu-custom.min.css'
import './style.scss'
import config, { ConfigPayload, ConfigState, loadConfig, saveConfig, setConfigState } from '../../store/config';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { themeKeyLookup, getLocalUnitAbbrRule, themeColors } from '../common';
import { T } from '../../locales/i18n';
import Section from '@douyinfe/semi-ui/lib/es/form/section';

export default () => {
    type TableInfo = {tableId: string, tableName: string}
    const [tableList, setTableList] = useState<TableInfo[]>([])
    const [tableDataRange, setTableDataRange] = useState<IDataRange[]>([])
    type NumberFieldInfo = {fieldId: string, fieldName: string}
    const dispatch = useAppDispatch()
    const [numberFieldList, setNumberFieldList] = useState<NumberFieldInfo[]>([])
    const config = useAppSelector(store => store.config.config)

    // dashboard theme system section
    const [themeConfig, setThemeConfig] = useState<IDashboardTheme>();
    const getThemeConfig = async () => {
        const theme = await dashboard.getTheme();
        setThemeConfig(theme);
    }
    useEffect(() => {
        getThemeConfig()
    }, [])
    
    // because Form in semi-design requires formApi, and it has to be
    // within the Form's context, so an additional component (DefaultValueSetter) is created to 
    // keep formApi instances
    const emptyDefaultValueSetter = (value: string) => {}
    let setDefaultValues = {
        form: (values:ConfigPayload) => {},
    }

    const DefaultValueSetter = () => {
        const formApi = useFormApi()
        setDefaultValues.form = (values ) => { formApi.setValues(values) }
        return '';
    }

    const fetchInitData = async() => {
        const configState = await dispatch<Promise<ConfigPayload>>(loadConfig())
        setDefaultValues.form(configState)
    }

    useEffect(() => {
        fetchInitData()
    }, [])

    return <Form labelPosition='top' className='configForm' 
                onChange={(formData) => {
                    const dateRange = formData.values.dateRange
                    const dateRangeText = [
                        typeof(dateRange[0])==='string' ? dateRange[0]:formData.values.dateRange[0].toLocaleDateString(),
                        typeof(dateRange[1])==='string' ? dateRange[1]:formData.values.dateRange[1].toLocaleDateString()
                    ]
                    dispatch(setConfigState({...formData.values, ...{dateRange: dateRangeText}} as ConfigPayload))
                }}
                onSubmit={(formData) => dispatch(saveConfig(formData as ConfigPayload))}>
        <div className='configFields'>
            <Form.RadioGroup field="chartType" label={T("chartShape")} type='pureCard' direction='horizontal' className='chartTypePicker' initValue="bar">
                <Form.Radio value="bar">
                    <div className='iconFrame bar'></div>
                    <div className='chartTypeLabel'>{T("chartShapeBar")}</div>
                </Form.Radio>
                <Form.Radio value="semiCircular">
                    <div className='iconFrame semiCircular'></div>
                    <div className='chartTypeLabel'>{T("chartShapeSemiCircle")}</div>
                </Form.Radio>
                <Form.Radio value="circular">
                    <div className='iconFrame circular'></div>
                    <div className='chartTypeLabel'>{T("chartShapeCircle")}</div>
                </Form.Radio>
            </Form.RadioGroup>

            <Form.RadioGroup field="color" label={T("color")} initValue='rgba(53, 189, 75, 1)' type='pureCard' direction='horizontal' className='colorPicker'> 
                {
                    themeColors.map((color) => {
                        const themedColor = themeConfig ? themeConfig.labelColorTokenList[themeKeyLookup[color]] : color;
                        return <Form.Radio key={color} value={color} style={{borderColor: themedColor}}>
                            <div className='swatch' style={{backgroundColor: themedColor}}></div>
                        </Form.Radio>
                    })
                }
            </Form.RadioGroup>

            <Divider/>

            <Form.InputGroup label={{ text: T("dateRange") }} className='fieldNumericFormat'>
                <Form.Select field="dateType" initValue={0}>
                    <Select.Option value="thisMonth">{T('thisMonth')}</Select.Option>
                    <Select.Option value="thisQuarter">{T('thisQuarter')}</Select.Option>
                    <Select.Option value="thisYear">{T('thisYear')}</Select.Option>
                    <Select.Option value="custom">{T('custom')}</Select.Option>
                </Form.Select>

                <Form.DatePicker field="dateRange" type="dateRange" style={config.dateType=='custom' ? {} : {display: 'none'}} />
            </Form.InputGroup>
            

            <Form.Select field="dateFormat" label={T('dateFormat')} initValue={'YYYY/MM/DD'}
                    fieldStyle={config.dateType=='custom' ? {} : {display: 'none'}}>
                <Select.Option value="YYYY/MM/DD">YYYY/MM/DD</Select.Option>
                <Select.Option value="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
                <Select.Option value="YY/MM/DD">YY/MM/DD</Select.Option>
                <Select.Option value="YY-MM-DD">YY-MM-DD</Select.Option>
                <Select.Option value="MM-DD">MM-DD</Select.Option>
                <Select.Option value="MM/DD">MM/DD</Select.Option>
            </Form.Select>

            <Form.InputGroup label={{ text: T("percenageFormat") }} className='fieldNumericFormat'>
                <Form.Select field="percentageNumericDigits" initValue={0}>
                    <Select.Option value={0}>{T("integer")}</Select.Option>
                    <Select.Option value={1}>{T("keepOneDigit")}</Select.Option>
                    <Select.Option value={2}>{T("keepTwoDigit")}</Select.Option>
                </Form.Select>
            </Form.InputGroup>

            <Form.InputGroup label={{ text: T("todayCalcMethod") }} className='fieldNumericFormat'>
                <Form.Select field="todayCalcMethod" initValue={0}>
                    <Select.Option value={-1}>{T("endOfYesterday")}</Select.Option>
                    <Select.Option value={0}>{T("realTime")}</Select.Option>
                    <Select.Option value={1}>{T("endOfToday")}</Select.Option>
                </Form.Select>
            </Form.InputGroup>

        </div>
        <div className='configActions'>
            <Button theme='solid' type="primary" htmlType="submit" className="btn-margin-right">{T('confirm')}</Button>
        </div>
        
        <DefaultValueSetter/>
    </Form>
}
