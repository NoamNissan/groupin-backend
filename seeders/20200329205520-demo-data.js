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
            },
            {
                provider: 'FACEBOOK',
                provider_user_id: '1948',
                display_name: 'ד"ר ישראל ישראלי',
                email: 'israel@israeli.co.il',
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
            },
            {
                user_id: getId(
                    firstUserId,
                    users,
                    'provider_user_id',
                    '22222222222222222222222222222'
                ),
                title: 'מדברים על אומנות יפנית ≧ω≦',
                description:
                    'כל מי שמעוניין מוזמן להצטרף אלי לשיחה של כשעה שבה נדבר על האנימות והמנגות האהובות עלינו! (人◕ω◕)',
                category: getId(firstCategoryId, categories, 'name', 'אומנות'),
                start_date: new Date(),
                end_date: moment(new Date()).add(60, 'm').toDate(),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                user_id: getId(
                    firstUserId,
                    users,
                    'provider_user_id',
                    'hello_this_is_also_a_valid_id'
                ),
                title: 'איך לעשות עין',
                description:
                    'הסתכסכתם עם השכנים? רוצים לנקום בקולגה? במפגש הקרוב אלמד אתכם ואתכן איך להטיל עין רעה על אויבכם. הצטרפו אלי ללחשים עם מיקרופון פתוח כדי לחזק את הקללה',
                category: getId(firstCategoryId, categories, 'name', 'שונות'),
                start_date: new Date(),
                end_date: moment(new Date()).add(15, 'm').toDate(),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                user_id: getId(firstUserId, users, 'provider_user_id', '1948'),
                title: 'נגיף הקורונה - המיתוסים וניפוצם',
                description:
                    'במפגש אשתדל לגעת במספר מיתוסים נפוצים בנוגע למחלה, כדוגמאת זמני השהייה של הוירוס על משטחים שונים. תוקדשנה חצי שעה בסוף בשביל שאלות מהקהל',
                category: getId(firstCategoryId, categories, 'name', 'בריאות'),
                start_date: new Date(),
                end_date: moment(new Date()).add(120, 'm').toDate(),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                user_id: getId(firstUserId, users, 'provider_user_id', '1948'),
                title: 'פעילויות לכל המשפחה בזמן הסגר',
                description:
                    'נגמרו הרעיונות לתעסוקה לילדים בזמן שכולם תקועים בבית? או שאולי מצאתם משהו מגניב שאפשר לעשות גם מהסלון ואתם רוצים לשתף? מוזמנים למפגש בו כולם יכולים להעלות רעיונות!',
                category: getId(firstCategoryId, categories, 'name', 'משפחה'),
                start_date: new Date(),
                end_date: moment(new Date()).add(35, 'm').toDate(),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                user_id: getId(
                    firstUserId,
                    users,
                    'provider_user_id',
                    '22222222222222222222222222222'
                ),
                title: 'טיפים לדוטא 2',
                description:
                    'אני מניח שכל מי שקורא את זה נחות ממני לחלוטין בDota, ובעקבות השעמום שתקף אותי החלטתי ללמד נובים כמוכם קצת מהלכים של Pros. תצטרפו אם בא לכם להשתפר',
                category: getId(firstCategoryId, categories, 'name', 'משחקים'),
                start_date: new Date(),
                end_date: moment(new Date()).add(110, 'm').toDate(),
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
