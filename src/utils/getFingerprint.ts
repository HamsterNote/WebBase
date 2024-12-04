import { getInfoPromise } from '@binance/fingerprint';
import md5 from 'md5';
import moment from 'moment';

export let fingerprint = md5(`${navigator.userAgent}-${window.screen.width}-${window.screen.height}-${moment().valueOf()}`);

getInfoPromise().then(info => {
	fingerprint = md5(info);
});
