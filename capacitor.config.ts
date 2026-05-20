import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.wellnessconnect.app',
  appName: 'WellnessConnect',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: 'DARK',
      backgroundColor: '#E5E7EB',
    },
  },
}

export default config
