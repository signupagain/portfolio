#!/usr/bin/env node
/**
 * Validate a conventional-commit subject against this repo's common types.
 * Usage: node validate-subject.mjs "feat(file-browser): add intro component"
 */

const subject = process.argv[2]

if (!subject) {
	console.error(
		'Usage: node validate-subject.mjs "<type>(<scope>): <description>"',
	)
	process.exit(1)
}

const pattern = /^(feat|fix|chore|refactor|perf|style|build)\([^)]+\): [a-z]/

if (pattern.test(subject)) {
	console.log(`OK: ${subject}`)
	process.exit(0)
}

console.error('Invalid subject (expected type(scope): lowercase description):')
console.error(`  ${subject}`)
process.exit(1)
