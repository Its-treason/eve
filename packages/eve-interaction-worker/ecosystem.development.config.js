module.exports = {
    apps : [{
        name: 'eve-util',
        cwd: './',
        script: './index.js',
        watch: ['../'],
        max_restarts: 2,
        restart_delay: 5000,
        env: {
            NODE_ENV: 'testing',
            DISCORD_TOKEN: 'someone-forgot-to-change-this-value',
        },
    }],
};
