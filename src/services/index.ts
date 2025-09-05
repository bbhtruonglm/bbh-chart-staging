export const ENV: IEnv = {
  analytic: import.meta.env.VITE_HOST_ANALYTIC,
  billing: import.meta.env.VITE_HOST_BILLING,
  service: import.meta.env.VITE_HOST_SERVICE,
  image: import.meta.env.VITE_HOST_IMAGE,
  root_domain: import.meta.env.VITE_HOST_ROOT_DOMAIN,
  root: import.meta.env.VITE_HOST_ROOT,
  business_config: import.meta.env.VITE_HOST_BUSINESS_CONFIG,
  business_upgrade_package: import.meta.env.VITE_HOST_BUSINESS_UPGRADE_PACKAGE,
  business_app_market: import.meta.env.VITE_HOST_BUSINESS_APP_MARKET,
  business_dashboard: import.meta.env.VITE_HOST_BUSINESS_DASHBOARD,
  chat_box_v2: import.meta.env.VITE_HOST_CHAT_BOX_V2,
}
