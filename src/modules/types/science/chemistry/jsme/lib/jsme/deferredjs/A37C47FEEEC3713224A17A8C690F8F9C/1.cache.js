$wnd.jsme.runAsyncCallback1('var hP="Any",iP="Aromatic",jP="Nonring",kP="Reset",lP="Ring";function mP(a,b){if(0>b||b>=a.pb.options.length)throw new Mu;}function nP(a,b){mP(a,b);return a.pb.options[b].value}function oP(){Ev();this.pb=$doc.createElement("select");this.pb[jd]="gwt-ListBox"}r(365,342,Hh,oP);function pP(){pP=s}\nfunction qP(a,b){if(null==b)throw new lr("Missing message: awt.103");var c=-1,d,e,f;f=a.nc.a.pb;e=$doc.createElement(zf);e.text=b;e.removeAttribute("bidiwrapped");e.value=b;d=f.options.length;(0>c||c>d)&&(c=d);c==d?f.add(e,null):(c=f.options[c],f.add(e,c))}function rP(){pP();Ux.call(this);new Hi;this.nc=new sP((Vx(),this))}r(431,418,{45:1,47:1,54:1,66:1,72:1},rP);_.ie=function(){return Zx(this.nc,this)};\n_.xe=function(){return(null==this.kc&&(this.kc=Gx(this)),this.kc)+ya+this.vc+ya+this.wc+ya+this.sc+$g+this.ic+(this.rc?l:",hidden")+",current="+nP(this.nc.a,this.nc.a.pb.selectedIndex)};function tP(){tL.call(this,7)}r(444,1,ni,tP);function uP(a){vL.call(this,a,0)}r(449,418,ri,uP);function vP(a){var b=a.j;UL(a.nc.c,b.a,b.b);!Ix(a)&&OK(a);JK(a)}\nfunction wP(a,b,c){RL.call(this);this.nc&&oL(this.nc.c,!1);lL(this,!1);hy(this,new tL(0));a=new vL(a,1);Z(this,a,null);a=new my;Z(a,this.i,null);Z(this,a,null);b&&(this.j=Jx(b),kL(this),QL(this.j,~~(cn(b._b.pb,wf)/2)-~~(this.sc/2),~~(cn(b._b.pb,vf)/2)-~~(this.ic/2)));c&&Y(this,c)}r(577,578,GH,wP);_.rg=function(){return"OK"};r(585,586,Ah);_.Sc=function(){vP(new wP(this.b,this.a,(fB(),hB)))};r(588,586,Ah);_.Sc=function(){!this.a.Jb?this.a.Jb=new xP(this.a):this.a.Jb.nc.c.hb?IM(this.a.Jb.nc.c):vP(this.a.Jb)};\nfunction yP(a,b){FK(b)==a.a?Y(b,(Iy(),Ry)):Y(b,a.a)}\nfunction zP(a){var b,c,d,e;e=l;d=!1;FK(AP)!=a.a?(e=va,d=!0):FK(BP)!=a.a?(e="!#6",d=!0):FK(CP)!=a.a?(Y(DP,(Iy(),Ry)),Y(EP,Ry),Y(FP,Ry),Y(GP,Ry),e="F,Cl,Br,I"):(b=FK(HP)!=a.a,c=FK(IP)!=a.a,FK(JP)!=a.a&&(b?e+="c,":c?e+="C,":e+="#6,"),FK(KP)!=a.a&&(b?e+="n,":c?e+="N,":e+="#7,"),FK(LP)!=a.a&&(b?e+="o,":c?e+="O,":e+="#8,"),FK(MP)!=a.a&&(b?e+="s,":c?e+="S,":e+="#16,"),FK(NP)!=a.a&&(b?e+="p,":c?e+="P,":e+="#15,"),FK(DP)!=a.a&&(e+="F,"),FK(EP)!=a.a&&(e+="Cl,"),FK(FP)!=a.a&&(e+="Br,"),FK(GP)!=a.a&&(e+="I,"),\ndF(e,ya)&&(e=e.substr(0,e.length-1-0)),1>e.length&&!a.b&&(b?e=tc:c?e=ub:(Y(AP,(Iy(),Ry)),e=va)));b=l;d&&FK(HP)!=a.a&&(b+=";a");d&&FK(IP)!=a.a&&(b+=";A");FK(OP)!=a.a&&(b+=";R");FK(PP)!=a.a&&(b+=";!R");FK(AP)!=a.a&&0<b.length?e=b.substr(1,b.length-1):e+=b;d=QP.nc.a.pb.selectedIndex;0<d&&(--d,e+=";H"+d);d=RP.nc.a.pb.selectedIndex;0<d&&(--d,e+=";D"+d);FK(SP)!=a.a&&(e="~");FK(TP)!=a.a&&(e=jb);FK(UP)!=a.a&&(e=tb);FK(VP)!=a.a&&(e="!@");yL(a.e,e)}\nfunction WP(a){XP(a);YP(a);var b=QP.nc.a;mP(b,0);b.pb.options[0].selected=!0;b=RP.nc.a;mP(b,0);b.pb.options[0].selected=!0;Y(HP,a.a);Y(IP,a.a);Y(OP,a.a);Y(PP,a.a);Y(QP,a.a);Y(RP,a.a);ZP(a)}function XP(a){Y(JP,a.a);Y(KP,a.a);Y(LP,a.a);Y(MP,a.a);Y(NP,a.a);Y(DP,a.a);Y(EP,a.a);Y(FP,a.a);Y(GP,a.a)}function YP(a){Y(AP,a.a);Y(BP,a.a);Y(CP,a.a)}function ZP(a){Y(SP,a.a);Y(TP,a.a);Y(UP,a.a);Y(VP,a.a);a.b=!1}\nfunction xP(a){mL.call(this,"Atom/Bond Query");this.i=new fL(this.rg());By(this.q,new SL(this));this.a=(fB(),hB);this.c=a;this.d||(a=Jx(a),this.d=new xL(a),QL(this.d,-150,10));this.j=this.d;hy(this,new tP);Y(this,this.a);a=new my;hy(a,new hz(0,3,1));Z(a,new uP("Atom type :"),null);AP=new fL(hP);BP=new fL("Any except C");CP=new fL("Halogen");Z(a,AP,null);Z(a,BP,null);Z(a,CP,null);Z(this,a,null);a=new my;hy(a,new hz(0,3,1));Z(a,new vL("Or select one or more from the list :",0),null);Z(this,a,null);\na=new my;hy(a,new hz(0,3,1));JP=new fL(zb);KP=new fL(Ub);LP=new fL(Zb);MP=new fL(fc);NP=new fL($b);DP=new fL(Gb);EP=new fL(Cb);FP=new fL(yb);GP=new fL(Kb);Z(a,JP,null);Z(a,KP,null);Z(a,LP,null);Z(a,MP,null);Z(a,NP,null);Z(a,DP,null);Z(a,EP,null);Z(a,FP,null);Z(a,GP,null);Z(this,a,null);a=new my;hy(a,new hz(0,3,1));QP=new rP;qP(QP,hP);qP(QP,ab);qP(QP,cb);qP(QP,fb);qP(QP,gb);Z(a,new uP("Number of hydrogens :  "),null);Z(a,QP,null);Z(this,a,null);a=new my;hy(a,new hz(0,3,1));RP=new rP;qP(RP,hP);qP(RP,\nab);qP(RP,cb);qP(RP,fb);qP(RP,gb);qP(RP,"4");qP(RP,"5");qP(RP,"6");Z(a,new vL("Number of connections :",0),null);Z(a,RP,null);Z(a,new vL(" (H\'s don\'t count.)",0),null);Z(this,a,null);a=new my;hy(a,new hz(0,3,1));Z(a,new uP("Atom is :"),null);HP=new fL(iP);Z(a,HP,null);IP=new fL("Nonaromatic");Z(a,IP,null);OP=new fL(lP);Z(a,OP,null);PP=new fL(jP);Z(a,PP,null);Z(this,a,null);a=new my;Y(a,Yy(FK(this)));hy(a,new hz(0,3,1));Z(a,new uP("Bond is :"),null);SP=new fL(hP);Z(a,SP,null);TP=new fL(iP);Z(a,TP,\nnull);UP=new fL(lP);Z(a,UP,null);VP=new fL(jP);Z(a,VP,null);Z(this,a,null);a=new my;hy(a,new hz(1,3,1));this.e=new Oz(va,20);Z(a,this.e,null);Z(a,new fL(kP),null);Z(a,this.i,null);Z(this,a,null);this.nc&&oL(this.nc.c,!1);lL(this,!1);XP(this);YP(this);ZP(this);Y(HP,this.a);Y(IP,this.a);Y(OP,this.a);Y(PP,this.a);Y(QP,this.a);Y(RP,this.a);yP(this,AP);kL(this);a=this.j;UL(this.nc.c,a.a,a.b);!Ix(this)&&OK(this);JK(this)}r(599,578,GH,xP);\n_.sg=function(a,b){var c;G(b,kP)?(WP(this),yP(this,AP),zP(this)):D(a.f,44)?(ZP(this),Rr(a.f)===Rr(AP)?(XP(this),YP(this)):Rr(a.f)===Rr(BP)?(XP(this),YP(this)):Rr(a.f)===Rr(CP)?(XP(this),YP(this)):Rr(a.f)===Rr(OP)?Y(PP,this.a):Rr(a.f)===Rr(PP)?(Y(OP,this.a),Y(HP,this.a)):Rr(a.f)===Rr(HP)?(Y(IP,this.a),Y(PP,this.a)):Rr(a.f)===Rr(IP)?Y(HP,this.a):Rr(a.f)===Rr(SP)||Rr(a.f)===Rr(TP)||Rr(a.f)===Rr(UP)||Rr(a.f)===Rr(VP)?(WP(this),this.b=!0):YP(this),yP(this,a.f),zP(this)):D(a.f,45)&&(ZP(this),c=a.f,0==c.nc.a.pb.selectedIndex?\nY(c,this.a):Y(c,(Iy(),Ry)),zP(this));107!=this.c.e&&(this.c.e=107,ry(this.c));return!0};_.tg=function(){return dn(this.e.nc.a.pb,Ug)};_.ug=function(){return this.b};_.b=!1;_.c=null;_.d=null;var AP=_.e=null,SP=null,BP=null,HP=null,TP=null,FP=null,JP=null,RP=null,QP=null,EP=null,DP=null,CP=null,GP=null,KP=null,IP=null,PP=null,VP=null,LP=null,NP=null,OP=null,UP=null,MP=null;function sP(a){jH();lH.call(this);this.a=new oP;tu(this.a,new $P(this,a),(TI(),TI(),UI))}r(645,643,{},sP);_.Re=function(){return this.a};\n_.a=null;function $P(a,b){this.a=a;this.b=b}r(646,1,{},$P);_.$c=function(a){Vx();VL(a,this.b,nP(this.a.a,this.a.a.pb.selectedIndex))};_.a=null;_.b=null;V(577);V(599);V(431);V(645);V(646);V(365);x(EH)(1);\n//@ sourceURL=1.js\n')
