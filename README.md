## My Resume

This tool can read resume data from a JSON file and generate a static web page. Reference from [joyeecheung](https://github.com/joyeecheung/resume)

Written with Gulp, Less, and Jade. 

## Build

1. Run `npm install` to install the dependencies.
2. Fill your resume data in `resume.json`.
3. Run `gulp build` to generate the static web page(`dist/index.html`).
4. Run `gulp server` and visit `http://localhost:8500` if you want to see it hosted locally(make sure the port 8500 is not taken).

## Develop

1. Make sure port 35729(for livereload) and 8500(for the local server) are available.
2. Run `gulp`, then visit `http://localhost:8500`.
3. Start development!
