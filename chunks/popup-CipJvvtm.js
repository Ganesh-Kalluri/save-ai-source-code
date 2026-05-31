import{c as U,r as n,z as k,d as a,j as e,U as xe,i as b,b as D,g as he,s as oe,f as H,G as be,k as me,l as Ce}from"./index-CmBT__Kc.js";import{s as W,a as $,b as w,D as K,g as ke}from"./tabUtil-B-vUTo1f.js";import{c as Ie,A as Z,b as ye,g as ee,d as j,B as Se,S as ve}from"./siteIcons-owHAYZbf.js";import{C as re}from"./search-BeaLIg0I.js";import{C as we}from"./copy-BHaFGfZb.js";import{u as je,T as Ae,N as Ne,S as Me,L as $e,I as De,a as Ee}from"./hooks-CGG9Necn.js";const We=[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",key:"k3hazp"}]],ze=U("book",We);const Be=[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]],Le=U("message-circle-warning",Be);const Te=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M15 3v18",key:"14nvp0"}]],Fe=U("panel-right",Te),Pe=()=>{const[t,o]=n.useState(""),[d,p]=n.useState(""),[c,i]=n.useState(!1),l=n.useCallback(async()=>{const u=await Ie();i(!u.isSupported),o(u.currentSiteName),p(u.connectionStatus)},[]);return n.useEffect(()=>{l()},[l]),{currentSiteName:t,connectionStatus:d,isUnsupportedSite:c,checkTabSupport:l}},_e=()=>{const[t,o]=n.useState([]);n.useEffect(()=>{(async()=>{const i=await Z.getSettings(),l=ye(),u=[],s=new Set;i.sortedNames.forEach(r=>{const x=l.find(h=>h.name===r);x&&!i.hiddenNames.includes(r)&&(u.push({...x,icon:ee(x.name)}),s.add(r))}),l.forEach(r=>{!s.has(r.name)&&!i.hiddenNames.includes(r.name)&&u.push({...r,icon:ee(r.name)})}),o(u)})()},[]);const d=n.useCallback(async c=>{await W("navigation",{name:c.name}),window.open(c.linkUrl||c.url,"_blank")},[]),p=n.useCallback(async c=>{try{const l=(await Z.getSettings()).hiddenNames,u=[...c,...l.filter(s=>!c.includes(s))];await Z.updateSettings({sortedNames:u,hiddenNames:l})}catch{}},[]);return{displaySites:t,setDisplaySites:o,handleSiteClick:d,handleReorder:p}},se=()=>{const t=n.useCallback(async()=>{const{canPerform:s,errorMessage:r}=await j();if(!s){k(r||"当前页面不支持此操作");return}$("custom"),w("captureSelect")},[]),o=n.useCallback(async()=>{const{canPerform:s,errorMessage:r}=await j();if(!s){k(r);return}$("text"),w("exportFullText")},[]),d=n.useCallback(async()=>{const{canPerform:s,errorMessage:r}=await j();if(!s){k(r);return}w("captureAllToImage")},[]),p=n.useCallback(async()=>{const{canPerform:s,errorMessage:r}=await j();if(!s){k(r);return}$("pdf"),w("exportFullPDF")},[]),c=n.useCallback(async()=>{const{canPerform:s,errorMessage:r}=await j();if(!s){k(r);return}$("markdown"),w("exportFullMarkdown")},[]),i=n.useCallback(async()=>{const{canPerform:s,errorMessage:r}=await j();if(!s){k(r);return}$("copy-markdown"),w("copyFullMarkdown")},[]),l=n.useCallback(async()=>{const{canPerform:s,errorMessage:r}=await j();if(!s){k(r);return}$("json"),w("exportFullJSON")},[]),u=n.useCallback(async()=>{console.log("[Word Export] exportFullWordClick called");const{canPerform:s,errorMessage:r}=await j();if(!s){console.log("[Word Export] checkCanPerformAction failed:",r),k(r);return}console.log("[Word Export] sending exportFullWord to active tab"),$("word"),w("exportFullWord")},[]);return{customExportClick:t,exportFullTextClick:o,exportFullImageClick:d,exportFullPDFClick:p,exportFullMarkdownClick:c,copyClick:i,exportFullJSONClick:l,exportFullWordClick:u}},Re=a.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
`,Oe=()=>e.jsxs(Re,{children:[e.jsx(Se,{size:"medium"}),e.jsx(xe,{mode:"popup",theme:"light"})]}),He="_horizontalScrollContainer_imct0_1",Ze="_scrollContent_imct0_9",Je="_scrollInner_imct0_24",Ue="_centered_imct0_31",Ge="_scrollBtn_imct0_35",Qe="_scrollLeft_imct0_66",Ye="_scrollRight_imct0_71",M={horizontalScrollContainer:He,scrollContent:Ze,scrollInner:Je,centered:Ue,scrollBtn:Ge,scrollLeft:Qe,scrollRight:Ye},Xe=({children:t,scrollAmount:o=120,leftLabel:d="Scroll left",rightLabel:p="Scroll right",autoHide:c=!0,gap:i=8,visibleItems:l=4,itemWidth:u=36,leftIcon:s,rightIcon:r,initialScrollIndex:x})=>{const[h,g]=n.useState(!1),[f,m]=n.useState(!1),[y,A]=n.useState(!1),[E,N]=n.useState(!1),v=n.useRef(null),T=n.useRef(null),ie=`${l*u+(l-1)*i}px`,F=n.useCallback(()=>{if(!v.current||!T.current)return;const I=v.current,z=T.current;m(I.scrollLeft>0),A(I.scrollLeft<z.scrollWidth-I.clientWidth);const Q=z.scrollWidth<=I.clientWidth;N(Q)},[]),ae=n.useCallback(()=>{v.current&&v.current.scrollBy({left:-o,behavior:"smooth"})},[o]),ce=n.useCallback(()=>{v.current&&v.current.scrollBy({left:o,behavior:"smooth"})},[o]),P=n.useCallback(()=>{setTimeout(()=>{F()},0)},[F]);n.useEffect(()=>{P();const I=()=>F();return window.addEventListener("resize",I),()=>{window.removeEventListener("resize",I)}},[P,F]);const G=n.useCallback(I=>{if(!v.current||!T.current)return;const z=v.current,Y=T.current.children;if(I<0||I>=Y.length)return;const R=Y[I];if(!R)return;const O=R.offsetLeft,X=R.offsetWidth,V=z.clientWidth,q=z.scrollLeft,pe=O+X,ue=q,ge=q+V;if(O>=ue&&pe<=ge)return;const fe=O-(V-X)/2;z.scrollLeft=Math.max(0,fe)},[]);n.useEffect(()=>{P()},[t,P]),n.useLayoutEffect(()=>{x!==void 0&&x>=0&&G(x)},[x,G]);const le=e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"15,18 9,12 15,6"})}),de=e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"9,18 15,12 9,6"})});return e.jsxs("div",{className:M.horizontalScrollContainer,onMouseEnter:()=>g(!0),onMouseLeave:()=>g(!1),children:[h&&f&&e.jsx("button",{className:`${M.scrollBtn} ${M.scrollLeft}`,onClick:ae,"aria-label":d,children:s||le}),e.jsx("div",{ref:v,className:M.scrollContent,onScroll:F,style:{maxWidth:ie},children:e.jsx("div",{ref:T,className:`${M.scrollInner} ${E?M.centered:""}`,style:{gap:`${i}px`},children:t})}),h&&y&&e.jsx("button",{className:`${M.scrollBtn} ${M.scrollRight}`,onClick:ce,"aria-label":p,children:r||de})]})},Ve=(t,o,d)=>{const p=n.useRef(null),c=n.useRef(null),[i,l]=n.useState(null),u=n.useCallback((h,g)=>{p.current=g,l(g)},[]),s=n.useCallback((h,g)=>{c.current=g,h.preventDefault()},[]),r=n.useCallback(h=>{h.preventDefault()},[]),x=n.useCallback(async h=>{const g=p.current,f=c.current;if(g!==null&&f!==null&&g!==f){const m=[...t],y=m[g];m.splice(g,1),m.splice(f,0,y),o(m);const A=m.map(E=>E.name);await d(A)}p.current=null,c.current=null,l(null)},[t,o,d]);return{handleDragStart:u,handleDragEnter:s,handleDragOver:r,handleDragEnd:x,draggingIndex:i}},qe=a.div`
  background: #ffffff;
  padding: 10px 12px;
  border-bottom: 1px solid #f8fafc;
`,Ke=a.a`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #e5e7eb;
  flex-shrink: 0;
  text-decoration: none;
  position: relative;

  &:hover {
    transform: scale(1.05);
    border-color: #3b82f6;
    background: #f0f9ff;
  }

  ${t=>t.$active&&`
    border-color: #3b82f6;
    background: #f0f9ff;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  `}

  ${t=>t.$connected&&`
    position: relative;
  `}

  ${t=>t.$dragging&&`
    opacity: 0.5;
    background: #f1f5f9;
    border-style: dashed;
    transform: scale(0.95);
  `}

  img {
    width: 18px;
    height: 18px;
    object-fit: contain;
  }
`,et=a.div`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 4px;
  height: 4px;
  border: 1px solid #ffffff;
  border-radius: 50%;
  background: ${t=>t.$status==="chat"?"#10b981":"#f59e0b"};
`,J=b.t.bind(b),tt=({sites:t,currentSiteName:o,connectionStatus:d,isUnsupportedSite:p,onSiteClick:c,onReorder:i,setDisplaySites:l})=>{const{handleDragStart:u,handleDragEnter:s,handleDragOver:r,handleDragEnd:x,draggingIndex:h}=Ve(t,l,i),g=t.findIndex(f=>f.name===o);return e.jsx(qe,{children:e.jsx(Xe,{scrollAmount:200,gap:8,visibleItems:7,itemWidth:28,leftLabel:"向左滚动",rightLabel:"向右滚动",initialScrollIndex:g>=0?g:void 0,children:t.map((f,m)=>{const y=o===f.name,A=!p&&y,E=!p&&y?`${f.name} - ${d==="chat"?J("nav.chatPage","聊天页面"):J("nav.homePage","主页面")}`:`${J("nav.clickToVisit","点击跳转到")} ${f.name}`;return e.jsxs(Ke,{draggable:!0,onDragStart:N=>u(N,m),onDragEnter:N=>s(N,m),onDragOver:r,onDragEnd:x,$active:y,$connected:A,$dragging:h===m,title:E,onClick:N=>{N.preventDefault(),c(f)},children:[e.jsx("img",{src:f.icon,alt:f.name}),A&&e.jsx(et,{$status:d==="chat"?"chat":"home"})]},f.name)})})})},nt="/assets/magic-D_xyIQjt.png",ot=b.t.bind(b),rt=({type:t="recommended",text:o})=>{const p={position:"absolute",top:"-2px",right:"6px",fontSize:"9px",padding:"2px 6px",borderRadius:"8px",fontWeight:"500",zIndex:10,...(()=>{switch(t){case"recommended":return{background:"#ef4444",color:"white"};case"hot":return{background:"#f59e0b",color:"white"};case"new":return{background:"#10b981",color:"white"};default:return{background:"#ef4444",color:"white"}}})()},c=o||ot("ui.recommended","推荐");return e.jsx("div",{style:p,children:c})},te=b.t.bind(b),st=a.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 12px 6px;
  background: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  transition: background 0.25s ease, border-color 0.25s ease;
  cursor: pointer !important;

  &:hover {
    background: #e0f2fe;
    border-color: #bfdbfe;
  }

  ${t=>t.$featured&&`
    padding: 4px 14px;
    flex: 1;
    flex-direction: row;
    text-align: left;
    align-items: center;
    position: relative;
    border: 1px solid #dbeafe;
    border-radius: 14px;
    background: #f4f8ff;
    transition: all 0.25s ease;

    &:hover {
      background: #ebf1ff;
    }

    &:active {
      background: #e0eaff;
    }
  `}
`,it=a.div`
  margin-bottom: 0;
  margin-right: ${t=>t.$featured?"4px":"0"};
  width: ${t=>t.$featured?"64px":"auto"};
  height: ${t=>t.$featured?"64px":"auto"};
  flex-shrink: 0;
  border-radius: ${t=>t.$featured?"10px":"0"};
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  img {
    width: ${t=>t.$featured?"62px":"23px"};
    height: ${t=>t.$featured?"auto":"23px"};
    object-fit: contain;
  }
`,at=a.div`
  flex: 1;
  margin-top: 0;

  ${t=>t.$featured&&`
    margin-top: 0;
    flex: 1;
    text-align: left;
    z-index: 1;
  `}

  h3 {
    margin: ${t=>t.$featured?"0 0 2px 0":"0 0 1px 0"};
    font-size: ${t=>t.$featured?"15px":"12px"};
    color: ${t=>t.$featured?"#1e293b":"#374151"};
    line-height: ${t=>t.$featured?"1.2":"1.1"};
    font-weight: ${t=>t.$featured?700:"normal"};
  }

  p {
    margin: 0;
    font-size: ${t=>t.$featured?"12px":"10px"};
    color: ${t=>t.$featured?"#64748b":"#6b7280"};
    line-height: ${t=>t.$featured?"1.4":"1.2"};
  }
`,ct=({onClick:t})=>e.jsxs(st,{$featured:!0,onClick:t,children:[e.jsx(it,{$featured:!0,children:e.jsx("img",{src:nt,alt:"Custom Export"})}),e.jsxs(at,{$featured:!0,children:[e.jsx("h3",{children:te("popup.customExport")}),e.jsx("p",{children:te("popup.customExportDesc")})]}),e.jsx(rt,{type:"recommended"})]}),lt=a.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 10px 4px 8px;
  background: #ffffff;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
  cursor: pointer !important;

  &:hover {
    background: #e8f0f7ff;
    border-color: #d4dfedff;
  }
`,dt=a.div`
  width: auto;
  height: auto;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 2px;

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
`,pt=a.div`
  flex: 1;
  margin-top: 6px;

  h3 {
    margin: 0;
    font-size: 13px;
    color: #475569;
    font-weight: 500;
    line-height: 1.2;
  }
`,B=({icon:t,title:o,alt:d,onClick:p})=>e.jsxs(lt,{onClick:p,children:[e.jsx(dt,{children:e.jsx("img",{src:t,alt:d})}),e.jsx(pt,{children:e.jsx("h3",{children:o})})]}),ut="/assets/md-B8nF0Nu1.png",gt="/assets/pdf-CMPbJ9aZ.png",ft="/assets/image-JY_E3rsp.png",xt="/assets/txt-CB7qOyB7.png",ht="/assets/json-wgKw7CF_.png",bt="data:image/svg+xml;base64,PHN2ZyBpZD0iaWNvbi1wcmV2aWV3LXN2ZyIgdmlld0JveD0iNjUuNSA0OC41IDM4MSA0MTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgY2xhc3M9InctZnVsbCBoLWZ1bGwiPjxwYXRoIGQ9Ik0gMTYwIDY0JiMxMDsgICAgICAgICAgICBMIDI4OCA2NCYjMTA7ICAgICAgICAgICAgTCA0MDAgMTc2JiMxMDsgICAgICAgICAgICBMIDQwMCA0MDAmIzEwOyAgICAgICAgICAgIEEgNDggNDggMCAwIDEgMzUyIDQ0OCYjMTA7ICAgICAgICAgICAgTCAxNjAgNDQ4JiMxMDsgICAgICAgICAgICBBIDQ4IDQ4IDAgMCAxIDExMiA0MDAmIzEwOyAgICAgICAgICAgIEwgMTEyIDExMiYjMTA7ICAgICAgICAgICAgQSA0OCA0OCAwIDAgMSAxNjAgNjQgWiIgZmlsbD0iI2JmZDlmOCIgc3Ryb2tlPSIjMkI2Q0M0IiBzdHJva2Utd2lkdGg9IjI3IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTSAyODggNjQmIzEwOyAgICAgICAgICAgIEwgMjg4IDEyOCYjMTA7ICAgICAgICAgICAgQSA0OCA0OCAwIDAgMCAzMzYgMTc2JiMxMDsgICAgICAgICAgICBMIDQwMCAxNzYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzJCNkNDNCIgc3Ryb2tlLXdpZHRoPSIyNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHRleHQgeD0iMjU2IiB5PSIyNzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIiBmb250LXNpemU9IjE3NyIgZm9udC13ZWlnaHQ9IjkwMCIgZmlsbD0iIzFBNDM4MCIgZm9udC1mYW1pbHk9InVpLXNhbnMtc2VyaWYsIHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCAnU2Vnb2UgVUknLCBSb2JvdG8sICdIZWx2ZXRpY2EgTmV1ZScsIEFyaWFsLCBzYW5zLXNlcmlmIiBzdHlsZT0ibGV0dGVyLXNwYWNpbmc6IC0wLjAyZW07Ij5XPC90ZXh0Pjwvc3ZnPg==",mt=a.div`
  margin-top: 8px;
`,Ct=a.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`,kt=a.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.3px;
  padding-left: 4px;
`,It=a.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #f8fafc;
  border: none;
  border-radius: 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #475569;
  }

  &:active {
    background: #cbd5e1;
  }
`,yt=a.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  > * {
    flex: 0 0 calc((100% - 20px) / 3);
    min-width: 0;
    max-width: calc((100% - 20px) / 3);
    box-sizing: border-box;
  }
`;a.div`
  margin-top: 8px;
`;const St=a.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`,vt=a.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 9px 14px 15px 14px;
  background: #ffffff;
`,S=b.t.bind(b),wt=()=>{const{exportFullPDFClick:t,exportFullMarkdownClick:o,exportFullTextClick:d,exportFullImageClick:p,exportFullJSONClick:c,exportFullWordClick:i,copyClick:l}=se();return e.jsxs(mt,{children:[e.jsxs(Ct,{children:[e.jsxs(kt,{children:[S("popup.quickExports"),e.jsx(D,{content:S("tooltip.quickExports"),delay:[100,0],children:e.jsx(re,{style:{cursor:"pointer"},color:"#999",size:12})})]}),e.jsx(D,{content:S("popup.copyFullActionDesc"),delay:[800,0],children:e.jsxs(It,{onClick:l,children:[e.jsx(we,{size:14}),S("popup.copyFullAction")]})})]}),e.jsxs(yt,{children:[e.jsx(B,{icon:gt,title:S("popup.exportPdfShort"),alt:"Export as PDF",onClick:t}),e.jsx(B,{icon:ut,title:S("popup.exportMarkdownShort"),alt:"Export as markdown",onClick:o}),e.jsx(B,{icon:xt,title:S("popup.exportTextShort"),alt:"Export as Text",onClick:d}),e.jsx(B,{icon:bt,title:S("popup.exportWordShort"),alt:"Export as Word",onClick:i}),e.jsx(B,{icon:ft,title:S("popup.exportImageShort"),alt:"Export as Image",onClick:p}),e.jsx(B,{icon:ht,title:S("popup.exportJSONShort"),alt:"Export as JSON",onClick:c})]})]})},C=b.t.bind(b),jt=a.div`
  margin-top: 8px;
`,At=a.div`
  display: flex;
  padding-left: 4px;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
`,Nt=a.div`
  display: flex;
  gap: 8px;
  align-items: center;
`,Mt=a.div`
  position: relative;
  flex: 1;
  min-width: 0;
`,$t=a.button`
  padding: 10px 16px;
  line-height: 18px;
  background: #ffffff; 
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  flex-shrink: 0;
  font-weight: 600;
  
  &:hover {
    background: #e0f2fe;
    border-color: #bfdbfe;
    color: #1e293b;
  }

  &:active {
    background: #dbeafe;
    border-color: #93c5fd;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  ${t=>t.$saving&&`
    opacity: 0.7;
    background: #f1f5f9;
    border-color: #e5e7eb;
  `}
`,Dt=()=>{const t=je(),{selectedBlock:o,isLoading:d,selectedSpaceId:p,handleBlockSelect:c}=t,[i,l]=n.useState(!1),[u,s]=n.useState(!1),r=()=>{s(!0),t.resetSearchState()},h={...t,handleBlockSelect:async y=>{await c(y),s(!1)}},g=async()=>{if(i)return;if(!await Ee.isAuthenticated()){W("notion_click",{result:"not_login"}),s(!0);return}const{canPerform:A,errorMessage:E}=await j();if(!A){k(E||C("notion.unsupportedOperation"));return}if(!o){k(C("notion.selectFirst")),s(!0);return}l(!0),k.loading(C("notion.savingProgress"),{id:"saving"});try{await $("full-notion"),await w("saveFullChatsToNotion",{block:o,blockId:o.record.id,blockName:o.record.name,blockType:o.record.type,spaceId:p}),W("notion_click",{result:"sended"}),k.success(C("notion.saveSuccessToast"),{id:"saving"})}catch{k(C("notion.saveFailedToast"),{id:"saving"})}finally{l(!1)}},f=()=>o?o.record.name||C("notion.unnamed"):C(d?"notion.loading":"notion.selectDatabaseOrPage"),m=()=>d?e.jsx($e,{size:14,className:"animate-spin"}):o?.record.iconEmoji?De({emoji:o.record.iconEmoji}):o?.record.type==="collection_view"?e.jsx(K,{size:14}):e.jsx(K,{size:14});return e.jsxs(jt,{children:[e.jsxs(At,{children:[C("popup.notionSync"),e.jsx(D,{content:C("popup.notionSyncDesc"),placement:"top",children:e.jsx(re,{style:{cursor:"pointer"},size:12,color:"#999"})})]}),e.jsxs(Nt,{children:[e.jsxs(Mt,{className:"flex-1",children:[e.jsx(Ae,{trigger:r,isLoading:d,displayIcon:m(),displayText:f()||""}),u&&e.jsx(Ne,{notionData:h,onClose:()=>s(!1)})]}),e.jsxs($t,{$saving:i,onClick:g,disabled:i,title:C("notion.save"),children:[e.jsx(Me,{size:14}),C(i?"notion.saving":"notion.save")]})]})]})},Et="https://x.com/ColinGo2030",Wt=a.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  padding: 5px 14px;
  border-top: 1px solid #f1f5f9;
`,zt=a.div`
  display: flex;
  align-items: center;
  gap: 4px;
`,Bt=a.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
`,_=a.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  background: transparent;
  color: #64748b;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
`,Lt=a(_)`
  display: none;
`,Tt=a.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: transparent;
  color: #64748b;
  border: none;
  border-radius: 8px;
  padding: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }

  svg {
    color: inherit;
  }
`,L=b.t.bind(b),Ft=()=>{const t=n.useCallback(async()=>{await W("tutorial",{name:"tutorial"}),window.open(`${he("/docs")}?utm_source=popup`,"_blank")},[]),o=n.useCallback(async()=>{oe("to-feedback-page",{})},[]),d=n.useCallback(async()=>{await W("x",{name:"x"}),window.open(Et,"_blank")},[]),p=n.useCallback(async()=>{await W("settings",{name:"settings"});try{const i=H.runtime.getURL("/options.html");await H.tabs.create({url:i})}catch{}},[]),c=n.useCallback(async()=>{const i=await ke();if(i)try{await H.sidePanel.open({tabId:i}),window.close()}catch{}},[]);return e.jsxs(Wt,{children:[e.jsx(zt,{}),e.jsxs(Bt,{children:[e.jsx(D,{content:L("popup.sidepanelTip"),children:e.jsx(Tt,{onClick:c,children:e.jsx(Fe,{size:18})})}),e.jsx(D,{content:L("ui.viewTutorial"),children:e.jsx(_,{onClick:t,children:e.jsx(ze,{size:18})})}),e.jsx(D,{content:L("ui.feedbackIssue"),children:e.jsx(_,{onClick:o,children:e.jsx(Le,{size:18})})}),e.jsx(D,{content:L("ui.followOnX"),children:e.jsx(Lt,{onClick:d,"aria-label":L("ui.followOnX"),children:e.jsx("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("path",{d:"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"})})})}),e.jsx(D,{content:L("ui.toSettingPage"),children:e.jsx(_,{onClick:p,children:e.jsx(ve,{size:18})})})]})]})};b.t.bind(b);const Pt=a.div`
  user-select: none;
  width: 340px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  color: #333;
  padding: 0;
  background: #ffffff;
  overflow: hidden;
`,_t=()=>{const{currentSiteName:t,connectionStatus:o,isUnsupportedSite:d}=Pe(),{displaySites:p,setDisplaySites:c,handleSiteClick:i,handleReorder:l}=_e(),{customExportClick:u}=se(),[s,r]=n.useState(!0);return n.useEffect(()=>{oe("popup-active",{})},[]),n.useEffect(()=>{W("open_popup",{})},[]),n.useEffect(()=>{(async()=>{try{const x=await be.enabledNotionExport();r(!!x)}catch{r(!0)}})()},[]),e.jsxs(e.Fragment,{children:[e.jsxs(Pt,{children:[e.jsx(Oe,{}),e.jsx(tt,{sites:p,currentSiteName:t,connectionStatus:o,isUnsupportedSite:d,onSiteClick:i,onReorder:l,setDisplaySites:c}),e.jsxs(vt,{children:[e.jsx(St,{children:e.jsx(ct,{onClick:u})}),e.jsx(wt,{}),s&&e.jsx(Dt,{})]}),e.jsx(Ft,{})]}),e.jsx(me,{position:"top-center",reverseOrder:!0,containerStyle:{inset:"10px"},toastOptions:{duration:2e3,style:{background:"rgba(0,0,0,0.8)",color:"#fff"},success:{duration:1e3}}})]})},ne=document.getElementById("app");ne&&Ce.createRoot(ne).render(e.jsx(_t,{}));
