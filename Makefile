all : dist/smartypants.min.js smartypants.js smartypants.es6.js 
.PHONY : all

dist/smartypants.min.js: smartypants.js
	uglifyjs smartypants.js --comments '/^!/' --support-ie8 > dist/smartypants.min.js

smartypants.js: smartypants.es6.js template.js
	tsc smartypants.ts; mv smartypants.js smartypants.src.js
	sed -i.bak 's/^/    /g' smartypants.src.js; rm smartypants.src.js.bak
	cat template.js | perl -pe 's/^\/\/\ \@CODE/`cat smartypants.src.js`/ge' > smartypants.indent.js; rm smartypants.src.js
	cat smartypants.indent.js | gunexpand -t 4 --first-only - | gexpand -t 2 - > smartypants.js; rm smartypants.indent.js
	# cat smartypants.indent.js | unexpand -t 4 --first-only | expand -t 2 > smartypants.js; rm smartypants.indent.js

smartypants.es6.js: smartypants.ts
	tsc smartypants.ts --target es6; 
	cat smartypants.js | gunexpand -t 4 --first-only - | gexpand -t 2 - > smartypants.es6.js; rm smartypants.js
	# cat smartypants.js | unexpand -t 4 --first-only | expand -t 2 > smartypants.es6.js; rm smartypants.js

