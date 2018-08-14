
export interface IResponseProcessor {

  registerCaller(event);

  respondCaller(event);

  respondAll(event);
}
