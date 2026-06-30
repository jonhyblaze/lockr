type GeneratorOptions = {
  length: number
  charset: {
    upper: boolean
    lower: boolean
    numbers: boolean
    symbols: boolean
  }
}

const generatePassword = ({ length, charset }: GeneratorOptions) => {
  let chars = ""

  if (charset.upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  if (charset.lower) chars += "abcdefghijklmnopqrstuvwxyz"
  if (charset.numbers) chars += "0123456789"
  if (charset.symbols) chars += "@#$%^&*"

  let result = ""

  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }

  return result
}

export { generatePassword }
