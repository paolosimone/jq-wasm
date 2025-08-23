# emcc toolchain
FROM emscripten/emsdk:4.0.13

# additional tools needed to build JQ
RUN apt-get update && apt-get install -y libtool
