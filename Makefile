install:
	npm ci
	npm link

lint:
	npx eslint .

test:
	npm test