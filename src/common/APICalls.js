import { API_URL } from '../config';


// The token value from the localStorage is taken and being concatenated with 'Bearer' which 
// is then sent as an Authorization header in the API call
export let token = localStorage.getItem('ArsenicToken');

var bearer = 'Bearer ' + token;


// This function makes an API call which does not have a body in the request the only necessary parameters 
// are the endpoint of the API and the verb of the method
export async function APINoBody(endpoint, methodVerb) {
  return await fetch(API_URL + endpoint, {
    method: methodVerb,
    headers: {
      Authorization: bearer,
      Accept: 'application/json'
    },
  });
}


// This function makes an API call which REQUIRES to have a body in the request. The necessary parameters are 
// the endpoint of the API, the verb of the method and the body of the request which would most likely be FormData
export async function APIBody(endpoint, methodVerb, form) {
  return await fetch(API_URL + endpoint, {
    method: methodVerb,
    body: form,
    headers: {
      Authorization: bearer,
      Accept: 'application/json'
    },
  });
}


// This function makes an API call which does not have an Authorizaion token in the request,
// the necessary parameters are the endpoint of the API, verb of the method and body with data
export async function APINoAuth(endpoint, methodVerb, form) {
  return await fetch(API_URL + endpoint, {
    method: methodVerb,
    headers: { 'Content-Type': 'application/json' },
    body: form
  })
}