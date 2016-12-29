/**
 * Created by zhang on 2016/12/14.
 */
const db = require('../config/db');

module.exports = db.defineModel('user_auth', {
    ownerId: db.ID,
    user_id: db.STRING(100),
    api_key: db.STRING(32),
    api_secret: db.STRING(64),
});