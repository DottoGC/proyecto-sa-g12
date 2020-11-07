const gulp=require('gulp');
const uglify=require('gulp-uglify-es').default;

gulp.task('watch', function(){
	var watcher = gulp.watch('./src/*.js');
	watcher.on('change',function(event){
		console.log('File: '+event.path + ' was changed!');
	});
});

gulp.task('uglify', ()=>
	gulp.src('./src/*.js') 
	.pipe(uglify())
	.pipe(gulp.dest('./dist'))
);
