module.exports = function (context, options) {
    return {
        name: 'script-inject',
        // loadContent: async () => {
        //     return { remoteHeadTags: await fetchHeadTagsFromAPI() };
        // },
        injectHtmlTags({ content }) {
            return {
                headTags: [
                    {
                        tagName: 'link',
                        attributes: {
                            rel: 'preconnect',
                            href: 'https://www.github.com',
                        },
                    },
                    // Google tag manager
                    {
                        tagName: 'script',
                        innerHTML: `
                        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-W4BCTSF');                      
                        `
                    },
                    //...content.remoteHeadTags,
                ],
                preBodyTags: [
                    {
                        tagName: 'noscript',
                        innerHTML: `
                        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W4BCTSF"
                        height="0" width="0" style="display:none;visibility:hidden"></iframe>
                        `
                    },
                ],
            };
        },
    };
};