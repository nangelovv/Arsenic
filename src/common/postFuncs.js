// This function can be called from both MyProfile and Home components when there are posts to render
//  and their date needs to be transformed into human readable time
export function transformTime(milliseconds) {

    // The parseInt function parses the milliseconds argument as an integer in base 10 and creates the date
    const date = new Date(parseInt(milliseconds, 10));
  
    // The below variables are used to hold the specific day, month or year of the date and then return it as a readable date
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // January is month 0
    const year = date.getUTCFullYear();
  
    return `${day}/${month}/${year}`;
  }