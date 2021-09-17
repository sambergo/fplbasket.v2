(this["webpackJsonpFPL-Basket"]=this["webpackJsonpFPL-Basket"]||[]).push([[0],{162:function(e,t,a){"use strict";a.r(t);var n=a(210),r=a(220),c=a(45),s=a.n(c),i=a(22),l=a(61),j=function(e){return e?"".concat(e.first_name," ").concat(e.second_name):""},u=function(e){return e?e.web_name:""},o=function(e){switch(e.element_type){case 1:return"GKP";case 2:return"DEF";case 3:return"MID";case 4:return"FWD";default:return""}},d=a(11),b=a(0),x=a(1),O={bssData:null,leagueData:null,gwsData:[],selectedGw:""},h=Object(b.createContext)([O,function(){return O}]),g=function(e){var t=e.reducer,a=e.children,n=Object(b.useReducer)(t,O),r=Object(d.a)(n,2),c=r[0],s=r[1];return Object(x.jsx)(h.Provider,{value:[c,s],children:a})},p=function(){return Object(b.useContext)(h)},m=a(32),f=a.n(m),v=a(47),y=a(209),w=a(221),D=a(81),_=a(222),k=a(216),S=a(217),C=a(211),E=a(214),T=a(226),P=a(203),A=a(83),B=a.n(A),I="/api",L=function(){var e=Object(v.a)(f.a.mark((function e(){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,B.a.get("".concat(I,"/data"));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),G=function(){var e=Object(v.a)(f.a.mark((function e(t){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,B.a.post("".concat(I,"/league"),t);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),F=a(107),M=a.n(F),W=function(){var e=p(),t=Object(d.a)(e,2),a=t[0],n=a.gwsData,r=a.selectedGw,c=t[1],s=Object(b.useState)(!1),i=Object(d.a)(s,2),l=i[0],j=i[1],u=Object(b.useState)(""),o=Object(d.a)(u,2),O=o[0],h=o[1],g=Object(b.useState)(r),m=Object(d.a)(g,2),y=m[0],w=m[1],D=function(){var e=Object(v.a)(f.a.mark((function e(t,a){var n,r,s;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t&&a){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,n={gw:t.toString(),leagueId:a},e.next=6,G(n);case 6:200==(r=e.sent).status&&r.data&&(s=r.data,c({type:"SET_LEAGUE_DATA",payload:s}),c({type:"SET_SELECTED_GW",payload:y}),window.localStorage.setItem("usersPreviousLeagueID",a)),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(2),alert("No league found");case 13:case"end":return e.stop()}}),e,null,[[2,10]])})));return function(t,a){return e.apply(this,arguments)}}();return Object(b.useEffect)((function(){var e=window.localStorage.getItem("usersPreviousLeagueID");e&&h(e)}),[]),Object(b.useEffect)((function(){w(r);var e=window.location.pathname.match(/[0-9]/g);e&&(console.log("idFromBrowser:",r,e.join("")),D(parseInt(r),e.join("").toString()))}),[r]),Object(x.jsxs)(x.Fragment,{children:[Object(x.jsx)(P.a,{sx:{my:4},style:{display:"flex",marginTop:"10%"},children:Object(x.jsx)("img",{src:"/images/logo512.png",alt:"logo",style:{margin:"auto",maxWidth:"500px",width:"75%"}})}),Object(x.jsxs)(P.a,{sx:{my:4},style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[Object(x.jsx)(P.a,{style:{width:300,height:20},children:l?Object(x.jsx)("img",{src:"/images/urlpic.png",alt:"urlpic",style:{maxWidth:300}}):null}),Object(x.jsx)(_.a,{margin:"normal",variant:"filled",style:{width:300},children:Object(x.jsx)(k.a,{InputProps:{endAdornment:Object(x.jsx)(P.a,{children:Object(x.jsx)(M.a,{style:{cursor:"pointer"},onClick:function(){return j(!l)}})})},id:"leagueId",value:O,label:"League ID",onChange:function(e){return h(e.target.value)}})}),Object(x.jsxs)(_.a,{margin:"normal",variant:"outlined",style:{width:300},children:[Object(x.jsx)(S.a,{id:"gw",children:"Gameweek"}),Object(x.jsx)(C.a,{labelId:"gw",id:"gw",label:"Gameweek",value:y.toString(),defaultValue:"",onChange:function(e){return w(e.target.value)},children:n.map((function(e){return Object(x.jsxs)(E.a,{value:e.id,children:[" ",e.id," "]},e.id)}))})]}),Object(x.jsx)(T.a,{style:{marginTop:15},size:"large",variant:"contained",onClick:function(){return D(parseInt(y),O)},children:"Go!"})]})]})},R=a(231),U=a(233),N=a(234),V=a(235),z=a(236),J=a(227),q=a(228),H=a(229),K=a(230),Q=function(e){var t=e.children,a=e.header,n=void 0===a?null:a;return Object(x.jsx)(J.a,{variant:"elevation",style:{marginBottom:"20px",borderRadius:"5px"},children:Object(x.jsxs)(q.a,{children:[n,Object(x.jsx)(H.a,{children:Object(x.jsx)(K.a,{children:t})})]})})},X=function(){var e=p(),t=Object(d.a)(e,1)[0],a=t.bssData,n=t.leagueData;return a&&(null===n||void 0===n?void 0:n.parsedData)?Object(x.jsxs)(Q,{header:Object(x.jsx)(R.a,{title:"Captains",style:{textAlign:"center"}}),children:[Object(x.jsx)(U.a,{children:Object(x.jsxs)(N.a,{children:[Object(x.jsx)(V.a,{children:"Captain"}),Object(x.jsx)(V.a,{children:"Owners"}),Object(x.jsx)(V.a,{children:"#"})]})}),Object(x.jsx)(z.a,{children:n.parsedData.captains.map((function(e){return Object(x.jsxs)(N.a,{children:[Object(x.jsx)(V.a,{children:u(a.elements[e.captain])}),Object(x.jsx)(V.a,{children:e.captainedBy.join(", ")}),Object(x.jsxs)(V.a,{children:[e.captainedBy.length," "]})]},e.captain)}))})]}):null},Y=function(){var e=p(),t=Object(d.a)(e,1)[0],a=t.bssData,n=t.leagueData;if(!a||!(null===n||void 0===n?void 0:n.parsedData)||n.parsedData.chips.length<1)return null;var r=function(e){switch(e){case"wildcard":return"Wildcard";case"3xc":return"Triple Captain";case"freehit":return"Freehit";case"bboost":return"Bench Boost";default:return""}};return Object(x.jsxs)(Q,{header:Object(x.jsx)(R.a,{title:"Chips played",style:{textAlign:"center"}}),children:[Object(x.jsx)(U.a,{children:Object(x.jsxs)(N.a,{children:[Object(x.jsx)(V.a,{children:"Chip"}),Object(x.jsx)(V.a,{children:"Used by"})]})}),Object(x.jsx)(z.a,{children:n.parsedData.chips.map((function(e){return Object(x.jsxs)(N.a,{children:[Object(x.jsx)(V.a,{children:r(e.chip)}),Object(x.jsx)(V.a,{children:e.usedBy.join(", ")})]},e.chip)}))})]})},Z=function(){var e=p(),t=Object(d.a)(e,1)[0].leagueData;return Object(x.jsxs)(Q,{header:Object(x.jsx)(R.a,{title:"Team values",style:{textAlign:"center"}}),children:[Object(x.jsx)(U.a,{children:Object(x.jsxs)(N.a,{children:[Object(x.jsx)(V.a,{children:"Manager"}),Object(x.jsx)(V.a,{children:"Value"})]})}),Object(x.jsx)(z.a,{children:null===t||void 0===t?void 0:t.parsedData.managers.sort((function(e,t){return t.manager.gw_team.entry_history.value-e.manager.gw_team.entry_history.value})).map((function(e){return Object(x.jsxs)(N.a,{children:[Object(x.jsx)(V.a,{children:e.manager.player_name}),Object(x.jsx)(V.a,{children:(e.manager.gw_team.entry_history.value/10).toFixed(1)})]},e.manager.id)}))})]})},$=a(237),ee=a(238),te=a(213),ae=a(239),ne=a(232),re=a(241),ce=a(240),se=a(108),ie=a.n(se),le=a(111),je=a.n(le),ue=a(110),oe=a.n(ue),de=a(109),be=a.n(de),xe=a(16),Oe=a(89),he=a(50),ge="#13181F",pe=Object(Oe.a)({palette:{mode:"dark",background:{default:"#171c24",paper:"#222b36"},primary:{main:"#556cd6"},secondary:{main:"#19857b"},error:{main:he.a.A400}}}),me={margin:"auto"},fe=[{icon:Object(x.jsx)(ie.a,{style:me}),text:"Main"},{icon:Object(x.jsx)(be.a,{style:me}),text:"Transfers"},{icon:Object(x.jsx)(oe.a,{style:me}),text:"Standings"},{icon:Object(x.jsx)(je.a,{style:me}),text:"Data"}],ve=function(e){var t=e.page,a=e.setPage,n=p(),r=Object(d.a)(n,2),c=r[0],s=c.leagueData,i=c.selectedGw,l=c.gwsData,j=r[1];if(!(null===s||void 0===s?void 0:s.league_curr.managers))return null;var u=l[0].id.toString()==i,o=Object(xe.d)();return Object(x.jsxs)(x.Fragment,{children:[Object(x.jsx)($.a,{position:"fixed",children:Object(x.jsxs)(ee.a,{style:{background:ge},children:[Object(x.jsx)("img",{onClick:function(){j({type:"RESET_LEAGUE_DATA",payload:null}),o.push("/")},src:"/images/logo192.png",alt:"logo",style:{maxHeight:"75%",maxWidth:80,paddingBlock:7,cursor:"pointer"}}),Object(x.jsx)(y.a,{display:{xs:"none",md:"flex"},children:Object(x.jsx)(te.a,{style:{marginLeft:15},value:t,onChange:function(e,t){a(t)},children:fe.map((function(e){return Object(x.jsx)(ae.a,{value:e.text.toLowerCase(),icon:e.icon,label:e.text,disabled:"Standings"==e.text&&!u},e.text)}))})}),Object(x.jsx)(ne.a,{style:{marginLeft:"auto"},variant:"h5",children:"".concat(null===s||void 0===s?void 0:s.league_curr.league.name).concat((null===s||void 0===s?void 0:s.league_curr.managers.length)>49?" (Top 50)":"",", Gameweek ").concat(i)})]})}),Object(x.jsx)(y.a,{display:{md:"none"},children:Object(x.jsx)(ce.a,{style:{zIndex:999999999,background:ge,position:"fixed",bottom:0,left:0,right:0},value:t,onChange:function(e,t){a(t)},showLabels:!0,children:fe.map((function(e){return Object(x.jsx)(re.a,{value:e.text.toLowerCase(),label:e.text,icon:e.icon},e.text)}))})})]})},ye=function(){var e=p(),t=Object(d.a)(e,1)[0],a=t.bssData,n=t.leagueData;if(!a||!n)return null;var r=Object(b.useState)(""),c=Object(d.a)(r,2),s=c[0],i=c[1];return Object(x.jsxs)(Q,{header:Object(x.jsx)(x.Fragment,{children:Object(x.jsx)(k.a,{fullWidth:!0,value:s||"",InputProps:{endAdornment:Object(x.jsx)(T.a,{variant:"text",onClick:function(){return i("")},children:"Clear"})},label:"Search from ".concat(n.parsedData.players.length," players..."),onChange:function(e){return i(e.target.value.toLowerCase())}})}),children:[Object(x.jsx)(U.a,{children:Object(x.jsxs)(N.a,{children:[Object(x.jsx)(V.a,{children:"Player"}),Object(x.jsx)(V.a,{children:"Owners"}),Object(x.jsx)(V.a,{children:"#"})]})}),Object(x.jsx)(z.a,{children:function(e,t){return""==e?t:t.filter((function(t){return j(a.elements[t.player]).toLowerCase().includes(e)}))}(s,n.parsedData.players).map((function(e){return Object(x.jsxs)(N.a,{children:[Object(x.jsx)(V.a,{children:u(a.elements[e.player])}),Object(x.jsx)(V.a,{children:e.ownedBy.join(", ")}),Object(x.jsx)(V.a,{children:e.ownedBy.length})]},e.player)}))})]})},we=a(219),De=function(e){var t=e.manager,a=e.setManagerPage,n=p(),r=Object(d.a)(n,1)[0].bssData;return(null===r||void 0===r?void 0:r.elements)?Object(x.jsxs)(Q,{header:Object(x.jsxs)(we.a,{container:!0,children:[Object(x.jsx)(we.a,{item:!0,xs:3,display:"flex",justifyContent:"left",alignItems:"center",children:Object(x.jsx)(T.a,{onClick:function(){return a(null)},variant:"contained",children:"Back"})}),Object(x.jsx)(we.a,{item:!0,xs:6,children:Object(x.jsx)(R.a,{title:t.manager.player_name,style:{textAlign:"center"}})}),Object(x.jsx)(we.a,{item:!0,xs:3})]}),children:[Object(x.jsx)(U.a,{children:Object(x.jsxs)(N.a,{children:[Object(x.jsx)(V.a,{children:"Player"}),Object(x.jsx)(V.a,{children:"Team"}),Object(x.jsx)(V.a,{children:"Position"}),Object(x.jsx)(V.a,{children:"Points"})]})}),Object(x.jsxs)(z.a,{children:[t.manager.gw_team.picks.filter((function(e){return e.multiplier>0})).map((function(e){return Object(x.jsxs)(N.a,{children:[Object(x.jsxs)(V.a,{children:[j(r.elements[e.element]),e.is_captain?" (C)":"",e.is_vice_captain?" (V)":""]}),Object(x.jsx)(V.a,{children:(t=r.elements[e.element],a=r.teams,a[t.team-1].name||"no")}),Object(x.jsx)(V.a,{children:o(r.elements[e.element])}),Object(x.jsx)(V.a,{children:r.elements[e.element].event_points*e.multiplier})]},e.element);var t,a})),Object(x.jsxs)(N.a,{children:[Object(x.jsx)(V.a,{children:"Total"}),Object(x.jsx)(V.a,{}),Object(x.jsx)(V.a,{}),Object(x.jsx)(V.a,{children:t.points})]})]})]}):null},_e=a(115),ke=a.n(_e),Se=a(113),Ce=a.n(Se),Ee=a(114),Te=a.n(Ee),Pe=function(e){var t=e.gwPoints,a=e.totalPoints,n=e.manager,r=e.setManagerPage,c=e.i,s=void 0===c?1:c;return Object(x.jsxs)(N.a,{style:{cursor:"pointer"},onClick:function(){return r(n?{manager:n,points:t}:null)},children:[Object(x.jsx)(V.a,{children:function(){var e=n.last_rank<s?0:n.last_rank>s?2:1,t={marginRight:5,marginBlock:"auto"},a={marginBlock:"auto"},r=function(e,a){return Object(x.jsxs)(y.a,{display:"flex",children:[Object(x.jsx)(ne.a,{style:t,variant:"button",children:e}),a]})};return r(s,0==e?Object(x.jsx)(Ce.a,{color:"primary",style:a}):1==e?Object(x.jsx)(Te.a,{color:"disabled",style:a}):Object(x.jsx)(ke.a,{color:"error",style:a}))}()}),Object(x.jsx)(V.a,{children:n.player_name}),Object(x.jsx)(V.a,{children:t}),Object(x.jsx)(V.a,{children:a})]},s)},Ae=function(e){var t=e.managers,a=e.setManagerPage,n=p(),r=Object(d.a)(n,1)[0].bssData;if(!r)return null;var c,s=[],j=Object(l.a)(t);try{for(j.s();!(c=j.n()).done;){var u,o=c.value,b=o.manager.gw_team,O=b.entry_history.total_points-b.entry_history.points,h=0,g=Object(l.a)(o.parsedPicks.active);try{for(g.s();!(u=g.n()).done;){var m=u.value;h+=r.elements[m.element].event_points*m.multiplier}}catch(f){g.e(f)}finally{g.f()}s.push({manager:o.manager,gwPoints:h,totalPoints:O+h,setManagerPage:a})}}catch(f){j.e(f)}finally{j.f()}return s.sort((function(e,t){return t.totalPoints-e.totalPoints})),Object(x.jsx)(x.Fragment,{children:s.map((function(e,t){return Object(x.jsx)(Pe,Object(i.a)(Object(i.a)({},e),{},{i:t+1}),t)}))})},Be=function(){var e=p(),t=Object(d.a)(e,1)[0],a=t.bssData,n=t.leagueData;if(!(null===n||void 0===n?void 0:n.parsedData)||!a)return null;var r=Object(b.useState)(null),c=Object(d.a)(r,2),s=c[0],i=c[1];return s?Object(x.jsx)(De,{setManagerPage:i,manager:s}):Object(x.jsx)(x.Fragment,{children:Object(x.jsxs)(Q,{header:Object(x.jsx)(R.a,{title:"Standings",style:{textAlign:"center"}}),children:[Object(x.jsx)(U.a,{children:Object(x.jsxs)(N.a,{children:[Object(x.jsx)(V.a,{children:"Rank"}),Object(x.jsx)(V.a,{children:"Manager"}),Object(x.jsx)(V.a,{children:"GW"}),Object(x.jsx)(V.a,{children:"Tot"})]})}),Object(x.jsx)(z.a,{children:Object(x.jsx)(Ae,{setManagerPage:i,managers:n.parsedData.managers})})]})})},Ie=function(){var e,t=p(),a=Object(d.a)(t,1)[0],n=a.bssData,r=a.leagueData;return n&&(null===r||void 0===r||null===(e=r.parsedData)||void 0===e?void 0:e.transfers)?Object(x.jsxs)(Q,{header:Object(x.jsx)(R.a,{title:"Transfers",style:{textAlign:"center"}}),children:[Object(x.jsx)(U.a,{children:Object(x.jsxs)(N.a,{children:[Object(x.jsx)(V.a,{children:"Manager"}),Object(x.jsx)(V.a,{children:"In"}),Object(x.jsx)(V.a,{children:"Out"}),Object(x.jsx)(V.a,{children:"-"})]})}),Object(x.jsx)(z.a,{children:r.parsedData.transfers.map((function(e){var t,a;return Object(x.jsxs)(N.a,{children:[Object(x.jsx)(V.a,{children:e.managerName}),Object(x.jsx)(V.a,{children:null!==(t=e.chip)&&void 0!==t?t:e.transfersIn.map((function(e){return u(n.elements[e])})).join(", ")}),Object(x.jsx)(V.a,{children:null!==(a=e.chip)&&void 0!==a?a:e.transfersOut.map((function(e){return u(n.elements[e])})).join(", ")}),Object(x.jsx)(V.a,{children:0!==e.transfersCost?-1*e.transfersCost:""})]},e.managerName)}))})]}):null},Le=function(){var e=Object(b.useState)("main"),t=Object(d.a)(e,2),a=t[0],n=t[1];return Object(x.jsxs)(x.Fragment,{children:[Object(x.jsx)(ve,{page:a,setPage:n}),Object(x.jsx)(y.a,{paddingBottom:10,marginTop:20,children:function(e){switch(e){case"main":return Object(x.jsxs)(x.Fragment,{children:[Object(x.jsx)(Y,{}),Object(x.jsx)(X,{}),Object(x.jsx)(ye,{})]});case"transfers":return Object(x.jsx)(Ie,{});case"standings":return Object(x.jsx)(Be,{});case"data":return Object(x.jsx)(Z,{});default:return null}}(a)})]})};function Ge(){var e=p(),t=Object(d.a)(e,2),a=t[0],n=(a.bssData,a.leagueData),r=t[1];return Object(b.useEffect)((function(){(function(){var e=Object(v.a)(f.a.mark((function e(){var t,a;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,L();case 2:200==(t=e.sent).status&&t.data?(a=t.data,r({type:"SET_BSS_DATA",payload:a})):alert("The game is being updated.");case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()()}),[]),Object(x.jsx)(D.a,{children:Object(x.jsx)(w.a,{maxWidth:"lg",children:Object(x.jsx)(y.a,{height:"100vh",children:n?Object(x.jsx)(Le,{}):Object(x.jsx)(W,{})})})})}s.a.render(Object(x.jsxs)(r.a,{theme:pe,children:[Object(x.jsx)(n.a,{}),Object(x.jsx)(g,{reducer:function(e,t){switch(t.type){case"SET_BSS_DATA":var a=function(e){var t,a=e.filter((function(e){return e.finished})),n=Object(l.a)(e);try{for(n.s();!(t=n.n()).done;){var r=t.value,c=new Date-new Date(r.deadline_time);!r.finished&&c>12e5&&a.push(r)}}catch(s){n.e(s)}finally{n.f()}return a.reverse()}(t.payload.events);return Object(i.a)(Object(i.a)({},e),{},{bssData:Object(i.a)({},t.payload),gwsData:a,selectedGw:a[0].id.toString()});case"SET_LEAGUE_DATA":return Object(i.a)(Object(i.a)({},e),{},{leagueData:Object(i.a)({},t.payload)});case"RESET_LEAGUE_DATA":return Object(i.a)(Object(i.a)({},e),{},{leagueData:null});case"SET_SELECTED_GW":return Object(i.a)(Object(i.a)({},e),{},{selectedGw:t.payload});default:return e}},children:Object(x.jsx)(Ge,{})})]}),document.querySelector("#root"))}},[[162,1,2]]]);
//# sourceMappingURL=main.e7e784a7.chunk.js.map