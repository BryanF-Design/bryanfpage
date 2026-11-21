"""Modelos de la intro: laptop (escritorio) y teléfono (móvil).

Genera `laptop.glb` y `phone.glb` para `components/intro/device-intro.tsx`.

Uso (desde la raíz del repo):
  blender --background --python scripts/blender/intro-devices.py -- public/models/intro [carpeta_previews]

Después, cuantizar (sin decodificador en runtime, igual que el Civic):
  npx @gltf-transform/cli optimize public/models/intro/laptop.glb public/models/intro/laptop.glb \
      --compress quantize --texture-compress false --simplify false --join false --flatten false
  (ídem para phone.glb)

Convenciones que el componente web espera:
  - malla "Pantalla": plano de la pantalla, UV 0..1 con v hacia arriba de la imagen.
    El componente le pone una textura <canvas> con el preloader.
  - nodo "Pivote_Tapa" (solo laptop): rota en X; 0 = cerrada. El GLB sale abierto
    a OPEN_ANGLE y el componente anima desde 0 hasta ese valor.
  - Blender -Y (frente) = +Z en three.js: la cámara web mira desde +Z.
"""
import bmesh
import bpy
import math
import os
import sys

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT_DIR = os.path.abspath(argv[0] if argv else "public/models/intro")
PREVIEW_DIR = os.path.abspath(argv[1]) if len(argv) > 1 else None
os.makedirs(OUT_DIR, exist_ok=True)

OPEN_ANGLE = 108


# ════════════════════════════════════════════════════════════════ utilidades
def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.scene.unit_settings.system = "METRIC"


def mat(name, color, metallic=0.0, rough=0.5, emission=None, strength=0.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Metallic"].default_value = metallic
    p.inputs["Roughness"].default_value = rough
    if emission:
        p.inputs["Emission Color"].default_value = (*emission, 1)
        p.inputs["Emission Strength"].default_value = strength
    return m


def smooth(o, angle=35):
    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    try:
        bpy.ops.object.shade_smooth_by_angle(angle=math.radians(angle))
    except Exception:
        bpy.ops.object.shade_smooth()
    o.select_set(False)


def add_bevel(o, width, segments=3):
    b = o.modifiers.new("Bevel", "BEVEL")
    b.width = width
    b.segments = segments
    b.limit_method = "ANGLE"
    b.harden_normals = False


def box(name, size, loc, material, bevel=0.0, segments=3):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        add_bevel(o, bevel, segments)
    o.data.materials.append(material)
    smooth(o)
    return o


def cyl(name, r, depth, loc, material, rot=(0, 0, 0), verts=32):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=loc, rotation=rot, vertices=verts)
    o = bpy.context.active_object
    o.name = name
    o.data.materials.append(material)
    smooth(o)
    return o


def new_mesh_object(name, bm, material, loc=(0, 0, 0)):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(o)
    o.location = loc
    o.data.materials.append(material)
    smooth(o)
    return o


def rounded_slab(name, w, h, t, r, material, loc, segments=10, edge_bevel=0.0):
    """Losa redondeada de pie: ancho X, alto Z, grosor Y. Frente hacia -Y."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= w
        v.co.y *= h
        v.co.z *= t
    vertical = [e for e in bm.edges
                if abs(e.verts[0].co.x - e.verts[1].co.x) < 1e-9 and abs(e.verts[0].co.y - e.verts[1].co.y) < 1e-9]
    bmesh.ops.bevel(bm, geom=vertical, offset=r, offset_type="OFFSET", segments=segments,
                    profile=0.5, affect="EDGES")
    bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=_rot_x(90))
    o = new_mesh_object(name, bm, material, loc)
    if edge_bevel:
        add_bevel(o, edge_bevel, 3)
    return o


def rounded_plane(name, w, h, r, material, loc, segments=10, facing="-Y"):
    """Plano redondeado con UV 0..1 (u → derecha, v → arriba visto de frente)."""
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5)
    for v in bm.verts:
        v.co.x *= w
        v.co.y *= h
    if r > 0:
        bmesh.ops.bevel(bm, geom=list(bm.verts), offset=r, offset_type="OFFSET", segments=segments,
                        profile=0.5, affect="VERTICES")
    uv = bm.loops.layers.uv.new("UVMap")
    for f in bm.faces:
        for loop in f.loops:
            co = loop.vert.co
            loop[uv].uv = ((co.x + w / 2) / w, (co.y + h / 2) / h)
    if facing == "-Y":
        bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=_rot_x(90))
    elif facing == "-Z":
        bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=_rot_x(180))
    o = new_mesh_object(name, bm, material, loc)
    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.shade_flat()
    o.select_set(False)
    return o


def _rot_x(deg):
    from mathutils import Matrix
    return Matrix.Rotation(math.radians(deg), 3, "X")


def apply_modifiers(objs):
    for o in objs:
        if o.type != "MESH" or not o.modifiers:
            continue
        bpy.ops.object.select_all(action="DESELECT")
        bpy.context.view_layer.objects.active = o
        o.select_set(True)
        for m in list(o.modifiers):
            bpy.ops.object.modifier_apply(modifier=m.name)
        o.select_set(False)


def join(objs, name):
    objs = [o for o in objs if o]
    if not objs:
        return None
    apply_modifiers(objs)
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    if len(objs) > 1:
        bpy.ops.object.join()
    o = bpy.context.active_object
    o.name = name
    o.data.name = name
    bpy.ops.object.select_all(action="DESELECT")
    return o


def parent_keep(child, parent):
    mw = child.matrix_world.copy()
    child.parent = parent
    child.matrix_parent_inverse = parent.matrix_world.inverted()
    child.matrix_world = mw


def export_glb(path):
    apply_modifiers([o for o in bpy.context.scene.objects if o.type == "MESH"])
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        export_yup=True,
        export_apply=True,
        export_materials="EXPORT",
        export_cameras=False,
        export_lights=False,
        export_extras=False,
        use_selection=False,
    )
    print("GLB:", path, os.path.getsize(path), "bytes")


def preview(path, cam_loc, target, lens=50, floor_z=-0.0015):
    scene = bpy.context.scene
    bpy.ops.mesh.primitive_plane_add(size=6, location=(0, 0, floor_z))
    bpy.context.active_object.data.materials.append(mat("PisoPreview", (0.03, 0.04, 0.035), rough=0.6))
    bpy.ops.object.empty_add(location=target)
    tgt = bpy.context.active_object
    for name, loc, energy in (("K", (0.6, -0.7, 0.8), 22), ("F", (-0.8, -0.4, 0.4), 6), ("R", (-0.2, 0.9, 0.6), 25)):
        bpy.ops.object.light_add(type="AREA", location=loc)
        lamp = bpy.context.active_object
        lamp.data.energy = energy
        lamp.data.size = 0.6
        lamp.constraints.new("TRACK_TO").target = tgt
    bpy.ops.object.camera_add(location=cam_loc)
    cam = bpy.context.active_object
    cam.data.lens = lens
    cam.constraints.new("TRACK_TO").target = tgt
    scene.camera = cam
    world = bpy.data.worlds.new("W")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.02, 0.03, 0.028, 1)
    scene.world = world
    scene.render.resolution_x, scene.render.resolution_y = 1200, 800
    scene.render.filepath = path
    for eng in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT"):
        try:
            scene.render.engine = eng
            break
        except TypeError:
            pass
    bpy.ops.render.render(write_still=True)
    print("PREVIEW:", path)


# ════════════════════════════════════════════════════════════════ laptop
def build_laptop():
    M_ALU = mat("Aluminio", (0.62, 0.63, 0.66), metallic=1.0, rough=0.38)
    M_ALU_DARK = mat("AluminioOscuro", (0.22, 0.23, 0.25), metallic=1.0, rough=0.45)
    M_KEY = mat("Teclas", (0.025, 0.025, 0.03), rough=0.5)
    M_GLASS = mat("VidrioNegro", (0.006, 0.006, 0.007), rough=0.08)
    M_PAD = mat("Trackpad", (0.55, 0.56, 0.59), metallic=0.6, rough=0.25)
    M_RUBBER = mat("Goma", (0.02, 0.02, 0.02), rough=0.9)
    M_PORT = mat("Puerto", (0.01, 0.01, 0.01), rough=0.6)
    M_CAM = mat("Camara", (0.0, 0.0, 0.0), rough=0.1)
    M_LOGO = mat("Logo", (0.85, 0.86, 0.9), metallic=1.0, rough=0.1)
    M_SCREEN = mat("Pantalla", (0, 0, 0), rough=0.2, emission=(0.03, 0.06, 0.05), strength=1.0)

    W, D, H = 0.32, 0.22, 0.015
    LID_T = 0.006
    HINGE_Y = D / 2
    TOP = H

    base = box("Base", (W, D, H), (0, 0, H / 2), M_ALU, bevel=0.004, segments=4)
    deck = box("PozoTeclado", (0.276, 0.118, 0.0006), (0, 0.040, TOP - 0.0001), M_ALU_DARK, bevel=0.0003, segments=1)

    U, GAP, KEY_H = 0.0185, 0.0028, 0.0022
    rows = [
        [14.5 / 14] * 14,
        [1] * 13 + [1.5],
        [1.5] + [1] * 13,
        [1.75] + [1] * 11 + [1.75],
        [2.25] + [1] * 10 + [2.25],
        [1, 1, 1, 1.25, 6, 1.25, 1, 1, 1],
    ]
    kb_w = 14.5 * U
    y = 0.090
    keys = []
    for ri, row in enumerate(rows):
        depth = U * 0.6 if ri == 0 else U
        x = -kb_w / 2
        for wu in row:
            kw = wu * U
            keys.append(box("Tecla", (kw - GAP, depth - GAP, KEY_H),
                            (x + kw / 2, y - depth / 2, TOP + KEY_H / 2 - 0.0004), M_KEY, bevel=0.001, segments=2))
            x += kw
        y -= depth
    keyboard = join(keys, "Teclado")

    pad = box("Trackpad", (0.125, 0.075, 0.0006), (0, -0.064, TOP), M_PAD, bevel=0.0003, segments=1)

    holes = []
    for sx in (-1, 1):
        for i in range(10):
            for j in range(3):
                holes.append(cyl("Bocina", 0.0006, 0.0008, (sx * 0.148 + (j - 1) * 0.003, 0.085 - i * 0.0085, TOP), M_PORT, verts=6))
    for i, (w, h) in enumerate([(0.0085, 0.0028), (0.0085, 0.0028), (0.0035, 0.0035)]):
        holes.append(box("Puerto", (0.002, w, h), (-W / 2, 0.04 - i * 0.016, H / 2), M_PORT, bevel=0.0009, segments=2))
    holes.append(box("Puerto", (0.002, 0.0085, 0.0028), (W / 2, 0.04, H / 2), M_PORT, bevel=0.0009, segments=2))
    ports = join(holes, "Puertos")

    feet = join([cyl("Pata", 0.008, 0.0016, (sx * (W / 2 - 0.025), sy * (D / 2 - 0.022), -0.0006), M_RUBBER, verts=20)
                 for sx in (-1, 1) for sy in (-1, 1)], "Patas")
    hinge_bar = cyl("Bisagra", 0.0042, W * 0.86, (0, HINGE_Y - 0.003, TOP + 0.0005), M_ALU_DARK,
                    rot=(0, math.radians(90), 0), verts=24)

    # Tapa modelada cerrada (pantalla hacia -Z); el pivote la abre.
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, HINGE_Y, TOP + 0.0005))
    pivot = bpy.context.active_object
    pivot.name = "Pivote_Tapa"

    LD = D - 0.004
    lid = box("Tapa", (W, LD, LID_T), (0, HINGE_Y - LD / 2, TOP + 0.0005 + LID_T / 2), M_ALU, bevel=0.003, segments=4)
    bezel = box("Bisel", (W - 0.004, LD - 0.004, 0.0004), (0, HINGE_Y - LD / 2, TOP + 0.0003), M_GLASS, bevel=0.0002, segments=1)
    screen = rounded_plane("Pantalla", 0.296, 0.185, 0.0, M_SCREEN,
                           (0, HINGE_Y - LD / 2 + 0.0035, TOP + 0.00005), facing="-Z")
    cam_dot = cyl("Webcam", 0.0012, 0.0002, (0, HINGE_Y - LD + 0.006, TOP + 0.00005), M_CAM, verts=16)
    logo = cyl("Logo", 0.012, 0.0002, (0, HINGE_Y - LD / 2, TOP + 0.0005 + LID_T + 0.0001), M_LOGO, verts=48)
    for o in (lid, bezel, screen, cam_dot, logo):
        parent_keep(o, pivot)
    pivot.rotation_euler[0] = math.radians(-OPEN_ANGLE)

    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
    root = bpy.context.active_object
    root.name = "Laptop"
    for o in (base, deck, keyboard, pad, ports, feet, hinge_bar, pivot):
        parent_keep(o, root)


# ════════════════════════════════════════════════════════════════ teléfono
def build_phone():
    M_FRAME = mat("MarcoGrafito", (0.16, 0.17, 0.18), metallic=1.0, rough=0.28)
    M_GLASS = mat("VidrioNegro", (0.006, 0.006, 0.007), rough=0.06)
    M_BACK = mat("VidrioTrasero", (0.055, 0.075, 0.068), rough=0.32)
    M_LENS = mat("Lente", (0.004, 0.004, 0.006), rough=0.04)
    M_RING = mat("AroLente", (0.5, 0.52, 0.54), metallic=1.0, rough=0.2)
    M_CAM = mat("Camara", (0.0, 0.0, 0.0), rough=0.1)
    M_PORT = mat("Puerto", (0.01, 0.01, 0.01), rough=0.6)
    M_SCREEN = mat("Pantalla", (0, 0, 0), rough=0.2, emission=(0.03, 0.06, 0.05), strength=1.0)

    W, H, T, R = 0.0735, 0.158, 0.0080, 0.0105
    body = rounded_slab("Cuerpo", W, H, T, R, M_FRAME, (0, 0, 0), segments=12, edge_bevel=0.0018)
    front = rounded_slab("Frente", W - 0.0012, H - 0.0012, 0.0005, R - 0.0006, M_GLASS,
                         (0, -T / 2 - 0.00005, 0), segments=12, edge_bevel=0.0002)
    back = rounded_slab("Trasera", W - 0.0012, H - 0.0012, 0.0005, R - 0.0006, M_BACK,
                        (0, T / 2 + 0.00005, 0), segments=12, edge_bevel=0.0002)

    SW, SH = 0.0690, 0.1535
    screen = rounded_plane("Pantalla", SW, SH, 0.0088, M_SCREEN, (0, -T / 2 - 0.00032, 0), segments=10, facing="-Y")
    punch = cyl("Webcam", 0.0015, 0.0001, (0, -T / 2 - 0.00036, SH / 2 - 0.0058), M_CAM,
                rot=(math.radians(90), 0, 0), verts=20)

    buttons = [
        box("Encendido", (0.0012, 0.0016, 0.013), (W / 2 + 0.0001, 0, 0.022), M_FRAME, bevel=0.0005, segments=2),
        box("Volumen", (0.0012, 0.0016, 0.024), (W / 2 + 0.0001, 0, 0.046), M_FRAME, bevel=0.0005, segments=2),
    ]
    btns = join(buttons, "Botones")

    bottom = [box("USB", (0.0088, 0.0032, 0.002), (0, 0, -H / 2), M_PORT, bevel=0.0012, segments=3)]
    for i in range(6):
        bottom.append(cyl("Bocina", 0.0005, 0.002, (0.012 + i * 0.0022, 0, -H / 2), M_PORT, verts=8))
    ports = join(bottom, "Puertos")

    # Módulo de cámaras trasero: cápsula vertical genérica (visto desde atrás, arriba a la izquierda).
    mx, mz = 0.0205, H / 2 - 0.030
    module = rounded_slab("ModuloCamara", 0.0150, 0.0440, 0.0013, 0.0074, M_BACK,
                          (mx, T / 2 + 0.0009, mz), segments=10, edge_bevel=0.0004)
    lenses, rings = [], []
    for dz in (0.0136, 0.0, -0.0136):
        rings.append(cyl("Aro", 0.0058, 0.0009, (mx, T / 2 + 0.0019, mz + dz), M_RING,
                         rot=(math.radians(90), 0, 0), verts=32))
        lenses.append(cyl("Lente", 0.0046, 0.001, (mx, T / 2 + 0.0021, mz + dz), M_LENS,
                          rot=(math.radians(90), 0, 0), verts=32))
    join(rings, "Aros")
    join(lenses, "Lentes")
    flash = cyl("Flash", 0.0016, 0.0008, (mx - 0.0145, T / 2 + 0.0012, mz + 0.0136), M_RING,
                rot=(math.radians(90), 0, 0), verts=16)

    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
    root = bpy.context.active_object
    root.name = "Telefono"
    for o in list(bpy.context.scene.objects):
        if o is not root and o.parent is None:
            parent_keep(o, root)


# ════════════════════════════════════════════════════════════════ main
reset()
build_laptop()
export_glb(os.path.join(OUT_DIR, "laptop.glb"))
if PREVIEW_DIR:
    preview(os.path.join(PREVIEW_DIR, "laptop-preview.png"), (0.5, -0.7, 0.38), (0, 0.03, 0.085))

reset()
build_phone()
export_glb(os.path.join(OUT_DIR, "phone.glb"))
if PREVIEW_DIR:
    # dos vistas: frente en 3/4 y trasera
    preview(os.path.join(PREVIEW_DIR, "phone-front.png"), (0.14, -0.34, 0.05), (0, 0, 0), lens=40, floor_z=-0.081)
    cam = bpy.context.scene.camera
    cam.location = (-0.16, 0.32, 0.06)
    bpy.context.scene.render.filepath = os.path.join(PREVIEW_DIR, "phone-back.png")
    bpy.ops.render.render(write_still=True)
    print("PREVIEW:", bpy.context.scene.render.filepath)
