// shipitfile.js
module.exports = shipit => {
    // Load shipit-deploy tasks
    require('shipit-deploy')(shipit)

    shipit.initConfig({
        default: {
            deployTo: '/var/apps/my-project',
            repositoryUrl: 'https://github.com/user/my-project.git',
        },
        staging: {
            servers: 'deploy@staging.my-project.com',
        },
    })

    shipit.on('deployed', () => {
        const processName = 'pm2-process-name';
        const env = shipit.environment;

        let cmd = `
        cd ${shipit.releasePath} && npm install --production && 
        (
            pm2 restart ${processName} ||
            NODE_ENV=${env} pm2 start server.js --name ${processName}
        )
    `;

        shipit.remote(cmd);
    });


}