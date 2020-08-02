@build-diffuse:
	echo "> Building Diffuse from source"
	just diffuse/build-prod


@update-diffuse:
	echo "> Updating Diffuse git submodule"
	git submodule update --remote --merge
