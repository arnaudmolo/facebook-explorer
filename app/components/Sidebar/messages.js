/*
 * Sidebar Messages
 *
 * This contains all the text for the Sidebar component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  home: {
    id: 'app.components.Sidebar.home',
    defaultMessage: 'Home',
  },
  users: {
    id: 'app.components.Sidebar.users',
    defaultMessage: 'Users',
  },
  threads: {
    id: 'app.components.Sidebar.threads',
    defaultMessage: 'Threads',
  },
  cartho: {
    id: 'app.components.Sidebar.cartho',
    defaultMessage: 'Carthographie',
  },
  noData: {
    id: 'app.components.Sidebar.noData',
    defaultMessage:
      'No data is beeing loaded. Please follow the readme instructions.',
  },
});
