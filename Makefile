# before hitting 'make' you should have a shell with emconfigure and emcc.
# install emscripten and follow instructions here:
#   https://kripken.github.io/emscripten-site/docs/tools_reference/emsdk.html

EMCC_CFLAGS = -s NO_DYNAMIC_EXECUTION=1 \
			  -s MODULARIZE=1 \
			  -s EXPORT_NAME=newJQ \
			  -s ALLOW_MEMORY_GROWTH=1 \
 			  -s MEMORY_GROWTH_GEOMETRIC_STEP=0.5 \
			  -s WASM=1 \
 			  -s WASM_BIGINT \
			  -s USE_PTHREADS=0 \
			  --memory-init-file 0 \
			  -O2 \
			  -g1 \
 			  -Wno-unused-command-line-argument \
			  --pre-js $(PWD)/pre.js

# TODO multiple build (web only, min...)
# https://stackoverflow.com/a/26383350
all: jq.wasm.js

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

clean:
	rm -f dist/*

test:
	yarn test
