# Flags product/site photos with flat chroma-green backgrounds (edge pixels strongly green). Usage: python3 tools/green_scan.py
import os,sys,json,numpy as np
from PIL import Image
d='src/assets/'
res=[]
for sub in ['products','img']:
  for f in sorted(os.listdir(d+sub)):
    try: im=Image.open(d+sub+'/'+f).convert('RGB')
    except Exception as e: continue
    im.thumbnail((400,400)); a=np.asarray(im).astype(int)
    r,g,b=a[...,0],a[...,1],a[...,2]
    green=(g>100)&(g>r*1.35)&(g>b*1.35)
    h,w=green.shape; bw=max(3,int(min(h,w)*0.08))
    edge=np.concatenate([green[:bw].ravel(),green[-bw:].ravel(),green[:,:bw].ravel(),green[:,-bw:].ravel()])
    res.append((edge.mean(),green.mean(),sub+'/'+f))
res.sort(reverse=True)
for e,t,f in res[:40]: print(f"{e:.3f} {t:.3f} {f}")
