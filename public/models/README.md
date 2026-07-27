# Civic Type R model

`civic/honda-civic-type-r-2023.gltf` and its adjacent assets come from the
GLB supplied in
`Japan Redesign/Modelo del Honda civic en glb/2023-honda-civic-type-r.zip`.

Production transform:

```text
gltf-transform optimize input.glb optimized.glb
  --compress quantize
  --texture-compress webp
  --texture-size 512
  --flatten false
  --join false
  --palette false
  --simplify false

gltf-transform copy optimized.glb civic/honda-civic-type-r-2023.gltf
```

The result is a valid glTF 2.0 package with `KHR_mesh_quantization` and external
WebP textures. The browser loads those textures directly from the same origin,
which avoids blob-texture errors without changing the site CSP. The package was
reduced from 11.91 MB to 6.82 MB without adding a runtime decoder.

The supplied ZIP contains no author, source URL, README, or license. Confirm
commercial-use rights before a public production deployment. The original ZIP
remains outside Git.
