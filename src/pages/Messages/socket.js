import { API_URL } from '../../config';
import { token } from '../../common/APICalls';


const afterProtocol = API_URL.split("://")[1];

// export function openSocket() {
//   return new WebSocket('ws://' + afterProtocol + '/' + token);
// }


// UNCOMMENT THIS BEFORE SETTING LIVE

export function openSocket() {
  return {}
}