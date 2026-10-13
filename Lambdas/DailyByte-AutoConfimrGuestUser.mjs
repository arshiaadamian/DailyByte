// in this lambda you need to check whether the passed email ends in '@guest.dailybyte.com', if so, auto confirm it.
// if not no need to do anything.

export const handler = async (event) => {
  // TODO implement

  // data coming from cognito
  const eventAttributes = event.request.userAttributes;
  const eventResponse = event.response;
  
  const email = eventAttributes.email ?? "";
  if (email.endsWith("@guest.dailybyte.com.invalid")){
    eventResponse.autoConfirmUser = true;
    eventResponse.autoVerifyEmail = true;
  }

  return event;
};
