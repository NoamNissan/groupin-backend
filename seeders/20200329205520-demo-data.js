'use strict';
var moment = require('moment');

function getId(firstId, items, field, what) {
    for (let i = 0; i < items.length; i++) {
        if (items[i][field] === what) {
            return firstId + i;
        }
    }
    return null;
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        var categories = [
            {
                name: 'משחקים',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'כושר',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'השכלה',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'בריאות',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'מוזיקה',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'משפחה',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'אומנות',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'שונות',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        var firstCategoryId = await queryInterface.bulkInsert(
            'categories',
            categories
        );

        var users = [
            {
                provider: 'FACEBOOK',
                provider_user_id: '123456789ABCDEF',
                display_name: 'פלוני אלמוני',
                email: 'example@example.com',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                provider: 'FACEBOOK',
                provider_user_id: '22222222222222222222222222222',
                display_name: 'אבישי סנסיי',
                email: 'avishay@myfakemail.org',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                provider: 'FACEBOOK',
                provider_user_id: 'hello_this_is_also_a_valid_id',
                display_name: 'עדי ביטי',
                email: 'adi@biti.co.il',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        var firstUserId = await queryInterface.bulkInsert('users', users);
        await queryInterface.bulkInsert('sessions', [
            {
                user_id: getId(
                    firstUserId,
                    users,
                    'provider_user_id',
                    '22222222222222222222222222222'
                ),
                title: 'סדנת הכנת פיצה',
                description:
                    'הצטרפו אלי לסדנה בה אנסה ללמד אתכם את מתכון הפיצה המשפחתי שלי. מומלץ לצפות מהמטבח כדי שתוכלו להכין יחד איתי 😊 תרגישו חופשי לשאול שאלות בזמן הסדנה!',
                category: getId(firstCategoryId, categories, 'name', 'שונות'),
                start_date: new Date(),
                end_date: moment(new Date()).add(40, 'm').toDate(),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('categories', null, {});
        await queryInterface.bulkDelete('users', null, {});
        await queryInterface.bulkDelete('sessions', null, {});
    }
};
