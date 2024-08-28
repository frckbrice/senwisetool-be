export const localEvents = {
  /**
   *  When a new participant is created we emit this event so that we can send an email on the receiving end
   * to inform the participant that their registration has been received and they will be notified when their registration has been confirmed.
   */
  participantCreated: 'participant.created',
  paymentCanceled: `paypalPayment.canceled`,
  paymentSuccess: `paypalPayment.successfull`,
}
