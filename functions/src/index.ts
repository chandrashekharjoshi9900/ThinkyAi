/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/document";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {beforeUserCreated} from "firebase-functions/v2/identity";
import {HttpsError} from "firebase-functions/v2/https";

// List of blocked temporary email domains.
const blockedDomains = [
  "mailinator.com",
  "temp-mail.org",
  "yopmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "throwawaymail.com",
  "getnada.com",
  "maildrop.cc",
  "inboxalias.com",
  "tempmail.com",
  "dispostable.com",
  "mohmal.com",
  "trashmail.com",
  "emailondeck.com",
  "tempinbox.com",
  "mail.tm"
];

export const blocktemporaryemails = beforeUserCreated((event) => {
  const user = event.data;
  const email = user.email;

  if (email) {
    const domain = email.split("@")[1];
    if (blockedDomains.includes(domain)) {
      // Throw an error to block account creation.
      throw new HttpsError(
        "invalid-argument",
        "Temporary emails are not allowed. Please use a permanent email address.",
      );
    }
  }
  // If the domain is not blocked, return without an error.
  return;
});
