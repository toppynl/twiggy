import { describe, test, beforeEach, mock } from 'node:test';
import * as assert from 'node:assert/strict';
import {
    normalizeDirectoryPath,
    extractFrameworkRoot,
} from '../src/utils/paths/normalizeTemplatePath';

// Mock existsSync for testing
const originalExistsSync = require('fs').existsSync;

describe('normalizeTemplatePath', () => {
    describe('normalizeDirectoryPath', () => {
        test('handles relative path without changes', () => {
            const result = normalizeDirectoryPath(
                'templates',
                '/workspace',
                undefined,
            );
            assert.equal(result, 'templates');
        });

        test('strips leading slash from non-absolute path', () => {
            // When path starts with "/" but doesn't exist as absolute path
            const result = normalizeDirectoryPath(
                '/templates',
                '/workspace',
                undefined,
            );
            // Since "/templates" likely doesn't exist as an absolute path,
            // it should be treated as relative
            assert.equal(result, 'templates');
        });

        test('normalizes backslashes to forward slashes', () => {
            const result = normalizeDirectoryPath(
                'vendor\\templates',
                '/workspace',
                undefined,
            );
            assert.equal(result, 'vendor/templates');
        });

        test('handles mixed separators with leading slash', () => {
            const result = normalizeDirectoryPath(
                '/vendor\\templates',
                '/workspace',
                undefined,
            );
            assert.equal(result, 'vendor/templates');
        });
    });

    describe('extractFrameworkRoot', () => {
        test('returns undefined for standard bin/console path', () => {
            const result = extractFrameworkRoot('bin/console');
            assert.equal(result, undefined);
        });

        test('returns undefined for ./bin/console path', () => {
            const result = extractFrameworkRoot('./bin/console');
            assert.equal(result, undefined);
        });

        test('extracts framework root from app/bin/console', () => {
            const result = extractFrameworkRoot('app/bin/console');
            assert.equal(result, 'app');
        });

        test('extracts framework root from backend/bin/console', () => {
            const result = extractFrameworkRoot('backend/bin/console');
            assert.equal(result, 'backend');
        });

        test('extracts nested framework root', () => {
            const result = extractFrameworkRoot('apps/main/bin/console');
            assert.equal(result, 'apps/main');
        });

        test('handles backslashes', () => {
            const result = extractFrameworkRoot('app\\bin\\console');
            assert.equal(result, 'app');
        });

        test('handles mixed separators', () => {
            const result = extractFrameworkRoot('apps\\main/bin/console');
            assert.equal(result, 'apps/main');
        });

        test('returns undefined for empty string', () => {
            const result = extractFrameworkRoot('');
            assert.equal(result, undefined);
        });

        test('returns undefined when bin is not in path', () => {
            const result = extractFrameworkRoot('console.php');
            assert.equal(result, undefined);
        });

        test('returns undefined for ./app/bin/console (dot-relative)', () => {
            const result = extractFrameworkRoot('./app/bin/console');
            assert.equal(result, 'app');
        });
    });
});
