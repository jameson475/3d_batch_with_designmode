# 3D Object Prompt Set — 100 objects total (10 batches)

Each object = one natural-language prompt → one three.js module (`code/NN_name.js`, exporting `build(THREE)` that returns a `THREE.Group`).
Double-click `viewers/*.html` to open in a browser (loads three@0.169.0 from jsdelivr; drag to rotate); `renders/*.png` are offline render screenshots; `token_log.csv` is the per-object cost table.

## Overview

| Batch | Objects | Code lines | Code tok | Measured generation tok | Avg per object | Measured/code |
|---|---|---|---|---|---|---|
| 1 | 01-10 | 558 | 8,234 | 15,228 | 1,522 | 1.85× |
| 2 | 11-20 | 693 | 11,790 | 19,030 | 1,903 | 1.61× |
| 3 | 21-30 | 717 | 12,637 | 20,143 | 2,014 | 1.59× |
| 4 | 31-40 | 758 | 13,689 | 22,247 | 2,224 | 1.63× |
| 5 | 41-50 | 832 | 15,136 | 24,010 | 2,401 | 1.59× |
| 6 | 51-60 | 517 | 9,517 | 16,607 | 1,660 | 1.74× |
| 7 | 61-70 | 564 | 10,521 | 18,089 | 1,808 | 1.72× |
| 8 | 71-80 | 484 | 8,960 | 16,291 | 1,629 | 1.82× |
| 9 | 81-90 | 513 | 10,264 | 17,956 | 1,795 | 1.75× |
| 10 | 91-100 | 565 | 11,271 | 19,397 | 1,939 | 1.72× |
| **Total** | 100 | 6201 | **112,019** | **188,998** | 1,889 | 1.69× |

**Methodology**

- *Code tok*: counted over the final code files with `@anthropic-ai/tokenizer` (the older Claude tokenizer); approximate.
- *Measured tok*: the difference in the session's remaining-token counter before and after each step; includes thinking, tool-call wrapping, and the code itself.
- Dollar cost = tokens × the model's unit price (output is usually priced far higher than input).

## Comparison by prompt detail level (from #51)

From batch 6 on, prompts mix three detail levels. *Estimated measured tok* = each group of 5 objects' measured usage, split across individual objects in proportion to code tok.

| Detail level | Count | Avg prompt tok | Avg code tok | Avg code lines | Avg mesh | Est. measured tok/object |
|---|---|---|---|---|---|---|
| Simple | 21 | 4 | 515 | 28 | 14 | 959 |
| Medium | 17 | 17 | 946 | 50 | 35 | 1,694 |
| Detailed | 12 | 53 | 1,970 | 100 | 90 | 3,284 |

## Batch 1 (01-10)

### Session token ledger

| Stage | tokens |
|---|---|
| Context + read canvas instructions (one-time) | 99,948 |
| Generate 01-05 | 7,025 |
| Generate 06-10 | 8,203 |
| Render / stats / visual check | 9,027 |
| Summaries + packaging + upload | 4,346 |
| Canvas layout | 6,484 |

### Per object

| # | Object | Detail | Prompt tok | Code lines | Code tok | Mesh | Triangles |
|---|---|---|---|---|---|---|---|
| 01 | Articulated Desk Lamp | Detailed | 28 | 64 | 772 | 8 | 1,368 |
| 02 | Scandinavian Wooden Chair | Detailed | 25 | 48 | 677 | 13 | 300 |
| 03 | Ceramic Coffee Mug | Detailed | 20 | 34 | 500 | 3 | 2,608 |
| 04 | Potted Succulent | Detailed | 27 | 42 | 613 | 37 | 12,320 |
| 05 | Retro Rocket | Detailed | 25 | 61 | 885 | 9 | 3,380 |
| 06 | Striped Lighthouse | Detailed | 27 | 66 | 1,082 | 35 | 2,908 |
| 07 | Recursive Bonsai | Detailed | 21 | 51 | 805 | 237 | 5,384 |
| 08 | Tin Toy Robot | Detailed | 29 | 78 | 1,208 | 30 | 2,780 |
| 09 | Spiral Staircase | Detailed | 24 | 53 | 702 | 43 | 5,216 |
| 10 | Hot Air Balloon | Detailed | 28 | 61 | 990 | 16 | 4,772 |

### Code summaries

#### 01 · Articulated Desk Lamp
> An articulated desk lamp with a weighted round base, two arm segments joined by hinges, and a cone shade with a glowing bulb.

The two arm segments form a hinge hierarchy of nested Groups (change rotation.z to pose it); open-ended ConeGeometry shade + emissive bulb + PointLight.

`64 lines · 772 tok · 8 mesh · 1,368 triangles · 4 materials`

#### 02 · Scandinavian Wooden Chair
> A simple Scandinavian wooden dining chair with four tapered legs, a slatted backrest, and a light oak finish.

Assembled purely from Box/Cylinder; legs taper via cylinders with different top/bottom radii, the rear legs extend up to double as backrest posts, 5-slat backrest.

`48 lines · 677 tok · 13 mesh · 300 triangles · 2 materials`

#### 03 · Ceramic Coffee Mug
> A glazed ceramic coffee mug with a curved handle, a thick rim, and dark coffee inside.

A single LatheGeometry profile makes the outer wall, thick rim, inner wall, and bottom in one go; the handle is a flattened half Torus.

`34 lines · 500 tok · 3 mesh · 2,608 triangles · 2 materials`

#### 04 · Potted Succulent
> A small terracotta pot holding an echeveria succulent with rosette leaves arranged in a golden-angle spiral.

34 leaves arranged in a golden-angle (137.5°) spiral, growing larger, flatter, and shifting color from inside out — a textbook procedural-plant technique.

`42 lines · 613 tok · 37 mesh · 12,320 triangles · 36 materials`

#### 05 · Retro Rocket
> A 1950s retro rocket ship with a pointed nose cone, porthole window, three swept fins, and a flame exhaust.

Fuselage Lathe profile generated from a sine function; fins are Shape + ExtrudeGeometry, copied three times at 120° around Y; the flame is an emissive cone.

`61 lines · 885 tok · 9 mesh · 3,380 triangles · 4 materials`

#### 06 · Striped Lighthouse
> A red-and-white striped lighthouse on a rocky base, with a gallery railing and a glowing lantern room.

Tower is 6 alternating red/white frustums; the base is Icosahedron rocks with randomly jittered vertices (seeded RNG, reproducible); emissive lantern room + point light.

`66 lines · 1082 tok · 35 mesh · 2,908 triangles · 5 materials`

#### 07 · Recursive Bonsai
> A bonsai tree in a shallow rectangular tray, with a recursively branching trunk and clustered foliage pads.

Recursive branch() with 4 levels of forking, each cylinder segment oriented via quaternion; ends spawn flat low-poly foliage clusters. 237 meshes — the most "fragmented" of this batch.

`51 lines · 805 tok · 237 mesh · 5,384 triangles · 4 materials`

#### 08 · Tin Toy Robot
> A boxy tin toy robot with antenna, glowing eyes, chest dial panel, jointed arms with claw hands, and wind-up key.

A box() helper places blocks in bulk; arms are two-level shoulder→elbow Group joints, animatable. From batch 2 on, renders added environment lighting so metals no longer look black.

`78 lines · 1208 tok · 30 mesh · 2,780 triangles · 4 materials`

#### 09 · Spiral Staircase
> A cast-iron spiral staircase with 20 wedge-shaped treads around a central pole and a helical handrail.

Wedge Shapes extruded into treads, 20 steps each turned 22.5°; the handrail is a CatmullRomCurve3 through the baluster tops, then TubeGeometry.

`53 lines · 702 tok · 43 mesh · 5,216 triangles · 2 materials`

#### 10 · Hot Air Balloon
> A hot air balloon with a teardrop envelope in alternating colored gores, suspension ropes, a burner, and a wicker basket.

A piecewise teardrop function builds the Lathe profile, cut via phiStart/phiLength into 12 alternating-color "gores"; ropes use Line.

`61 lines · 990 tok · 16 mesh · 4,772 triangles · 16 materials`

## Batch 2 (11-20)

### Session token ledger

| Stage | tokens |
|---|---|
| Turn start (new instructions) | 691 |
| Generate 11-15 | 9,149 |
| Generate 16-20 | 9,881 |
| Render / visual check / fix #20 lid + add environment lighting | 5,676 |
| Summaries + reusable packaging script + upload 20 renders | 16,778 |
| Canvas layout (overview + batch boards) | 8,169 |

### Per object

| # | Object | Detail | Prompt tok | Code lines | Code tok | Mesh | Triangles |
|---|---|---|---|---|---|---|---|
| 11 | Vintage Tube Radio | Detailed | 32 | 60 | 998 | 19 | 1,917 |
| 12 | Dutch Windmill | Detailed | 29 | 72 | 1,099 | 63 | 868 |
| 13 | Wooden Sloop | Detailed | 29 | 76 | 1,320 | 6 | 1,434 |
| 14 | Acoustic Guitar | Detailed | 37 | 84 | 1,265 | 30 | 1,892 |
| 15 | Cast-Iron Park Bench | Detailed | 27 | 57 | 1,010 | 18 | 5,624 |
| 16 | Mushroom Cluster | Detailed | 25 | 54 | 1,028 | 71 | 8,300 |
| 17 | Castle Tower | Detailed | 30 | 69 | 1,168 | 25 | 1,704 |
| 18 | Antique Hourglass | Detailed | 25 | 69 | 1,083 | 11 | 10,776 |
| 19 | Comms Satellite | Detailed | 29 | 76 | 1,376 | 55 | 2,780 |
| 20 | Treasure Chest | Detailed | 34 | 76 | 1,443 | 194 | 12,168 |

### Code summaries

#### 11 · Vintage Tube Radio
> A 1940s tabletop tube radio with a rounded-top walnut cabinet, a fabric speaker grille, a glowing tuning dial, and two knobs.

Arched cabinet = rectangle + semicircle Shape extruded with bevel; the cloth grille uses the same-shape ShapeGeometry, brass strips clipped to the arch by the circle equation; emissive dial.

`60 lines · 998 tok · 19 mesh · 1,917 triangles · 5 materials`

#### 12 · Dutch Windmill
> A Dutch windmill with an octagonal tapered tower, a thatched cap, four lattice sails, and a wraparound balcony.

Octagonal frustum tower (8-segment CylinderGeometry + flatShading); each of the four sails is a rotating Group with a spar, 8 crossbars, and translucent canvas.

`72 lines · 1099 tok · 63 mesh · 868 triangles · 5 materials`

#### 13 · Wooden Sloop
> A small wooden sloop sailboat with a curved hull, a single mast, a triangular mainsail and jib, and a boom.

Hand-written parametric hull surface: sine beam along length u, semicircle along section v, assembled directly into indexed BufferGeometry; the deck reuses the same profile function.

`76 lines · 1320 tok · 6 mesh · 1,434 triangles · 4 materials`

#### 14 · Acoustic Guitar
> An acoustic guitar with a figure-eight spruce body, a sound hole with rosette, a long fretted neck, a headstock with tuning pegs, and six strings.

Body's figure-8 outline from two summed Gaussians, sound hole cut with Shape.holes; frets placed by 12-tone equal temperament 2^(-n/12) — real music theory here.

`84 lines · 1265 tok · 30 mesh · 1,892 triangles · 4 materials`

#### 15 · Cast-Iron Park Bench
> A classic park bench with cast-iron scrolled side frames, wooden slat seat and curved backrest, and armrests.

Side frames are all CatmullRomCurve3 + TubeGeometry sweeps, armrest ends parameterized into scrolls with decreasing radius; backrest slats placed along the curve.

`57 lines · 1010 tok · 18 mesh · 5,624 triangles · 2 materials`

#### 16 · Mushroom Cluster
> A cluster of five fly-agaric mushrooms of different sizes growing from a mossy log, red caps with white spots.

5 mushrooms share one mushroom(scale) function: Lathe stem + truncated-hemisphere cap + random white spots in spherical coordinates; moss is flattened low-poly spheres.

`54 lines · 1028 tok · 71 mesh · 8,300 triangles · 5 materials`

#### 17 · Castle Tower
> A medieval stone castle tower with crenellated battlements, arrow-slit windows, a wooden door, and a flag on a pole.

12 merlons placed in a ring, rotated to face outward; arrow slits spiral up the tower; the arched door is an extruded Shape; the flag applies a sine displacement to PlaneGeometry vertices.

`69 lines · 1168 tok · 25 mesh · 1,704 triangles · 5 materials`

#### 18 · Antique Hourglass
> An antique hourglass with a turned wooden frame, three spindle posts, a glass double bulb, and sand mid-flow.

One bulbR(y) function drives both the glass and the sand pile at the bottom (Lathe); physically transmissive glass material; the three turned posts use |sin| for a beaded profile.

`69 lines · 1083 tok · 11 mesh · 10,776 triangles · 3 materials`

#### 19 · Comms Satellite
> A communications satellite with a gold-foil bus, two deployable solar panel wings, a parabolic dish antenna, and thruster nozzles.

Subdivided Box vertices jittered to mimic crinkled gold foil; the parabolic dish is a Lathe of y=r²/4f directly, with the feed at the focus and struts aligned by quaternion.

`76 lines · 1376 tok · 55 mesh · 2,780 triangles · 5 materials`

#### 20 · Treasure Chest
> A pirate treasure chest with a half-cylinder lid propped open, iron bands and rivets, a padlock hasp, and gold coins spilling out.

Box built from 5 panels; the half-cylinder lid hangs on a rear-edge hinge Group opened about 110°; 170 gold coins share one geometry, heaped in a paraboloid and scattered on the ground. First render had the lid floating (wrong half of the cylinder); fixed.

`76 lines · 1443 tok · 194 mesh · 12,168 triangles · 7 materials`

## Batch 3 (21-30)

### Session token ledger

| Stage | tokens |
|---|---|
| Turn start (request for 30 objects) | 2,358 |
| Generate 21-25 | 10,268 |
| Generate 26-30 | 9,875 |

### Per object

| # | Object | Detail | Prompt tok | Code lines | Code tok | Mesh | Triangles |
|---|---|---|---|---|---|---|---|
| 21 | City Bicycle | Detailed | 27 | 72 | 1,395 | 70 | 5,788 |
| 22 | Grand Piano | Detailed | 32 | 83 | 1,380 | 103 | 1,780 |
| 23 | Porcelain Teapot | Detailed | 32 | 69 | 1,251 | 9 | 8,536 |
| 24 | Rangefinder Camera | Detailed | 33 | 82 | 1,293 | 53 | 2,904 |
| 25 | Retro Desk Fan | Detailed | 30 | 83 | 1,299 | 63 | 8,036 |
| 26 | Wine Bottle & Glass | Detailed | 22 | 49 | 1,212 | 7 | 6,640 |
| 27 | Anvil on Stump | Detailed | 40 | 72 | 1,258 | 11 | 1,808 |
| 28 | Fire Hydrant | Detailed | 41 | 61 | 1,073 | 32 | 3,304 |
| 29 | Open Umbrella | Detailed | 34 | 73 | 1,354 | 36 | 3,520 |
| 30 | Five-Tier Pagoda | Detailed | 36 | 73 | 1,122 | 107 | 7,796 |

### Code summaries

#### 21 · City Bicycle
> A classic city bicycle with spoked wheels, a diamond steel frame, a leather saddle, curved handlebars, and a front basket.

Spokes are 24 thin cylinders placed by angle, alternating front/back; the frame uses a tube(a,b) helper to place a cylinder between any two points (quaternion-aligned), handlebars are a CatmullRom sweep; the basket uses a wireframe material to suggest weaving.

`72 lines · 1395 tok · 70 mesh · 5,788 triangles · 5 materials`

#### 22 · Grand Piano
> A glossy black grand piano with a curved case, a propped-open lid, 52 white and 36 black keys, three legs, and pedals.

Body's top-view outline drawn as the curved rim with two Bézier segments, then extruded; 52 white keys, with the A–G pattern deciding where black keys go (36 in total). First render had the lid rotating down into the body (wrong direction); fixed.

`83 lines · 1380 tok · 103 mesh · 1,780 triangles · 4 materials`

#### 23 · Porcelain Teapot
> A round porcelain teapot with blue bands, a curved spout, a loop handle, and a lid with a knob, on a saucer.

Pot body is a Lathe of a semicircle parametric equation for an oblate sphere; the spout is TubeGeometry with vertices scaled ring by ring to taper — TubeGeometry doesn't support variable radius, so this is the usual workaround.

`69 lines · 1251 tok · 9 mesh · 8,536 triangles · 2 materials`

#### 24 · Rangefinder Camera
> A vintage 35mm rangefinder film camera with a leatherette body, chrome top plate, a lens barrel with focus ring, dials, and a shutter button.

Body is a "rounded rectangle" Shape extruded in three layers (base plate/leather/top cover); the lens is a stack of coaxial cylinders, with 36 small blocks in a ring for the knurled focus ring.

`82 lines · 1293 tok · 53 mesh · 2,904 triangles · 4 materials`

#### 25 · Retro Desk Fan
> A retro oscillating desk fan with a round wire cage, four curved blades, a motor housing, a tilting neck, and a heavy base.

Blades drawn flat as a Bézier Shape, then vertices twisted around the radial axis by x-coordinate to get propeller pitch; the guard's 24 spokes front and back bend along cosine arcs into spherical caps.

`83 lines · 1299 tok · 63 mesh · 8,036 triangles · 3 materials`

#### 26 · Wine Bottle & Glass
> A dark green wine bottle with a cork and label beside a stemmed wine glass half-filled with red wine.

Bottle and glass are both Lathes; the glass wall gets thickness from a single curve of "outer profile + reversed inner profile"; the wine is the same bowl(y) function clipped at 45% height; the label is an open cylinder segment.

`49 lines · 1212 tok · 7 mesh · 6,640 triangles · 7 materials`

#### 27 · Anvil on Stump
> A blacksmith's anvil with a tapered horn, a flat face with a hardy hole, a waisted body, mounted on a tree-stump block with a hammer resting on it.

Anvil side profile (horn, face, waist) is one Shape extruded with bevel; stump vertices perturbed by sin(5a)+sin(11a) into an irregular cross-section, with growth rings on top.

`72 lines · 1258 tok · 11 mesh · 1,808 triangles · 6 materials`

#### 28 · Fire Hydrant
> A red cast-iron fire hydrant with a domed bonnet, a pentagonal operating nut, two side hose outlets with chained caps, and a flanged base bolted to the sidewalk.

Hydrant body is one Lathe from flange to dome; the pentagonal operating nut is simply a 5-segment CylinderGeometry; the three outlets share an outlet() function; the chain is small rings alternately rotated 90°.

`61 lines · 1073 tok · 32 mesh · 3,304 triangles · 4 materials`

#### 29 · Open Umbrella
> An open umbrella with an eight-panel canopy in alternating colors, visible ribs, a finial tip, and a curved wooden J-handle, tilted as if held.

Each of the 8 canopy panels is hand-written BufferGeometry: a concave height function + in-panel sin sag to mimic fabric stretched between ribs; ribs are tubes swept along the same height function; the J-shaped handle is a piecewise parametric curve.

`73 lines · 1354 tok · 36 mesh · 3,520 triangles · 10 materials`

#### 30 · Five-Tier Pagoda
> A five-tiered East Asian pagoda on a stone plinth, each tier with red columns and upturned curved eaves, topped by a bronze spire with rings.

5 tiers, each shrinking by 0.84×; eaves are subdivided planes displaced by "pyramid slope + corner |xz|² upturn", so one function yields upturned eaves; a 9-ring spire on top.

`73 lines · 1122 tok · 107 mesh · 7,796 triangles · 5 materials`

## Batch 4 (31-40)

### Session token ledger

| Stage | tokens |
|---|---|
| Generate 31-35 | 11,156 |
| Generate 36-40 | 11,091 |

### Per object

| # | Object | Detail | Prompt tok | Code lines | Code tok | Mesh | Triangles |
|---|---|---|---|---|---|---|---|
| 31 | Steam Locomotive | Detailed | 35 | 101 | 1,623 | 32 | 3,440 |
| 32 | Desk Globe | Detailed | 27 | 62 | 1,245 | 9 | 16,832 |
| 33 | Filled Bookshelf | Detailed | 30 | 68 | 1,332 | 138 | 1,780 |
| 34 | Silver Candelabra | Detailed | 33 | 64 | 1,316 | 29 | 8,960 |
| 35 | Birdhouse | Detailed | 37 | 85 | 1,393 | 70 | 1,776 |
| 36 | Snowman | Detailed | 40 | 94 | 1,712 | 41 | 9,860 |
| 37 | Brass Telescope | Detailed | 35 | 83 | 1,344 | 22 | 1,600 |
| 38 | Oak Barrel | Detailed | 34 | 73 | 1,300 | 36 | 3,936 |
| 39 | Wind Chime | Detailed | 28 | 56 | 1,003 | 10 | 924 |
| 40 | Hurricane Lantern | Detailed | 36 | 72 | 1,421 | 26 | 6,448 |

### Code summaries

#### 31 · Steam Locomotive
> A toy-scale steam locomotive with a cylindrical boiler, smokestack, steam dome, cab with windows, cowcatcher, and six red driving wheels linked by coupling rods.

Boiler, smokebox, and chimney (flared Lathe) arranged along x; the cowcatcher is an extruded triangle; 3 driving wheels + connecting rods on each side, two rails underneath.

`101 lines · 1623 tok · 32 mesh · 3,440 triangles · 5 materials`

#### 32 · Desk Globe
> A desk globe tilted at 23.5 degrees on a brass meridian ring and a turned wooden stand, with procedurally generated continents.

Each sphere vertex gets a "terrain value" from a few summed low-frequency sines; above a threshold it's painted land, poles are white, written straight into vertexColors — a texture-free procedural Earth; tilted 23.5° overall.

`62 lines · 1245 tok · 9 mesh · 16,832 triangles · 6 materials`

#### 33 · Filled Bookshelf
> A wooden bookshelf with four shelves filled with books of varied heights, thicknesses and colors, some leaning, plus a small plant on top.

Books generated in a "fill left to right" loop with random width/height/depth, about 8% leaning (rotated about the bottom corner, with the occupied width computed); the 126 materials are one color per book and could be merged.

`68 lines · 1332 tok · 138 mesh · 1,780 triangles · 126 materials`

#### 34 · Silver Candelabra
> An ornate silver five-arm candelabra with S-curved arms, drip cups, lit white candles with flames, and a turned base.

The four candle arms are S-shaped CatmullRom tube sweeps, two high and two low; drip trays and flames are Lathes (the flame uses sin(π·t^0.6) for a droplet shape), with their own point lights.

`64 lines · 1316 tok · 29 mesh · 8,960 triangles · 8 materials`

#### 35 · Birdhouse
> A painted wooden birdhouse on a post, with a pitched shingled roof, a round entrance hole, a perch dowel, and a small bird sitting on the roof.

Pentagonal wall Shape with a circular hole cuts the doorway directly; each roof slope has 5 rows of staggered shingles; a small bird made of spheres and a cone sits on the ridge.

`85 lines · 1393 tok · 70 mesh · 1,776 triangles · 7 materials`

#### 36 · Snowman
> A three-ball snowman with a carrot nose, coal eyes and buttons, stick arms, a knitted striped scarf, and a black top hat, standing on a snowy mound.

Low-frequency noise on the snowball vertices makes them look "hand-packed"; the mouth is 7 coal pieces arced in spherical coordinates; the scarf is 12 alternating-color torus segments.

`94 lines · 1712 tok · 41 mesh · 9,860 triangles · 23 materials`

#### 37 · Brass Telescope
> A brass refracting telescope on a wooden tripod with an altitude mount, a finder scope, an eyepiece, and a dew shield, pointed at the sky.

Tripod legs placed at 120° from foot to apex with quaternions; the tube sits in a tilted Group, with seg() stacking the dew shield, tube, and eyepiece; the finder scope hangs on a bracket.

`83 lines · 1344 tok · 22 mesh · 1,600 triangles · 4 materials`

#### 38 · Oak Barrel
> An oak wine barrel built from individual bulging staves held by four iron hoops, with a round head and a bung hole, lying on a wooden cradle.

Each of the 22 staves is an angular slice of LatheGeometry (phiStart/phiLength), with gaps and random shading; the barrel bulges via a parabolic radius, and hoop radii follow their height.

`73 lines · 1300 tok · 36 mesh · 3,936 triangles · 32 materials`

#### 39 · Wind Chime
> A hanging wind chime with a round wooden top disk, six aluminum tubes of graded lengths on strings, a central striker, and a sail.

The 6 tube lengths follow base/√(frequency ratio) (1, 9/8, 5/4, 3/2, 5/3, 2) — a real acoustic relationship; strings use Line, and the central striker and wind sail hang on the same line.

`56 lines · 1003 tok · 10 mesh · 924 triangles · 2 materials`

#### 40 · Hurricane Lantern
> A hurricane oil lantern with a red-painted fuel tank, a glass globe with a glowing flame, a wire guard, a vented cap, and a bail handle.

Fuel tank, globe, and flame are all Lathes; the wire guard is swept along the globe profile pushed outward; the curved tubes on both sides mimic a hurricane lantern's air-intake frame, with its own point light.

`72 lines · 1421 tok · 26 mesh · 6,448 triangles · 12 materials`

## Batch 5 (41-50)

### Session token ledger

| Stage | tokens |
|---|---|
| Generate 41-45 | 11,504 |
| Generate 46-50 | 12,506 |
| Render 21-50 / visual check / fix #22 lid + #43 arm (all 3 batches) | 7,787 |
| Summaries + observations + upload 30 renders (all 3 batches) | 15,369 |
| Canvas + packaging (all 3 batches) | 7,506 |

### Per object

| # | Object | Detail | Prompt tok | Code lines | Code tok | Mesh | Triangles |
|---|---|---|---|---|---|---|---|
| 41 | Office Swivel Chair | Detailed | 39 | 85 | 1,595 | 29 | 1,976 |
| 42 | Knight's Great Helm | Detailed | 36 | 76 | 1,298 | 35 | 2,244 |
| 43 | Compound Microscope | Detailed | 44 | 99 | 1,737 | 25 | 1,700 |
| 44 | Frosted Cupcake | Detailed | 30 | 75 | 1,326 | 96 | 19,260 |
| 45 | Traffic Cones & Barrier | Detailed | 31 | 73 | 1,185 | 28 | 872 |
| 46 | Staunton Chess Pieces | Detailed | 40 | 79 | 1,576 | 45 | 9,684 |
| 47 | Garden Wheelbarrow | Detailed | 36 | 79 | 1,608 | 14 | 3,742 |
| 48 | Glowing Jellyfish | Detailed | 28 | 79 | 1,401 | 25 | 22,144 |
| 49 | Grandfather Clock | Detailed | 43 | 92 | 1,760 | 89 | 3,208 |
| 50 | Ferris Wheel | Detailed | 39 | 95 | 1,650 | 264 | 20,876 |

### Code summaries

#### 41 · Office Swivel Chair
> An ergonomic office swivel chair with a five-star base on casters, a gas-lift column, a padded seat, a curved mesh backrest, and armrests.

The five-star base uses 5 rotated Groups reusing one component; the seat is a beveled rounded-rectangle extrusion; the backrest mesh is an open cylinder segment for a curved surface.

`85 lines · 1595 tok · 29 mesh · 1,976 triangles · 5 materials`

#### 42 · Knight's Great Helm
> A medieval knight's great helm on a display stand: a steel bucket helmet with a riveted cross reinforcement, eye slits, breathing holes, and a red plume.

Helmet is a flat-topped Lathe stretched 1.08× in z for an elliptical cross-section; the cross reinforcement + rivets, eye slit, and 4×3 breathing holes are all placed on the surface in cylindrical coordinates; the plume is elongated low-poly spheres in a fan.

`76 lines · 1298 tok · 35 mesh · 2,244 triangles · 6 materials`

#### 43 · Compound Microscope
> A laboratory compound microscope with a curved arm, an angled eyepiece tube, a rotating nosepiece with three objectives, a mechanical stage with slide clips, coarse and fine focus knobs, and a base lamp.

The C-shaped arm is an extruded curved Shape; three objectives of increasing length with colored magnification rings; first render had the objectives detached from the arm, fixed by adding a connector.

`99 lines · 1737 tok · 25 mesh · 1,700 triangles · 8 materials`

#### 44 · Frosted Cupcake
> A cupcake in a pleated paper liner topped with a swirled pink frosting spiral, rainbow sprinkles, and a cherry with a stem.

Paper cup is a Lathe with radius modulated by cos(36a) for pleats; the frosting is a conical spiral tube with rings scaled to a peak; 90 sprinkles share one Capsule geometry placed on the spiral surface.

`75 lines · 1326 tok · 96 mesh · 19,260 triangles · 95 materials`

#### 45 · Traffic Cones & Barrier
> Three orange traffic cones with white reflective bands on square black bases, one knocked over, next to a striped road barrier on A-frame legs.

Cones reuse a cone() function 3 times (one knocked over); reflective bands are short frustums matching the cone's slope; the barrier is striped from 8 red/white blocks.

`73 lines · 1185 tok · 28 mesh · 872 triangles · 11 materials`

#### 46 · Staunton Chess Pieces
> A corner of a wooden chessboard with a Staunton-style king, queen, rook, bishop, and pawn in ivory and ebony, all turned on a lathe.

The 5 piece types share a base profile, each attaching a different Lathe profile on top, then adding merlons, the bishop's cut, queen's crown beads, or king's cross by type — one piece(kind) function generates them all.

`79 lines · 1576 tok · 45 mesh · 9,684 triangles · 18 materials`

#### 47 · Garden Wheelbarrow
> A garden wheelbarrow with a deep green steel tray, a single pneumatic front wheel, tubular handles with rubber grips, rear legs, and a load of soil.

The tray is a hand-written BufferGeometry loft from "small bottom rectangle → large open rectangle"; the dirt pile is a flattened, perturbed hemisphere; the handles are tubes swept from the axle out under the tray.

`79 lines · 1608 tok · 14 mesh · 3,742 triangles · 5 materials`

#### 48 · Glowing Jellyfish
> A translucent glowing jellyfish with a scalloped bell, frilly oral arms, and long trailing tentacles that wave in sine curves.

Bell is a Lathe with a cos(16a) ruffled edge; oral arms are spiral tubes with sin-modulated radius for frills; 16 tentacles hang as sine waves with different phases, emissive + translucent.

`79 lines · 1401 tok · 25 mesh · 22,144 triangles · 3 materials`

#### 49 · Grandfather Clock
> A tall mahogany grandfather clock with an arched hood, a clock face with Roman-numeral ticks and hands, a glass-front trunk showing a brass pendulum and weights, and a plinth base.

Arched hood is an extruded rectangle + semicircle Shape; 60 dial ticks (hours bolder) placed by angle, hands set at 10:10; the pendulum and three weights are visible behind the glass door.

`92 lines · 1760 tok · 89 mesh · 3,208 triangles · 5 materials`

#### 50 · Ferris Wheel
> A carnival Ferris wheel with a double-rim spoked wheel, twelve colorful gondolas hanging level, an A-frame support tower, and light bulbs along the rim.

Twin wheel rims + 24 spokes + 12 crossbeams; 144 bulbs share one geometry; the 12 gondolas are added to root rather than the wheel so they always stay level. 264 meshes — the most complex of this batch.

`95 lines · 1650 tok · 264 mesh · 20,876 triangles · 16 materials`

## Batch 6 (51-60)

### Session token ledger

| Stage | tokens |
|---|---|
| Generate 51-55 (incl. turn start + planning 50 prompts) | 5,651 |
| Generate 56-60 | 10,956 |
| Render / check 51-60 (+ partial-render option) | 1,792 |

### Per object

| # | Object | Detail | Prompt tok | Code lines | Code tok | Mesh | Triangles |
|---|---|---|---|---|---|---|---|
| 51 | Apple | Simple | 4 | 27 | 492 | 3 | 3,272 |
| 52 | Iced Donut | Simple | 11 | 37 | 676 | 72 | 14,472 |
| 53 | Mid-Century Coffee Table | Medium | 19 | 29 | 563 | 10 | 1,664 |
| 54 | Rubber Duck | Simple | 4 | 33 | 527 | 7 | 4,200 |
| 55 | Pencil | Simple | 4 | 25 | 474 | 5 | 252 |
| 56 | Twin-Bell Alarm Clock | Medium | 17 | 54 | 993 | 26 | 3,156 |
| 57 | Potted Saguaro | Medium | 23 | 50 | 815 | 183 | 11,776 |
| 58 | Open Laptop | Medium | 15 | 47 | 905 | 76 | 906 |
| 59 | Electric Guitar | Detailed | 59 | 111 | 2,203 | 67 | 4,150 |
| 60 | Space Shuttle Stack | Detailed | 48 | 104 | 1,869 | 25 | 5,546 |

### Code summaries

#### 51 · Apple
> A red apple.

One Lathe profile + dimples at both ends, plus a stem and a flattened sphere for the leaf. Only 3 meshes.

`27 lines · 492 tok · 3 mesh · 3,272 triangles · 3 materials`

#### 52 · Iced Donut
> A donut with pink icing and sprinkles.

Dough is a flattened Torus; the glaze is a slightly larger Torus whose lower vertices are "flattened" onto a sin(9a) wave for a drippy edge; 70 sprinkles.

`37 lines · 676 tok · 72 mesh · 14,472 triangles · 72 materials`

#### 53 · Mid-Century Coffee Table
> A mid-century modern coffee table with a walnut oval top and splayed legs.

Oval tabletop = cylinder scaled 1.4×0.75; four tapered legs splay outward from under the table (cylinder between two points), with brass caps on the feet.

`29 lines · 563 tok · 10 mesh · 1,664 triangles · 5 materials`

#### 54 · Rubber Duck
> A rubber duck.

Built entirely from scaled spheres: body, head, beak, wings, and a cone for the tail. With a simple prompt, the model chose the most classic cartoon form.

`33 lines · 527 tok · 7 mesh · 4,200 triangles · 4 materials`

#### 55 · Pencil
> A yellow pencil.

A 6-sided cylinder is naturally a hexagonal pencil barrel; the sharpened wood and lead are two cones, with a metal ferrule + eraser at the other end.

`25 lines · 474 tok · 5 mesh · 252 triangles · 5 materials`

#### 56 · Twin-Bell Alarm Clock
> A classic twin-bell alarm clock with a hammer between the bells and little feet.

Dial with 12 ticks + hour and minute hands; the two bells are hemispheres tilted outward with a small hammer between; the arched handle is half a Torus.

`54 lines · 993 tok · 26 mesh · 3,156 triangles · 4 materials`

#### 57 · Potted Saguaro
> A saguaro cactus with two arms in a clay pot, with ribbed stems and spines.

ribbed(r,h) function: a capsule with radius modulated by cos(8a) for ribs, then spines along each rib ridge; the trunk and both arms reuse it.

`50 lines · 815 tok · 183 mesh · 11,776 triangles · 4 materials`

#### 58 · Open Laptop
> An open laptop with a keyboard, trackpad, and a glowing screen.

The 5×14 keyboard keys share one geometry; the screen uses vertexColors for a gradient wallpaper; the lid hangs on a rear-edge hinge Group, opened.

`47 lines · 905 tok · 76 mesh · 906 triangles · 5 materials`

#### 59 · Electric Guitar
> A sunburst electric guitar with an offset double-cutaway solid body, a white pickguard, three single-coil pickups, volume and tone knobs, a whammy bar, a maple neck with dot inlays, and a six-in-line headstock.

Double-cutaway body outline drawn with 6 Bézier segments; the sunburst color interpolates vertexColors by distance from center; frets by 12-tone equal temperament, with inlays at frets 3/5/7/9/12 (double)/15/17/19.

`111 lines · 2203 tok · 67 mesh · 4,150 triangles · 13 materials`

#### 60 · Space Shuttle Stack
> A space shuttle orbiter stacked for launch: the white orbiter with black heat-shield underside and delta wings, mounted on a large orange external fuel tank flanked by two white solid rocket boosters, standing on a launch platform.

The external tank is an ogive Lathe, both boosters reuse srb(); orbiter fuselage + black heat-shield belly + double-delta wing + tail fin + 3 main engine nozzles.

`104 lines · 1869 tok · 25 mesh · 5,546 triangles · 7 materials`

## Batch 7 (61-70)

### Session token ledger

| Stage | tokens |
|---|---|
| Generate 61-65 | 7,068 |
| Generate 66-70 | 11,021 |
| Render / check 61-70 | 986 |

### Per object

| # | Object | Detail | Prompt tok | Code lines | Code tok | Mesh | Triangles |
|---|---|---|---|---|---|---|---|
| 61 | Tree | Simple | 3 | 20 | 356 | 13 | 1,008 |
| 62 | Small House | Simple | 4 | 34 | 589 | 8 | 92 |
| 63 | Skeleton Key | Simple | 4 | 39 | 656 | 8 | 2,852 |
| 64 | Victorian Street Lamp | Medium | 18 | 50 | 983 | 11 | 3,168 |
| 65 | Three-Seat Sofa | Medium | 19 | 57 | 1,094 | 16 | 11,560 |
| 66 | Goldfish Bowl | Medium | 18 | 50 | 1,151 | 70 | 7,982 |
| 67 | Viking Longship | Detailed | 56 | 113 | 2,130 | 70 | 5,988 |
| 68 | Drum Kit | Detailed | 68 | 123 | 2,118 | 84 | 7,748 |
| 69 | Rural Mailbox | Simple | 3 | 29 | 502 | 4 | 236 |
| 70 | Skateboard | Medium | 19 | 49 | 942 | 11 | 824 |

### Code summaries

#### 61 · Tree
> A tree.

Minimal prompt: a trunk + 12 low-poly spheres of random size and random green forming the canopy.

`20 lines · 356 tok · 13 mesh · 1,008 triangles · 13 materials`

#### 62 · Small House
> A small house.

Box walls + extruded triangular roof + chimney, door, two windows, and sills. 92 triangles — among the leanest of all.

`34 lines · 589 tok · 8 mesh · 92 triangles · 6 materials`

#### 63 · Skeleton Key
> An old key.

The model read "old key" as a skeleton key: ring bow + small trefoil rings + shaft + notched bit (extruded Shape).

`39 lines · 656 tok · 8 mesh · 2,852 triangles · 1 materials`

#### 64 · Victorian Street Lamp
> A Victorian cast-iron street lamp with a lantern head and a fluted post.

The post uses cos(12a) modulation for fluting; the lamp head is a 4-sided frustum of glass + iron frame + pyramid cap, with its own point light.

`50 lines · 983 tok · 11 mesh · 3,168 triangles · 2 materials`

#### 65 · Three-Seat Sofa
> A three-seat fabric sofa with rounded arms, seat cushions, and throw pillows.

An rbox() rounded-box function is reused 10 times for the base, back, arms, and cushions; the two throw pillows are flattened spheres.

`57 lines · 1094 tok · 16 mesh · 11,560 triangles · 4 materials`

#### 66 · Goldfish Bowl
> A round glass fishbowl with water, gravel, a plant, and a goldfish.

The bowl is a spherical Lathe open at the top and flat at the bottom; the water reuses the same profile clipped at 70%; 60 pebbles, 5 water plants, 1 goldfish.

`50 lines · 1151 tok · 70 mesh · 7,982 triangles · 70 materials`

#### 67 · Viking Longship
> A Viking longship with an overlapping clinker-built plank hull, a carved dragon-head prow and curled stern, a single mast with a red-and-white striped square sail, a row of painted round shields along each gunwale, and oars.

Clinker-built hull: each of the 6 strakes is hand-written BufferGeometry with 15% overlap; dragon-head prow + curled stern; striped sail via vertexColors; 9 shields and oars on each side.

`113 lines · 2130 tok · 70 mesh · 5,988 triangles · 41 materials`

#### 68 · Drum Kit
> A five-piece rock drum kit: a bass drum with a logo head and pedal, a snare on a stand, two rack toms mounted on the bass drum, a floor tom on legs, a hi-hat, and two cymbals on boom stands, all with sparkle-red wraps and chrome hoops.

A drum(r,depth) function makes the shell, both heads, hoops, and lugs, reused 6 times; the stand() tripod and cymbal() Lathe are reused too.

`123 lines · 2118 tok · 84 mesh · 7,748 triangles · 6 materials`

#### 69 · Rural Mailbox
> A mailbox.

Tunnel-shaped mailbox = extruded rectangle + semicircle Shape, with the red flag raised on the side. 4 meshes.

`29 lines · 502 tok · 4 mesh · 236 triangles · 3 materials`

#### 70 · Skateboard
> A skateboard with a concave deck, kicktails, trucks, and colorful wheels.

The deck is an extruded rounded strip, then vertices displaced for kicktails along x and concave along y; two trucks + 4 colored wheels.

`49 lines · 942 tok · 11 mesh · 824 triangles · 6 materials`

## Batch 8 (71-80)

### Session token ledger

| Stage | tokens |
|---|---|
| Generate 71-75 | 5,772 |
| Generate 76-80 | 10,519 |
| Render / check 71-80 | 982 |

### Per object

| # | Object | Detail | Prompt tok | Code lines | Code tok | Mesh | Triangles |
|---|---|---|---|---|---|---|---|
| 71 | Gold Star | Simple | 4 | 19 | 301 | 1 | 116 |
| 72 | Cut Gemstone | Simple | 5 | 13 | 259 | 1 | 128 |
| 73 | Galvanized Bucket | Simple | 4 | 26 | 390 | 6 | 2,904 |
| 74 | Retro Toaster | Medium | 13 | 43 | 830 | 10 | 1,060 |
| 75 | Over-Ear Headphones | Medium | 15 | 48 | 784 | 12 | 5,000 |
| 76 | Hydraulic Excavator | Detailed | 41 | 121 | 2,362 | 70 | 2,968 |
| 77 | Carousel | Detailed | 46 | 88 | 1,758 | 164 | 30,720 |
| 78 | Ice Cream Cone | Simple | 5 | 34 | 587 | 3 | 4,096 |
| 79 | Picnic Table | Medium | 14 | 53 | 856 | 16 | 1,764 |
| 80 | Trophy Cup | Medium | 12 | 39 | 833 | 6 | 5,618 |

### Code summaries

#### 71 · Gold Star
> A gold star.

Ten points alternating between inner and outer radii draw the star Shape, extruded with bevel. The whole object is 1 mesh, 116 triangles.

`19 lines · 301 tok · 1 mesh · 116 triangles · 1 materials`

#### 72 · Cut Gemstone
> A blue gemstone.

Round brilliant cut profile (table, crown, girdle, pavilion) as a 16-segment Lathe, toNonIndexed + flatShading for facets, ior=2.4.

`13 lines · 259 tok · 1 mesh · 128 triangles · 1 materials`

#### 73 · Galvanized Bucket
> A metal bucket.

Open frustum pail body + bottom + 3 reinforcing ribs + bail handle.

`26 lines · 390 tok · 6 mesh · 2,904 triangles · 1 materials`

#### 74 · Retro Toaster
> A retro chrome two-slice toaster with toast popping out.

Body side is an extruded rounded profile; two slices of toast pop out of the slots, with half-cylinders for the crust along the top edges; side lever and knob.

`43 lines · 830 tok · 10 mesh · 1,060 triangles · 6 materials`

#### 75 · Over-Ear Headphones
> Over-ear headphones with a padded headband and cushioned ear cups.

The headband is half a Torus stretched along z; ear cups are elliptical cylinders + cushion rings + gold logo; sliders and yokes are symmetric on both sides.

`48 lines · 784 tok · 12 mesh · 5,000 triangles · 3 materials`

#### 76 · Hydraulic Excavator
> A yellow hydraulic excavator on steel crawler tracks, with a rotating cab with windows, a counterweight, and an articulated boom, stick, and toothed bucket driven by hydraulic cylinders, digging pose.

Tracks are an extruded "racetrack Shape with holes" + 18 grousers; upper body → boom → arm → bucket nested as Groups level by level; hydraulic cylinders use cyl() to place a barrel + chrome rod between two points.

`121 lines · 2362 tok · 70 mesh · 2,968 triangles · 5 materials`

#### 77 · Carousel
> A fairground carousel with a striped conical canopy with scalloped valance, a central mirrored column, twisted brass poles, eight horses at alternating heights, a round wooden platform, and bulbs around the canopy edge.

16 striped cone panels + scalloped valance + 48 bulbs; 8 horses generated by horse(), alternating high and low; the spiral brass poles are tubes swept along tight helices. 30k triangles — the heaviest of all.

`88 lines · 1758 tok · 164 mesh · 30,720 triangles · 53 materials`

#### 78 · Ice Cream Cone
> An ice cream cone.

Two sets of diagonal sin functions compute vertexColors on the cone for a diamond grid; the two scoops have slight noise undulation.

`34 lines · 587 tok · 3 mesh · 4,096 triangles · 3 materials`

#### 79 · Picnic Table
> A wooden picnic table with attached benches and a checkered tablecloth.

5-plank tabletop, benches on both sides, A-frame legs with braces; the checked tablecloth is a subdivided plane with vertices beyond the edge folded down to hang.

`53 lines · 856 tok · 16 mesh · 1,764 triangles · 2 materials`

#### 80 · Trophy Cup
> A gold trophy cup with two handles on a marble base.

The marble base uses summed sines for gray-veined vertexColors; the trophy is a single Lathe (base, knopped stem, cup), with S-shaped handles on both sides.

`39 lines · 833 tok · 6 mesh · 5,618 triangles · 3 materials`

## Batch 9 (81-90)

### Session token ledger

| Stage | tokens |
|---|---|
| Generate 81-85 | 9,232 |
| Generate 86-90 | 8,724 |
| Render / check 81-90 | 985 |

### Per object

| # | Object | Detail | Prompt tok | Code lines | Code tok | Mesh | Triangles |
|---|---|---|---|---|---|---|---|
| 81 | Puffy Cloud | Simple | 3 | 19 | 335 | 8 | 8,640 |
| 82 | Mushroom House | Medium | 19 | 52 | 1,041 | 19 | 6,040 |
| 83 | Vintage Biplane | Detailed | 61 | 118 | 2,295 | 83 | 4,498 |
| 84 | Ceramic Vase | Simple | 4 | 21 | 400 | 1 | 5,248 |
| 85 | Watering Can | Medium | 17 | 50 | 1,011 | 25 | 1,468 |
| 86 | Stone Arch Bridge | Detailed | 38 | 73 | 1,477 | 178 | 3,294 |
| 87 | Toy Blocks | Simple | 4 | 31 | 716 | 36 | 912 |
| 88 | Antique Sewing Machine | Detailed | 50 | 91 | 1,875 | 24 | 3,644 |
| 89 | Bronze Bell | Simple | 3 | 22 | 426 | 4 | 3,176 |
| 90 | Diamond Kite | Simple | 4 | 36 | 688 | 10 | 76 |

### Code summaries

#### 81 · Puffy Cloud
> A cloud.

7 spheres of different sizes + a flat cylinder base. 1 material.

`19 lines · 335 tok · 8 mesh · 8,640 triangles · 1 materials`

#### 82 · Mushroom House
> A fairy-tale mushroom house with a round door, windows, and a chimney.

Mushroom house: a bulging Lathe for the stem, cap edge curled inward, white spots fitted to the surface with lookAt; round door, glowing round window, chimney.

`52 lines · 1041 tok · 19 mesh · 6,040 triangles · 7 materials`

#### 83 · Vintage Biplane
> A 1930s biplane with fabric-covered upper and lower wings joined by struts and bracing wires, an open cockpit with a windscreen, a radial engine with a two-blade wooden propeller, a tail with rudder and elevators, and fixed landing gear with spoked wheels.

Upper and lower wings + ribs, interplane struts and cross-bracing wires, 7-cylinder radial engine, two-blade wooden prop, tail, spoked landing gear — implemented item by item from the prompt's list.

`118 lines · 2295 tok · 83 mesh · 4,498 triangles · 34 materials`

#### 84 · Ceramic Vase
> A vase.

A single Lathe with a sine-bulged belly, vertexColors graded by height (celadon glaze to cream rim). 1 mesh.

`21 lines · 400 tok · 1 mesh · 5,248 triangles · 1 materials`

#### 85 · Watering Can
> A green metal watering can with a long spout and a sprinkler rose.

Can body is a Lathe flattened in z; the long spout is a cone tube between two points; the rose has small holes in concentric circles; the handle spans the top.

`50 lines · 1011 tok · 25 mesh · 1,468 triangles · 20 materials`

#### 86 · Stone Arch Bridge
> A medieval stone arch bridge with three semicircular arches of individual voussoir stones, cutwater piers, a paved deck, and low parapet walls, spanning a stream.

Bridge body = extruded Shape with 3 semicircular holes; each arch ring extruded voussoir by voussoir; pier cutwaters, paving stones, parapets, and a stream. 172 materials (random shading per stone) — could be merged.

`73 lines · 1477 tok · 178 mesh · 3,294 triangles · 172 materials`

#### 87 · Toy Blocks
> Toy blocks.

Beveled cubes + colored block "letters" on 5 faces, with 6 blocks stacked casually.

`31 lines · 716 tok · 36 mesh · 912 triangles · 12 materials`

#### 88 · Antique Sewing Machine
> An antique black cast-iron sewing machine with gold decals, a curved arm and head, a hand wheel, a needle bar and presser foot above a chrome bed plate, a thread spool on a pin, mounted on a wooden base.

Machine side profile (pillar → arm → head) is one extruded curved Shape; gold decals are sine-swept tubes; handwheel, needle bar, presser foot, spool, and a line of stitching.

`91 lines · 1875 tok · 24 mesh · 3,644 triangles · 5 materials`

#### 89 · Bronze Bell
> A bell.

Classic bell-profile Lathe + thickened lip ring + crown loop on top + clapper.

`22 lines · 426 tok · 4 mesh · 3,176 triangles · 2 materials`

#### 90 · Diamond Kite
> A kite.

The 4 triangular sail panels are BufferGeometry built directly from 3 points; cross spars; the tail is a wavy line with little bows. 76 triangles.

`36 lines · 688 tok · 10 mesh · 76 triangles · 10 materials`

## Batch 10 (91-100)

### Session token ledger

| Stage | tokens |
|---|---|
| Generate 91-95 | 9,490 |
| Generate 96-100 | 9,907 |
| Render / check / fix #91 shell + eyes, numeric sort fix | 3,287 |
| Summaries + detail-level analysis + upload 50 renders (batches 6-10) | 21,529 |
| Canvas + packaging (batches 6-10) | 10,974 |

### Per object

| # | Object | Detail | Prompt tok | Code lines | Code tok | Mesh | Triangles |
|---|---|---|---|---|---|---|---|
| 91 | Garden Snail | Medium | 13 | 51 | 982 | 8 | 5,568 |
| 92 | Robot Vacuum | Simple | 4 | 28 | 542 | 7 | 644 |
| 93 | Rooftop Water Tower | Medium | 20 | 70 | 1,258 | 65 | 4,148 |
| 94 | Manual Typewriter | Detailed | 57 | 85 | 1,680 | 200 | 13,774 |
| 95 | Igloo | Simple | 4 | 40 | 796 | 83 | 1,288 |
| 96 | Camping Tent | Simple | 4 | 35 | 689 | 6 | 103 |
| 97 | Yellow Submarine | Medium | 18 | 59 | 1,038 | 24 | 6,704 |
| 98 | Oak Treehouse | Detailed | 61 | 90 | 2,018 | 91 | 4,118 |
| 99 | Pumpkin | Simple | 3 | 26 | 418 | 2 | 5,016 |
| 100 | Gramophone | Detailed | 55 | 81 | 1,850 | 30 | 6,884 |

### Code summaries

#### 91 · Garden Snail
> A garden snail with a spiral shell and eye stalks.

Shell = tube swept along a logarithmic spiral, each ring's radius shrunk by e^(-k·a), stripes via vertexColors. First render had the shell floating and eyes detached from the stalks; fixed.

`51 lines · 982 tok · 8 mesh · 5,568 triangles · 4 materials`

#### 92 · Robot Vacuum
> A robot vacuum.

Flat cylinder body + half-ring bumper + lidar turret + glowing button + three-prong side brush.

`28 lines · 542 tok · 7 mesh · 644 triangles · 7 materials`

#### 93 · Rooftop Water Tower
> A rooftop wooden water tower on a steel stand with a conical roof and a ladder.

28 wooden staves + 5 iron hoops + conical top; steel frame of four legs with cross bracing; ladder on the side.

`70 lines · 1258 tok · 65 mesh · 4,148 triangles · 31 materials`

#### 94 · Manual Typewriter
> A 1920s manual typewriter in black enamel: four staggered rows of round glass-topped keys with chrome rims, a semicircular basket of typebars, a platen roller with knobs and a sheet of paper, a carriage return lever, and gold lettering.

4 rows of staggered round keys (glass keycaps + chrome rings + key levers), 36 typebars in a fan; platen, knobs on both sides, a slightly curled sheet of paper, and the return lever. 200 meshes.

`85 lines · 1680 tok · 200 mesh · 13,774 triangles · 7 materials`

#### 95 · Igloo
> An igloo.

Snow blocks laid in hemispherical courses with staggered joints (half-block offset per row), skipping blocks at the entrance; half-cylinder tunnel + dark doorway.

`40 lines · 796 tok · 83 mesh · 1,288 triangles · 83 materials`

#### 96 · Camping Tent
> A camping tent.

Triangular Shape with a triangular hole cut for the doorway, then extruded; door flap rolled up; two guy ropes and stakes. 103 triangles.

`35 lines · 689 tok · 6 mesh · 103 triangles · 6 materials`

#### 97 · Yellow Submarine
> A yellow cartoon submarine with portholes, a periscope, and a propeller.

Round-nosed, pointed-tail Lathe hull; the conning tower is a flattened capsule; bent periscope tube, 4 portholes per side, cross tail fins, 3-blade propeller.

`59 lines · 1038 tok · 24 mesh · 6,704 triangles · 10 materials`

#### 98 · Oak Treehouse
> A treehouse built into a large oak: a thick trunk with branching limbs and leafy canopy clusters, a plank platform with railings resting on the branches, a small cabin with a shingled roof and a window, a rope ladder hanging to the ground, and a tire swing on another branch.

Trunk + buttress roots + 6 main limbs (limb() places a cylinder between two points) + canopy clusters at the tips; platform, railing, little cabin with windows, shingled roof, rope ladder, tire swing.

`90 lines · 2018 tok · 91 mesh · 4,118 triangles · 42 materials`

#### 99 · Pumpkin
> A pumpkin.

Sphere pressed by |sin(5a)| into 10 pumpkin ribs, pulled in at the poles; hexagonal stem. 2 meshes.

`26 lines · 418 tok · 2 mesh · 5,016 triangles · 2 materials`

#### 100 · Gramophone
> An antique gramophone: a square mahogany cabinet with a side winding crank, a turntable with a black shellac record showing grooves and a red label, a curved tonearm with a soundbox and needle, and a large flared brass horn.

The record uses concentric RingGeometry for grooves + a red label; tonearm and horn neck are swept tubes; the horn bell is an exponentially flared Lathe with a cos(8a) petal edge.

`81 lines · 1850 tok · 30 mesh · 6,884 triangles · 19 materials`

## Cumulative observations

- Everything uses only three.js built-in geometries (Box/Cylinder/Lathe/Extrude/Tube/Torus/Shape/Icosahedron/Capsule, plus hand-written BufferGeometry: #13 hull, #29 umbrella canopy, #47 wheelbarrow tray, #67 strakes, #90 kite), with zero external model assets.
- Prompt detail drives cost: simple (2–5 words, e.g. "A pumpkin.") averages ~500 code tok and ~960 measured tok; medium (one sentence) ~950 / 1,700; detailed (lists parts) ~1,970 / 3,280. Detailed prompts cost about 3.4× simple ones, with about 6× the meshes.
- Simple prompts don't mean low quality: the model fills in the "most typical" form on its own (#54 rubber duck, #63 skeleton key, #99 pumpkin ribs), but detail and part count are clearly lower. When a specific structure is needed, detailed prompts give more control.
- The most token-efficient patterns: a single Lathe profile (mug, rocket, hourglass, teapot, wine bottle, chess pieces, vase, bell, pumpkin); one parameterized function reused many times (mushrooms, cones, drums, cactus, sofa rbox); loops/recursion (staircase, bonsai, bookshelf, Ferris wheel, igloo).
- Code size doesn't scale with visual complexity: #71 star is 1 mesh, #77 carousel is 164 meshes / 30k triangles; objects whose parts must be placed one by one (robot, train, typewriter, excavator) are the most expensive.
- Common workarounds: TubeGeometry doesn't support variable radius, so #23 spout, #44 frosting, #48 oral arms, and #91 snail shell all scale vertices ring by ring; #32 globe, #59 guitar sunburst, #78 cone grid, and #80 marble use vertexColors instead of textures.
- Where real physics/music theory shows up: #14 and #59 frets follow 12-tone equal temperament, #39 wind-chime tube length ∝ 1/√frequency, #19 dish is a true paraboloid y=r²/4f, #72 gem ior=2.4 (diamond's refractive index).
- Quality issues logged: #20 floating chest lid, #22 piano lid rotated the wrong way, #43 detached microscope arm, #91 floating snail shell — 4 of 100 caught by visual render checks and fixed, so the render check is not optional.
- Room to optimize: most objects create a new geometry/material per mesh (#86 stone bridge has 172 materials, #33 bookshelf 126); these could be shared or switched to InstancedMesh.
