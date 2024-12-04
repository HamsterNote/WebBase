import md5 from 'md5';
import moment from 'moment';
import { fingerprint } from './getFingerprint';

let count = 0;

export function getId() {
	if (++count >= Number.MAX_SAFE_INTEGER) {
		count = 0;
	}
	return `${md5(`${moment().valueOf()}-${count}`)}-${fingerprint}`;
}
