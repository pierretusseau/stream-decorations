export const monsterNameParser = (string: string) => {
  return string
    .replace(/\s+/g, '_')
    .toLowerCase()
}

// https://stackoverflow.com/questions/45046030/maintaining-href-open-in-new-tab-with-an-onclick-handler-in-react
export const openInNewTab = (url: string) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}

export const dateISOToRelativeDays = (date: string) => {
  // Convert the ISO date string to a Date object
  const targetDate = new Date(date);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in time (milliseconds)
  const timeDifference = targetDate.getTime() - currentDate.getTime();

  // Convert the time difference from milliseconds to days
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  // Generate the relative date string
  const relativeDateString = `in ${daysDifference} days`;

  // Output the result
  return relativeDateString;
}