# before hitting 'make' you should have a shell with emconfigure and emcc.
# install emscripten and follow instructions here:
#   https://kripken.github.io/emscripten-site/docs/tools_reference/emsdk.html

EMCC_CFLAGS = -s NO_DYNAMIC_EXECUTION=1 \
			  -s MODULARIZE=1 \
			  -s EXPORT_NAME=initJQ \
			  -s WASM=1 \
			  --memory-init-file 0 \
			  -s ALLOW_MEMORY_GROWTH=1 \
			  -O3 \
			  --pre-js $(PWD)/pre.js \
			  --post-js $(PWD)/post.js

all: jq.wasm.js

clean:
	rm -f dist/*

jq/configure: .gitmodules
	git submodule update --init
	cd jq && \
	  git submodule update --init && \
	  autoreconf -fi

jq.wasm.js: jq/configure
	cd jq && \
	  emconfigure ./configure --disable-maintainer-mode --with-oniguruma=builtin && \
	  make clean && \
	  EMCC_CFLAGS="$(EMCC_CFLAGS)" emmake make LDFLAGS=-all-static -j4 && \
	cd .. && \
	  mkdir -p dist && \
	  mv jq/jq dist/jq.wasm.js && \
	  mv jq/jq.wasm dist/jq.wasm

test:
	yarn test
