import '@lark-base-open/js-sdk/dist/style/dashboard.css';
import './App.scss';
import { DashboardState, bitable, dashboard } from "@lark-base-open/js-sdk";
import GoalConfig from './components/GoalConfig';
import Chart from './components/Chart';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hook';
import { ConfigPayload, loadConfig } from './store/config';

export default function App() {
  const dispatch = useAppDispatch()
  const config = useAppSelector(store => store.config.config)
  
  dashboard.onThemeChange(res => {
    document.body.setAttribute('theme-mode', res.data.theme.toLowerCase());
  })
  const setThemeAttribute = async() => {
    const theme = await dashboard.getTheme();
    document.body.setAttribute('theme-mode', theme.theme.toLowerCase());
  }

  useEffect(() => {
    setThemeAttribute()

    if (dashboard.state === DashboardState.View || dashboard.state === DashboardState.FullScreen) {
      dispatch(loadConfig())

      dashboard.onConfigChange(e => {
        dispatch(loadConfig())
      })

      setTimeout(() => {
        // 预留3s给浏览器进行渲染，3s后告知服务端可以进行截图了
        dashboard.setRendered();
    }, 2000);
    }  
    dashboard.onDataChange(e => {
    })
  }, [])

  
  return (
    <div className='goal-app'>
        <div className='goal-chart'>
          <Chart/>
        </div>
        {dashboard.state === DashboardState.Config || dashboard.state === DashboardState.Create ? (
          <div className='config-panel'>
            <GoalConfig/>
          </div>
            
        ) : null}
    </div>
  );
}