# before hitting 'make' you should have a shell with emconfigure and emcc.
# install emscripten and follow instructions here:
#   https://kripken.github.io/emscripten-site/docs/tools_reference/emsdk.html

# for a detailed explanation of compile flags:
# - https://emscripten.org/docs/tools_reference/emcc.html
# - https://github.com/emscripten-core/emscripten/blob/main/src/settings.js

BASE_FLAGS= -s NO_DYNAMIC_EXECUTION=1 \
			-s MODULARIZE=1 \
			-s EXPORT_NAME=newJQ \
			-s ALLOW_MEMORY_GROWTH=1 \
			-s MEMORY_GROWTH_GEOMETRIC_STEP=0.5 \
			-s WASM=1 \
			-s USE_PTHREADS=0 \
			--memory-init-file 0 \
			-O3 \
			-g1 \
			-Wno-unused-command-line-argument \
			--pre-js $(PWD)/pre.js

EXTRA_FLAGS=''

.PHONY: jq

jq.wasm: jq
	  mkdir -p dist && \
	  mv jq/jq dist/jq.wasm.js && \
	  mv jq/jq.wasm dist/jq.wasm

jq.wasm.min: dist/jq.wasm.js
	  yarn node-minify --compressor uglify-js --input dist/jq.wasm.js --output dist/jq.wasm.min.js

jq-web.wasm: EXTRA_FLAGS= -s ENVIRONMENT=web
jq-web.wasm: jq
	  mkdir -p dist && \
	  mv jq/jq dist/jq-web.wasm.js && \
	  mv jq/jq.wasm dist/jq.wasm

jq-web.wasm.min: dist/jq-web.wasm.js
	  yarn node-minify --compressor uglify-js --input dist/jq-web.wasm.js --output dist/jq-web.wasm.min.js

jq: jq/configure
	cd jq && \
	  emconfigure ./configure --disable-maintainer-mode --with-oniguruma=builtin && \
	  make clean && \
	  EMCC_CFLAGS="$(BASE_FLAGS) $(EXTRA_FLAGS)" emmake make LDFLAGS=-all-static -j4

jq/configure: .gitmodules
	git submodule update --init
	cd jq && \
	  git submodule update --init && \
	  autoreconf -fi

clean:
	rm -f dist/*

test:
	yarn test
