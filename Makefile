all : smartypants.js smartypants.es6.js
.PHONY : all

smartypants.js: smartypants.es6.js template.js
	tsc smartypants.ts
	sed -i.bak 's/exports\["default"\]/exports.default/g' smartypants.js
	rm smartypants.js.bak
	mv smartypants.js smartypants.src.js
	cat template.js | perl -pe 's/\/\/\ \@CODE/`cat smartypants.src.js`/ge' > smartypants.js
	rm smartypants.src.js

smartypants.es6.js: smartypants.ts
	tsc smartypants.ts --target es6
	mv smartypants.js smartypants.es6.js

