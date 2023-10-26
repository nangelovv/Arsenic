export function transformTime(milliseconds) {
  const currentDate = new Date();
  const date = new Date(parseInt(milliseconds, 10));
  const timeDifference = currentDate - date;
  let formattedTime;

  if (timeDifference < 60000) { // Less than 60 seconds
    const secondsAgo = Math.floor(timeDifference / 1000);
    formattedTime = `${secondsAgo} seconds ago`;
  } else if (timeDifference < 3600000) { // Less than 60 minutes
    const minutesAgo = Math.floor(timeDifference / 60000);
    formattedTime = `${minutesAgo} minutes ago`;
  } else if (timeDifference < 86400000) { // Less than 24 hours
    const hoursAgo = Math.floor(timeDifference / 3600000);
    formattedTime = `${hoursAgo} hours ago`;
  } else if (timeDifference < 604800000) { // Less than 7 days
    const daysAgo = Math.floor(timeDifference / 86400000);
    formattedTime = `${daysAgo} days ago`;
  } else {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // January is month 0
    const year = date.getUTCFullYear();
    formattedTime = `${day}/${month}/${year}`;
  }

  return <time className='fs-6 text-start'>{formattedTime}</time>;
}