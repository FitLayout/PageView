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
