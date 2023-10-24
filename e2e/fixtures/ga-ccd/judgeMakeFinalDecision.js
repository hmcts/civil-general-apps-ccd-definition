const {date, listElement} = require('../../api/dataHelper');
const config = require('../../config');
module.exports = {
    judgeMakesDecisionFreeFormData: () => {
        return {
            finalOrderSelection : 'FREE_FORM_ORDER',
            caseNameHmctsInternal: 'Test Inc v Sir John Doe, Dr Foo Bar',
            freeFormRecitalText: 'Recital of who attended',
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
            assistedOrderAppealToggle: [
                'SHOW'
            ],
            orderMadeOnOption: 'NONE',
            assistedOrderAppealDetails: {
                reasonsText: 'asdfasd asdf',
                appealOrigin: 'CLAIMANT',
                permissionToAppeal: 'GRANTED',
                assistedOrderAppealDropdownGranted: {
                  assistedOrderAppealFirstOption: {
                    assistedOrderAppealDate: date(21)
                  }
                }
            },
            assistedOrderMadeSelection: 'Yes',
            assistedOrderJudgeHeardFrom: [
                'SHOW'
            ],
            assistedOrderRepresentation: {
                representationType: 'OTHER_REPRESENTATION',
                otherRepresentation: {
                    detailsRepresentationText: 'something',
                    claimantRepresentation: null,
                    defendantRepresentation: null
                },
                typeRepresentationJudgePapersList: [
                    'CONSIDERED'
                ]
            },
            assistedOrderOrderedThatText: 'Test Order details',
            assistedOrderGiveReasonsYesNo: 'No',
            assistedOrderRecitalsRecorded: {
                text: 'dsfads fasdf'
            },
            assistedOrderFurtherHearingToggle: [

            ],
            assistedOrderMadeDateHeardDetails: {
              singleDateSelection: {
                singleDateHeard:  date(1)
            }
          },
        };
    },
    judgeMakesDecisionAssistedWithHearing: () => {
        return {
            finalOrderSelection: 'ASSISTED_ORDER',
            assistedOrderAppealToggle: [
                'SHOW'
            ],
            orderMadeOnOption: 'NONE',
            assistedOrderAppealDetails: {
                appealOrigin: 'CLAIMANT',
                permissionToAppeal: 'GRANTED',
                assistedOrderAppealDropdownGranted: {
                  assistedOrderAppealFirstOption: {
                    assistedOrderAppealDate: date(21)
                }
              }
            },
            assistedOrderMadeSelection: 'Yes',
            assistedOrderJudgeHeardFrom: [
                'SHOW'
            ],
            assistedOrderRepresentation: {
                representationType: 'OTHER_REPRESENTATION',
                otherRepresentation: {
                    detailsRepresentationText: 'something',
                    claimantRepresentation: null,
                    defendantRepresentation: null
                },
                typeRepresentationJudgePapersList: [
                    'CONSIDERED'
                ]
            },
            assistedOrderOrderedThatText: 'Test Order details',
            assistedOrderGiveReasonsYesNo: 'No',
            assistedOrderRecitalsRecorded: {
                text: 'dsfads fasdf'
            },
            assistedOrderFurtherHearingToggle: [
                'SHOW'
            ],
            assistedOrderMadeDateHeardDetails: {
              singleDateSelection: {
                singleDateHeard:  date(1)
              }
            },
            assistedOrderFurtherHearingDetails: {
                listFromDate: date(1),
                hearingMethods: 'VIDEO',
                hearingNotesText: 'asdf',
                lengthOfNewHearing: 'MINUTES_30',
                datesToAvoidYesNo: 'No',
                alternativeHearingLocation: {
                    list_items: [
                        listElement(config.defendantSelectedCourt)
                    ],
                    value: listElement(config.defendantSelectedCourt)
                }
            },
        };
    }
};
