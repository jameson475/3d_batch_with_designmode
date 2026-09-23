import sys,glob
from PIL import Image
lo,hi=int(sys.argv[1]),int(sys.argv[2]); out=sys.argv[3]
fs=[f for f in sorted(glob.glob('out/renders/*.png')) if lo<=int(f.split('/')[-1][:2 if not f.split('/')[-1][:3].isdigit() else 3])<=hi]
W=240; cols=10; rows=(len(fs)+cols-1)//cols
s=Image.new('RGB',(W*cols,W*rows),(239,236,230))
for i,f in enumerate(fs): s.paste(Image.open(f).resize((W,W)),((i%cols)*W,(i//cols)*W))
s.save(out); print(len(fs))
