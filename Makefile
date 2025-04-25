JQ_VERSION=jq-1.7.1

# For a detailed explanation of EMCC flags:
# - https://emscripten.org/docs/tools_reference/emcc.html
# - https://github.com/emscripten-core/emscripten/blob/main/src/settings.js
#
# Changelog: https://github.com/emscripten-core/emscripten/blob/main/ChangeLog.md
#
# JQ build instructions: https://github.com/jqlang/jq?tab=readme-ov-file#building-from-source

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

.PHONY: jq-wasm
jq-wasm: $(JQ_VERSION)
# compile
	cd $(JQ_VERSION) && \
	  emconfigure ./configure --disable-maintainer-mode --disable-silent-rules --with-oniguruma=builtin && \
	  make clean && \
	  EMCC_CFLAGS="$(BASE_FLAGS)" emmake make LDFLAGS=-all-static -j4
# emit output files
	mkdir -p dist && \
	  mv $(JQ_VERSION)/jq dist/jq.wasm.js && \
	  mv $(JQ_VERSION)/jq.wasm dist/jq.wasm

$(JQ_VERSION):
	wget https://github.com/jqlang/jq/releases/download/$(JQ_VERSION)/$(JQ_VERSION).tar.gz && \
		tar -xvzf $(JQ_VERSION).tar.gz && \
		rm $(JQ_VERSION).tar.gz

clean:
	rm -rf jq-* dist/*
