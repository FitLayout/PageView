/**
 * Converts a string (class name) to a color.
 * @param {} cname 
 */
export function stringColor(cname) {
	
	if (!cname) {
		return 'rgba(255,255,255,0.5)';
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

/**
 * Infers a tag type from an IRI.
 * 
 * @param {} iri the IRI to analyze
 */
export function inferTagType(iri) {
	let name = iri;
	let isep = name.lastIndexOf('/');
	if (isep > 0 && isep + 1 < name.length) {
		name = name.substring(isep + 1);
	}
	isep = name.indexOf('--');
	if (isep > 0) {
		let type = name.substring(0, isep);
		if (type.startsWith('tag-')) {
			type = type.substring(4);
		}
		return type;
	} else {
		return null;
	}
}

/**
 * Infers a tag name from an IRI.
 * 
 * @param {} iri the IRI to analyze
 */
export function inferTagName(iri) {
	let name = iri;
	let isep = name.lastIndexOf('/');
	if (isep > 0 && isep + 1 < name.length) {
		name = name.substring(isep + 1);
	}
	isep = name.indexOf('--');
	if (isep > 0) {
		name = name.substring(isep + 2);
	}
    return name;
}
