const date = require('../../../fragments/date');
const {I} = inject();

module.exports = {

  fields: function (channel) {
    return {
      hearingLocation: {
        id: '#gaHearingNoticeDetail_hearingLocation',
        options: {
          basildon: 'Basildon Combined Court - REGENT HOUSE, THE GORE - SS14 2EW',
          barnsley: 'Barnsley Law Courts - THE COURT HOUSE, WESTGATE - S70 2DW',
        }
      },
      channelType: {
        id: `#gaHearingNoticeDetail_channel-${channel}`,
      },

      hnInfo: '#gaHearingNoticeInformation',
      hearingDate: 'hearingDate',
      errorMessage: '.error-message',
      hearingTime: {
        id: '#gaHearingNoticeDetail_hearingTimeHourMinute',
        options: {
          8: '08:00',
          9: '09:00',
        }
      },
      hearingDuration: {
        id: '#gaHearingNoticeDetail_hearingDuration',
        options: {
          15: '15 minutes',
          30: '30 minutes',
          other: 'Other',
        }
      },
    };
  },

  async verifyErrorMsg() {
    await I.waitInUrl('HEARING_SCHEDULED_GAHearingDetails');
    I.waitForElement(this.fields('channel').hearingLocation.id);
    await I.click('Continue');
    await I.seeNumberOfVisibleElements(this.fields('channel').errorMessage, 5);
    I.see('Location is required');
    I.see('Channel is required');
    I.see('Hearing Date is required');
  },

  async fillHearingDetails(location, channel) {
    await I.waitInUrl('HEARING_SCHEDULED_GAHearingDetails');
    I.waitForElement(this.fields(channel).hearingLocation.id);
    I.selectOption(this.fields(channel).hearingLocation.id, this.fields(channel).hearingLocation.options[location]);
    I.forceClick(this.fields(channel).channelType.id);
    await date.enterDate(this.fields(channel).hearingDate, +2);
    I.selectOption(this.fields(channel).hearingTime.id, this.fields(channel).hearingTime.options['9']);
    I.selectOption(this.fields(channel).hearingDuration.id, this.fields(channel).hearingDuration.options['30']);
    await I.clickContinue();
    await I.waitInUrl('HEARING_SCHEDULED_GAHearingInformation');
    await I.fillField(this.fields(channel).hnInfo, 'Test Notice info');
    await I.clickContinue();
  },
};

