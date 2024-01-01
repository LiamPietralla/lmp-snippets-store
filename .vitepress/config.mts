import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Snippets",
  description: "Snippets and musings gathered from different mistakes and experience.",
  srcDir: 'docs',
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
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/LiamPietralla' }
    ]
  }
})
