const {I} = inject();
const expect = require('chai').expect;

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
    judgeRecitalTextArea: '#judicialDecisionMakeOrder_judgeRecitalText',
    orderTextArea: '#judicialDecisionMakeOrder_orderText',
    dismissalOrderTextArea: '#judicialDecisionMakeOrder_dismissalOrderText',
    directionsTextArea: '#judicialDecisionMakeOrder_directionsText',
    reasonForDecisionTextArea: '#judicialDecisionMakeOrder_reasonForDecisionText',
    consentAgreementCheckBox: '#makeAppVisibleToAll-ConsentAgreementCheckBox',
    directionsResponseDay: '#directionsResponseByDate-day',
    directionsResponseMonth: '#directionsResponseByDate-month',
    directionsResponseYear: '#directionsResponseByDate-year',
  },

  async selectAnOrder(order, consentCheck) {
    await I.waitForElement(this.fields.makeAnOrder.id);
    I.seeInCurrentUrl('/JUDGE_MAKES_DECISIONGAJudicialMakeADecisionScreen');
    I.see('Judge’s recital');
    let judgeRecitalText = await I.grabValueFrom(this.fields.judgeRecitalTextArea);
    expect(judgeRecitalText).to.contains('Upon reading the application');
    I.see('Reason for decision');
    if (consentCheck === 'no') {
      I.seeTextEquals('This application is cloaked', '#applicationIsCloakedLabel h2');
      I.see('Make application visible to all parties');
      I.click(this.fields.consentAgreementCheckBox);
    }
    await within(this.fields.makeAnOrder.id, () => {
      I.click(this.fields.makeAnOrder.options[order]);
    });
    switch (order) {
      case 'approveOrEditTheOrder':
        I.fillField(this.fields.orderTextArea, 'Judges order');
        break;
      case 'dismissTheApplication':
        I.fillField(this.fields.dismissalOrderTextArea, 'Judges dismissed the order');
        break;
      case 'giveDirections':
        I.fillField(this.fields.directionsTextArea, 'Judges directions');
        I.see('Respond by 4pm on');
        I.fillField(this.fields.directionsResponseDay, '01');
        I.fillField(this.fields.directionsResponseMonth, '01');
        I.fillField(this.fields.directionsResponseYear, '2024');
        break;
    }
    await I.fillField(this.fields.reasonForDecisionTextArea, 'Judges Decision');
    await I.clickContinue();
  }
};
