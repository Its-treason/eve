module.exports = {
    apps : [{
        name: 'eve',
        cwd: './',
        script: './node_modules/ts-node/dist/bin.js',
        args: ['./index.ts'],
        env: {
            NODE_ENV: 'production',
            DISCORD_TOKEN: 'someone-forgot-to-change-this-value',
        },
    }],
};
