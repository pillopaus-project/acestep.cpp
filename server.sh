#!/bin/bash

set -eu
#source /opt/venv/bin/activate &

<<<<<<< Updated upstream
# Multi-GPU: add --device <name> below (CUDA0, CUDA1, Vulkan0, CPU)
=======
# If you have both, uncomment one to use it
#GGML_BACKEND=CUDA0
#GGML_BACKEND=Vulkan0
>>>>>>> Stashed changes

cd build-cuda
GGML_CUDA_DISABLE_GRAPHS=1

./bin/ace-server --models ../models \
    --adapters ../adapters \
    --host 0.0.0.0 \
    --port 8085 \
    --max-seq 4096 \
    --vae-chunk 256 --vae-overlap 16
