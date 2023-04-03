const {date} = require('../../api/dataHelper');
module.exports = {
    judgeMakesDecisionFreeFormData: () => {
        return {
            finalOrderSelection : 'FREE_FORM_ORDER',
            caseNameHmctsInternal: 'Test Inc v Sir John Doe, Dr Foo Bar',
            freeFormRecitalText: 'Recital of who attended',
            freeFormRecordedText: 'Record of agreement',
            freeFormOrderedText: 'Orders that were made',
            orderOnCourtsList: 'ORDER_ON_COURT_INITIATIVE',
            orderOnCourtInitiative: {
                onInitiativeSelectionTextArea: 'As this order was made on the court\'s own '
                                               + 'initiative any party affected by the order '
                                               + 'may apply to set aside, vary or stay the order. '
                                               + 'Any such application must be made by 4pm on',
                onInitiativeSelectionDate: date()
            }
        };
    },
    judgeMakesDecisionAssisted: () => {
        return {
            finalOrderSelection: 'ASSISTED_ORDER',
        }
    }
};
