(this["webpackJsonpFPL-Basket"]=this["webpackJsonpFPL-Basket"]||[]).push([[0],{163:function(e,t,a){"use strict";a.r(t);var n=a(212),r=a(222),c=a(46),s=a.n(c),i=a(23),l=a(62),j=function(e){return e?"".concat(e.first_name," ").concat(e.second_name):""},u=function(e){return e?e.web_name:""},o=function(e){switch(e.element_type){case 1:return"GKP";case 2:return"DEF";case 3:return"MID";case 4:return"FWD";default:return""}},d=a(10),b=a(0),x=a(1),O={bssData:null,leagueData:null,gwsData:[],selectedGw:""},h=Object(b.createContext)([O,function(){return O}]),g=function(e){var t=e.reducer,a=e.children,n=Object(b.useReducer)(t,O),r=Object(d.a)(n,2),c=r[0],s=r[1];return Object(x.jsx)(h.Provider,{value:[c,s],children:a})},p=function(){return Object(b.useContext)(h)},m=a(22),f=a.n(m),v=a(41),y=a(211),w=a(223),_=a(81),D=a(224),S=a(218),k=a(219),C=a(213),T=a(216),E=a(228),A=a(205),P=a(83),B=a.n(P),L="/api",I=function(){var e=Object(v.a)(f.a.mark((function e(){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,B.a.get("".concat(L,"/data"));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),G=function(){var e=Object(v.a)(f.a.mark((function e(t){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,B.a.post("".concat(L,"/league"),t);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),F=a(107),M=a.n(F),W=function(){var e=p(),t=Object(d.a)(e,2),a=t[0],n=a.gwsData,r=a.selectedGw,c=t[1],s=Object(b.useState)(!1),i=Object(d.a)(s,2),l=i[0],j=i[1],u=Object(b.useState)(""),o=Object(d.a)(u,2),O=o[0],h=o[1],g=Object(b.useState)(r),m=Object(d.a)(g,2),y=m[0],w=m[1],_=Object(b.useState)(!1),P=Object(d.a)(_,2),B=P[0],L=P[1],I=function(){var e=Object(v.a)(f.a.mark((function e(t,a){var n,r,s;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t&&a){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,L(!0),n={gw:t.toString(),leagueId:a},e.next=7,G(n);case 7:200==(r=e.sent).status&&r.data&&(s=r.data,c({type:"SET_LEAGUE_DATA",payload:s}),y&&c({type:"SET_SELECTED_GW",payload:y}),window.localStorage.setItem("usersPreviousLeagueID",a),L(!1)),e.next=15;break;case 11:e.prev=11,e.t0=e.catch(2),alert("No league found"),L(!1);case 15:case"end":return e.stop()}}),e,null,[[2,11]])})));return function(t,a){return e.apply(this,arguments)}}();return Object(b.useEffect)((function(){var e=window.localStorage.getItem("usersPreviousLeagueID");e&&h(e)}),[]),Object(b.useEffect)((function(){w(r);var e=window.location.pathname.match(/[0-9]/g);e&&(console.log("idFromBrowser:",r,e.join("")),I(parseInt(r),e.join("").toString()))}),[r]),Object(x.jsxs)(x.Fragment,{children:[Object(x.jsx)(A.a,{sx:{my:4},style:{display:"flex",marginTop:"10%"},children:Object(x.jsx)("img",{src:"/images/logo512.png",alt:"logo",style:{margin:"auto",maxWidth:"500px",width:"75%"}})}),Object(x.jsxs)(A.a,{sx:{my:4},style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[Object(x.jsx)(A.a,{style:{width:300,height:20},children:l?Object(x.jsx)("img",{src:"/images/urlpic.png",alt:"urlpic",style:{maxWidth:300}}):null}),Object(x.jsx)(D.a,{margin:"normal",variant:"filled",style:{width:300},children:Object(x.jsx)(S.a,{InputProps:{endAdornment:Object(x.jsx)(A.a,{children:Object(x.jsx)(M.a,{style:{cursor:"pointer"},onClick:function(){return j(!l)}})})},id:"leagueId",value:O,label:"League ID",onChange:function(e){return h(e.target.value)}})}),Object(x.jsxs)(D.a,{margin:"normal",variant:"outlined",style:{width:300},children:[Object(x.jsx)(k.a,{id:"gw",children:"Gameweek"}),Object(x.jsx)(C.a,{labelId:"gw",id:"gw",label:"Gameweek",value:y.toString(),defaultValue:"",onChange:function(e){return w(e.target.value)},children:n.map((function(e){return Object(x.jsxs)(T.a,{value:e.id,children:[" ",e.id," "]},e.id)}))})]}),Object(x.jsx)(E.a,{style:{marginTop:15},disabled:B,size:"large",variant:"contained",onClick:function(){return I(parseInt(y),O)},children:B?"Loading...":"Go!"})]})]})},R=a(233),U=a(235),z=a(236),N=a(237),V=a(238),J=a(229),q=a(230),H=a(231),K=a(232),Q=function(e){var t=e.children,a=e.header,n=void 0===a?null:a;return Object(x.jsx)(J.a,{variant:"elevation",style:{marginBottom:"20px",borderRadius:"5px"},children:Object(x.jsxs)(q.a,{children:[n,Object(x.jsx)(H.a,{children:Object(x.jsx)(K.a,{children:t})})]})})},X=function(){var e=p(),t=Object(d.a)(e,1)[0],a=t.bssData,n=t.leagueData;return a&&(null===n||void 0===n?void 0:n.parsedData)?Object(x.jsxs)(Q,{header:Object(x.jsx)(R.a,{title:"Captains",style:{textAlign:"center"}}),children:[Object(x.jsx)(U.a,{children:Object(x.jsxs)(z.a,{children:[Object(x.jsx)(N.a,{children:"Captain"}),Object(x.jsx)(N.a,{children:"Owners"}),Object(x.jsx)(N.a,{children:"#"})]})}),Object(x.jsx)(V.a,{children:n.parsedData.captains.map((function(e){return Object(x.jsxs)(z.a,{children:[Object(x.jsx)(N.a,{children:u(a.elements[e.captain])}),Object(x.jsx)(N.a,{children:e.captainedBy.join(", ")}),Object(x.jsxs)(N.a,{children:[e.captainedBy.length," "]})]},e.captain)}))})]}):null},Y=function(){var e=p(),t=Object(d.a)(e,1)[0],a=t.bssData,n=t.leagueData;if(!a||!(null===n||void 0===n?void 0:n.parsedData)||n.parsedData.chips.length<1)return null;var r=function(e){switch(e){case"wildcard":return"Wildcard";case"3xc":return"Triple Captain";case"freehit":return"Freehit";case"bboost":return"Bench Boost";default:return""}};return Object(x.jsxs)(Q,{header:Object(x.jsx)(R.a,{title:"Chips played",style:{textAlign:"center"}}),children:[Object(x.jsx)(U.a,{children:Object(x.jsxs)(z.a,{children:[Object(x.jsx)(N.a,{children:"Chip"}),Object(x.jsx)(N.a,{children:"Used by"})]})}),Object(x.jsx)(V.a,{children:n.parsedData.chips.map((function(e){return Object(x.jsxs)(z.a,{children:[Object(x.jsx)(N.a,{children:r(e.chip)}),Object(x.jsx)(N.a,{children:e.usedBy.join(", ")})]},e.chip)}))})]})},Z=function(){var e=p(),t=Object(d.a)(e,1)[0].leagueData;return Object(x.jsxs)(Q,{header:Object(x.jsx)(R.a,{title:"Team values",style:{textAlign:"center"}}),children:[Object(x.jsx)(U.a,{children:Object(x.jsxs)(z.a,{children:[Object(x.jsx)(N.a,{children:"Manager"}),Object(x.jsx)(N.a,{children:"Value"})]})}),Object(x.jsx)(V.a,{children:null===t||void 0===t?void 0:t.parsedData.managers.sort((function(e,t){return t.manager.gw_team.entry_history.value-e.manager.gw_team.entry_history.value})).map((function(e){return Object(x.jsxs)(z.a,{children:[Object(x.jsx)(N.a,{children:e.manager.player_name}),Object(x.jsx)(N.a,{children:(e.manager.gw_team.entry_history.value/10).toFixed(1)})]},e.manager.id)}))})]})},$=a(239),ee=a(240),te=a(215),ae=a(241),ne=a(234),re=a(243),ce=a(242),se=a(108),ie=a.n(se),le=a(111),je=a.n(le),ue=a(110),oe=a.n(ue),de=a(109),be=a.n(de),xe=a(16),Oe=a(89),he=a(50),ge="#13181F",pe=Object(Oe.a)({palette:{mode:"dark",background:{default:"#171c24",paper:"#222b36"},primary:{main:"#556cd6"},secondary:{main:"#19857b"},error:{main:he.a.A400}}}),me={margin:"auto"},fe=[{icon:Object(x.jsx)(ie.a,{style:me}),text:"Main"},{icon:Object(x.jsx)(be.a,{style:me}),text:"Transfers"},{icon:Object(x.jsx)(oe.a,{style:me}),text:"Standings"},{icon:Object(x.jsx)(je.a,{style:me}),text:"Data"}],ve=function(e){var t=e.page,a=e.setPage,n=p(),r=Object(d.a)(n,2),c=r[0],s=c.leagueData,i=c.selectedGw,l=c.gwsData,j=r[1];if(!(null===s||void 0===s?void 0:s.league_curr.managers))return null;var u=l[0].id.toString()==i,o=Object(xe.d)();return Object(x.jsxs)(x.Fragment,{children:[Object(x.jsx)($.a,{position:"fixed",children:Object(x.jsxs)(ee.a,{style:{background:ge},children:[Object(x.jsx)("img",{onClick:function(){j({type:"RESET_LEAGUE_DATA",payload:null}),o.push("/")},src:"/images/logo192.png",alt:"logo",style:{maxHeight:"75%",maxWidth:80,paddingBlock:7,cursor:"pointer"}}),Object(x.jsx)(y.a,{display:{xs:"none",md:"flex"},children:Object(x.jsx)(te.a,{style:{marginLeft:15},value:t,onChange:function(e,t){a(t)},children:fe.map((function(e){return Object(x.jsx)(ae.a,{value:e.text.toLowerCase(),icon:e.icon,label:e.text,disabled:"Standings"==e.text&&!u},e.text)}))})}),Object(x.jsx)(ne.a,{style:{marginLeft:"auto"},variant:"h5",children:"".concat(null===s||void 0===s?void 0:s.league_curr.league.name).concat((null===s||void 0===s?void 0:s.league_curr.managers.length)>49?" (Top 50)":"",", Gameweek ").concat(i)})]})}),Object(x.jsx)(y.a,{display:{md:"none"},children:Object(x.jsx)(ce.a,{style:{zIndex:999999999,background:ge,position:"fixed",bottom:0,left:0,right:0},value:t,onChange:function(e,t){a(t)},showLabels:!0,children:fe.map((function(e){return Object(x.jsx)(re.a,{value:e.text.toLowerCase(),label:e.text,icon:e.icon},e.text)}))})})]})},ye=function(){var e=p(),t=Object(d.a)(e,1)[0],a=t.bssData,n=t.leagueData;if(!a||!n)return null;var r=Object(b.useState)(""),c=Object(d.a)(r,2),s=c[0],i=c[1];return Object(x.jsxs)(Q,{header:Object(x.jsx)(x.Fragment,{children:Object(x.jsx)(S.a,{fullWidth:!0,value:s||"",InputProps:{endAdornment:Object(x.jsx)(E.a,{variant:"text",onClick:function(){return i("")},children:"Clear"})},label:"Search from ".concat(n.parsedData.players.length," players..."),onChange:function(e){return i(e.target.value.toLowerCase())}})}),children:[Object(x.jsx)(U.a,{children:Object(x.jsxs)(z.a,{children:[Object(x.jsx)(N.a,{children:"Player"}),Object(x.jsx)(N.a,{children:"Owners"}),Object(x.jsx)(N.a,{children:"#"})]})}),Object(x.jsx)(V.a,{children:function(e,t){return""==e?t:t.filter((function(t){return j(a.elements[t.player]).toLowerCase().includes(e)}))}(s,n.parsedData.players).map((function(e){return Object(x.jsxs)(z.a,{children:[Object(x.jsx)(N.a,{children:u(a.elements[e.player])}),Object(x.jsx)(N.a,{children:e.ownedBy.join(", ")}),Object(x.jsx)(N.a,{children:e.ownedBy.length})]},e.player)}))})]})},we=a(221),_e=function(e){var t=e.manager,a=e.setManagerPage,n=p(),r=Object(d.a)(n,1)[0].bssData;return(null===r||void 0===r?void 0:r.elements)?Object(x.jsxs)(Q,{header:Object(x.jsxs)(we.a,{container:!0,children:[Object(x.jsx)(we.a,{item:!0,xs:3,display:"flex",justifyContent:"left",alignItems:"center",children:Object(x.jsx)(E.a,{onClick:function(){return a(null)},variant:"contained",children:"Back"})}),Object(x.jsx)(we.a,{item:!0,xs:6,children:Object(x.jsx)(R.a,{title:t.manager.player_name,style:{textAlign:"center"}})}),Object(x.jsx)(we.a,{item:!0,xs:3})]}),children:[Object(x.jsx)(U.a,{children:Object(x.jsxs)(z.a,{children:[Object(x.jsx)(N.a,{children:"Player"}),Object(x.jsx)(N.a,{children:"Team"}),Object(x.jsx)(N.a,{children:"Position"}),Object(x.jsx)(N.a,{children:"Points"})]})}),Object(x.jsxs)(V.a,{children:[t.manager.gw_team.picks.filter((function(e){return e.multiplier>0})).map((function(e){return Object(x.jsxs)(z.a,{children:[Object(x.jsxs)(N.a,{children:[j(r.elements[e.element]),e.is_captain?" (C)":"",e.is_vice_captain?" (V)":""]}),Object(x.jsx)(N.a,{children:(t=r.elements[e.element],a=r.teams,a[t.team-1].name||"no")}),Object(x.jsx)(N.a,{children:o(r.elements[e.element])}),Object(x.jsx)(N.a,{children:r.elements[e.element].event_points*e.multiplier})]},e.element);var t,a})),Object(x.jsxs)(z.a,{children:[Object(x.jsx)(N.a,{children:"Transfers cost"}),Object(x.jsx)(N.a,{}),Object(x.jsx)(N.a,{}),Object(x.jsx)(N.a,{children:-1*t.manager.gw_team.entry_history.event_transfers_cost})]}),Object(x.jsxs)(z.a,{children:[Object(x.jsx)(N.a,{children:"Total"}),Object(x.jsx)(N.a,{}),Object(x.jsx)(N.a,{}),Object(x.jsx)(N.a,{children:t.points})]})]})]}):null},De=a(115),Se=a.n(De),ke=a(113),Ce=a.n(ke),Te=a(114),Ee=a.n(Te),Ae=a(116),Pe=a.n(Ae),Be=a(244),Le=function(e){var t=e.gwPoints,a=e.totalPoints,n=e.manager,r=e.setManagerPage,c=e.i,s=void 0===c?1:c;return Object(x.jsxs)(z.a,{style:{cursor:"pointer"},onClick:function(){return r(n?{manager:n,points:t}:null)},children:[Object(x.jsx)(N.a,{children:function(){console.log("getrank:",n.last_rank,s,n.player_name);var e=n.last_rank>s?0:n.last_rank<s?2:1,t={marginRight:5,marginBlock:"auto"},a={marginBlock:"auto"},r=function(e,a){return Object(x.jsxs)(y.a,{display:"flex",children:[Object(x.jsx)(ne.a,{style:t,variant:"button",children:e}),a]})};return r(s,0==e?Object(x.jsx)(Ce.a,{color:"primary",style:a}):1==e?Object(x.jsx)(Ee.a,{color:"disabled",style:a}):Object(x.jsx)(Se.a,{color:"error",style:a}))}()}),Object(x.jsx)(N.a,{children:n.player_name}),Object(x.jsx)(N.a,{children:t}),Object(x.jsx)(N.a,{children:a})]},s)},Ie=function(e){var t=e.managers,a=e.setManagerPage,n=p(),r=Object(d.a)(n,1)[0].bssData;if(!r)return null;var c,s=[],j=Object(l.a)(t);try{for(j.s();!(c=j.n()).done;){var u,o=c.value,b=o.manager.gw_team,O=b.entry_history.total_points-b.entry_history.points,h=-1*b.entry_history.event_transfers_cost,g=Object(l.a)(o.parsedPicks.active);try{for(g.s();!(u=g.n()).done;){var m=u.value;h+=r.elements[m.element].event_points*m.multiplier}}catch(f){g.e(f)}finally{g.f()}s.push({manager:o.manager,gwPoints:h,totalPoints:O+h,setManagerPage:a})}}catch(f){j.e(f)}finally{j.f()}return s.sort((function(e,t){return t.totalPoints-e.totalPoints})),Object(x.jsx)(x.Fragment,{children:s.map((function(e,t){return Object(x.jsx)(Le,Object(i.a)(Object(i.a)({},e),{},{i:t+1}),t)}))})},Ge=function(){var e=p(),t=Object(d.a)(e,2),a=t[0],n=a.bssData,r=a.leagueData,c=t[1];if(!(null===r||void 0===r?void 0:r.parsedData)||!n)return null;var s=Object(b.useState)(null),i=Object(d.a)(s,2),l=i[0],j=i[1],u=Object(b.useState)(!1),o=Object(d.a)(u,2),O=o[0],h=o[1],g=function(){var e=Object(v.a)(f.a.mark((function e(){var t,a;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return h(!0),e.next=3,I();case 3:200==(t=e.sent).status&&t.data?(a=t.data,c({type:"SET_BSS_DATA",payload:a})):alert("Refresh failed"),h(!1);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return l?Object(x.jsx)(_e,{setManagerPage:j,manager:l}):Object(x.jsx)(x.Fragment,{children:Object(x.jsxs)(Q,{header:Object(x.jsxs)(we.a,{container:!0,alignContent:"space-between",children:[Object(x.jsx)(we.a,{item:!0,xs:2,children:" "}),Object(x.jsx)(we.a,{item:!0,xs:8,children:Object(x.jsx)(R.a,{title:"Standings",style:{textAlign:"center"}})}),Object(x.jsx)(we.a,{container:!0,item:!0,xs:2,alignContent:"center",children:Object(x.jsx)(Be.a,{disabled:O,onClick:function(){return g()},style:{margin:"auto",cursor:"pointer"},children:Object(x.jsx)(Pe.a,{fontSize:"large"})})})]}),children:[Object(x.jsx)(U.a,{children:Object(x.jsxs)(z.a,{children:[Object(x.jsx)(N.a,{children:"Rank"}),Object(x.jsx)(N.a,{children:"Manager"}),Object(x.jsx)(N.a,{children:"GW"}),Object(x.jsx)(N.a,{children:"Tot"})]})}),Object(x.jsx)(V.a,{children:Object(x.jsx)(Ie,{setManagerPage:j,managers:r.parsedData.managers})})]})})},Fe=function(){var e,t=p(),a=Object(d.a)(t,1)[0],n=a.bssData,r=a.leagueData;return n&&(null===r||void 0===r||null===(e=r.parsedData)||void 0===e?void 0:e.transfers)?Object(x.jsxs)(Q,{header:Object(x.jsx)(R.a,{title:"Transfers",style:{textAlign:"center"}}),children:[Object(x.jsx)(U.a,{children:Object(x.jsxs)(z.a,{children:[Object(x.jsx)(N.a,{children:"Manager"}),Object(x.jsx)(N.a,{children:"In"}),Object(x.jsx)(N.a,{children:"Out"}),Object(x.jsx)(N.a,{children:"-"})]})}),Object(x.jsx)(V.a,{children:r.parsedData.transfers.map((function(e){var t,a;return Object(x.jsxs)(z.a,{children:[Object(x.jsx)(N.a,{children:e.managerName}),Object(x.jsx)(N.a,{children:null!==(t=e.chip)&&void 0!==t?t:e.transfersIn.map((function(e){return u(n.elements[e])})).join(", ")}),Object(x.jsx)(N.a,{children:null!==(a=e.chip)&&void 0!==a?a:e.transfersOut.map((function(e){return u(n.elements[e])})).join(", ")}),Object(x.jsx)(N.a,{children:0!==e.transfersCost?-1*e.transfersCost:""})]},e.managerName)}))})]}):null},Me=function(){var e=Object(b.useState)("main"),t=Object(d.a)(e,2),a=t[0],n=t[1];return Object(x.jsxs)(x.Fragment,{children:[Object(x.jsx)(ve,{page:a,setPage:n}),Object(x.jsx)(y.a,{paddingBottom:10,marginTop:20,children:function(e){switch(e){case"main":return Object(x.jsxs)(x.Fragment,{children:[Object(x.jsx)(Y,{}),Object(x.jsx)(X,{}),Object(x.jsx)(ye,{})]});case"transfers":return Object(x.jsx)(Fe,{});case"standings":return Object(x.jsx)(Ge,{});case"data":return Object(x.jsx)(Z,{});default:return null}}(a)})]})};function We(){var e=p(),t=Object(d.a)(e,2),a=t[0].leagueData,n=t[1];return Object(b.useEffect)((function(){(function(){var e=Object(v.a)(f.a.mark((function e(){var t,a;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,I();case 2:200==(t=e.sent).status&&t.data?(a=t.data,n({type:"SET_BSS_DATA",payload:a})):alert("The game is being updated.");case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()()}),[]),Object(x.jsx)(_.a,{children:Object(x.jsx)(w.a,{maxWidth:"lg",children:Object(x.jsx)(y.a,{height:"100vh",children:a?Object(x.jsx)(Me,{}):Object(x.jsx)(W,{})})})})}s.a.render(Object(x.jsxs)(r.a,{theme:pe,children:[Object(x.jsx)(n.a,{}),Object(x.jsx)(g,{reducer:function(e,t){switch(t.type){case"SET_BSS_DATA":var a=function(e){var t,a=e.filter((function(e){return e.finished})),n=Object(l.a)(e);try{for(n.s();!(t=n.n()).done;){var r=t.value,c=new Date-new Date(r.deadline_time);!r.finished&&c>12e5&&a.push(r)}}catch(s){n.e(s)}finally{n.f()}return a.reverse()}(t.payload.events);return Object(i.a)(Object(i.a)({},e),{},{bssData:Object(i.a)({},t.payload),gwsData:a,selectedGw:a[0].id.toString()});case"SET_LEAGUE_DATA":return Object(i.a)(Object(i.a)({},e),{},{leagueData:Object(i.a)({},t.payload)});case"RESET_LEAGUE_DATA":return Object(i.a)(Object(i.a)({},e),{},{leagueData:null});case"SET_SELECTED_GW":return Object(i.a)(Object(i.a)({},e),{},{selectedGw:t.payload});default:return e}},children:Object(x.jsx)(We,{})})]}),document.querySelector("#root"))}},[[163,1,2]]]);
//# sourceMappingURL=main.c9871351.chunk.js.map