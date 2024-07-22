// utils/formatDate.js
import moment from 'moment';

export const formatDate = (date) => moment(date).format('DD-MMM-YYYY HH:mm');
