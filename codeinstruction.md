# Code Instructions

## Purpose

This document defines the coding standards, engineering principles, documentation requirements, and quality expectations that must be followed when creating or modifying code in this project.

The primary goals are to produce code that is:

- Correct
- Readable
- Maintainable
- Modular
- Testable
- Secure
- Reusable
- Easy to review
- Easy to extend
- Easy to debug
- Consistent with the existing codebase

These instructions apply to all new code and should be followed when refactoring existing code unless doing so would introduce unnecessary risk.

---

# 1. Core Engineering Principles

## 1.1 Keep Code Simple

Follow the **KISS principle — Keep It Simple, Stupid**.

Prefer the simplest design that correctly solves the problem.

Avoid:

- Unnecessary abstractions
- Excessive inheritance
- Clever one-liners that reduce readability
- Premature optimization
- Complex design patterns when a simple function or class is sufficient
- Introducing extra layers without a clear benefit

Code should be easy for another developer to understand without requiring extensive explanation.

---

## 1.2 DRY — Don't Repeat Yourself

Do not duplicate business logic, validation rules, constants, algorithms, or repeated implementation details.

When the same logic appears multiple times:

1. Identify the shared responsibility.
2. Extract it into an appropriately named function, class, module, utility, or service.
3. Reuse the shared implementation.

However, do not create abstractions too early. A small amount of temporary duplication can be better than a bad abstraction.

---

## 1.3 YAGNI — You Aren't Gonna Need It

Do not implement functionality merely because it may be useful in the future.

Build what is required now while keeping the design reasonably extensible.

Avoid:

- Unused configuration options
- Unused classes
- Placeholder systems
- Speculative APIs
- Over-generalized abstractions
- Features that are not part of the current requirements

---

## 1.4 SOLID Principles

Use SOLID principles where appropriate.

### Single Responsibility Principle

A function, class, or module should have one clear responsibility.

### Open/Closed Principle

Prefer designs that allow behavior to be extended without repeatedly modifying stable code.

### Liskov Substitution Principle

Derived implementations must behave consistently with the contracts of the abstractions they replace.

### Interface Segregation Principle

Prefer small, focused interfaces instead of large interfaces that force callers to depend on functionality they do not use.

### Dependency Inversion Principle

High-level business logic should depend on stable abstractions rather than concrete implementation details where this meaningfully improves testability and maintainability.

Do not apply SOLID mechanically. Use it to improve clarity and maintainability, not to create unnecessary architecture.

---

## 1.5 Separation of Concerns

Keep separate responsibilities in separate components.

For example, avoid mixing:

- Database access with UI rendering
- HTTP transport logic with business rules
- Validation with persistence
- Logging with core calculations
- Configuration loading with domain logic
- File parsing with unrelated business operations

A component should have a clear reason to exist.

---

## 1.6 Prefer Composition Over Inheritance

Use composition by default.

Use inheritance only when there is a genuine and stable "is-a" relationship and inheritance clearly improves the design.

Avoid deep inheritance hierarchies.

---

## 1.7 Reuse Before Reinventing

Before implementing a common capability from scratch, check whether:

1. The language standard library already provides it.
2. The project already contains a suitable implementation.
3. A trusted, maintained dependency provides it.

Do not unnecessarily rebuild mature functionality such as:

- Date/time parsing
- Cryptography
- Serialization
- Validation frameworks
- HTTP clients
- Database pooling
- Authentication standards

Do not add a dependency for trivial functionality that can be implemented safely and clearly in a few lines.

---

# 2. Project and File Organization

## 2.1 Keep the Codebase Modular

Organize code by responsibility and domain.

Prefer small, cohesive modules rather than large files that handle unrelated behavior.

A file should normally have one primary purpose.

If a file becomes difficult to navigate, contains unrelated responsibilities, or grows excessively large, split it into smaller modules.

---

## 2.2 Every Source File Must Explain Its Purpose

Every source code file must begin with a module-level docstring or equivalent documentation comment where the language supports it.

The file documentation should explain:

- What the file/module is responsible for
- The main behavior it provides
- Important dependencies when relevant
- Important assumptions when relevant
- External side effects when relevant
- Important usage information when it is not obvious

Example in Python:

```python
"""User authentication service.

This module contains the application-level authentication logic used to
validate credentials, issue access tokens, and coordinate user login.

It does not contain HTTP route handling or database schema definitions.

Main responsibilities:
    - Validate login credentials.
    - Retrieve users through the user repository.
    - Issue authentication tokens.

External dependencies:
    - UserRepository
    - TokenProvider

Side effects:
    - Reads user information from persistent storage.
"""
```

Avoid meaningless module docstrings such as:

```python
"""Utilities."""
```

The documentation should communicate useful context.

### Exceptions

Generated files, third-party/vendor files, migration snapshots, and formats that do not support comments/docstrings may be exempt.

Do not manually edit generated or vendor files unless the project explicitly requires it.

---

## 2.3 Keep Related Code Together

Code that changes together should usually live together.

Avoid placing unrelated helpers in generic files such as:

- `utils.py`
- `helpers.py`
- `common.py`
- `misc.py`

If a utility has a specific purpose, give it a specific module name.

For example:

- `date_parser.py`
- `email_validator.py`
- `currency_formatter.py`

is preferable to placing everything in `utils.py`.

---

# 3. Naming Conventions

Names must communicate intent.

Do not optimize names for typing speed.

## 3.1 General Naming Rules

Use:

- Clear names
- Descriptive names
- Domain terminology
- Consistent terminology throughout the codebase

Avoid:

- Ambiguous abbreviations
- Single-letter names except for obvious short-lived local variables
- Misleading names
- Generic names such as `data`, `value`, `thing`, `temp`, `obj`, or `manager` when a more precise name is possible

Bad:

```python
d = get_data()
x = process(d)
```

Better:

```python
customer_orders = fetch_customer_orders()
validated_orders = validate_orders(customer_orders)
```

---

## 3.2 Functions and Methods

Function names should normally describe an action.

Examples:

- `create_invoice`
- `validate_email`
- `fetch_customer`
- `calculate_total`
- `send_notification`
- `is_user_active`

Boolean-returning functions should preferably read naturally:

- `is_valid`
- `has_permission`
- `can_retry`
- `should_refresh`

---

## 3.3 Classes and Types

Class names should normally be nouns or noun phrases.

Examples:

- `Invoice`
- `PaymentService`
- `UserRepository`
- `TokenProvider`

Avoid names that do not describe responsibility.

---

## 3.4 Constants

Use clearly named constants rather than unexplained literals.

Example:

```python
MAX_LOGIN_ATTEMPTS = 5
TOKEN_EXPIRY_MINUTES = 30
```

Avoid magic numbers and magic strings in business logic.

---

## 3.5 Follow Language-Specific Conventions

Follow the established naming conventions of the language and framework.

Examples:

### Python

- `snake_case` for functions and variables
- `PascalCase` for classes
- `UPPER_SNAKE_CASE` for constants
- `_leading_underscore` for internal/private implementation details

### JavaScript / TypeScript

- `camelCase` for variables and functions
- `PascalCase` for classes, components, and types
- `UPPER_SNAKE_CASE` for true constants when appropriate

If the existing project uses an established convention, preserve consistency unless there is a strong reason to change it.

---

# 4. Function and Method Standards

## 4.1 Every Non-Trivial Function Must Have Documentation

Every public function and method must have a docstring or equivalent documentation comment.

Private/internal functions should also be documented whenever their purpose, constraints, behavior, or inputs are not immediately obvious.

The documentation should describe:

- What the function does
- Parameters
- Expected parameter types when not already clear from the type system
- Return value
- Return type when useful
- Exceptions/errors that may be raised
- Side effects
- Important assumptions or constraints
- An example when usage is non-obvious

Example:

```python
def calculate_discount(
    subtotal: Decimal,
    discount_percentage: Decimal,
) -> Decimal:
    """Calculate the discount amount for an order.

    Args:
        subtotal:
            Order subtotal before discounts. Must be zero or greater.
        discount_percentage:
            Percentage discount represented as a value from 0 through 100.

    Returns:
        The monetary amount that should be deducted from the subtotal.

    Raises:
        ValueError:
            If subtotal is negative or discount_percentage is outside
            the inclusive range 0 through 100.

    Example:
        >>> calculate_discount(Decimal("100"), Decimal("15"))
        Decimal("15")
    """
```

Do not write docstrings that merely repeat the function name.

Bad:

```python
def get_user(user_id):
    """Gets user."""
```

Explain meaningful behavior and contracts.

---

## 4.2 Functions Should Do One Thing

A function should have one clear responsibility.

If the description of a function requires several unrelated verbs, consider splitting it.

Instead of:

```text
load_validate_transform_save_and_email_order()
```

prefer separate operations with orchestration at a higher level.

---

## 4.3 Keep Functions Small and Focused

There is no universal line limit, but large functions should be treated as a warning sign.

Extract logic when doing so improves:

- Readability
- Reuse
- Testability
- Error handling
- Separation of concerns

Do not split functions into tiny pieces merely to satisfy an arbitrary line count.

---

## 4.4 Minimize Function Arguments

Prefer small, focused parameter lists.

If many parameters naturally belong together, consider introducing a typed object, configuration object, request model, or domain type.

Avoid large groups of boolean flags such as:

```python
generate_report(data, True, False, True, False)
```

Prefer explicit options or separate operations.

---

## 4.5 Avoid Hidden Side Effects

A function should not unexpectedly:

- Modify global state
- Change input objects
- Write files
- Perform network calls
- Update a database
- Send messages

unless that behavior is part of the function's clear responsibility and documentation.

Prefer pure functions when practical.

---

## 4.6 Return Predictable Types

A function should return consistent, documented types.

Avoid patterns where a function may unpredictably return unrelated values such as:

- an object
- `False`
- an empty string
- an exception-like object

Use appropriate nullable/optional types, result objects, or exceptions.

---

# 5. Type Safety

Use the language's type system where available.

Prefer explicit type information for:

- Public APIs
- Function parameters
- Function return values
- Domain models
- Configuration
- Complex collections
- Interfaces

Example:

```python
def find_user(user_id: UserId) -> User | None:
    ...
```

Types should improve understanding and correctness, not simply satisfy a checker.

Avoid unnecessarily broad types such as `Any`, `object`, or untyped maps when a meaningful type can be defined.

---

# 6. Comments and Documentation

## 6.1 Comments Should Explain Why

Code should explain **what** it is doing through clear names and structure.

Comments should primarily explain:

- Why an unusual decision was made
- Why a workaround exists
- Why a particular constraint matters
- Why an apparently simpler implementation cannot be used
- Important business context

Bad:

```python
# Increment i by 1
i += 1
```

Better:

```python
# Retry counts include the initial attempt, so increment before comparison.
attempt_count += 1
```

---

## 6.2 Keep Documentation Accurate

Outdated documentation is dangerous.

Whenever behavior changes, update:

- Docstrings
- README files
- API documentation
- Examples
- Comments
- Configuration documentation
- Architecture notes

in the same change.

---

## 6.3 Document Public Interfaces

Public APIs, reusable modules, libraries, services, commands, configuration values, and integration points should have sufficient documentation for another developer to use them safely.

---

# 7. Error Handling

## 7.1 Fail Clearly

Errors should be clear, actionable, and appropriately typed.

Do not silently ignore unexpected errors.

Avoid empty catch blocks.

Bad:

```python
try:
    process_payment()
except Exception:
    pass
```

---

## 7.2 Catch Specific Errors

Catch the narrowest appropriate exception/error type.

Only catch a broad exception when:

- The boundary genuinely requires it
- The error is logged or transformed appropriately
- Important diagnostic information is preserved

---

## 7.3 Preserve Context

When converting or rethrowing errors, preserve the original cause/context when the language supports it.

Error messages should include enough context to diagnose the failure without exposing secrets.

---

## 7.4 Validate at Boundaries

Validate data entering the system from:

- User input
- HTTP requests
- Files
- Databases
- Message queues
- External APIs
- Environment variables
- Configuration
- Command-line arguments

After input passes a well-defined validation boundary, internal code should be able to rely on stronger invariants.

---

# 8. Logging and Observability

Use structured, meaningful logging.

Logs should help answer:

- What happened?
- Where did it happen?
- Which operation was involved?
- What relevant identifier can be used for tracing?
- Was the operation successful?
- Why did it fail?

Do not log:

- Passwords
- Authentication tokens
- API secrets
- Private keys
- Full payment details
- Sensitive personal data unless explicitly required and safely handled

Use appropriate log levels.

Avoid excessive logging inside high-frequency loops.

---

# 9. Security

Security must be considered during implementation, not added later.

## 9.1 Never Hard-Code Secrets

Never commit:

- Passwords
- API keys
- Tokens
- Private keys
- Production credentials
- Connection secrets

Use environment variables or an approved secrets-management solution.

---

## 9.2 Treat External Input as Untrusted

Validate and sanitize external input as appropriate.

Protect against common vulnerabilities including:

- SQL injection
- Command injection
- Cross-site scripting
- Path traversal
- Unsafe deserialization
- Server-side request forgery
- Broken access control
- Insecure direct object references

Use parameterized queries rather than building database queries through string concatenation.

---

## 9.3 Apply Least Privilege

Code and services should have only the permissions required to perform their intended responsibilities.

---

## 9.4 Use Established Security Libraries

Do not implement custom cryptography, password hashing, token signing, or authentication protocols unless there is an exceptional and reviewed requirement.

Use trusted, maintained implementations.

---

# 10. Configuration

Configuration should be separate from business logic.

Use configuration for values that vary between environments, such as:

- Service URLs
- Timeouts
- Feature flags
- Database connections
- Logging configuration

Validate configuration when the application starts whenever possible.

Fail early when required configuration is missing or invalid.

---

# 11. Dependency Management

Add dependencies intentionally.

Before adding a dependency, consider:

- Is it necessary?
- Is it actively maintained?
- Is it trustworthy?
- Is the license acceptable?
- Does the standard library already solve the problem?
- Does the project already have a dependency that provides the functionality?
- What is the security and maintenance cost?

Pin or constrain dependency versions according to the project's package-management strategy.

Remove unused dependencies.

---

# 12. Data and Domain Modeling

Prefer meaningful domain types over loosely structured data.

Instead of passing dictionaries/maps everywhere, consider:

- Typed models
- Data classes
- Records
- Schemas
- Value objects
- Enums

Use enums or dedicated types when values belong to a known closed set.

Represent important concepts explicitly.

---

# 13. State and Mutability

Minimize mutable shared state.

Prefer:

- Immutable values when practical
- Local state
- Explicit state transitions
- Clear ownership of mutable objects

Avoid global mutable state unless absolutely necessary.

Unexpected mutation is a frequent source of bugs.

---

# 14. Database and Persistence Practices

Keep persistence concerns separated from business logic where practical.

Use:

- Parameterized queries
- Transactions when operations must be atomic
- Appropriate indexes
- Explicit migrations
- Clear repository/data-access boundaries when helpful

Avoid:

- N+1 query patterns
- Loading unnecessary data
- Unbounded queries on large datasets
- Mixing database-specific details throughout domain logic

Database schema changes should be backward-compatible when rolling deployments require it.

---

# 15. API Design

APIs should be predictable and consistent.

Use:

- Clear resource names
- Consistent request/response formats
- Appropriate status/error codes
- Input validation
- Stable contracts
- Versioning when breaking compatibility is unavoidable

Do not expose internal implementation details unnecessarily.

Errors returned to clients should be useful without leaking sensitive system information.

---

# 16. Concurrency and Async Code

Use asynchronous or concurrent programming only when it provides a real benefit.

Be explicit about:

- Shared state
- Thread safety
- Race conditions
- Cancellation
- Timeouts
- Retries
- Resource cleanup

Always define reasonable timeouts for external network operations.

Retries should normally use:

- A maximum attempt count
- Backoff
- Jitter when appropriate
- Retry only for transient failures

Do not blindly retry non-idempotent operations.

---

# 17. Resource Management

Resources must be released correctly.

Examples include:

- Files
- Database connections
- Locks
- Sockets
- Streams
- Temporary files
- Processes

Use language-supported resource-management constructs such as context managers, `using`, `defer`, `try/finally`, or RAII where appropriate.

---

# 18. Testing Requirements

New behavior should include appropriate tests.

## 18.1 Test Important Behavior

Prioritize tests for:

- Business rules
- Validation
- Edge cases
- Error conditions
- Security-sensitive behavior
- Data transformations
- Public interfaces
- Bug fixes

Every bug fix should normally include a regression test that would have caught the bug.

---

## 18.2 Testing Pyramid

Prefer a healthy mix of:

1. Unit tests for focused logic
2. Integration tests for component boundaries
3. End-to-end tests for critical user flows

Do not test everything exclusively through slow end-to-end tests.

---

## 18.3 Tests Must Be Deterministic

Tests should not randomly fail.

Avoid uncontrolled dependencies on:

- Current time
- Random numbers
- Network services
- Shared mutable state
- Execution order
- Machine-specific paths

Inject or control such dependencies when necessary.

---

## 18.4 Tests Should Be Readable

A test should clearly communicate:

- Given / setup
- When / action
- Then / expected behavior

Test names should describe expected behavior.

Example:

```python
def test_login_rejects_user_when_password_is_incorrect():
    ...
```

---

## 18.5 Do Not Test Implementation Details Without Need

Prefer testing observable behavior.

Tests that depend too heavily on internal implementation make refactoring unnecessarily difficult.

---

# 19. Code Quality and Static Analysis

Use the project's standard tools for:

- Formatting
- Linting
- Type checking
- Static analysis
- Dependency checks
- Security scanning

Code should pass configured quality checks before being considered complete.

Do not manually fight the formatter.

Prefer automatic formatting for consistency.

---

# 20. Performance

Write clear code first.

Optimize only when:

- There is a demonstrated performance problem
- The performance requirement is known
- Measurement or profiling identifies the bottleneck

Do not sacrifice readability for speculative micro-optimizations.

When performance matters:

1. Measure.
2. Identify the bottleneck.
3. Optimize the relevant path.
4. Measure again.
5. Document non-obvious optimizations.

---

# 21. Backward Compatibility

Avoid breaking public behavior unintentionally.

Before changing a public API, shared interface, data format, or database schema, consider existing consumers.

When a breaking change is necessary:

- Make it explicit
- Document it
- Provide a migration path when appropriate
- Version the interface when appropriate

---

# 22. Git and Version-Control Practices

Keep commits focused and understandable.

A commit should ideally represent one logical change.

Avoid mixing:

- Large formatting changes
- Refactors
- Unrelated feature changes
- Dependency updates
- Bug fixes

in a single commit without a good reason.

Write commit messages that explain the purpose of the change.

Do not commit:

- Secrets
- Build artifacts unless required
- Local environment files
- IDE-specific files unless intentionally shared
- Temporary debug files
- Large generated files without a project requirement

---

# 23. Code Review Standards

Before considering work complete, review the change as another developer would.

Check:

- Is the code understandable?
- Are names clear?
- Are responsibilities separated?
- Is there unnecessary duplication?
- Are edge cases handled?
- Are errors handled appropriately?
- Are inputs validated?
- Are secrets protected?
- Are tests included?
- Are tests meaningful?
- Are docstrings accurate?
- Is documentation updated?
- Are unused imports, variables, functions, or files present?
- Is there dead code?
- Is complexity justified?
- Does the implementation fit the surrounding architecture?

---

# 24. Refactoring Rules

Refactor when it meaningfully improves the code.

Good reasons include:

- Removing duplication
- Simplifying complex logic
- Improving naming
- Separating responsibilities
- Improving testability
- Removing dead code
- Reducing coupling

Avoid unrelated large refactors during a small bug fix unless they are necessary to make the change safe.

Preserve behavior during pure refactoring.

Use tests to verify that behavior remains unchanged.

---

# 25. Dead Code and Temporary Code

Remove code that is no longer used.

Do not leave:

- Commented-out code
- Temporary debug output
- Abandoned feature branches in source files
- Unused functions
- Unused imports
- Unreachable conditions
- Placeholder TODOs without context

Version control already preserves historical code.

When a TODO is necessary, include enough context to make it actionable.

Example:

```python
# TODO(PROJ-142): Remove compatibility path after all clients migrate to API v2.
```

---

# 26. Avoid Magic Values

Do not scatter unexplained literal values throughout the code.

Bad:

```python
if retry_count > 5:
    ...
```

Better:

```python
MAX_RETRY_ATTEMPTS = 5

if retry_count > MAX_RETRY_ATTEMPTS:
    ...
```

Constants should be named according to their meaning.

---

# 27. Boolean Logic

Keep boolean expressions readable.

Prefer descriptive intermediate variables when expressions become complex.

Bad:

```python
if user and user.enabled and not user.deleted and (user.admin or user.owner):
    ...
```

Better:

```python
is_active_user = user is not None and user.enabled and not user.deleted
has_required_role = user is not None and (user.admin or user.owner)

if is_active_user and has_required_role:
    ...
```

When domain logic becomes complex, extract it into a clearly named function.

---

# 28. Null / None Handling

Handle missing values intentionally.

Do not rely on accidental null behavior.

Prefer:

- Explicit optional types
- Validation
- Guard clauses
- Sensible defaults only when semantically correct

Do not hide invalid state behind arbitrary defaults.

---

# 29. Guard Clauses

Use guard clauses to reduce unnecessary nesting where they improve readability.

Example:

```python
def process_order(order: Order) -> Receipt:
    """Process a validated order and return its receipt."""

    if order.is_cancelled:
        raise InvalidOrderError("Cancelled orders cannot be processed.")

    if not order.items:
        raise InvalidOrderError("An order must contain at least one item.")

    return _charge_and_create_receipt(order)
```

---

# 30. Avoid Excessive Nesting

Deep nesting makes code difficult to understand.

Use:

- Guard clauses
- Extracted functions
- Early returns
- Clear domain abstractions

to keep control flow understandable.

---

# 31. Public vs. Internal Interfaces

Keep the public API as small as possible.

Expose only what consumers need.

Implementation details should remain internal where the language allows it.

A smaller public surface is easier to:

- Maintain
- Test
- Change
- Secure
- Document

---

# 32. Environment-Specific Behavior

Avoid branching on environment throughout the application.

Centralize environment-specific configuration and infrastructure behavior.

Business logic should usually behave the same across development, testing, staging, and production.

---

# 33. Feature Flags

Feature flags should:

- Have descriptive names
- Have a clear owner/purpose
- Define default behavior
- Be removed when no longer required
- Not create uncontrolled combinations of application states

Long-lived feature flags should be treated as configuration and maintained deliberately.

---

# 34. Accessibility and User-Facing Interfaces

For user interfaces, accessibility is part of correctness.

Use:

- Semantic elements
- Keyboard-accessible interactions
- Appropriate labels
- Sufficient focus handling
- Accessible error messages
- Meaningful alternative text where applicable

Do not make essential functionality dependent only on color, hover, or pointer input.

---

# 35. Internationalization

Do not assume:

- One timezone
- One date format
- One currency
- English-only text
- ASCII-only names
- Fixed-length names
- One address format

Use established localization and Unicode-capable libraries where internationalization is required.

---

# 36. Time and Date Handling

Be explicit about timezones.

Prefer timezone-aware timestamps.

Store timestamps in a consistent canonical format, commonly UTC, and convert at system boundaries when appropriate.

Do not manually calculate calendar rules when reliable date/time libraries are available.

---

# 37. Monetary Values

Do not use binary floating-point arithmetic for money when exact decimal behavior is required.

Use:

- Decimal/fixed-point types
- Integer minor units when appropriate

Always define the currency when ambiguity is possible.

---

# 38. External Services

Treat external services as unreliable.

For network calls:

- Set timeouts
- Handle expected failure modes
- Validate responses
- Avoid infinite retries
- Consider idempotency
- Log useful diagnostic information
- Use circuit breakers or backoff when justified by system needs

Do not assume an external service will always return valid or complete data.

---

# 39. CLI and Script Standards

Scripts should be safe and predictable.

A script should:

- Document its purpose
- Validate arguments
- Return meaningful exit codes
- Print actionable errors
- Avoid destructive defaults
- Support `--help` when appropriate
- Avoid requiring source-code edits for configuration

Destructive operations should require explicit intent.

---

# 40. Documentation Examples Must Work

Code examples in documentation should be syntactically correct and remain aligned with the current API.

Where practical, automatically test important documentation examples.

---

# 41. AI-Assisted Coding Rules

When code is created or modified with an AI coding assistant:

1. Inspect the existing project structure before introducing new architecture.
2. Reuse existing project conventions.
3. Do not invent APIs, packages, configuration keys, database columns, or framework behavior without verification.
4. Do not remove working behavior unless required.
5. Make the smallest coherent change that fully solves the problem.
6. Preserve backward compatibility unless a breaking change is explicitly required.
7. Add or update tests.
8. Update documentation.
9. Check for security implications.
10. Do not claim tests passed unless they were actually executed.
11. Do not claim code works unless it was validated appropriately.
12. Clearly identify assumptions when requirements are incomplete.

---

# 42. Definition of Done

A code change is complete only when, where applicable:

- Requirements are implemented.
- Code is modular and readable.
- Naming is clear and consistent.
- Every relevant source file has an informative module/file docstring.
- Public functions and non-trivial functions have useful documentation.
- Parameters, returns, exceptions, and important side effects are documented.
- Type information is present where appropriate.
- Input validation is implemented.
- Error handling is intentional.
- Security considerations have been reviewed.
- Sensitive information is not exposed.
- Duplicate logic has been removed where appropriate.
- No unnecessary abstraction has been introduced.
- Tests cover important behavior.
- Bug fixes include regression tests.
- Formatting passes.
- Linting passes.
- Type checking passes when configured.
- Relevant automated tests pass.
- Dead code and debug code have been removed.
- Documentation has been updated.
- The final implementation has been reviewed for simplicity.

---

# 43. Pre-Commit Checklist

Before submitting a change, verify:

- [ ] Does every changed or new source file have a meaningful file/module docstring or equivalent header where supported?
- [ ] Does every public or non-obvious function explain its purpose?
- [ ] Are function parameters documented?
- [ ] Are return values documented?
- [ ] Are important exceptions/errors documented?
- [ ] Are side effects documented where relevant?
- [ ] Are names clear and consistent?
- [ ] Is the code modular?
- [ ] Does each function/class/module have a focused responsibility?
- [ ] Has duplicated logic been avoided?
- [ ] Is the implementation as simple as reasonably possible?
- [ ] Are there unnecessary abstractions?
- [ ] Are magic numbers or strings replaced with meaningful constants where appropriate?
- [ ] Are inputs validated at system boundaries?
- [ ] Are errors handled intentionally?
- [ ] Are secrets and sensitive data protected?
- [ ] Are database queries parameterized?
- [ ] Are external calls given reasonable timeouts?
- [ ] Are tests included or updated?
- [ ] Are important edge cases tested?
- [ ] Does a bug fix include a regression test?
- [ ] Do tests pass?
- [ ] Does formatting pass?
- [ ] Does linting pass?
- [ ] Does type checking pass when configured?
- [ ] Are comments still accurate?
- [ ] Is documentation updated?
- [ ] Are unused imports and variables removed?
- [ ] Is dead or commented-out code removed?
- [ ] Are temporary logs/debug statements removed?
- [ ] Does the change fit the existing project architecture?
- [ ] Would another developer understand this code without needing the original author to explain it?

---

# 44. Guiding Rule

When multiple implementations are correct, prefer the one that is:

1. Easier to understand
2. Easier to test
3. Easier to maintain
4. More explicit
5. Less coupled
6. Less surprising
7. Consistent with the existing codebase

Readable and maintainable code is preferred over clever code.

> Write code for humans first and computers second.
