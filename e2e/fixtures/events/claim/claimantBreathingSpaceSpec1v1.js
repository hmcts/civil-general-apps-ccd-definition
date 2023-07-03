const {date} = require('../../../api/dataHelper');
module.exports = {
    enterBs: (type) => {
        return {
            enterBreathing: {
                reference: '123',
                start: date(-10),
                type: type,
                expectedEnd: date(10),
                event: 'Enter Breathing Space Spec',
                eventDescription: 'Enter bs spec'
            }
        };
    },
    liftBs: () => {
        return {
            liftBreathing: {
                expectedEnd: date(10),
                event: 'Lift Breathing Space Spec',
                eventDescription: 'Lift bs spec'
            }
        };
    },
};
