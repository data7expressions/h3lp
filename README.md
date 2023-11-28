# H3lp

Helper sets

|Method     |Description            |
|-----------|-----------------------|
|obj        | Object helper         |
|fs         | File system helper    |
|str        | String helper         |
|test       | Test helper           |
|utils      | Utils helper          |
|validator  | Validator helper      |

## Object Helper

|Method     |Description                            |
|-----------|---------------------------------------|
|clone      | clone an object                       |
|clone      | clone an object                       |
|extends    | extend an object                      |
|delta      | get the difference between two objects|
|find       | find with predicate                   |
|jsonPath   | find with jsonPath expression         |
|sort       | sort properties                       |

## File System Helper

|Method     |Description                            |
|-----------|---------------------------------------|
|exists     | verify if exists path                 |
|create     | create folder                         |
|read       | read file                             |
|remove     | remove file                           |
|copy       | copy file                             |
|write      | create or replace file                |
|writeBinary| create or replace binary file         |
|lstat      | returned details about the file       |
|readdir    | list folder                           |

## String Helper

|Method     |Description                                                                                                |
|-----------|-----------------------------------------------------------------------------------------------------------|
| normalize | normalize a string                                                                                        |
| toString  | convert to string                                                                                         |
| replace   | Searches a string for a specified value and returns a new string where the specified values are replaced  |
| concat    | String concatenation                                                                                      |
| capitalize| Make the first character have upper case and the rest lower case                                          |
| initCap   | Capitalize words                                                                                          |
| plural    | convert word to plural                                                                                    |
| singular  | convert word to singular                                                                                  |
| notation  | convert to notation camelCase or pascalCase                                                               |

## Test Helper

|Method             |Description                |
|-------------------|---------------------------|
|createBuilder      | create TestBuilder        |
|createSuiteBuilder | create TestSuiteBuilder   |

## Utils Helper

|Method                 |Description                    |
|-----------------------|-------------------------------|
|solveEnvironmentVars   | resolve environment variables |
|template               | solve a template              |

## Validator Helper

|Method                 |Description                                        |
|-----------------------|---------------------------------------------------|
| isObject              | evaluate if is Object                             |
| isEmpty               | evaluate if is Empty                              |
| isPositiveInteger     | evaluate if is Positive Integer                   |
| isNull                | evaluate if is Null                               |
| isNotNull             | evaluate if is Not Null                           |
| isNotEmpty            | evaluate if is Not Empty                          |
| isBoolean             | evaluate if is Boolean                            |
| isNumber              | evaluate if is Number                             |
| isInteger             | evaluate if is Integer                            |
| isDecimal             | evaluate if is Decimal                            |
| isString              | evaluate if is String                             |
| isDate                | evaluate if is Date                               |
| isDateTime            | evaluate if is DateTime                           |
| isArray               | evaluate if is Array                              |
| isTime                | evaluate if is Time                               |
| isBooleanFormat       | evaluate if is Boolean Format                     |
| isNumberFormat        | evaluate if is Number Format                      |
| isIntegerFormat       | evaluate if is Integer Format                     |
| isDecimalFormat       | evaluate if is Decimal Format                     |
| isAlphanumeric        | evaluate if is Alphanumeric                       |
| isAlpha               | evaluate if is Alpha                              |
| isDateFormat          | evaluate if is Date Format                        |
| isDateTimeFormat      | evaluate if is DateTime Format                    |
| isTimeFormat          | evaluate if is Time Format                        |
| between               | evaluate if value is between two ranges           |
| includes              | evaluate if value is included is string or array  |
