# 3D Object Prompt Set — 累计 100 个物体（10 批）

每个物体 = 一条自然语言 prompt → 一个 three.js 模块（`code/NN_name.js`，导出 `build(THREE)` 返回 `THREE.Group`）。
`viewers/*.html` 双击即可在浏览器打开（从 jsdelivr 加载 three@0.169.0，可拖拽旋转）；`renders/*.png` 为离线渲染截图；`token_log.csv` 为逐物体成本表。

## 总览

| 批次 | 物体 | 代码行 | 代码 tok | 生成阶段实测 tok | 每物体平均 | 实测/代码 |
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
| **合计** | 100 | 6201 | **112,019** | **188,998** | 1,889 | 1.69× |

**计量方法**

- *代码 tok*：用 `@anthropic-ai/tokenizer`（旧版 Claude 分词器）对最终代码文件计数，属近似值。
- *实测 tok*：每一步前后读取会话剩余 token 计数器做差，包含思考、工具调用包装和代码本身。
- 美元成本 = token × 所用模型单价（输出单价通常远高于输入）。

## 按 prompt 详细程度对比（51 号起）

从第 6 批开始，prompt 混合了三种详细程度。*估算实测 tok* = 每组 5 个物体的实测消耗按代码 tok 比例分摊到单个物体。

| 详细程度 | 数量 | 平均 prompt tok | 平均代码 tok | 平均代码行 | 平均 mesh | 估算实测 tok/物体 |
|---|---|---|---|---|---|---|
| 简单 | 21 | 4 | 515 | 28 | 14 | 959 |
| 中等 | 17 | 17 | 946 | 50 | 35 | 1,694 |
| 详细 | 12 | 53 | 1,970 | 100 | 90 | 3,284 |

## 第 1 批（01-10）

### 会话 token 账本

| 阶段 | tokens |
|---|---|
| Context + read canvas instructions (one-time) | 99,948 |
| Generate 01-05 | 7,025 |
| Generate 06-10 | 8,203 |
| Render / stats / visual check | 9,027 |
| Summaries + packaging + upload | 4,346 |
| Canvas layout | 6,484 |

### 逐物体

| # | 物体 | 详细程度 | Prompt tok | 代码行 | 代码 tok | Mesh | 三角面 |
|---|---|---|---|---|---|---|---|
| 01 | Articulated Desk Lamp | 详细 | 28 | 64 | 772 | 8 | 1,368 |
| 02 | Scandinavian Wooden Chair | 详细 | 25 | 48 | 677 | 13 | 300 |
| 03 | Ceramic Coffee Mug | 详细 | 20 | 34 | 500 | 3 | 2,608 |
| 04 | Potted Succulent | 详细 | 27 | 42 | 613 | 37 | 12,320 |
| 05 | Retro Rocket | 详细 | 25 | 61 | 885 | 9 | 3,380 |
| 06 | Striped Lighthouse | 详细 | 27 | 66 | 1,082 | 35 | 2,908 |
| 07 | Recursive Bonsai | 详细 | 21 | 51 | 805 | 237 | 5,384 |
| 08 | Tin Toy Robot | 详细 | 29 | 78 | 1,208 | 30 | 2,780 |
| 09 | Spiral Staircase | 详细 | 24 | 53 | 702 | 43 | 5,216 |
| 10 | Hot Air Balloon | 详细 | 28 | 61 | 990 | 16 | 4,772 |

### 代码总结

#### 01 · Articulated Desk Lamp
> An articulated desk lamp with a weighted round base, two arm segments joined by hinges, and a cone shade with a glowing bulb.

两段臂由嵌套 Group 做铰链层级（改 rotation.z 即可摆姿势），开口 ConeGeometry 灯罩 + 自发光灯泡 + PointLight。

`64 行 · 772 tok · 8 mesh · 1,368 三角面 · 4 材质`

#### 02 · Scandinavian Wooden Chair
> A simple Scandinavian wooden dining chair with four tapered legs, a slatted backrest, and a light oak finish.

纯 Box/Cylinder 拼装；腿用上下半径不同的圆柱实现锥形，后腿加长兼做靠背立柱，5 根板条靠背。

`48 行 · 677 tok · 13 mesh · 300 三角面 · 2 材质`

#### 03 · Ceramic Coffee Mug
> A glazed ceramic coffee mug with a curved handle, a thick rim, and dark coffee inside.

杯身用一条 LatheGeometry 轮廓一次性做出外壁、厚杯沿、内壁和杯底；把手是半个 Torus 压扁。

`34 行 · 500 tok · 3 mesh · 2,608 三角面 · 2 材质`

#### 04 · Potted Succulent
> A small terracotta pot holding an echeveria succulent with rosette leaves arranged in a golden-angle spiral.

34 片叶子按黄金角(137.5°)螺旋排布，由内到外尺寸变大、倾角变平、颜色渐变——程序化植物的典型写法。

`42 行 · 613 tok · 37 mesh · 12,320 三角面 · 36 材质`

#### 05 · Retro Rocket
> A 1950s retro rocket ship with a pointed nose cone, porthole window, three swept fins, and a flame exhaust.

机身用正弦函数生成 Lathe 轮廓；尾翼是 Shape + ExtrudeGeometry，绕 Y 轴 120° 复制三次；火焰为自发光圆锥。

`61 行 · 885 tok · 9 mesh · 3,380 三角面 · 4 材质`

#### 06 · Striped Lighthouse
> A red-and-white striped lighthouse on a rocky base, with a gallery railing and a glowing lantern room.

塔身 6 段红白交替锥台；底座是顶点随机扰动的 Icosahedron 石块（带种子 RNG，可复现）；灯室自发光 + 点光源。

`66 行 · 1082 tok · 35 mesh · 2,908 三角面 · 5 材质`

#### 07 · Recursive Bonsai
> A bonsai tree in a shallow rectangular tray, with a recursively branching trunk and clustered foliage pads.

递归 branch() 4 层分叉，每段圆柱用 quaternion 对齐方向；末端生成扁平低多边形叶簇。237 个 mesh，是本批最“碎”的。

`51 行 · 805 tok · 237 mesh · 5,384 三角面 · 4 材质`

#### 08 · Tin Toy Robot
> A boxy tin toy robot with antenna, glowing eyes, chest dial panel, jointed arms with claw hands, and wind-up key.

box() 小工具函数批量放置方块；手臂为 肩→肘 两级 Group 关节，可动画。第 2 批起渲染加了环境光照，金属不再发黑。

`78 行 · 1208 tok · 30 mesh · 2,780 三角面 · 4 材质`

#### 09 · Spiral Staircase
> A cast-iron spiral staircase with 20 wedge-shaped treads around a central pole and a helical handrail.

扇形 Shape 挤出成踏板，20 级每级转 22.5°；扶手用 CatmullRomCurve3 穿过栏杆顶点，再 TubeGeometry 成管。

`53 行 · 702 tok · 43 mesh · 5,216 三角面 · 2 材质`

#### 10 · Hot Air Balloon
> A hot air balloon with a teardrop envelope in alternating colored gores, suspension ropes, a burner, and a wicker basket.

泪滴形分段函数做 Lathe 轮廓，用 phiStart/phiLength 切成 12 片交替配色的“气囊瓣”；绳索用 Line。

`61 行 · 990 tok · 16 mesh · 4,772 三角面 · 16 材质`

## 第 2 批（11-20）

### 会话 token 账本

| 阶段 | tokens |
|---|---|
| Turn start (new instructions) | 691 |
| Generate 11-15 | 9,149 |
| Generate 16-20 | 9,881 |
| Render / visual check / fix #20 lid + add environment lighting | 5,676 |
| Summaries + reusable packaging script + upload 20 renders | 16,778 |
| Canvas layout (overview + batch boards) | 8,169 |

### 逐物体

| # | 物体 | 详细程度 | Prompt tok | 代码行 | 代码 tok | Mesh | 三角面 |
|---|---|---|---|---|---|---|---|
| 11 | Vintage Tube Radio | 详细 | 32 | 60 | 998 | 19 | 1,917 |
| 12 | Dutch Windmill | 详细 | 29 | 72 | 1,099 | 63 | 868 |
| 13 | Wooden Sloop | 详细 | 29 | 76 | 1,320 | 6 | 1,434 |
| 14 | Acoustic Guitar | 详细 | 37 | 84 | 1,265 | 30 | 1,892 |
| 15 | Cast-Iron Park Bench | 详细 | 27 | 57 | 1,010 | 18 | 5,624 |
| 16 | Mushroom Cluster | 详细 | 25 | 54 | 1,028 | 71 | 8,300 |
| 17 | Castle Tower | 详细 | 30 | 69 | 1,168 | 25 | 1,704 |
| 18 | Antique Hourglass | 详细 | 25 | 69 | 1,083 | 11 | 10,776 |
| 19 | Comms Satellite | 详细 | 29 | 76 | 1,376 | 55 | 2,780 |
| 20 | Treasure Chest | 详细 | 34 | 76 | 1,443 | 194 | 12,168 |

### 代码总结

#### 11 · Vintage Tube Radio
> A 1940s tabletop tube radio with a rounded-top walnut cabinet, a fabric speaker grille, a glowing tuning dial, and two knobs.

拱顶机壳 = 矩形+半圆 Shape 带倒角挤出；布面格栅用同形 ShapeGeometry，铜条高度按圆方程裁到拱内；表盘自发光。

`60 行 · 998 tok · 19 mesh · 1,917 三角面 · 5 材质`

#### 12 · Dutch Windmill
> A Dutch windmill with an octagonal tapered tower, a thatched cap, four lattice sails, and a wraparound balcony.

八角锥台塔身（CylinderGeometry 8 段 + flatShading）；四片风帆各是一个旋转 Group，内含主杆、8 根横档和半透明帆布。

`72 行 · 1099 tok · 63 mesh · 868 三角面 · 5 材质`

#### 13 · Wooden Sloop
> A small wooden sloop sailboat with a curved hull, a single mast, a triangular mainsail and jib, and a boom.

船体手写参数曲面：沿长度 u 取正弦船宽、沿截面 v 取半圆，直接拼 BufferGeometry 索引；甲板复用同一轮廓函数。

`76 行 · 1320 tok · 6 mesh · 1,434 三角面 · 4 材质`

#### 14 · Acoustic Guitar
> An acoustic guitar with a figure-eight spruce body, a sound hole with rosette, a long fretted neck, a headstock with tuning pegs, and six strings.

琴身由两个高斯叠加出“8”字轮廓，Shape.holes 挖音孔；品丝按十二平均律 2^(-n/12) 排布，这一处用了真实乐理。

`84 行 · 1265 tok · 30 mesh · 1,892 三角面 · 4 材质`

#### 15 · Cast-Iron Park Bench
> A classic park bench with cast-iron scrolled side frames, wooden slat seat and curved backrest, and armrests.

侧架全部是 CatmullRomCurve3 + TubeGeometry 扫掠，扶手末端用递减半径参数化出涡卷；靠背板条沿曲线摆放。

`57 行 · 1010 tok · 18 mesh · 5,624 三角面 · 2 材质`

#### 16 · Mushroom Cluster
> A cluster of five fly-agaric mushrooms of different sizes growing from a mossy log, red caps with white spots.

5 朵蘑菇共用一个 mushroom(scale) 函数：Lathe 菌柄 + 截半球菌盖 + 球面坐标随机白点；苔藓为压扁的低多边形球。

`54 行 · 1028 tok · 71 mesh · 8,300 三角面 · 5 材质`

#### 17 · Castle Tower
> A medieval stone castle tower with crenellated battlements, arrow-slit windows, a wooden door, and a flag on a pole.

12 个城垛绕圈摆放并朝外旋转；箭窗沿塔身螺旋上升；拱门用 Shape 挤出；旗面对 PlaneGeometry 顶点做正弦位移。

`69 行 · 1168 tok · 25 mesh · 1,704 三角面 · 5 材质`

#### 18 · Antique Hourglass
> An antique hourglass with a turned wooden frame, three spindle posts, a glass double bulb, and sand mid-flow.

一个 bulbR(y) 函数同时驱动玻璃、底部沙堆（Lathe）的形状；物理透射玻璃材质；三根车削柱用 |sin| 生成串珠轮廓。

`69 行 · 1083 tok · 11 mesh · 10,776 三角面 · 3 材质`

#### 19 · Comms Satellite
> A communications satellite with a gold-foil bus, two deployable solar panel wings, a parabolic dish antenna, and thruster nozzles.

细分 Box 顶点微扰模拟金箔褶皱；抛物面天线直接用 y=r²/4f 做 Lathe，馈源放在焦点并用 quaternion 对齐支杆。

`76 行 · 1376 tok · 55 mesh · 2,780 三角面 · 5 材质`

#### 20 · Treasure Chest
> A pirate treasure chest with a half-cylinder lid propped open, iron bands and rivets, a padlock hasp, and gold coins spilling out.

箱体 5 块板拼成；半圆柱箱盖挂在后缘铰链 Group 上张开约 110°；170 枚金币共用一个几何体，按抛物面堆起再洒一地。首次渲染箱盖浮空（半圆柱取错半边），已修复。

`76 行 · 1443 tok · 194 mesh · 12,168 三角面 · 7 材质`

## 第 3 批（21-30）

### 会话 token 账本

| 阶段 | tokens |
|---|---|
| Turn start (request for 30 objects) | 2,358 |
| Generate 21-25 | 10,268 |
| Generate 26-30 | 9,875 |

### 逐物体

| # | 物体 | 详细程度 | Prompt tok | 代码行 | 代码 tok | Mesh | 三角面 |
|---|---|---|---|---|---|---|---|
| 21 | City Bicycle | 详细 | 27 | 72 | 1,395 | 70 | 5,788 |
| 22 | Grand Piano | 详细 | 32 | 83 | 1,380 | 103 | 1,780 |
| 23 | Porcelain Teapot | 详细 | 32 | 69 | 1,251 | 9 | 8,536 |
| 24 | Rangefinder Camera | 详细 | 33 | 82 | 1,293 | 53 | 2,904 |
| 25 | Retro Desk Fan | 详细 | 30 | 83 | 1,299 | 63 | 8,036 |
| 26 | Wine Bottle & Glass | 详细 | 22 | 49 | 1,212 | 7 | 6,640 |
| 27 | Anvil on Stump | 详细 | 40 | 72 | 1,258 | 11 | 1,808 |
| 28 | Fire Hydrant | 详细 | 41 | 61 | 1,073 | 32 | 3,304 |
| 29 | Open Umbrella | 详细 | 34 | 73 | 1,354 | 36 | 3,520 |
| 30 | Five-Tier Pagoda | 详细 | 36 | 73 | 1,122 | 107 | 7,796 |

### 代码总结

#### 21 · City Bicycle
> A classic city bicycle with spoked wheels, a diamond steel frame, a leather saddle, curved handlebars, and a front basket.

辐条用 24 根细圆柱按角度排布并前后交错；车架用 tube(a,b) 工具在任意两点间放圆柱（quaternion 对齐），车把是 CatmullRom 扫掠管；车筐直接用 wireframe 材质表现编织。

`72 行 · 1395 tok · 70 mesh · 5,788 三角面 · 5 材质`

#### 22 · Grand Piano
> A glossy black grand piano with a curved case, a propped-open lid, 52 white and 36 black keys, three legs, and pedals.

琴身俯视轮廓用两段贝塞尔曲线画出弯曲侧板再挤出；52 白键按 A–G 模式判断是否插黑键（共 36 个）。首次渲染琴盖向下转进琴身（旋转方向反了），已修复。

`83 行 · 1380 tok · 103 mesh · 1,780 三角面 · 4 材质`

#### 23 · Porcelain Teapot
> A round porcelain teapot with blue bands, a curved spout, a loop handle, and a lid with a knob, on a saucer.

壶身 Lathe 用半圆参数方程生成扁球；壶嘴是 TubeGeometry 后逐环缩放顶点实现渐细——TubeGeometry 本身不支持变半径，这是常用补丁写法。

`69 行 · 1251 tok · 9 mesh · 8,536 三角面 · 2 材质`

#### 24 · Rangefinder Camera
> A vintage 35mm rangefinder film camera with a leatherette body, chrome top plate, a lens barrel with focus ring, dials, and a shutter button.

机身是“圆角矩形”Shape 挤出三层（底板/皮革/顶盖）；镜头为一串同轴圆柱，对焦环用 36 个小方块绕圈做滚花。

`82 行 · 1293 tok · 53 mesh · 2,904 三角面 · 4 材质`

#### 25 · Retro Desk Fan
> A retro oscillating desk fan with a round wire cage, four curved blades, a motor housing, a tilting neck, and a heavy base.

扇叶先用贝塞尔 Shape 画平面，再按 x 坐标绕径向轴扭转顶点得到螺旋桨扭角；护罩前后各 24 根辐条沿余弦弧线弯成球冠。

`83 行 · 1299 tok · 63 mesh · 8,036 三角面 · 3 材质`

#### 26 · Wine Bottle & Glass
> A dark green wine bottle with a cork and label beside a stemmed wine glass half-filled with red wine.

酒瓶、酒杯都是 Lathe；杯壁用“外轮廓 + 反向内轮廓”一条曲线做出厚度，红酒是同一 bowl(y) 函数截到 45% 高度；标签是开口圆柱段。

`49 行 · 1212 tok · 7 mesh · 6,640 三角面 · 7 材质`

#### 27 · Anvil on Stump
> A blacksmith's anvil with a tapered horn, a flat face with a hardy hole, a waisted body, mounted on a tree-stump block with a hammer resting on it.

铁砧侧面轮廓（砧角、砧面、腰部）一条 Shape 带倒角挤出；树桩顶点按 sin(5a)+sin(11a) 扰动成不规则截面，顶面叠年轮环。

`72 行 · 1258 tok · 11 mesh · 1,808 三角面 · 6 材质`

#### 28 · Fire Hydrant
> A red cast-iron fire hydrant with a domed bonnet, a pentagonal operating nut, two side hose outlets with chained caps, and a flanged base bolted to the sidewalk.

消防栓主体一条 Lathe 从法兰画到圆顶；五角操作螺母就是 5 段 CylinderGeometry；三个出水口共用 outlet() 函数，链条是交替旋转 90° 的小环。

`61 行 · 1073 tok · 32 mesh · 3,304 三角面 · 4 材质`

#### 29 · Open Umbrella
> An open umbrella with an eight-panel canopy in alternating colors, visible ribs, a finial tip, and a curved wooden J-handle, tilted as if held.

8 片伞面各自手写 BufferGeometry：高度函数下凹 + 片内 sin 下垂模拟布料绷在伞骨间；伞骨沿同一高度函数扫管，J 形伞柄用分段参数曲线。

`73 行 · 1354 tok · 36 mesh · 3,520 三角面 · 10 材质`

#### 30 · Five-Tier Pagoda
> A five-tiered East Asian pagoda on a stone plinth, each tier with red columns and upturned curved eaves, topped by a bronze spire with rings.

5 层逐层缩小 0.84 倍；飞檐是细分平面按“金字塔坡度 + 四角 |xz|² 上翘”位移，一个函数得到翘角屋檐；顶部相轮 9 环。

`73 行 · 1122 tok · 107 mesh · 7,796 三角面 · 5 材质`

## 第 4 批（31-40）

### 会话 token 账本

| 阶段 | tokens |
|---|---|
| Generate 31-35 | 11,156 |
| Generate 36-40 | 11,091 |

### 逐物体

| # | 物体 | 详细程度 | Prompt tok | 代码行 | 代码 tok | Mesh | 三角面 |
|---|---|---|---|---|---|---|---|
| 31 | Steam Locomotive | 详细 | 35 | 101 | 1,623 | 32 | 3,440 |
| 32 | Desk Globe | 详细 | 27 | 62 | 1,245 | 9 | 16,832 |
| 33 | Filled Bookshelf | 详细 | 30 | 68 | 1,332 | 138 | 1,780 |
| 34 | Silver Candelabra | 详细 | 33 | 64 | 1,316 | 29 | 8,960 |
| 35 | Birdhouse | 详细 | 37 | 85 | 1,393 | 70 | 1,776 |
| 36 | Snowman | 详细 | 40 | 94 | 1,712 | 41 | 9,860 |
| 37 | Brass Telescope | 详细 | 35 | 83 | 1,344 | 22 | 1,600 |
| 38 | Oak Barrel | 详细 | 34 | 73 | 1,300 | 36 | 3,936 |
| 39 | Wind Chime | 详细 | 28 | 56 | 1,003 | 10 | 924 |
| 40 | Hurricane Lantern | 详细 | 36 | 72 | 1,421 | 26 | 6,448 |

### 代码总结

#### 31 · Steam Locomotive
> A toy-scale steam locomotive with a cylindrical boiler, smokestack, steam dome, cab with windows, cowcatcher, and six red driving wheels linked by coupling rods.

锅炉、烟箱、烟囱（喇叭形 Lathe）沿 x 轴排列；排障器是三角形挤出；两侧各 3 个动轮 + 连杆，底下两根铁轨。

`101 行 · 1623 tok · 32 mesh · 3,440 三角面 · 5 材质`

#### 32 · Desk Globe
> A desk globe tilted at 23.5 degrees on a brass meridian ring and a turned wooden stand, with procedurally generated continents.

球面每个顶点用几个低频正弦叠加算“地形值”，超过阈值涂陆地色、极区涂白，直接写 vertexColors——无贴图的程序化地球；整体按 23.5° 倾斜。

`62 行 · 1245 tok · 9 mesh · 16,832 三角面 · 6 材质`

#### 33 · Filled Bookshelf
> A wooden bookshelf with four shelves filled with books of varied heights, thicknesses and colors, some leaning, plus a small plant on top.

书按“从左往右塞满”循环生成，宽高深随机，约 8% 概率斜靠（绕底角旋转并计算占位宽度）；126 个材质是每本书独立颜色，可合并优化。

`68 行 · 1332 tok · 138 mesh · 1,780 三角面 · 126 材质`

#### 34 · Silver Candelabra
> An ornate silver five-arm candelabra with S-curved arms, drip cups, lit white candles with flames, and a turned base.

四条烛臂是 S 形 CatmullRom 扫管，两高两低；滴蜡盘、火焰都是 Lathe（火焰用 sin(π·t^0.6) 得到水滴形），自带点光源。

`64 行 · 1316 tok · 29 mesh · 8,960 三角面 · 8 材质`

#### 35 · Birdhouse
> A painted wooden birdhouse on a post, with a pitched shingled roof, a round entrance hole, a perch dowel, and a small bird sitting on the roof.

五边形墙面 Shape 带圆形 holes 直接挖出门洞；屋顶两坡各 5 排错位瓦片；屋脊上一只由球体和圆锥拼成的小鸟。

`85 行 · 1393 tok · 70 mesh · 1,776 三角面 · 7 材质`

#### 36 · Snowman
> A three-ball snowman with a carrot nose, coal eyes and buttons, stick arms, a knitted striped scarf, and a black top hat, standing on a snowy mound.

雪球对球面顶点加低频噪声显得“手捏”；嘴巴 7 颗煤块按球面坐标排成弧线；围巾是 12 段交替颜色的圆环片段。

`94 行 · 1712 tok · 41 mesh · 9,860 三角面 · 23 材质`

#### 37 · Brass Telescope
> A brass refracting telescope on a wooden tripod with an altitude mount, a finder scope, an eyepiece, and a dew shield, pointed at the sky.

三脚架腿按 120° 从脚点到顶点用 quaternion 摆放；镜筒放进一个倾斜 Group，逐段 seg() 堆出遮光罩、镜筒、目镜；寻星镜挂在支架上。

`83 行 · 1344 tok · 22 mesh · 1,600 三角面 · 4 材质`

#### 38 · Oak Barrel
> An oak wine barrel built from individual bulging staves held by four iron hoops, with a round head and a bung hole, lying on a wooden cradle.

22 块桶板各是 LatheGeometry 的一个角度切片（phiStart/phiLength），留缝并随机明暗；桶身半径用抛物线鼓起，铁箍半径按所在高度取值。

`73 行 · 1300 tok · 36 mesh · 3,936 三角面 · 32 材质`

#### 39 · Wind Chime
> A hanging wind chime with a round wooden top disk, six aluminum tubes of graded lengths on strings, a central striker, and a sail.

6 根管长按 base/√频率比（1, 9/8, 5/4, 3/2, 5/3, 2）计算——用了真实声学关系；绳子用 Line，中央击锤和风帆挂在同一根线上。

`56 行 · 1003 tok · 10 mesh · 924 三角面 · 2 材质`

#### 40 · Hurricane Lantern
> A hurricane oil lantern with a red-painted fuel tank, a glass globe with a glowing flame, a wire guard, a vented cap, and a bail handle.

油箱、灯罩、火焰都是 Lathe；护丝沿灯罩轮廓外扩后扫管；两侧弯管模拟防风灯的进气框架，自带点光源。

`72 行 · 1421 tok · 26 mesh · 6,448 三角面 · 12 材质`

## 第 5 批（41-50）

### 会话 token 账本

| 阶段 | tokens |
|---|---|
| Generate 41-45 | 11,504 |
| Generate 46-50 | 12,506 |
| Render 21-50 / visual check / fix #22 lid + #43 arm (all 3 batches) | 7,787 |
| Summaries + observations + upload 30 renders (all 3 batches) | 15,369 |
| Canvas + packaging (all 3 batches) | 7,506 |

### 逐物体

| # | 物体 | 详细程度 | Prompt tok | 代码行 | 代码 tok | Mesh | 三角面 |
|---|---|---|---|---|---|---|---|
| 41 | Office Swivel Chair | 详细 | 39 | 85 | 1,595 | 29 | 1,976 |
| 42 | Knight's Great Helm | 详细 | 36 | 76 | 1,298 | 35 | 2,244 |
| 43 | Compound Microscope | 详细 | 44 | 99 | 1,737 | 25 | 1,700 |
| 44 | Frosted Cupcake | 详细 | 30 | 75 | 1,326 | 96 | 19,260 |
| 45 | Traffic Cones & Barrier | 详细 | 31 | 73 | 1,185 | 28 | 872 |
| 46 | Staunton Chess Pieces | 详细 | 40 | 79 | 1,576 | 45 | 9,684 |
| 47 | Garden Wheelbarrow | 详细 | 36 | 79 | 1,608 | 14 | 3,742 |
| 48 | Glowing Jellyfish | 详细 | 28 | 79 | 1,401 | 25 | 22,144 |
| 49 | Grandfather Clock | 详细 | 43 | 92 | 1,760 | 89 | 3,208 |
| 50 | Ferris Wheel | 详细 | 39 | 95 | 1,650 | 264 | 20,876 |

### 代码总结

#### 41 · Office Swivel Chair
> An ergonomic office swivel chair with a five-star base on casters, a gas-lift column, a padded seat, a curved mesh backrest, and armrests.

五星脚用 5 个旋转 Group 复用同一组件；座垫是圆角矩形带倒角挤出；靠背用开口圆柱段做弧面网布。

`85 行 · 1595 tok · 29 mesh · 1,976 三角面 · 5 材质`

#### 42 · Knight's Great Helm
> A medieval knight's great helm on a display stand: a steel bucket helmet with a riveted cross reinforcement, eye slits, breathing holes, and a red plume.

头盔为平顶 Lathe 并在 z 方向拉伸 1.08 成椭圆截面；十字加强筋 + 铆钉、眼缝和 4×3 呼吸孔都按圆柱面坐标贴在盔面上；羽饰是拉长的低多边形球扇形排列。

`76 行 · 1298 tok · 35 mesh · 2,244 三角面 · 6 材质`

#### 43 · Compound Microscope
> A laboratory compound microscope with a curved arm, an angled eyepiece tube, a rotating nosepiece with three objectives, a mechanical stage with slide clips, coarse and fine focus knobs, and a base lamp.

C 形镜臂为曲线 Shape 挤出；三个物镜长度递增并配彩色倍率环；首次渲染镜头与镜臂脱节，补了连接件后修复。

`99 行 · 1737 tok · 25 mesh · 1,700 三角面 · 8 材质`

#### 44 · Frosted Cupcake
> A cupcake in a pleated paper liner topped with a swirled pink frosting spiral, rainbow sprinkles, and a cherry with a stem.

纸杯先做 Lathe 再按 cos(36a) 调制半径得到褶皱；奶油是锥形螺旋扫管并逐环缩放成尖顶；90 颗糖针用同一 Capsule 几何体贴在螺旋表面。

`75 行 · 1326 tok · 96 mesh · 19,260 三角面 · 95 材质`

#### 45 · Traffic Cones & Barrier
> Three orange traffic cones with white reflective bands on square black bases, one knocked over, next to a striped road barrier on A-frame legs.

锥桶用 cone() 函数复用 3 次（一个倒地）；反光带是与锥面同斜率的短锥台；路障由 8 段红白方块拼成条纹。

`73 行 · 1185 tok · 28 mesh · 872 三角面 · 11 材质`

#### 46 · Staunton Chess Pieces
> A corner of a wooden chessboard with a Staunton-style king, queen, rook, bishop, and pawn in ivory and ebony, all turned on a lathe.

5 种棋子共用底座轮廓，只在上半段各自接不同 Lathe 轮廓，再按种类加城垛、主教切口、后冠珠、王冠十字——一个 piece(kind) 函数生成全部。

`79 行 · 1576 tok · 45 mesh · 9,684 三角面 · 18 材质`

#### 47 · Garden Wheelbarrow
> A garden wheelbarrow with a deep green steel tray, a single pneumatic front wheel, tubular handles with rubber grips, rear legs, and a load of soil.

车斗是手写 BufferGeometry 的“小底矩形→大口矩形”放样；土堆为压扁并扰动的半球；把手从轮轴经车斗下方延伸出去的扫管。

`79 行 · 1608 tok · 14 mesh · 3,742 三角面 · 5 材质`

#### 48 · Glowing Jellyfish
> A translucent glowing jellyfish with a scalloped bell, frilly oral arms, and long trailing tentacles that wave in sine curves.

伞膜 Lathe 后按 cos(16a) 做荷叶边；口腕是螺旋扫管并用 sin 调制半径成皱褶；16 根触手按相位不同的正弦波下垂，自发光 + 半透明。

`79 行 · 1401 tok · 25 mesh · 22,144 三角面 · 3 材质`

#### 49 · Grandfather Clock
> A tall mahogany grandfather clock with an arched hood, a clock face with Roman-numeral ticks and hands, a glass-front trunk showing a brass pendulum and weights, and a plinth base.

拱形钟帽为矩形+半圆 Shape 挤出；表盘 60 个刻度（整点加粗）按角度排布，时针分针指向 10:10；玻璃门后可见摆锤与三只重锤。

`92 行 · 1760 tok · 89 mesh · 3,208 三角面 · 5 材质`

#### 50 · Ferris Wheel
> A carnival Ferris wheel with a double-rim spoked wheel, twelve colorful gondolas hanging level, an A-frame support tower, and light bulbs along the rim.

双轮圈 + 24 根辐条 + 12 根横梁；144 个灯泡共用一个几何体；12 个吊厢加在 root 而非轮子上，保证始终保持水平。264 个 mesh，本批最复杂。

`95 行 · 1650 tok · 264 mesh · 20,876 三角面 · 16 材质`

## 第 6 批（51-60）

### 会话 token 账本

| 阶段 | tokens |
|---|---|
| Generate 51-55 (incl. turn start + planning 50 prompts) | 5,651 |
| Generate 56-60 | 10,956 |
| Render / check 51-60 (+ partial-render option) | 1,792 |

### 逐物体

| # | 物体 | 详细程度 | Prompt tok | 代码行 | 代码 tok | Mesh | 三角面 |
|---|---|---|---|---|---|---|---|
| 51 | Apple | 简单 | 4 | 27 | 492 | 3 | 3,272 |
| 52 | Iced Donut | 简单 | 11 | 37 | 676 | 72 | 14,472 |
| 53 | Mid-Century Coffee Table | 中等 | 19 | 29 | 563 | 10 | 1,664 |
| 54 | Rubber Duck | 简单 | 4 | 33 | 527 | 7 | 4,200 |
| 55 | Pencil | 简单 | 4 | 25 | 474 | 5 | 252 |
| 56 | Twin-Bell Alarm Clock | 中等 | 17 | 54 | 993 | 26 | 3,156 |
| 57 | Potted Saguaro | 中等 | 23 | 50 | 815 | 183 | 11,776 |
| 58 | Open Laptop | 中等 | 15 | 47 | 905 | 76 | 906 |
| 59 | Electric Guitar | 详细 | 59 | 111 | 2,203 | 67 | 4,150 |
| 60 | Space Shuttle Stack | 详细 | 48 | 104 | 1,869 | 25 | 5,546 |

### 代码总结

#### 51 · Apple
> A red apple.

一条 Lathe 轮廓 + 两端凹窝，加茎和一片压扁球做叶子。只有 3 个 mesh。

`27 行 · 492 tok · 3 mesh · 3,272 三角面 · 3 材质`

#### 52 · Iced Donut
> A donut with pink icing and sprinkles.

面团是压扁 Torus；糖霜是略大的 Torus，把下半部顶点“压平”到一条 sin(9a) 波浪线上，得到滴落边缘；70 颗糖针。

`37 行 · 676 tok · 72 mesh · 14,472 三角面 · 72 材质`

#### 53 · Mid-Century Coffee Table
> A mid-century modern coffee table with a walnut oval top and splayed legs.

椭圆桌面 = 圆柱按 1.4×0.75 缩放；四条锥形腿从桌下向外斜撑（两点间放圆柱），腿脚套铜帽。

`29 行 · 563 tok · 10 mesh · 1,664 三角面 · 5 材质`

#### 54 · Rubber Duck
> A rubber duck.

全部由缩放球体拼成：身体、头、喙、翅膀，尾巴是圆锥。简单 prompt 下模型选择了最经典的卡通造型。

`33 行 · 527 tok · 7 mesh · 4,200 三角面 · 4 材质`

#### 55 · Pencil
> A yellow pencil.

6 边圆柱天然就是六角铅笔杆；削尖的木头和笔芯是两个圆锥，另一端金属箍 + 橡皮。

`25 行 · 474 tok · 5 mesh · 252 三角面 · 5 材质`

#### 56 · Twin-Bell Alarm Clock
> A classic twin-bell alarm clock with a hammer between the bells and little feet.

表盘 12 个刻度 + 时分针；两只铃铛是半球并向外倾斜，中间小锤；弧形提手是半个 Torus。

`54 行 · 993 tok · 26 mesh · 3,156 三角面 · 4 材质`

#### 57 · Potted Saguaro
> A saguaro cactus with two arms in a clay pot, with ribbed stems and spines.

ribbed(r,h) 函数：胶囊体按 cos(8a) 调制半径得到棱，再在每条棱脊上排刺；主干和两条手臂都复用它。

`50 行 · 815 tok · 183 mesh · 11,776 三角面 · 4 材质`

#### 58 · Open Laptop
> An open laptop with a keyboard, trackpad, and a glowing screen.

键盘 5×14 键共用一个几何体；屏幕用 vertexColors 做渐变壁纸；屏幕盖挂在后缘铰链 Group 上张开。

`47 行 · 905 tok · 76 mesh · 906 三角面 · 5 材质`

#### 59 · Electric Guitar
> A sunburst electric guitar with an offset double-cutaway solid body, a white pickguard, three single-coil pickups, volume and tone knobs, a whammy bar, a maple neck with dot inlays, and a six-in-line headstock.

琴身双切角轮廓用 6 段贝塞尔画出；日落色用顶点到中心距离插值 vertexColors；品丝按十二平均律，3/5/7/9/12(双点)/15/17/19 品有指板点。

`111 行 · 2203 tok · 67 mesh · 4,150 三角面 · 13 材质`

#### 60 · Space Shuttle Stack
> A space shuttle orbiter stacked for launch: the white orbiter with black heat-shield underside and delta wings, mounted on a large orange external fuel tank flanked by two white solid rocket boosters, standing on a launch platform.

外挂燃料箱是尖拱 Lathe，两侧助推器复用 srb()；轨道器机身 + 黑色隔热底 + 双三角翼 + 尾翼 + 3 个主发动机喷口。

`104 行 · 1869 tok · 25 mesh · 5,546 三角面 · 7 材质`

## 第 7 批（61-70）

### 会话 token 账本

| 阶段 | tokens |
|---|---|
| Generate 61-65 | 7,068 |
| Generate 66-70 | 11,021 |
| Render / check 61-70 | 986 |

### 逐物体

| # | 物体 | 详细程度 | Prompt tok | 代码行 | 代码 tok | Mesh | 三角面 |
|---|---|---|---|---|---|---|---|
| 61 | Tree | 简单 | 3 | 20 | 356 | 13 | 1,008 |
| 62 | Small House | 简单 | 4 | 34 | 589 | 8 | 92 |
| 63 | Skeleton Key | 简单 | 4 | 39 | 656 | 8 | 2,852 |
| 64 | Victorian Street Lamp | 中等 | 18 | 50 | 983 | 11 | 3,168 |
| 65 | Three-Seat Sofa | 中等 | 19 | 57 | 1,094 | 16 | 11,560 |
| 66 | Goldfish Bowl | 中等 | 18 | 50 | 1,151 | 70 | 7,982 |
| 67 | Viking Longship | 详细 | 56 | 113 | 2,130 | 70 | 5,988 |
| 68 | Drum Kit | 详细 | 68 | 123 | 2,118 | 84 | 7,748 |
| 69 | Rural Mailbox | 简单 | 3 | 29 | 502 | 4 | 236 |
| 70 | Skateboard | 中等 | 19 | 49 | 942 | 11 | 824 |

### 代码总结

#### 61 · Tree
> A tree.

最简 prompt：一根树干 + 12 个随机大小、随机绿色的低多边形球组成树冠。

`20 行 · 356 tok · 13 mesh · 1,008 三角面 · 13 材质`

#### 62 · Small House
> A small house.

方盒墙体 + 三角形挤出屋顶 + 烟囱、门、两扇窗和窗台。92 个三角面，全场最省之一。

`34 行 · 589 tok · 8 mesh · 92 三角面 · 6 材质`

#### 63 · Skeleton Key
> An old key.

模型把“old key”理解为骨架钥匙：环形握柄 + 三叶小环 + 杆 + 带缺口的钥匙齿（Shape 挤出）。

`39 行 · 656 tok · 8 mesh · 2,852 三角面 · 1 材质`

#### 64 · Victorian Street Lamp
> A Victorian cast-iron street lamp with a lantern head and a fluted post.

柱身用 cos(12a) 调制做出凹槽；灯头是 4 边锥台玻璃 + 铁框 + 四棱锥顶，自带点光源。

`50 行 · 983 tok · 11 mesh · 3,168 三角面 · 2 材质`

#### 65 · Three-Seat Sofa
> A three-seat fabric sofa with rounded arms, seat cushions, and throw pillows.

rbox() 圆角盒函数复用 10 次做底座、靠背、扶手和坐垫；两个抱枕是压扁球。

`57 行 · 1094 tok · 16 mesh · 11,560 三角面 · 4 材质`

#### 66 · Goldfish Bowl
> A round glass fishbowl with water, gravel, a plant, and a goldfish.

鱼缸是顶部开口、底部截平的球面 Lathe，水体复用同一轮廓截到 70%；60 颗碎石、5 条水草、1 条金鱼。

`50 行 · 1151 tok · 70 mesh · 7,982 三角面 · 70 材质`

#### 67 · Viking Longship
> A Viking longship with an overlapping clinker-built plank hull, a carved dragon-head prow and curled stern, a single mast with a red-and-white striped square sail, a row of painted round shields along each gunwale, and oars.

熟料搭接船壳：6 条船板各自手写 BufferGeometry，并留 15% 重叠；龙头船首 + 卷曲船尾；条纹帆用 vertexColors；两舷各 9 面盾牌和桨。

`113 行 · 2130 tok · 70 mesh · 5,988 三角面 · 41 材质`

#### 68 · Drum Kit
> A five-piece rock drum kit: a bass drum with a logo head and pedal, a snare on a stand, two rack toms mounted on the bass drum, a floor tom on legs, a hi-hat, and two cymbals on boom stands, all with sparkle-red wraps and chrome hoops.

drum(r,depth) 函数生成鼓身、双鼓皮、鼓圈和耳扣，复用 6 次；stand() 三脚支架和 cymbal() 镲片 Lathe 也都复用。

`123 行 · 2118 tok · 84 mesh · 7,748 三角面 · 6 材质`

#### 69 · Rural Mailbox
> A mailbox.

隧道形信箱 = 矩形 + 半圆 Shape 挤出，侧面红旗竖起。4 个 mesh。

`29 行 · 502 tok · 4 mesh · 236 三角面 · 3 材质`

#### 70 · Skateboard
> A skateboard with a concave deck, kicktails, trucks, and colorful wheels.

板面是圆角长条挤出后，按 x 做翘头、按 y 做凹面（顶点位移）；两组支架 + 4 个彩色轮子。

`49 行 · 942 tok · 11 mesh · 824 三角面 · 6 材质`

## 第 8 批（71-80）

### 会话 token 账本

| 阶段 | tokens |
|---|---|
| Generate 71-75 | 5,772 |
| Generate 76-80 | 10,519 |
| Render / check 71-80 | 982 |

### 逐物体

| # | 物体 | 详细程度 | Prompt tok | 代码行 | 代码 tok | Mesh | 三角面 |
|---|---|---|---|---|---|---|---|
| 71 | Gold Star | 简单 | 4 | 19 | 301 | 1 | 116 |
| 72 | Cut Gemstone | 简单 | 5 | 13 | 259 | 1 | 128 |
| 73 | Galvanized Bucket | 简单 | 4 | 26 | 390 | 6 | 2,904 |
| 74 | Retro Toaster | 中等 | 13 | 43 | 830 | 10 | 1,060 |
| 75 | Over-Ear Headphones | 中等 | 15 | 48 | 784 | 12 | 5,000 |
| 76 | Hydraulic Excavator | 详细 | 41 | 121 | 2,362 | 70 | 2,968 |
| 77 | Carousel | 详细 | 46 | 88 | 1,758 | 164 | 30,720 |
| 78 | Ice Cream Cone | 简单 | 5 | 34 | 587 | 3 | 4,096 |
| 79 | Picnic Table | 中等 | 14 | 53 | 856 | 16 | 1,764 |
| 80 | Trophy Cup | 中等 | 12 | 39 | 833 | 6 | 5,618 |

### 代码总结

#### 71 · Gold Star
> A gold star.

10 个点交替内外半径画出五角星 Shape，带倒角挤出。整个物体只有 1 个 mesh、116 个三角面。

`19 行 · 301 tok · 1 mesh · 116 三角面 · 1 材质`

#### 72 · Cut Gemstone
> A blue gemstone.

标准明亮式切割轮廓（台面、冠部、腰棱、亭部）用 16 段 Lathe，toNonIndexed + flatShading 得到刻面，ior=2.4。

`13 行 · 259 tok · 1 mesh · 128 三角面 · 1 材质`

#### 73 · Galvanized Bucket
> A metal bucket.

开口锥台桶身 + 底面 + 3 道加强筋 + 提梁。

`26 行 · 390 tok · 6 mesh · 2,904 三角面 · 1 材质`

#### 74 · Retro Toaster
> A retro chrome two-slice toaster with toast popping out.

机身侧面圆角轮廓挤出；两片吐司弹出槽口，上缘用半圆柱做面包边；侧面拉杆和旋钮。

`43 行 · 830 tok · 10 mesh · 1,060 三角面 · 6 材质`

#### 75 · Over-Ear Headphones
> Over-ear headphones with a padded headband and cushioned ear cups.

头梁是沿 z 拉长的半个 Torus；耳罩为椭圆圆柱 + 耳垫环 + 金色 logo；滑杆和叉臂两侧对称。

`48 行 · 784 tok · 12 mesh · 5,000 三角面 · 3 材质`

#### 76 · Hydraulic Excavator
> A yellow hydraulic excavator on steel crawler tracks, with a rotating cab with windows, a counterweight, and an articulated boom, stick, and toothed bucket driven by hydraulic cylinders, digging pose.

履带是“跑道形带孔 Shape”挤出 + 18 块履齿；上车体 → 动臂 → 斗杆 → 铲斗逐级嵌套 Group，液压缸用 cyl() 在两点间放缸筒 + 镀铬活塞杆。

`121 行 · 2362 tok · 70 mesh · 2,968 三角面 · 5 材质`

#### 77 · Carousel
> A fairground carousel with a striped conical canopy with scalloped valance, a central mirrored column, twisted brass poles, eight horses at alternating heights, a round wooden platform, and bulbs around the canopy edge.

16 片条纹锥面 + 花边垂帘 + 48 个灯泡；8 匹马由 horse() 生成、高低交错；螺旋铜杆是沿紧密螺旋线扫的管。3 万三角面，全场最重。

`88 行 · 1758 tok · 164 mesh · 30,720 三角面 · 53 材质`

#### 78 · Ice Cream Cone
> An ice cream cone.

蛋筒圆锥上用两组斜向 sin 计算 vertexColors 画出菱形格；两个冰淇淋球做了轻微噪声起伏。

`34 行 · 587 tok · 3 mesh · 4,096 三角面 · 3 材质`

#### 79 · Picnic Table
> A wooden picnic table with attached benches and a checkered tablecloth.

桌面 5 块板、两侧长凳，A 字腿斜撑；格子桌布是细分平面，边缘外的顶点向下折，模拟垂落。

`53 行 · 856 tok · 16 mesh · 1,764 三角面 · 2 材质`

#### 80 · Trophy Cup
> A gold trophy cup with two handles on a marble base.

大理石底座用 sin 叠加生成灰色纹理的 vertexColors；奖杯为一条 Lathe（底座、带节柄、杯身），两侧 S 形把手。

`39 行 · 833 tok · 6 mesh · 5,618 三角面 · 3 材质`

## 第 9 批（81-90）

### 会话 token 账本

| 阶段 | tokens |
|---|---|
| Generate 81-85 | 9,232 |
| Generate 86-90 | 8,724 |
| Render / check 81-90 | 985 |

### 逐物体

| # | 物体 | 详细程度 | Prompt tok | 代码行 | 代码 tok | Mesh | 三角面 |
|---|---|---|---|---|---|---|---|
| 81 | Puffy Cloud | 简单 | 3 | 19 | 335 | 8 | 8,640 |
| 82 | Mushroom House | 中等 | 19 | 52 | 1,041 | 19 | 6,040 |
| 83 | Vintage Biplane | 详细 | 61 | 118 | 2,295 | 83 | 4,498 |
| 84 | Ceramic Vase | 简单 | 4 | 21 | 400 | 1 | 5,248 |
| 85 | Watering Can | 中等 | 17 | 50 | 1,011 | 25 | 1,468 |
| 86 | Stone Arch Bridge | 详细 | 38 | 73 | 1,477 | 178 | 3,294 |
| 87 | Toy Blocks | 简单 | 4 | 31 | 716 | 36 | 912 |
| 88 | Antique Sewing Machine | 详细 | 50 | 91 | 1,875 | 24 | 3,644 |
| 89 | Bronze Bell | 简单 | 3 | 22 | 426 | 4 | 3,176 |
| 90 | Diamond Kite | 简单 | 4 | 36 | 688 | 10 | 76 |

### 代码总结

#### 81 · Puffy Cloud
> A cloud.

7 个大小不同的球 + 扁圆柱底座。1 种材质。

`19 行 · 335 tok · 8 mesh · 8,640 三角面 · 1 材质`

#### 82 · Mushroom House
> A fairy-tale mushroom house with a round door, windows, and a chimney.

蘑菇屋：鼓肚 Lathe 做菌柄，菌盖边缘内卷，白点用 lookAt 贴合表面；圆门、发光圆窗、烟囱。

`52 行 · 1041 tok · 19 mesh · 6,040 三角面 · 7 材质`

#### 83 · Vintage Biplane
> A 1930s biplane with fabric-covered upper and lower wings joined by struts and bracing wires, an open cockpit with a windscreen, a radial engine with a two-blade wooden propeller, a tail with rudder and elevators, and fixed landing gear with spoked wheels.

上下翼面 + 翼肋、翼间支柱和交叉张线、7 缸星形发动机、双叶木桨、尾翼、辐条起落架——按 prompt 列表逐项实现。

`118 行 · 2295 tok · 83 mesh · 4,498 三角面 · 34 材质`

#### 84 · Ceramic Vase
> A vase.

一条带正弦鼓肚的 Lathe，按高度渐变 vertexColors（青绿釉到米白口沿）。1 个 mesh。

`21 行 · 400 tok · 1 mesh · 5,248 三角面 · 1 材质`

#### 85 · Watering Can
> A green metal watering can with a long spout and a sprinkler rose.

壶身 Lathe 并在 z 方向压扁；长壶嘴是两点间锥筒；花洒面按同心圆排布小孔；提手横跨顶部。

`50 行 · 1011 tok · 25 mesh · 1,468 三角面 · 20 材质`

#### 86 · Stone Arch Bridge
> A medieval stone arch bridge with three semicircular arches of individual voussoir stones, cutwater piers, a paved deck, and low parapet walls, spanning a stream.

桥身 = 带 3 个半圆洞的 Shape 挤出；每个拱圈由楔形拱石逐块挤出；桥墩分水尖、铺路石、护墙和溪水。172 个材质（每块石头随机明暗），可合并优化。

`73 行 · 1477 tok · 178 mesh · 3,294 三角面 · 172 材质`

#### 87 · Toy Blocks
> Toy blocks.

倒角立方体 + 5 个面上的彩色方块“字母”，6 块积木随意堆叠。

`31 行 · 716 tok · 36 mesh · 912 三角面 · 12 材质`

#### 88 · Antique Sewing Machine
> An antique black cast-iron sewing machine with gold decals, a curved arm and head, a hand wheel, a needle bar and presser foot above a chrome bed plate, a thread spool on a pin, mounted on a wooden base.

机身侧面曲线轮廓（立柱→机臂→机头）一条 Shape 挤出；金色描花是正弦扫管；手轮、针杆、压脚、线轴和一条走线。

`91 行 · 1875 tok · 24 mesh · 3,644 三角面 · 5 材质`

#### 89 · Bronze Bell
> A bell.

经典钟形轮廓 Lathe + 口沿加厚环 + 顶部吊环 + 钟舌。

`22 行 · 426 tok · 4 mesh · 3,176 三角面 · 2 材质`

#### 90 · Diamond Kite
> A kite.

4 块三角帆面直接用 3 个点建 BufferGeometry；十字骨架；尾巴是波浪线加小蝴蝶结。76 个三角面。

`36 行 · 688 tok · 10 mesh · 76 三角面 · 10 材质`

## 第 10 批（91-100）

### 会话 token 账本

| 阶段 | tokens |
|---|---|
| Generate 91-95 | 9,490 |
| Generate 96-100 | 9,907 |
| Render / check / fix #91 shell + eyes, numeric sort fix | 3,287 |
| Summaries + detail-level analysis + upload 50 renders (batches 6-10) | 21,529 |
| Canvas + packaging (batches 6-10) | 10,974 |

### 逐物体

| # | 物体 | 详细程度 | Prompt tok | 代码行 | 代码 tok | Mesh | 三角面 |
|---|---|---|---|---|---|---|---|
| 91 | Garden Snail | 中等 | 13 | 51 | 982 | 8 | 5,568 |
| 92 | Robot Vacuum | 简单 | 4 | 28 | 542 | 7 | 644 |
| 93 | Rooftop Water Tower | 中等 | 20 | 70 | 1,258 | 65 | 4,148 |
| 94 | Manual Typewriter | 详细 | 57 | 85 | 1,680 | 200 | 13,774 |
| 95 | Igloo | 简单 | 4 | 40 | 796 | 83 | 1,288 |
| 96 | Camping Tent | 简单 | 4 | 35 | 689 | 6 | 103 |
| 97 | Yellow Submarine | 中等 | 18 | 59 | 1,038 | 24 | 6,704 |
| 98 | Oak Treehouse | 详细 | 61 | 90 | 2,018 | 91 | 4,118 |
| 99 | Pumpkin | 简单 | 3 | 26 | 418 | 2 | 5,016 |
| 100 | Gramophone | 详细 | 55 | 81 | 1,850 | 30 | 6,884 |

### 代码总结

#### 91 · Garden Snail
> A garden snail with a spiral shell and eye stalks.

壳 = 沿对数螺线扫管，逐环按 e^(-k·a) 缩小半径，条纹用 vertexColors。首次渲染壳悬空、眼睛脱离眼柄，已修复。

`51 行 · 982 tok · 8 mesh · 5,568 三角面 · 4 材质`

#### 92 · Robot Vacuum
> A robot vacuum.

扁圆柱机身 + 半圈缓冲条 + 激光雷达凸台 + 发光按钮 + 三叉边刷。

`28 行 · 542 tok · 7 mesh · 644 三角面 · 7 材质`

#### 93 · Rooftop Water Tower
> A rooftop wooden water tower on a steel stand with a conical roof and a ladder.

28 块木桶板 + 5 道铁箍 + 锥顶；钢架四腿交叉斜撑；侧面爬梯。

`70 行 · 1258 tok · 65 mesh · 4,148 三角面 · 31 材质`

#### 94 · Manual Typewriter
> A 1920s manual typewriter in black enamel: four staggered rows of round glass-topped keys with chrome rims, a semicircular basket of typebars, a platen roller with knobs and a sheet of paper, a carriage return lever, and gold lettering.

4 排交错圆键（玻璃键帽 + 镀铬圈 + 键杆），36 根字锤扇形排布；滚筒、两侧旋钮、微卷纸张和换行杆。200 个 mesh。

`85 行 · 1680 tok · 200 mesh · 13,774 三角面 · 7 材质`

#### 95 · Igloo
> An igloo.

雪砖按半球逐层排布并错缝（行间偏移半块），入口处跳过砖块；半圆柱隧道 + 深色门洞。

`40 行 · 796 tok · 83 mesh · 1,288 三角面 · 83 材质`

#### 96 · Camping Tent
> A camping tent.

三角形 Shape 带三角形 holes 挖出门洞后挤出；门帘翻起；两根拉绳和地钉。103 个三角面。

`35 行 · 689 tok · 6 mesh · 103 三角面 · 6 材质`

#### 97 · Yellow Submarine
> A yellow cartoon submarine with portholes, a periscope, and a propeller.

圆头尖尾的 Lathe 船身；指挥塔是拉扁胶囊；潜望镜弯管、两侧各 4 个舷窗、十字尾鳍、3 叶螺旋桨。

`59 行 · 1038 tok · 24 mesh · 6,704 三角面 · 10 材质`

#### 98 · Oak Treehouse
> A treehouse built into a large oak: a thick trunk with branching limbs and leafy canopy clusters, a plank platform with railings resting on the branches, a small cabin with a shingled roof and a window, a rope ladder hanging to the ground, and a tire swing on another branch.

树干 + 板根 + 6 条主枝（limb() 两点放圆柱）+ 枝头树冠团；平台、栏杆、带窗小木屋、瓦片屋顶、绳梯、轮胎秋千。

`90 行 · 2018 tok · 91 mesh · 4,118 三角面 · 42 材质`

#### 99 · Pumpkin
> A pumpkin.

球体按 |sin(5a)| 压出 10 条南瓜棱，两极向内收；六角茎。2 个 mesh。

`26 行 · 418 tok · 2 mesh · 5,016 三角面 · 2 材质`

#### 100 · Gramophone
> An antique gramophone: a square mahogany cabinet with a side winding crank, a turntable with a black shellac record showing grooves and a red label, a curved tonearm with a soundbox and needle, and a large flared brass horn.

唱片用同心 RingGeometry 画纹路 + 红色标签；唱臂和号筒颈是扫管；喇叭口是指数展开 Lathe，再按 cos(8a) 做出花瓣边。

`81 行 · 1850 tok · 30 mesh · 6,884 三角面 · 19 材质`

## 累计观察

- 全部只用 three.js 内置几何体（Box/Cylinder/Lathe/Extrude/Tube/Torus/Shape/Icosahedron/Capsule，外加手写 BufferGeometry：#13 船体、#29 伞面、#47 车斗、#67 船板、#90 风筝），零外部模型资源。
- prompt 详细程度决定成本：简单（2–5 词，如 "A pumpkin."）平均约 500 代码 tok、约 960 实测 tok；中等（一句话）约 950 / 1,700；详细（列出部件）约 1,970 / 3,280。详细 prompt 的成本约是简单的 3.4 倍，mesh 数约 6 倍。
- 简单 prompt 并不等于低质量：模型会自己补出“最典型”的形态（#54 小黄鸭、#63 骨架钥匙、#99 南瓜棱），但细节和部件数明显少。需要特定结构时，详细 prompt 更可控。
- 最省 token 的写法：一条 Lathe 轮廓（杯子、火箭、沙漏、茶壶、酒瓶、棋子、花瓶、钟、南瓜）；一个参数化函数复用多次（蘑菇、锥桶、鼓、仙人掌、沙发 rbox）；循环/递归（楼梯、盆景、书架、摩天轮、雪屋）。
- 代码量与视觉复杂度不成正比：#71 星星 1 个 mesh，#77 旋转木马 164 个 mesh / 3 万三角面；零件需要逐个摆放的物体（机器人、火车、打字机、挖掘机）最贵。
- 常用“补丁技巧”：TubeGeometry 不支持变半径，#23 壶嘴、#44 奶油、#48 口腕、#91 蜗牛壳都用逐环缩放顶点实现；#32 地球、#59 吉他日落色、#78 蛋筒网格、#80 大理石用 vertexColors 代替贴图。
- 用到真实物理/乐理的地方：#14、#59 品丝按十二平均律排布，#39 风铃管长 ∝ 1/√频率，#19 天线是真抛物面 y=r²/4f，#72 宝石 ior=2.4（钻石折射率）。
- 质量问题记录：#20 箱盖浮空、#22 琴盖转反、#43 镜臂脱节、#91 蜗牛壳悬空——100 个里 4 个靠渲染目检发现并修复，渲染检查不能省。
- 可优化：多数物体每个 mesh 新建几何体/材质（#86 石桥 172 个材质、#33 书架 126 个），可复用或改用 InstancedMesh。
