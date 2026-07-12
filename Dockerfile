# emcc toolchain
FROM emscripten/emsdk:6.0.2

# additional tools needed to build JQ
RUN apt-get update && apt-get install -y libtool
