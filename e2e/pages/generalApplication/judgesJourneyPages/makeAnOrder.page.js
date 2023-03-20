/* eslint-disable  no-case-declarations */
const {I} = inject();
const expect = require('chai').expect;
const {verifyJudgeRecitalText, selectJudicialByCourtsInitiativeOption} = require('../../generalAppCommons');

module.exports = {

  fields: {
    makeAnOrder: {
      id: '#judicialDecisionMakeOrder_makeAnOrder',
      options: {
        approveOrEditTheOrder: 'Approve or edit the order requested by the applicant',
        dismissTheApplication: 'Dismiss the application',
        giveDirections: 'Give directions without listing for hearing'
      }
    },
    courtInitiative: {
      id: '#judicialDecisionMakeOrder_judicialByCourtsInitiative',
      options: {
        orderCourtInitiative: 'Order on court\'s own initiative',
        orderWithoutNotice: 'Order without notice',
        none: 'None'
      }
    },
    judgeRecitalTextArea: '#judicialDecisionMakeOrder_judgeRecitalText',
    orderTextArea: '#judicialDecisionMakeOrder_orderText',
    dismissalOrderTextArea: '#judicialDecisionMakeOrder_dismissalOrderText',
    directionsTextArea: '#judicialDecisionMakeOrder_directionsText',
    reasonForDecisionTextArea: '#judicialDecisionMakeOrder_reasonForDecisionText',
    consentAgreementCheckBox: '#makeAppVisibleToRespondents_makeAppAvailableCheck-ConsentAgreementCheckBox',
    directionsResponseDay: '#directionsResponseByDate-day',
    directionsResponseMonth: '#directionsResponseByDate-month',
    directionsResponseYear: '#directionsResponseByDate-year',
    documentDropdown: '#judicialDecisionMakeOrder_judgeApproveEditOptionDoc',
    judgeApproveEditOptionDateDay: '#judgeApproveEditOptionDate-day',
    judgeApproveEditOptionDateMonth: '#judgeApproveEditOptionDate-month',
    judgeApproveEditOptionDateYear: '#judgeApproveEditOptionDate-year',
  },

  async selectAnOrder(order, notice) {
    await I.waitForElement(this.fields.makeAnOrder.id);
    I.seeInCurrentUrl('/MAKE_DECISIONGAJudicialMakeADecisionScreen');
    I.see('Judge’s recital');
    await verifyJudgeRecitalText(await I.grabValueFrom(this.fields.judgeRecitalTextArea), notice);
    I.see('Reasons for decision');
    if (notice === 'no') {
      I.seeTextEquals('This application is cloaked', '#applicationIsCloakedLabel h2');
      I.see('Make application visible to all parties');
      I.click(this.fields.consentAgreementCheckBox);
    }
    await within(this.fields.makeAnOrder.id, () => {
      I.click(this.fields.makeAnOrder.options[order]);
    });
    await within(this.fields.courtInitiative.id, () => {
      I.click(this.fields.courtInitiative.options['none']);
    });
    switch (order) {
      case 'approveOrEditTheOrder':
        let orderText = await I.grabValueFrom(this.fields.orderTextArea);
        expect(orderText).to.contains('Test Order details');
        I.see('For which document?');
        let documentDropdownValues = await I.grabTextFromAll(this.fields.documentDropdown);
        expect(documentDropdownValues.toString().replace(/(\r\n|\n|\r)/gm, ', ').trim()).to.equals('--Select a value--, Claim Form, Defence Form');
        I.selectOption(this.fields.documentDropdown, 'Claim Form');
        break;
      case 'dismissTheApplication':
        I.fillField(this.fields.dismissalOrderTextArea, 'Judges dismissed the order');
        break;
      case 'giveDirections':
        I.fillField(this.fields.directionsTextArea, 'Judges directions');
        I.see('When should this application be referred to a Judge again?');
        I.fillField(this.fields.directionsResponseDay, '01');
        I.fillField(this.fields.directionsResponseMonth, '01');
        I.fillField(this.fields.directionsResponseYear, '2024');
        break;
    }
    await selectJudicialByCourtsInitiativeOption();
    await I.fillField(this.fields.reasonForDecisionTextArea, 'Judges Decision');
    await I.clickContinue();
  }
};
