$wnd.jsme.runAsyncCallback5('r(212,200,{});function ZO(){ZO=s;$O=new $o("dragend",new aP)}function bP(a){a.a.cancelBubble=!0;cn(a.a)}function aP(){}r(213,212,{},aP);_.Rc=function(){bP(this)};_.Uc=function(){return $O};var $O;function cP(){cP=s;dP=new $o("dragenter",new eP)}function eP(){}r(214,212,{},eP);_.Rc=function(){bP(this)};_.Uc=function(){return dP};var dP;function fP(){fP=s;gP=new $o("dragover",new hP)}function hP(){}r(215,212,{},hP);_.Rc=function(){bP(this)};_.Uc=function(){return gP};var gP;\nfunction iP(){iP=s;jP=new $o("drop",new kP)}function kP(){}r(216,212,{},kP);_.Rc=function(a){var b,c,d,e;this.a.cancelBubble=!0;cn(this.a);d=(this.a.dataTransfer||null).files;e=0;a:for(;e<d.length;++e){if(0<a.a.d&&e>=a.a.d)break a;b=d[e];c=new FileReader;lP(c,a.a.b);1==a.a.c&&c.readAsText(b)}0==d.length&&(b=(this.a.dataTransfer||null).getData(vg),a.a.b.a.a.f.pb[Qg]=null!=b?b:l)};_.Uc=function(){return jP};var jP;function mP(a,b,c){zq(!a.mb?a.mb=new Oq(a):a.mb,c,b)}\nfunction nP(){this.pb=Zm("file");this.pb[id]="gwt-FileUpload"}r(332,313,Fh,nP);_.ld=function(a){Jt(this,a)};function oP(a){var b=bn(Gd);BH(kg,AH(b));this.pb=b;this.b=new gJ(this.pb);this.pb[id]="gwt-HTML";fJ(this.b,a,!0);oJ(this)}r(336,337,Fh,oP);function pP(){iw();var a=bn("textarea");!ks&&(ks=new js);!is&&(is=new hs);this.pb=a;this.pb[id]="gwt-TextArea"}r(376,377,Fh,pP);\nfunction qP(a,b){var c,d;c=bn(Kg);d=bn(ug);d[Dc]=a.a.a;d.style[Rg]=a.b.a;var e=(ms(),ns(d));c.appendChild(e);ls(a.d,c);Vt(a,b,d)}function rP(){Pu.call(this);this.a=(Su(),Zu);this.b=($u(),cv);this.e[Yc]=Za;this.e[Xc]=Za}r(385,329,Ph,rP);_.Gd=function(a){var b;b=an(a.pb);(a=Zt(this,a))&&this.d.removeChild(an(b));return a};\nfunction sP(a){try{a.w=!1;var b,c,d;d=a.hb;c=a.ab;d||(a.pb.style[Sg]=ke,a.ab=!1,a.Td());b=a.pb;b.style[te]=0+(ao(),yf);b.style[Cg]=$a;QK(a,Vi(Dn($doc)+(Cn()-Wm(a.pb,kf)>>1),0),Vi(En($doc)+(mn()-Wm(a.pb,jf)>>1),0));d||((a.ab=c)?(a.pb.style[md]=Qf,a.pb.style[Sg]=Tg,wi(a.gb,200)):a.pb.style[Sg]=Tg)}finally{a.w=!0}}function tP(a){a.i=(new bK(a.j)).nc.Ie();Ft(a.i,new uP(a),(fp(),fp(),gp));a.d=F(vw,q,39,[a.i])}\nfunction yP(){kL();var a,b,c,d,e;HL.call(this,(ZL(),$L),null,!0);this.Cg();this.db=!0;a=new oP(this.k);this.f=new pP;this.f.pb.style[Wg]=bb;tt(this.f,bb);this.Ag();bL(this,"400px");e=new rP;e.pb.style[je]=bb;e.e[Yc]=10;c=(Su(),Tu);e.a=c;qP(e,a);qP(e,this.f);this.e=new gv;this.e.e[Yc]=20;for(b=this.d,c=0,d=b.length;c<d;++c)a=b[c],dv(this.e,a);qP(e,this.e);pL(this,e);kK(this,!1);this.Bg()}r(632,633,AG,yP);_.Ag=function(){tP(this)};\n_.Bg=function(){var a=this.f;a.pb.readOnly=!0;var b=wt(a.pb)+"-readonly";st(a.td(),b,!0)};_.Cg=function(){jK(this.I.b,"Copy")};_.d=null;_.e=null;_.f=null;_.i=null;_.j="Close";_.k="Press Ctrl-C (Command-C on Mac) or right click (Option-click on Mac) on the selected text to copy it, then paste into another program.";function uP(a){this.a=a}r(635,1,{},uP);_.Xc=function(){rL(this.a,!1)};_.a=null;function zP(a){this.a=a}r(636,1,{},zP);\n_.Dc=function(){Bt(this.a.f.pb,!0);Av(this.a.f.pb);var a=this.a.f,b;b=Xm(a.pb,Qg).length;if(0<b&&a.kb){if(0>b)throw new ND("Length must be a positive integer. Length: "+b);if(b>Xm(a.pb,Qg).length)throw new ND("From Index: 0  To Index: "+b+"  Text Length: "+Xm(a.pb,Qg).length);var a=a.pb,c=0;try{var d=a.createTextRange(),e=a.value.substr(c,b).match(/(\\r\\n)/gi);null!=e&&(b-=e.length);var f=a.value.substring(0,c).match(/(\\r\\n)/gi);null!=f&&(c-=f.length);d.collapse(!0);d.moveStart("character",c);d.moveEnd("character",\nb);d.select()}catch(g){}}};_.a=null;function AP(a){tP(a);a.a=(new bK(a.b)).nc.Ie();Ft(a.a,new BP(a),(fp(),fp(),gp));a.d=F(vw,q,39,[a.a,a.i])}function CP(a){a.j="Cancel";a.k="Paste the text to import into the text area below.";a.b="Accept";jK(a.I.b,"Paste")}function DP(a){kL();yP.call(this);this.c=a}r(638,632,AG,DP);_.Ag=function(){AP(this)};_.Bg=function(){tt(this.f,"150px")};_.Cg=function(){CP(this)};_.Td=function(){GL(this);Lm((Im(),Jm),new EP(this))};_.a=null;_.b=null;_.c=null;\nfunction FP(a){kL();DP.call(this,a)}r(637,638,AG,FP);_.Ag=function(){var a;AP(this);a=new nP;Ft(a,new GP(this),(OH(),OH(),PH));this.d=F(vw,q,39,[this.a,a,this.i])};_.Bg=function(){tt(this.f,"150px");var a=new HP(this),b=this.f;mP(b,new IP,(cP(),cP(),dP));mP(b,new JP,(ZO(),ZO(),$O));mP(b,new KP,(fP(),fP(),gP));mP(b,new LP(a),(iP(),iP(),jP))};_.Cg=function(){CP(this);this.k+=" Or drag and drop a file on it."};function GP(a){this.a=a}r(639,1,{},GP);\n_.Wc=function(a){var b,c;b=new FileReader;a=(c=a.a.srcElement,c.files[0]);MP(b,new NP(this));b.readAsText(a)};_.a=null;function NP(a){this.a=a}r(640,1,{},NP);_.Dg=function(a){gz();hw(this.a.a.f,a)};_.a=null;r(643,1,{});r(642,643,{});_.b=null;_.c=1;_.d=-1;function HP(a){this.a=a;this.b=new OP(this);this.c=this.d=1}r(641,642,{},HP);_.a=null;function OP(a){this.a=a}r(644,1,{},OP);_.Dg=function(a){this.a.a.f.pb[Qg]=null!=a?a:l};_.a=null;function BP(a){this.a=a}r(648,1,{},BP);\n_.Xc=function(){if(this.a.c){var a=this.a.c,b;b=new dz(a.a,0,Xm(this.a.f.pb,Qg));CC(a.a.a,b.a)}rL(this.a,!1)};_.a=null;function EP(a){this.a=a}r(649,1,{},EP);_.Dc=function(){Bt(this.a.f.pb,!0);Av(this.a.f.pb)};_.a=null;r(650,1,xh);_.Oc=function(){var a,b;a=new PP(this.a);void 0!=$wnd.FileReader?b=new FP(a):b=new DP(a);dL(b);sP(b)};function PP(a){this.a=a}r(651,1,{},PP);_.a=null;r(652,1,xh);\n_.Oc=function(){var a;a=new yP;var b=this.a,c;hw(a.f,b);b=(c=RD(b,"\\r\\n|\\r|\\n|\\n\\r"),c.length);tt(a.f,20*(10>b?b:10)+yf);Lm((Im(),Jm),new zP(a));dL(a);sP(a)};function MP(a,b){a.onload=function(a){b.Dg(a.target.result)}}function lP(a,b){a.onloadend=function(a){b.Dg(a.target.result)}}function LP(a){this.a=a}r(657,1,{},LP);_.a=null;function IP(){}r(658,1,{},IP);function JP(){}r(659,1,{},JP);function KP(){}r(660,1,{},KP);X(643);X(642);X(657);X(658);X(659);X(660);X(212);X(214);X(213);X(215);X(216);X(632);\nX(638);X(637);X(651);X(635);X(636);X(648);X(649);X(639);X(640);X(641);X(644);X(336);X(385);X(376);X(332);x(tG)(5);\n//@ sourceURL=5.js\n')