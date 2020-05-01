.PHONY: build


# Variables

DIST_DIR=dist
NODE_BIN=node_modules/.bin
SRC_DIR=../diffuse/src
BUILD_DIR=build


# Default task

all: dist


#
# Build tasks
#

build-diffuse:
	@echo "> Building Diffuse from source"
	@(cd ../diffuse; just build-prod)
	@(cd ../diffuse; mv ./build ../electron/$(BUILD_DIR))


clean:
	@rm -rf $(BUILD_DIR) || true
	@rm -rf $(DIST_DIR) || true


dist: clean build-diffuse prep
	@echo "> Making electron build"
	@$(NODE_BIN)/electron-builder build --config=builder.yaml --mac --linux --win


install:
	@echo "> Installing Diffuse dependencies"
	@(cd ../diffuse; yarn install)


prep:
	@echo "> Prepping"
	@cp electron.js $(BUILD_DIR)/
	@cp package.json $(BUILD_DIR)/
	@mkdir -p $(BUILD_DIR)/resources
	@cp $(SRC_DIR)/Static/Images/icon.png $(BUILD_DIR)/resources/icon.png
	@makeicns -in $(BUILD_DIR)/resources/icon.png -out $(BUILD_DIR)/resources/icon.icns 2>/dev/null
	@convert $(BUILD_DIR)/resources/icon.png -define icon:auto-resize=256 $(BUILD_DIR)/resources/icon.ico
	@cp ../diffuse/LICENSE $(BUILD_DIR)/LICENSE



#
# Dev tasks
#

dev: clean build-diffuse prep
	@ENV=DEV $(NODE_BIN)/electron $(BUILD_DIR)
