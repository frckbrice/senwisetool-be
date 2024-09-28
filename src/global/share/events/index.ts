export const localEvents = {

  invitationCreated: 'invitation.created',


  companyCreated: 'company.created',
  userCreated: 'user.created',
  userUpdated: 'user.updated',

  // subscription 
  subscriptionRenewalReminder: 'subscription.renewalReminder',
  accountDeactivated: 'account.deactivated',
  gracePeriodStarted: 'gracePeriod.started',

  paymentCanceled: `paypalPayment.canceled`,
  paymentSuccess: `paypalPayment.successfull`,
  unsubscribeToPlan: `subscription.unsubscribe`,
  upgradeToPlan: `subscription.upgrade`,
  nearExpiration: `subscription.nearExpiration`,
  subscriptionExpired: `subscription.expired`,
};
