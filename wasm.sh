#!/bin/bash

# Check if all arguments are provided
if [ $# -lt 3 ]; then
	echo "Usage: $0 <c_filename> <output_folder> <exported_functions>"
	echo "Example: $0 mandelbrot public/mandelbrot _test,_anotherFunc"
	exit 1
fi

C_FILE="$1"
OUTPUT_FOLDER="$2"
EXPORTED_FUNCS="$3"

# Build the file names
INPUT_FILE="./wasm/${C_FILE}.c"
TEMP_JS="./wasm/${C_FILE}WASM.js"
TEMP_WASM="./wasm/${C_FILE}WASM.wasm"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
	echo "Error: File $INPUT_FILE not found"
	exit 1
fi

# Run emcc
emcc "$INPUT_FILE" -o "$TEMP_JS" -sEXPORTED_FUNCTIONS="${EXPORTED_FUNCS}" -sEXPORTED_RUNTIME_METHODS=cwrap

# Check if emcc was successful
if [ $? -ne 0 ]; then
	echo "Error: emcc compilation failed"
	exit 1
fi

# Create output folder if it doesn't exist
mkdir -p "$OUTPUT_FOLDER"

# Move files to output folder
mv "$TEMP_JS" "$OUTPUT_FOLDER/"
mv "$TEMP_WASM" "$OUTPUT_FOLDER/"

echo "Successfully compiled $C_FILE to $OUTPUT_FOLDER"
#!/bin/bash

# Check if all arguments are provided
if [ $# -lt 3 ]; then
	echo "Usage: $0 <c_filename> <output_folder> <exported_functions>"
	echo "Example: $0 mandelbrot public/mandelbrot _test,_anotherFunc"
	exit 1
fi

C_FILE="$1"
OUTPUT_FOLDER="$2"
EXPORTED_FUNCS="$3"

# Build the file names
INPUT_FILE="./wasm/${C_FILE}.c"
TEMP_JS="./wasm/${C_FILE}WASM.js"
TEMP_WASM="./wasm/${C_FILE}WASM.wasm"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
	echo "Error: File $INPUT_FILE not found"
	exit 1
fi

# Run emcc
emcc "$INPUT_FILE" -o "$TEMP_JS" -sEXPORTED_FUNCTIONS="${EXPORTED_FUNCS}" -sEXPORTED_RUNTIME_METHODS=cwrap

# Check if emcc was successful
if [ $? -ne 0 ]; then
	echo "Error: emcc compilation failed"
	exit 1
fi

# Create output folder if it doesn't exist
mkdir -p "$OUTPUT_FOLDER"

# Move files to output folder
mv "$TEMP_JS" "$OUTPUT_FOLDER/"
mv "$TEMP_WASM" "$OUTPUT_FOLDER/"

echo "Successfully compiled $C_FILE to $OUTPUT_FOLDER"
#!/bin/bash

# Check if all arguments are provided
if [ $# -lt 3 ]; then
	echo "Usage: $0 <c_filename> <output_folder> <exported_functions>"
	echo "Example: $0 mandelbrot public/mandelbrot _test,_anotherFunc"
	exit 1
fi

C_FILE="$1"
OUTPUT_FOLDER="$2"
EXPORTED_FUNCS="$3"

# Build the file names
INPUT_FILE="./wasm/${C_FILE}.c"
TEMP_JS="./wasm/${C_FILE}WASM.js"
TEMP_WASM="./wasm/${C_FILE}WASM.wasm"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
	echo "Error: File $INPUT_FILE not found"
	exit 1
fi

# Run emcc
emcc "$INPUT_FILE" -o "$TEMP_JS" -sEXPORTED_FUNCTIONS="${EXPORTED_FUNCS}" -sEXPORTED_RUNTIME_METHODS=cwrap

# Check if emcc was successful
if [ $? -ne 0 ]; then
	echo "Error: emcc compilation failed"
	exit 1
fi

# Create output folder if it doesn't exist
mkdir -p "$OUTPUT_FOLDER"

# Move files to output folder
mv "$TEMP_JS" "$OUTPUT_FOLDER/"
mv "$TEMP_WASM" "$OUTPUT_FOLDER/"

echo "Successfully compiled $C_FILE to $OUTPUT_FOLDER"
#!/bin/bash

# Check if all arguments are provided
if [ $# -lt 3 ]; then
	echo "Usage: $0 <c_filename> <output_folder> <exported_functions>"
	echo "Example: $0 mandelbrot public/mandelbrot _test,_anotherFunc"
	exit 1
fi

C_FILE="$1"
OUTPUT_FOLDER="$2"
EXPORTED_FUNCS="$3"

# Build the file names
INPUT_FILE="./wasm/${C_FILE}.c"
TEMP_JS="./wasm/${C_FILE}WASM.js"
TEMP_WASM="./wasm/${C_FILE}WASM.wasm"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
	echo "Error: File $INPUT_FILE not found"
	exit 1
fi

# Run emcc
emcc "$INPUT_FILE" -o "$TEMP_JS" -sEXPORTED_FUNCTIONS="${EXPORTED_FUNCS}" -sEXPORTED_RUNTIME_METHODS=cwrap

# Check if emcc was successful
if [ $? -ne 0 ]; then
	echo "Error: emcc compilation failed"
	exit 1
fi

# Create output folder if it doesn't exist
mkdir -p "$OUTPUT_FOLDER"

# Move files to output folder
mv "$TEMP_JS" "$OUTPUT_FOLDER/"
mv "$TEMP_WASM" "$OUTPUT_FOLDER/"

echo "Successfully compiled $C_FILE to $OUTPUT_FOLDER"
#!/bin/bash

# Check if all arguments are provided
if [ $# -lt 3 ]; then
	echo "Usage: $0 <c_filename> <output_folder> <exported_functions>"
	echo "Example: $0 mandelbrot public/mandelbrot _test,_anotherFunc"
	exit 1
fi

C_FILE="$1"
OUTPUT_FOLDER="$2"
EXPORTED_FUNCS="$3"

# Build the file names
INPUT_FILE="./wasm/${C_FILE}.c"
TEMP_JS="./wasm/${C_FILE}WASM.js"
TEMP_WASM="./wasm/${C_FILE}WASM.wasm"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
	echo "Error: File $INPUT_FILE not found"
	exit 1
fi

# Run emcc
emcc "$INPUT_FILE" -o "$TEMP_JS" -sEXPORTED_FUNCTIONS="${EXPORTED_FUNCS}" -sEXPORTED_RUNTIME_METHODS=cwrap

# Check if emcc was successful
if [ $? -ne 0 ]; then
	echo "Error: emcc compilation failed"
	exit 1
fi

# Create output folder if it doesn't exist
mkdir -p "$OUTPUT_FOLDER"

# Move files to output folder
mv "$TEMP_JS" "$OUTPUT_FOLDER/"
mv "$TEMP_WASM" "$OUTPUT_FOLDER/"

echo "Successfully compiled $C_FILE to $OUTPUT_FOLDER"
#!/bin/bash

# Check if all arguments are provided
if [ $# -lt 3 ]; then
	echo "Usage: $0 <c_filename> <output_folder> <exported_functions>"
	echo "Example: $0 mandelbrot public/mandelbrot _test,_anotherFunc"
	exit 1
fi

C_FILE="$1"
OUTPUT_FOLDER="$2"
EXPORTED_FUNCS="$3"

# Build the file names
INPUT_FILE="./wasm/${C_FILE}.c"
TEMP_JS="./wasm/${C_FILE}WASM.js"
TEMP_WASM="./wasm/${C_FILE}WASM.wasm"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
	echo "Error: File $INPUT_FILE not found"
	exit 1
fi

# Run emcc
emcc "$INPUT_FILE" -o "$TEMP_JS" -sEXPORTED_FUNCTIONS="${EXPORTED_FUNCS}" -sEXPORTED_RUNTIME_METHODS=cwrap

# Check if emcc was successful
if [ $? -ne 0 ]; then
	echo "Error: emcc compilation failed"
	exit 1
fi

# Create output folder if it doesn't exist
mkdir -p "$OUTPUT_FOLDER"

# Move files to output folder
mv "$TEMP_JS" "$OUTPUT_FOLDER/"
mv "$TEMP_WASM" "$OUTPUT_FOLDER/"

echo "Successfully compiled $C_FILE to $OUTPUT_FOLDER"
#!/bin/bash

# Check if all arguments are provided
if [ $# -lt 3 ]; then
	echo "Usage: $0 <c_filename> <output_folder> <exported_functions>"
	echo "Example: $0 mandelbrot public/mandelbrot _test,_anotherFunc"
	exit 1
fi

C_FILE="$1"
OUTPUT_FOLDER="$2"
EXPORTED_FUNCS="$3"

# Build the file names
INPUT_FILE="./wasm/${C_FILE}.c"
TEMP_JS="./wasm/${C_FILE}WASM.js"
TEMP_WASM="./wasm/${C_FILE}WASM.wasm"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
	echo "Error: File $INPUT_FILE not found"
	exit 1
fi

# Run emcc
emcc "$INPUT_FILE" -o "$TEMP_JS" -sEXPORTED_FUNCTIONS="${EXPORTED_FUNCS}" -sEXPORTED_RUNTIME_METHODS=cwrap

# Check if emcc was successful
if [ $? -ne 0 ]; then
	echo "Error: emcc compilation failed"
	exit 1
fi

# Create output folder if it doesn't exist
mkdir -p "$OUTPUT_FOLDER"

# Move files to output folder
mv "$TEMP_JS" "$OUTPUT_FOLDER/"
mv "$TEMP_WASM" "$OUTPUT_FOLDER/"

echo "Successfully compiled $C_FILE to $OUTPUT_FOLDER"
#!/bin/bash

# Check if all arguments are provided
if [ $# -lt 3 ]; then
	echo "Usage: $0 <c_filename> <output_folder> <exported_functions>"
	echo "Example: $0 mandelbrot public/mandelbrot _test,_anotherFunc"
	exit 1
fi

C_FILE="$1"
OUTPUT_FOLDER="$2"
EXPORTED_FUNCS="$3"

# Build the file names
INPUT_FILE="./wasm/${C_FILE}.c"
TEMP_JS="./wasm/${C_FILE}WASM.js"
TEMP_WASM="./wasm/${C_FILE}WASM.wasm"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
	echo "Error: File $INPUT_FILE not found"
	exit 1
fi

# Run emcc
emcc "$INPUT_FILE" -o "$TEMP_JS" -sEXPORTED_FUNCTIONS="${EXPORTED_FUNCS}" -sEXPORTED_RUNTIME_METHODS=cwrap

# Check if emcc was successful
if [ $? -ne 0 ]; then
	echo "Error: emcc compilation failed"
	exit 1
fi

# Create output folder if it doesn't exist
mkdir -p "$OUTPUT_FOLDER"

# Move files to output folder
mv "$TEMP_JS" "$OUTPUT_FOLDER/"
mv "$TEMP_WASM" "$OUTPUT_FOLDER/"

echo "Successfully compiled $C_FILE to $OUTPUT_FOLDER"
#!/bin/bash

# Check if all arguments are provided
if [ $# -lt 3 ]; then
	echo "Usage: $0 <c_filename> <output_folder> <exported_functions>"
	echo "Example: $0 mandelbrot public/mandelbrot _test,_anotherFunc"
	exit 1
fi

C_FILE="$1"
OUTPUT_FOLDER="$2"
EXPORTED_FUNCS="$3"

# Build the file names
INPUT_FILE="./wasm/${C_FILE}.c"
TEMP_JS="./wasm/${C_FILE}WASM.js"
TEMP_WASM="./wasm/${C_FILE}WASM.wasm"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
	echo "Error: File $INPUT_FILE not found"
	exit 1
fi

# Run emcc
emcc "$INPUT_FILE" -o "$TEMP_JS" -sEXPORTED_FUNCTIONS="${EXPORTED_FUNCS}" -sEXPORTED_RUNTIME_METHODS=cwrap

# Check if emcc was successful
if [ $? -ne 0 ]; then
	echo "Error: emcc compilation failed"
	exit 1
fi

# Create output folder if it doesn't exist
mkdir -p "$OUTPUT_FOLDER"

# Move files to output folder
mv "$TEMP_JS" "$OUTPUT_FOLDER/"
mv "$TEMP_WASM" "$OUTPUT_FOLDER/"

echo "Successfully compiled $C_FILE to $OUTPUT_FOLDER"
