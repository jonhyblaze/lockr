const copyToClipboard = (text : string) => {

  const navigator = window.navigator
  navigator.clipboard.writeText(text)
}

export default copyToClipboard
