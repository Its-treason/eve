module.exports = {
    apps : [{
        name: 'eve',
        cwd: './',
        script: './node_modules/ts-node/dist/bin.js',
        args: ['./index.ts'],
        watch: ['../'],
        autorestart: false,
        max_restarts: 1,
        restart_delay: 5000,
        env: {
            NODE_ENV: 'testing',
            DISCORD_TOKEN: 'someone-forgot-to-change-this-value',
            DB_HOST: 'someone-forgot-to-change-this-value',
            DB_USER: 'someone-forgot-to-change-this-value',
            DB_PASSWORD: 'someone-forgot-to-change-this-value',
            DB_DATABASE: 'someone-forgot-to-change-this-value',
        },
    }],
};
