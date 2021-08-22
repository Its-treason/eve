module.exports = {
    apps : [{
        name: 'eve',
        cwd: './',
        script: './node_modules/ts-node/dist/bin.js',
        args: ['./index.ts'],
        env: {
            NODE_ENV: 'production',
            DISCORD_TOKEN: 'someone-forgot-to-change-this-value',
            DB_HOST: 'someone-forgot-to-change-this-value',
            DB_USER: 'someone-forgot-to-change-this-value',
            DB_PASSWORD: 'someone-forgot-to-change-this-value',
            DB_DATABASE: 'someone-forgot-to-change-this-value',
            CLIENT_ID: 'someone-forgot-to-change-this-value',
        },
    }],
};
