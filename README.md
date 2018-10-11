# How to use the Aircall Everywhere in any CRM ?

## Include this project in your dependency

`npm install aircall-everywhere`

## Constructor

You need to create an instance to use the library. The constructor has a settings argument:

- `onLogin`: Callback function after the phone is fully loaded, logged in, and the connexion between the phone and the CRM is established. This callback will triggers everytime the user logs again. User details and integration settings if any are passed as parameters.
- `onLogout`: Callback function after the user logs out of the phone. It will triggers everytime the user logs out.
- `integrationToLoad`: You can specify a CRM from which specific settings can be retrieved. Only `zendesk` or `hubspot` available for now. You can ignore this if you have your own CRM.
- `domToLoadPhone`: You must specify in which element you want to load the phone. Query selector string.

Example:

```javascript
import AircallPhone from 'aircall-everywhere';

const aircallPhone = new AircallPhone({
  onLogin: settings => {
    console.log('phone loaded');
    doStuff();
  },
  onLogout: () => {},
  domToLoadPhone: '#phone',
  integrationToLoad: 'zendesk'
});
```

Settings passed in the `onLogin` callback contains info about the user and integration and looks like this:

```javascript
{
  user: {
    email: 'john@company.com',
    first_name: 'John',
    last_name: 'Smith',
    company_name: 'Super Company Inc'
  },
  settings: {
    <specific_integration_settings>
  }
}
```

## isLoggedIn method

In addition to the `onLogin` and `onLogout` callbacks, a `isLoggedIn` method is provided that will directly asks the phone about its status. The result is a boolean.

Example:

```javascript
aircallPhone.isLoggedIn(res => {
  console.log('login status:', res);
});
```

## on & send

You can send messages to the phone and listen messages coming from it.

### events from the phone:

All events from the phone with the payload associated:

- `incoming_call`: there is an incoming call, ringing.
  ```javascript
  {
    from: '+15557543010',
    to: '+15551234567',
    communication_id: 'abcdeABCDE12345'
  }
  ```
- `call_end_ringtone`: the ringtone has ended.
  ```javascript
  {
    answer_status: 'answered | disconnected | refused',
    communication_id: 'abcdeABCDE12345'
  }
  ```
- `outgoing_call`: an outgoing call has started
  ```javascript
  {
    from: '+15557543010',
    to: '+15551234567',
    communication_id: 'abcdeABCDE12345'
  }
  ```
- `outgoing_answered`: an outgoing call has been answered
  ```javascript
  {
    communication_id: 'abcdeABCDE12345';
  }
  ```
- `call_ended`: a call has been ended
  ```javascript
  {
    duration: 20,
    communication_id: 'abcdeABCDE12345'
  }
  ```
- `comment_saved`: a comment has been saved about a call
  ```javascript
  {
    comment: 'This is a comment',
    communication_id: 'abcdeABCDE12345'
  }
  ```
- `external_dial`: a dial has been made from outside of the phone (api/extension)
  ```javascript
  {
    phone_number: '+15557543010';
  }
  ```
- `powerdialer_updated`: a powerdialer campain has been updated (via extension). There is no payload.
- `redirect_event`: event coming from specific CRM settings if it has been enabled in the Aircall Dashboard. Only `zendesk` and `hubspot` is supported for now. This event data has this schema:
  ```javascript
  {
    type: 'Zendesk::User' | 'Zendesk::Ticket'
    id: <userId> | <ticketId>
  }
  ```

`communication_id` parameter is a hash unique per call.
`duration` is in seconds.
All numbers are sent in the `e.164` format.

Example:

```javascript
aircallPhone.on('incoming_call', callInfos => {
  console.log('Call from ' + callInfos.from + ' to ' + callInfos.to);
  doStuff();
});
```

### events the phone listens to:

Example:

```javascript
aircallPhone.send('dial_number', { phone_number: number }, (success, data) => {
  console.log('success of dial:', success);
});
```

The callback of the `send` method has two arguments:

- success of the request
- if the request is successful, data from the response sent by the phone
- if the request is not successful, an error object with an error code and error message:

All generic errors from `send`:

- `no_event_name`: the event name sent is not valid
- `not_ready`: Phone is not loaded or logged in yet
- `no_answer`: Phone didn't answer, most likely not logged in
- `does_not_exists`: The event sent does not exists
- `invalid_response`: Phone sent an malformed answer, should not happen
- `unknown_error`: Should not happen

List of events:

- `dial_number`: with `{phone_number: <number>}` argument, you can ask the phone to dial the number.
  Specific errors for this event:

  - `in_call`: Phone is on a call, retry after the call is ended

- `exit_keyboard`: with no argument, you can ask the phone to exit the keyboard view if it is on.
  Specific errors for this event:
  - `in_call`: Phone is on a call, retry after the call is ended
  - `not_in_keyboard`: Phone is not on keyboard screen, so it can't exit the keyboard :D

more events to come...

## removeListener method

You can remove a listener added by `on` with this method.

# Development

You can run the demo webpage with:
`npm start`

tests are available:
`npm run test`
`npm run test-watch`
`npm run coverage`
