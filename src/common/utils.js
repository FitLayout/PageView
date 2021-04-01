/**
 * Converts a string (class name) to a color.
 * @param {} cname 
 */
export function stringColor(cname) {
	
	if (!cname) {
		return 'rgb(255,255,255)';
	}
	let s = cname;
	while (s.length < 6) { 
		s = s + s;
	}
	let r = s.charCodeAt(0) * s.charCodeAt(1);
	let g = s.charCodeAt(2) * s.charCodeAt(3);
	let b = s.charCodeAt(4) * s.charCodeAt(5);
	let ret = 'rgba(' + (100 + (r % 150)) + ',' + (100 + (g % 150)) + ',' + (100 + (b % 150)) + ',0.5)';
	//System.out.println(cname + " => " + ret.toString());
	return ret;
}

export function stringsGradient(cnames) {
	if (!cnames || cnames.length == 0) {
		return '';
	}
	let ret = 'linear-gradient(180deg';
	for (let i = 0; i < cnames.length; i++) {
		if (i == 0) {
			ret += ',' + stringColor(cnames[i]);
		} else {
			let perc = (i * 100) / cnames.length;
			ret += ',' + stringColor(cnames[i - 1]) + ' ' + perc + '%';
			ret += ',' + stringColor(cnames[i]) + ' ' + perc + '%';
		}
	}
	ret += ',' + stringColor(cnames[cnames.length - 1]) + ')';
	return ret;
}
