/**
 * Created by zhang on 2016/12/14.
 */

const db = require('../config/db');

module.exports = db.defineModel('messages', {
    email: {
        type: db.STRING(100),
        unique: true
    },
    username:db.STRING(32),
    title: db.STRING(100),
    context: db.TEXT
});
