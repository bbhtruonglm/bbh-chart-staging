/** API HOST THEO 3 MÔI TRƯỜNG */
export const API_HOST: { [index: string]: { [index: string]: string } } = {
  /** môi trường development */
  development: {
    analytic: 'https://dev-api.botbanhang.vn/v1/n9_analytic_v2',
    billing: 'https://dev-api.botbanhang.vn/v1/billing',
    service: 'https://dev-api.botbanhang.vn/v1/n4_service',
    image: 'https://dev-api.botbanhang.vn/v1/n6_static/cdn',

    root_domain: 'https://retion.ai',

    business_config: 'https://retion.ai/chat/dashboard/org/setting',
    business_upgrade_package: 'https://retion.ai/chat/dashboard/org/pay/info',
    business_app_market: 'https://retion.ai/chat/dashboard/widget/market',
    business_dashboard: 'https://ad.retion.ai/statistics',
    business_logout: 'https://retion.ai/logout',

    chatbox_v2: 'https://chatv2.botbanhang.vn',
  },
  /** môi trường production */
  production: {
    // analytic: 'https://chatbox-tracking-v3.botbanhang.vn',
    billing: ' https://chatbox-billing.botbanhang.vn',
    service: 'https://chatbox-service-v3.botbanhang.vn',
    image: 'https://cdn.botbanhang.vn',

    root_domain: 'https://retion.ai',
    root: 'retion.ai',

    business_config: 'https://retion.ai/chat/dashboard/org/setting',
    business_upgrade_package: 'https://retion.ai/chat/dashboard/org/pay/info',
    business_app_market: 'https://retion.ai/chat/dashboard/widget/market',
    business_dashboard: 'https://ad.retion.ai/statistics',
    business_logout: 'https://retion.ai/logout',

    chatbox_v2: 'https://chatv2.botbanhang.vn',
    analytic: 'http://3.25.208.94:1355/v2/n9_analytic_v2',
  },
}
