firefox_pkg = unsocialize.xpi

# This chrome package cannot be loaded directly into chrome. It can be uploaded
# to the chrome web store. To install the chrome extension, you will need to
# visit the url chrome://settings/extensions, select "load unpacked extension",
# and navigate to the chrome/ folder.
chrome_pkg = unsocialize.zip

# TARGETS
.PHONY: all
all: $(firefox_pkg) $(chrome_pkg)
	@echo "Done"

.PHONY: firefox
firefox: $(firefox_pkg)

.PHONY: chrome
chrome: $(chrome_pkg)

.PHONY: clean
clean:
	rm -f $(firefox_pkg)
	rm -f $(ff_common_src)
	rm -f $(chrome_pkg)
	rm -f $(cr_common_src)
	@echo "Cleanup is done."

# FIREFOX
#
# The firefox-specific sources
ff_src = firefox/chrome.manifest \
         firefox/install.rdf \
         firefox/content/browserOverlay.xul \
         firefox/content/browserOverlay.js

# Rules for moving common sources to places where firefox needs them.
ff_common_src = firefox/skin/us_16.png \
                firefox/skin/us_48.png \
                firefox/skin/us_64.png \
                firefox/modules/unsocialize.js

firefox/skin/%.png: images/%.png
	cp $< firefox/skin/
firefox/modules/unsocialize.js: common/unsocialize.js
	cp $< firefox/modules/

firefox/skin/us_16.png: images/us_16.png
	cp images/us_16.png firefox/skin/

# Creates the firefox package using zip
$(firefox_pkg): $(ff_src) $(ff_common_src)
	cd firefox; zip -r ../$(firefox_pkg) chrome.manifest install.rdf \
	  skin/ content/ modules/ -x *.swp; cd ..

# CHROME
#
# Chrome-specific sources
cr_src = chrome/background.js \
         chrome/key.pem \
         chrome/manifest.json

# Rules for moving common sources to chrome
cr_common_src = chrome/unsocialize.js \
                chrome/us_16.png \
                chrome/us_48.png \
                chrome/us_128.png

chrome/%.png: images/%.png
	cp $< chrome/

chrome/unsocialize.js: common/unsocialize.js
	cp $< chrome/

# Rule for zipping chrome package
$(chrome_pkg): $(cr_src) $(cr_common_src)
	zip -r $(chrome_pkg) chrome/ -x *.swp
