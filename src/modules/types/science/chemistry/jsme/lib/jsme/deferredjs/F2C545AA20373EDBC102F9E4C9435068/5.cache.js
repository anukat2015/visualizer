$wnd.jsme.runAsyncCallback5('var g0="400px",h0="Accept",i0="Cancel",j0="Paste",k0="Paste the text to import into the text area below.",l0="dragend",m0="dragenter",n0="dragover",o0="drop",p0="gwt-HTML",q0="gwt-TextArea",r0="textarea";o(204,192,{});function s0(){s0=q;t0=new Hy(l0,new u0)}function v0(a){a.a.cancelBubble=!0;lx(a.a)}function u0(){}o(205,204,{},u0);_.Rc=function(){v0(this)};_.Uc=function(){return t0};var t0;function w0(){w0=q;x0=new Hy(m0,new y0)}function y0(){}o(206,204,{},y0);_.Rc=function(){v0(this)};_.Uc=function(){return x0};\nvar x0;function z0(){z0=q;A0=new Hy(n0,new B0)}function B0(){}o(207,204,{},B0);_.Rc=function(){v0(this)};_.Uc=function(){return A0};var A0;function C0(){C0=q;D0=new Hy(o0,new E0)}function E0(){}o(208,204,{},E0);\n_.Rc=function(a){var b,c,d,e;this.a.cancelBubble=!0;lx(this.a);d=(this.a.dataTransfer||null).files;e=0;a:for(;e<d.length;++e){if(0<a.a.d&&e>=a.a.d)break a;b=d[e];c=new FileReader;F0(c,a.a.b);1==a.a.c&&c.readAsText(b)}0==d.length&&(b=(this.a.dataTransfer||null).getData(pq),a.a.b.a.a.e.ob[Tq]=null!=b?b:l)};_.Uc=function(){return D0};var D0;function G0(a,b,c){gA(!a.lb?a.lb=new vA(a):a.lb,c,b)}\nfunction H0(a){var b=E(Ik);US($p,TS(b));this.ob=b;this.b=new oU(this.ob);this.ob[Mj]=p0;nU(this.b,a,!0);wU(this)}o(329,330,{13:1,15:1,17:1,18:1,20:1,21:1,22:1,23:1,24:1,25:1,26:1,27:1,28:1,30:1,31:1,32:1,36:1,37:1,38:1,39:1,40:1,41:1,42:1,43:1,44:1,45:1,47:1,49:1,53:1,58:1,68:1,69:1,70:1,73:1,77:1,80:1,81:1,83:1},H0);function I0(){KF();var a=E(r0);!TB&&(TB=new SB);!RB&&(RB=new QB);this.ob=a;this.ob[Mj]=q0}o(369,370,qs,I0);\nfunction J0(a,b){var c,d;c=E(Eq);d=E(oq);d[Vi]=a.a.a;d.style[Uq]=a.b.a;var e=(VB(),WB(d));c.appendChild(e);UB(a.d,c);sD(a,b,d)}function K0(){mE.call(this);this.a=(pE(),wE);this.b=(xE(),AE);this.e[Fj]=nc;this.e[Ej]=nc}o(378,323,ls,K0);_.Jd=function(a){var b;b=kx(a.ob);(a=wD(this,a))&&this.d.removeChild(kx(b));return a};\nfunction L0(a){try{a.v=!1;var b,c,d;d=a.gb;c=a._;d||(a.ob.style[Vq]=Dl,WE(a.ob,!1),a._=!1,a.Wd());b=a.ob;b.style[mm]=0+(by(),Ho);b.style[yq]=pc;YV(a,rt(Ax($doc)+(zx()-gx(a.ob,Un)>>1),0),rt(Bx($doc)+(yx()-gx(a.ob,Tn)>>1),0));d||((a._=c)?(a.ob.style[Tj]=kp,a.ob.style[Vq]=Wq,WE(a.ob,!0),Gs(a.fb,200)):(a.ob.style[Vq]=Wq,WE(a.ob,!0)))}finally{a.v=!0}}function M0(a){a.f=(new jV(a.i)).nc.Le();cD(a.f,new N0(a),(Ny(),Ny(),Oy));a.d=C(O0,m,60,[a.f])}\nfunction P0(){sW();var a,b,c,d,e,f;PW.call(this,(gX(),hX),null,!0);this.Eg();this.cb=!0;a=new H0(this.j);this.e=new I0;this.e.ob.style[br]=rc;RC(this.e,rc);this.Cg();jW(this,g0);f=new K0;f.ob.style[Bl]=rc;f.e[Fj]=10;c=(pE(),qE);f.a=c;J0(f,a);J0(f,this.e);e=new EE;e.e[Fj]=20;for(b=this.d,c=0,d=b.length;c<d;++c)a=b[c],BE(e,a);J0(f,e);xW(this,f);sV(this,!1);this.Dg()}o(627,628,oQ,P0);_.Cg=function(){M0(this)};_.Dg=function(){var a=this.e;a.ob.readOnly=!0;var b=UC(a.ob)+"-readonly";QC(a.wd(),b,!0)};\n_.Eg=function(){rV(this.H.b,"Copy")};_.d=null;_.e=null;_.f=null;_.i="Close";_.j="Press Ctrl-C (Command-C on Mac) or right click (Option-click on Mac) on the selected text to copy it, then paste into another program.";function N0(a){this.a=a}o(630,1,{},N0);_.Wc=function(){zW(this.a,!1)};_.a=null;function Q0(a){this.a=a}o(631,1,{},Q0);\n_.Dc=function(){ZC(this.a.e.ob,!0);YE(this.a.e.ob);var a=this.a.e,b;b=hx(a.ob,Tq).length;if(0<b&&a.jb){if(0>b)throw new zN("Length must be a positive integer. Length: "+b);if(b>hx(a.ob,Tq).length)throw new zN("From Index: 0  To Index: "+b+"  Text Length: "+hx(a.ob,Tq).length);var a=a.ob,c=0;try{var d=a.createTextRange(),e=a.value.substr(c,b).match(/(\\r\\n)/gi);null!=e&&(b-=e.length);var f=a.value.substring(0,c).match(/(\\r\\n)/gi);null!=f&&(c-=f.length);d.collapse(!0);d.moveStart("character",c);d.moveEnd("character",\nb);d.select()}catch(g){}}};_.a=null;function R0(a){a.i=i0;a.j=k0;a.b=h0;rV(a.H.b,j0)}function S0(a){sW();P0.call(this);this.c=a}o(633,627,oQ,S0);_.Cg=function(){M0(this);this.a=(new jV(this.b)).nc.Le();cD(this.a,new T0(this),(Ny(),Ny(),Oy));this.d=C(O0,m,60,[this.a,this.f])};_.Dg=function(){RC(this.e,"150px")};_.Eg=function(){R0(this)};_.Wd=function(){OW(this);Ww((Tw(),Uw),new U0(this))};_.a=null;_.b=null;_.c=null;function V0(a){sW();S0.call(this,a)}o(632,633,oQ,V0);\n_.Dg=function(){RC(this.e,"150px");var a=new W0(this),b=this.e;G0(b,new X0,(w0(),w0(),x0));G0(b,new Y0,(s0(),s0(),t0));G0(b,new Z0,(z0(),z0(),A0));G0(b,new $0(a),(C0(),C0(),D0))};_.Eg=function(){R0(this);this.j+=" Or drag and drop a file on it."};o(636,1,{});o(635,636,{});_.b=null;_.c=1;_.d=-1;function W0(a){this.a=a;this.b=new a1(this);this.c=this.d=1}o(634,635,{},W0);_.a=null;function a1(a){this.a=a}o(637,1,{},a1);_.Fg=function(a){this.a.a.e.ob[Tq]=null!=a?a:l};_.a=null;\nfunction T0(a){this.a=a}o(641,1,{},T0);_.Wc=function(){if(this.a.c){var a=this.a.c,b;b=new SI(a.a,0,hx(this.a.e.ob,Tq));nM(a.a.a,b.a)}zW(this.a,!1)};_.a=null;function U0(a){this.a=a}o(642,1,{},U0);_.Dc=function(){ZC(this.a.e.ob,!0);YE(this.a.e.ob)};_.a=null;o(643,1,Kr);_.Oc=function(){var a,b;a=new b1(this.a);void 0!=$wnd.FileReader?b=new V0(a):b=new S0(a);lW(b);L0(b)};function b1(a){this.a=a}o(644,1,{},b1);_.a=null;o(645,1,Kr);\n_.Oc=function(){var a;a=new P0;var b=this.a,c;JF(a.e,b);b=(c=DN(b,"\\r\\n|\\r|\\n|\\n\\r"),c.length);RC(a.e,20*(10>b?b:10)+Ho);Ww((Tw(),Uw),new Q0(a));lW(a);L0(a)};function F0(a,b){a.onloadend=function(a){b.Fg(a.target.result)}}function $0(a){this.a=a}o(650,1,{},$0);_.a=null;function X0(){}o(651,1,{},X0);function Y0(){}o(652,1,{},Y0);function Z0(){}o(653,1,{},Z0);Y(636);Y(635);Y(650);Y(651);Y(652);Y(653);Y(204);Y(206);Y(205);Y(207);Y(208);Y(627);var O0=oN(791);Y(633);Y(632);Y(644);Y(630);Y(631);Y(641);\nY(642);Y(634);Y(637);Y(329);Y(378);Y(369);s(iQ)(5);\n//@ sourceURL=5.js\n')
