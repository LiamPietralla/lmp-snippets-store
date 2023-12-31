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
        text: 'Examples',
        items: [
          { text: '.NET', link: '/dotnet/' },
          { text: 'EF Core', link: '/ef-core/' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/LiamPietralla' }
    ]
  }
})
