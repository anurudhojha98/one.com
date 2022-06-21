const mongoose = require('mongoose');
const config = require('./config');
const UserPermission = require('./models/UserPermissions');
const _ = require('lodash');
/**
 * @description This is a seeder file that will help to create a platform admin into the system.
 * @author Anurudh Ojha
 */
class UserPermissionsSeeder {
    /**
     * @description Execute Function to generate the platform user object
     *
     * @returns {Boolean} true
     * @memberof UserPermissionsSeeder
     */
    async execute() {
        try {
            await this.connectDatabase();
            const userPermissionObj = await UserPermission.find({});
            if (!_.isEmpty(userPermissionObj)) {
                console.info("Old data removed successfully")
                await UserPermission.deleteMany({});
            }
            if (await this.seedUserPermissions()) {
                console.info("New data added successfully")
                process.exit();
            }
            return true;
        } catch (err) {
            console.log(err.message);
            return process.exit();
        }
    }

    /**
* @description Connect database
*
* @returns
* @memberof UserPermissionsSeeder
*/
    async connectDatabase() {
        // we can add these details on configs
        let uri = `${config.db.db_client}://${config.db.db_nodes}/${config.db.db_name}`;
        mongoose.connect(uri, { useNewUrlParser: true });

        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log('Database connected successfully!')
        })
    }


    async seedUserPermissions() {
        var userPermission = new UserPermission({
            admin: ["create", "update", "delete", "fetch"],
            seller: ["create", "update", "fetch"],
            supporter: ["delete", "fetch"],
            customer: ["fetch"],
        });
        return await userPermission.save();
    }
}

setTimeout(function () {
    new UserPermissionsSeeder().execute();
}, 3000);

module.exports = UserPermissionsSeeder;
