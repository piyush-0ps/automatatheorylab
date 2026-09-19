/**
 * Configures DOM assertions and cleanup for all unit and component tests.
 *
 * Vitest loads this module before each test file through `vitest.config.ts`.
 * Explicit cleanup is required because this project does not expose Vitest's
 * lifecycle functions as globals for Testing Library to discover automatically.
 */

import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(cleanup)
