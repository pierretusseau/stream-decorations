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