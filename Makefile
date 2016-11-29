all : dist/smartypants.min.js smartypants.js smartypants.es6.js 
.PHONY : all

dist/smartypants.min.js: smartypants.js
	uglifyjs smartypants.js > dist/smartypants.min.js

smartypants.js: smartypants.es6.js template.js
	tsc smartypants.ts
	mv smartypants.js smartypants.src.js
	cat template.js | perl -pe 's/\/\/\ \@CODE/`cat smartypants.src.js`/ge' > smartypants.js
	rm smartypants.src.js

smartypants.es6.js: smartypants.ts
	tsc smartypants.ts --target es6
	mv smartypants.js smartypants.es6.js

