/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'app.components.HomePage.header',
    defaultMessage: 'Hohi!',
  },
  lead: {
    id: 'app.components.HomePage.lead',
    defaultMessage:
      "Facebook knows a lot about you. Let's try to find out how much.",
  },
  mostMessages: {
    id: 'app.components.HomePage.mostMessages',
    defaultMessage: 'Threads with the most messages.',
  },
  myMessages: {
    id: 'app.components.HomePage.myMessages',
    defaultMessage: 'Threads I most posted in.',
  },
});
