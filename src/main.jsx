import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes'
import 'antd/dist/reset.css';
import '@ant-design/v5-patch-for-react-19';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
)
