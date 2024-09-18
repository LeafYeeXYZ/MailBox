import { ThemeConfig, theme } from 'antd'

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#ff8080',
    colorText: '#4c0519',
  },
}

export const darkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorText: '#ffffff'
  },
}