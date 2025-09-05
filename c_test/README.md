# C++ Test Environment

This directory contains a simple C++ testing setup that allows you to write and run C++ test code.

## Files

- `main.cpp` - Main test file with a simple test framework and example tests
- `Makefile` - Build configuration for compiling and running tests
- `README.md` - This documentation file

## Usage

### Compile and run tests:
```bash
make test
```

### Just compile:
```bash
make
```

### Clean build artifacts:
```bash
make clean
```

### Rebuild everything:
```bash
make rebuild
```

## Adding New Tests

To add new tests, modify `main.cpp`:

1. Add your function to test
2. Create a new test case in the `main()` function
3. Use the test framework methods:
   - `test.start_test("Test Name")` - Start a new test
   - `test.assert_equal(expected, actual)` - Assert two values are equal
   - `test.assert_true(condition, message)` - Assert a condition is true

## Example

The current setup includes example tests for:
- Basic addition function
- Bubble sort algorithm
- Empty array handling

Run `make test` to see the test results.