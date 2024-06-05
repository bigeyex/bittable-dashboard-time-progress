import React, { useCallback, useEffect, useState } from 'react';
import { FieldType, IDataRange, IField, ITable, SourceType, base } from '@lark-base-open/js-sdk';
import { Form, Button, Divider, Select, useFieldApi, useFormApi } from '@douyinfe/semi-ui';
import IconFormular from '/src/assets/icons/icon-formular.svg?react'
import IconMore from '/src/assets/icons/icon-more.svg?react'
import { DashboardState, bitable, dashboard } from "@lark-base-open/js-sdk";
// import '../../assets/semi-feishu-custom.min.css'
import './style.scss'
import config, { ConfigPayload, ConfigState, loadConfig, saveConfig, setConfigState } from '../../store/config';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { darkModeThemeColor, getLocalUnitAbbrRule, themeColors } from '../common';
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
                    dispatch(setConfigState(formData.values as ConfigPayload))
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
                        return <Form.Radio key={color} value={color} style={{borderColor: darkModeThemeColor(color)}}>
                            <div className='swatch' style={{backgroundColor: darkModeThemeColor(color)}}></div>
                        </Form.Radio>
                    })
                }
            </Form.RadioGroup>

            <Divider/>

            <Form.InputGroup label={{ text: T("日期范围") }} className='fieldNumericFormat'>
                <Form.Select field="dateType" initValue={0}>
                    <Select.Option value="thisMonth">本月</Select.Option>
                    <Select.Option value="thisQuarter">本季度</Select.Option>
                    <Select.Option value="custom">自定义范围</Select.Option>
                </Form.Select>

                <Form.DatePicker field="dateRange" type="dateTimeRange" onChange={console.log} />
            </Form.InputGroup>
            

            <Form.Select field="numericDigits" label={T('日期格式')} initValue={0}>
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

        </div>
        <div className='configActions'>
            <Button theme='solid' type="primary" htmlType="submit" className="btn-margin-right">{T('confirm')}</Button>
        </div>
        
        <DefaultValueSetter/>
    </Form>
}
