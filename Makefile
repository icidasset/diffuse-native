update-diffuse:
	git submodule update --recursive
	git submodule foreach git pull origin main
