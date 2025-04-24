# For a detailed explanation of compiler flags:
# - https://emscripten.org/docs/tools_reference/emcc.html
# - https://github.com/emscripten-core/emscripten/blob/main/src/settings.js
#
# Changelog: https://github.com/emscripten-core/emscripten/blob/main/ChangeLog.md

jq/configure: .gitmodules
	git submodule update --init
	cd jq && \
	  git submodule update --init && \
	  autoreconf -fi

BASE_FLAGS= -s DYNAMIC_EXECUTION=0 \
			-s MODULARIZE=1 \
			-s EXPORT_NAME=newJQ \
			-s ALLOW_MEMORY_GROWTH=1 \
			-s MEMORY_GROWTH_GEOMETRIC_STEP=0.5 \
			-s WASM=1 \
			-s USE_PTHREADS=0 \
			-s INVOKE_RUN=0 \
			-s EXIT_RUNTIME=1 \
			-O3 \
			-g1 \
			-Wno-unused-command-line-argument \
			--pre-js $(PWD)/pre.js

.PHONY: jq
jq: jq/configure
# compile
	cd jq && \
	  emconfigure ./configure --disable-maintainer-mode --disable-silent-rules --with-oniguruma=builtin && \
	  make clean && \
	  EMCC_CFLAGS="$(BASE_FLAGS)" emmake make LDFLAGS=-all-static -j4
# emit output files
	mkdir -p dist && \
	  mv jq/jq dist/jq.wasm.js && \
	  mv jq/jq.wasm dist/jq.wasm

clean:
	rm -f dist/*
