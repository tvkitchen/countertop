# Testing

This project uses Jest for testing.  All new [contributions](docs/CONTRIBUTING.md) that modify code should come with accompanying tests.

**Please review [this excellent guide](https://github.com/goldbergyoni/javascript-testing-best-practices) on JavaScript testing best practices.**

## Test Command

To test the project, run:

```
yarn test
```

This will display the test results, but not other logging output from the code by default. To override this add `--no-silent`.


## Test Locations

We have a few types of test, which should be placed in different places depending on the type of test.

### Unit / Component Tests

[Unit tests](https://en.wikipedia.org/wiki/Unit_testing) (aka component tests) test specific methods within a module.  Unit tests should be committed *alongside the code that they test*.

Unit test suites should be located inside of a `__test__` directory that is a sibling of the module being tested.  The test suite should be named as `{MODULE_FILENAME}.unit.test.js`.

For instance, the following might be a file structure for a unit test suite for the `module.js` module:

```
 - myCode
   - __test__
     - module.unit.test.js
   - module.js
```

### Integration Tests

[Integration tests](https://en.wikipedia.org/wiki/Integration_testing) test modules of the system as a group.  Because these tests are not related to individual modules, they should be palced inside of the `src/tests` directory.

They should be named in terms of the system component they are testing.

For instance, the following might be a file for an integration test suite of the `api`:

```
- test
  - api.int.test.js
```

## Test Data

### Input data

Manually created data for unit tests should be stored in a `data` directory within `__test__`.  The same data file should NOT be shared between multiple tests, so as to avoid accidental coupling.

Data should be stored in a JSON file named `methodBeingTested.json`.  If there is more than one data file for a given tested method it should be appropriately named e.g. `methodBeingTested.moreDetailedDescription.json`.

The data loader only supports JSON data.

### Output data

If the expected output for a given test is expected to be long or complex, we recommend the use of [snapshots](https://jestjs.io/docs/en/snapshot-testing).

## Mocks

We use [nock](https://www.npmjs.com/package/nock) for http mocking.
