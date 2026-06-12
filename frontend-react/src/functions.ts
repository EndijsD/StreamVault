import moment from 'moment'

export const formatDate = (value: string | Date) => {
  return moment(value).format('DD.MM.YYYY')
}
