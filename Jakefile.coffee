fs = require('fs')

desc 'Run our specs.'
task 'spec', [], ->

  jake.exec [ 'coffee --output ./spec/build/ --compile ./spec/specs/' ], ->

    paths = new jake.FileList()
      .include('./spec/build/**/*.spec.js')
      .map((p) -> p.replace(/^spec\//, ''))
      .map((p) -> "'#{p}'" )
      .join(',')

    fs.writeFile './spec/build/index.js', "define([#{paths}])", ->
      jake.exec [ 'phantomjs ./spec/support/phantom-runner.js ./spec/runner.html' ], { printStdout:true, printStderr:true, breakOnError:false }

