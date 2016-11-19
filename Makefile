all : smartypants.js smartypants.es6.js
.PHONY : all

smartypants.js: smartypants.es6.js
	tsc smartypants.ts
	sed -i.bak 's/exports\["default"\]/exports.default/g' smartypants.js
	rm smartypants.js.bak

smartypants.es6.js: smartypants.ts
	tsc smartypants.ts --target es6
	mv smartypants.js smartypants.es6.js

