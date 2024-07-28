import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Snippets",
  description: "Snippets and musings gathered from different mistakes and experience.",
  srcDir: 'docs',
  sitemap: {
    hostname: 'https://code.liampietralla.com'
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    search: {
      provider: 'local'
    },

    sidebar: [
      {
        text: '.NET',
        link: '/dotnet/',
        collapsed: true,
        items: [
          { text: 'Blazor with an API', link: '/dotnet/blazor-with-api' },
          { text: 'Database Seeding', link: '/dotnet/database-seed' },
          { text: 'Dockerising Blazor', link: '/dotnet/dockerising-blazor' },
          { text: 'OWIN Logging', link: '/dotnet/owin-logging' },
          { text: 'System.NET Logging', link: '/dotnet/system-net-logging' },
          { text: 'Unit Of Work Template', link: '/dotnet/unit-of-work-template' },
          { text: 'JWT Authentication', link: '/dotnet/jwt-authentication' },
          { text: 'JWT Authentication in Cookie', link: '/dotnet/jwt-authentication-cookie' },
          { text: 'Google Sign in without Identity', link: '/dotnet/google-sign-in-without-identity' },
        ]
      },
      {
        text: 'Ansible',
        link: '/ansible/',
        collapsed: true,
        items: [
          { text: 'Installing Docker', link: '/ansible/installing-docker' },
          { text: 'Configure SSL', link: '/ansible/certbot-ssl' },
          { text: 'Waiting For Servers', link: '/ansible/server-wait' },
        ]
      },
      {
        text: 'CSS',
        link: '/css/',
        collapsed: true,
        items: [
          { text: 'Text Width HR', link: '/css/text-width-hr' },
        ]
      },
      {
        text: 'EF Core',
        link: '/ef-core/',
        collapsed: true,
        items: [
          { text: 'Stored Procedure Migration', link: '/ef-core/stp-migration' },
        ]
      },
      {
        text: 'Github Actions',
        link: '/github-actions/',
        collapsed: true,
        items: [
          { text: 'Build and Test .NET', link: '/github-actions/build-test-dotnet' },
          { text: 'Build and Publish Container', link: '/github-actions/build-publish-container' },
          { text: 'Run EF Core Migrations', link: '/github-actions/run-ef-core-migrations' },
        ]
      },
      {
        text: 'Nginx',
        link: '/nginx/',
        collapsed: true,
        items: [
          { text: 'Easy Reverse Proxy Config', link: '/nginx/easy-reverse-proxy-config' },
          { text: 'Adding Nginx Site', link: '/nginx/adding-nginx-site' }
        ]
      },
      {
        text: 'Nuxt',
        link: '/nuxt/',
        collapsed: true,
        items: [
          { text: 'Custom Fetch', link: '/nuxt/custom-fetch' },
        ]
      },
      {
        text: 'PowerShell',
        link: '/powershell/',
        collapsed: true,
        items: [
          { text: 'Basic Template', link: '/powershell/basic-template' },
        ]
      },
      {
        text: 'React',
        link: '/react/',
        collapsed: true,
        items: [
          { text: 'Basic Template', link: '/powershell/basic-template' },
        ]
      },
      {
        text: 'React Native',
        link: '/react-native/',
        collapsed: true,
        items: [
          { text: 'Generic Box', link: '/react-native/generic-box' },
          { text: 'Generic Stacks', link: '/react-native/generic-stacks' },
          { text: 'Generic Text', link: '/react-native/generic-text' },
        ]
      },
      {
        text: 'Terraform',
        link: '/terraform/',
        collapsed: true,
        items: [
          { text: 'Ansible Inventory Generation', link: '/terraform/ansible-inventory-generation' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/LiamPietralla' }
    ]
  },

  head: [
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-PHMPD0HWEF' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-PHMPD0HWEF');`
    ]
  ]
})
