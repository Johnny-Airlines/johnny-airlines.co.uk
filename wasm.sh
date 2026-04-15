emcc ./wasm/mandelbrot.c -o ./wasm/mandelbrotWASM.js -sEXPORTED_FUNCTIONS=_test -sEXPORTED_RUNTIME_METHODS=cwrap
mv ./wasm/mandelbrotWASM.js ./public/mandelbrot/
mv ./wasm/mandelbrotWASM.wasm ./public/mandelbrot/
