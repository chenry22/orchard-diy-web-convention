import { defineConfig } from 'vite'

export default defineConfig({
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