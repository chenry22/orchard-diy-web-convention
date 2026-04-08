import { defineConfig } from 'vite'

export default defineConfig({
    base: '/orchard-diy-web-convention/',
    build: {
        rolldownOptions: {
            input: {
                main: 'index.html',
                intro: 'intro.html',
                convention: 'convention.html',
                website: 'website.html',
                more: 'more.html',
            },
        },
    },
})