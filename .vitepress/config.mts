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

    sidebar: [
      {
        text: '.NET',
        link: '/dotnet/',
        collapsed: true,
        items: [
          { text: 'OWIN Logging', link: '/dotnet/owin-logging' },
          { text: 'System.NET Logging', link: '/dotnet/system-net-logging' },
          { text: 'Unit Of Work Template', link: '/dotnet/unit-of-work-template' },
          { text: 'JWT Authentication', link: '/dotnet/jwt-authentication' },
          { text: 'JWT Authentication in Cookie', link: '/dotnet/jwt-authentication-cookie' },
          { text: 'Google Sign in without Identity', link: '/dotnet/google-sign-in-without-identity' },
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
        text: 'PowerShell',
        link: '/powershell/',
        collapsed: true,
        items: [
          { text: 'Basic Template', link: '/powershell/basic-template' },
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
        text: 'Terraform',
        link: '/terraform/',
        collapsed: true,
        items: [
          { text: 'Ansible Inventory Generation', link: '/terraform/ansible-inventory-generation' },
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
        text: 'Nuxt',
        link: '/nuxt/',
        collapsed: true,
        items: [
          { text: 'Custom Fetch', link: '/nuxt/custom-fetch' },
        ]
      },
      {
        text: 'Nginx',
        link: '/nginx/',
        collapsed: true,
        items: [
          { text: 'Easy Reverse Proxy Config', link: '/nginx/easy-reverse-proxy-config' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/LiamPietralla' }
    ]
  }
})
