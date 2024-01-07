import { DateTime } from "luxon"

const genEndDate = () => {
  const today = DateTime.now()
  return today
    .plus({
      day: 21,
    })
    .toJSDate()
}

export { genEndDate }
