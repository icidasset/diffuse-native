.PHONY: build dist


# Variables

DIST_DIR=dist
NODE_BIN=node_modules/.bin
SRC_DIR=../diffuse/src
BUILD_DIR=build


# Default task

all: install dist


#
# Build tasks
#

build-diffuse:
	@echo "> Building Diffuse from source"
	@(cd ../diffuse; nix-shell --run "just build-prod")
	@(cd ../diffuse; mv ./build ../electron/$(BUILD_DIR))


clean:
	@rm -rf $(BUILD_DIR) || true
	@rm -rf $(DIST_DIR) || true


dist: clean build-diffuse prep
	@echo "> Making electron build"
	pnpx electron-builder $(BUILD_DIR) --config=builder.yaml --mac --linux --win
	rm $(BUILD_DIR)/.DS_Store || true
	rm -rf $(BUILD_DIR)/node_modules || true
	@mv $(BUILD_DIR) diffuse
	@zip -r -X $(DIST_DIR)/diffuse-web.zip diffuse
	@tar -zcvf $(DIST_DIR)/diffuse-web.tar.gz diffuse
	@rm -rf diffuse


install:
	@echo "> Installing Diffuse dependencies"
	@(cd ../diffuse; just install-deps)


prep:
	@echo "> Prepping"
	@cp electron.js $(BUILD_DIR)/
	@cp package.json $(BUILD_DIR)/
	@mkdir -p $(BUILD_DIR)/resources
	@cp $(SRC_DIR)/Static/Images/icon.png $(BUILD_DIR)/resources/icon.png
	@./node_modules/.bin/png2icons $(BUILD_DIR)/resources/icon.png $(BUILD_DIR)/resources/icon -allwe -hm
	@cp ../diffuse/LICENSE $(BUILD_DIR)/LICENSE



#
# Dev tasks
#

dev: clean build-diffuse prep
	@ENV=DEV $(NODE_BIN)/electron $(BUILD_DIR)
