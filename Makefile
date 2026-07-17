report:
	npx playwright show-report
failed:
	npx playwright test --last-failed
all: 
	npx percy exec -- npx playwright test /tests/Travel documents/ /tests/Passport-tests/ /tests/Mobile/ /tests/visual/
admin: 
	npx playwright test /tests/admin/
test: 
	npx playwright test /tests/Travel documents/ /tests/Passport-tests/ /tests/Mobile/ /tests/wolf-tests

refactor: 
	npx playwright test ukEta.spec.js --headed
translations:
	npx playwright test payments.spec.js

fastPassport:
	npx playwright test onlinePassport.spec.js 


status:
	npx playwright test payments.spec.js extra_order.spec.js different_currency.spec.js currency_mobile.spec.js