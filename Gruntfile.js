module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt)
	grunt.initConfig({
		exec: {
			lint: { cmd: 'npx eslint src' },
			test: { cmd: 'npx jest --config jest-config.json' },
			tsc: { cmd: 'npx tsc' },
			doc: { cmd: 'npx typedoc ' },
			getOriginalBranch: {
				cmd: 'git branch | sed -n -e \'s/^\\* \\(.*\\)/\\1/p\'',
				callback: function (error, stdout, stderr) {
					if (error) {
						grunt.log.error(stderr)
					} else {
						grunt.config.set('originalBranch', stdout.trim())
					}
				}
			},
			standardVersion: {
				cmd: 'standard-version'
			},
			gitFlowRelease: {
				cmd: `git add . && git commit -m "chore(release): <%= version %>" && git push && git push --tags
				  &&  git checkout -b release/<%= version %> && git push --set-upstream origin release/<%= version %>
				  &&  git checkout main && git merge release/<%= version %> -m "chore(release): release <%= version %>" && git push
				  &&  git checkout <%= originalBranch %> && git merge release/<%= version %> -m "chore(release): release <%= version %>" && git push
				  &&  git branch -D release/<%= version %>
				`
			}
		},
		clean: {
			dist: ['dist'],
			build: ['build'],
			test: ['src/lib/test/']
		},
		copy: {
			lib: { expand: true, cwd: 'build/lib', src: '**', dest: 'dist/' },
			readme: { expand: true, src: './README.md', dest: 'dist/' },
			changeLog: { expand: true, src: './CHANGELOG.md', dest: 'dist/' },
			license: { expand: true, src: './LICENSE', dest: 'dist/' },
			jest: { expand: true, src: './jest-unit-config.json', dest: 'dist/' }
		}
	})
	grunt.registerTask('internal-build-test', 'build test', function () {
		const task = require('./build/dev/tasks/buildTest')
		task.apply(this.async())
	})
	grunt.registerTask('internal-build-test-suite', 'build test suite', function () {
		const task = require('./build/dev/tasks/buildTestSuite')
		task.apply(this.async())
	})
	grunt.registerTask('changelog-format', 'apply format to changelog', function () {
		const changelog = grunt.file.read('CHANGELOG.md')
		let newChangelog = changelog.replace(/\n### Bug Fixes/g, '**Bug Fixes:**')
		newChangelog = newChangelog.replace(/\n### Features/g, '**Features:**')
		grunt.file.write('CHANGELOG.md', newChangelog)
	})
	grunt.registerTask('get-version', 'get version from package.json', function () {
		const version = grunt.file.readJSON('./package.json').version
		grunt.config.set('version', version)
	})
	grunt.registerTask('create-package', 'create package.json for dist', function () {
		const fs = require('fs')
		const data = require('./package.json')
		delete data.devDependencies
		delete data.private
		data.scripts = {
			test: data.scripts.test
		}
		data.main = 'index.js'
		data.types = 'index.d.ts'
		fs.writeFileSync('dist/package.json', JSON.stringify(data, null, 2), 'utf8')
	})
	grunt.registerTask('exec-release', ['exec:standardVersion', 'changelog-format', 'copy:changeLog', 'create-package', 'get-version', 'exec:gitFlowRelease'])
	grunt.registerTask('run-release-if-applicable', 'run release if applicable', function () {
		const originalBranch = grunt.config.get('originalBranch')
		if (originalBranch === 'develop' || originalBranch.startsWith('hotfix')) {
			grunt.task.run('exec-release')
		} else {
			grunt.log.writeln('Current branch ' + originalBranch + ', cannot release from branch different from develop or hotfix.')
		}
	})
	grunt.registerTask('doc', ['exec:doc'])
	grunt.registerTask('lint', ['exec:lint'])
	grunt.registerTask('build', ['lint', 'clean:build', 'exec:tsc'])
	grunt.registerTask('build-test', ['clean:test', 'build', 'internal-build-test-suite', 'internal-build-test'])
	grunt.registerTask('test', ['build', 'exec:test'])
	grunt.registerTask('dist', ['test', 'clean:dist', 'copy:lib', 'copy:jest', 'copy:readme', 'copy:license', 'create-package'])
	grunt.registerTask('release', ['dist', 'doc', 'exec:getOriginalBranch', 'run-release-if-applicable'])
	grunt.registerTask('default', [])
}
