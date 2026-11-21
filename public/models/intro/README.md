# Intro models (laptop + phone)

Original models built procedurally in Blender for `components/intro/device-intro.tsx`.
No third-party assets, so no licensing restrictions.

Source script: `scripts/blender/intro-devices.py`

```text
blender --background --python scripts/blender/intro-devices.py -- public/models/intro [preview_dir]

gltf-transform optimize laptop.glb laptop.glb --compress quantize --texture-compress false
  --simplify false --join false --flatten false --palette false --instance false
  --prune-attributes false
(same for phone.glb)
```

`--prune-attributes false` matters: the screen mesh (`Pantalla`) has UVs but no
texture, so pruning would strip them and the `<canvas>` preloader texture would
not map.

Node contract the component expects:

- `Pantalla`: screen plane, UV 0..1 (v up). The component swaps in a canvas texture.
- `Pivote_Tapa` (laptop only): lid hinge. The GLB ships with the lid open and the
  component animates from the identity rotation (closed) to that value.
