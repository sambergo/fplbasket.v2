(this["webpackJsonpcreate-react-app-with-typescript"]=this["webpackJsonpcreate-react-app-with-typescript"]||[]).push([[0],{150:function(e,t,a){"use strict";a.r(t);var n=a(198),r=a(208),c=a(42),s=a.n(c),i=a(21),l=a(57),j=function(e){return e?"".concat(e.first_name," ").concat(e.web_name):""},u=function(e){switch(e.element_type){case 1:return"GKP";case 2:return"DEF";case 3:return"MID";case 4:return"FWD";default:return""}},o=a(10),d=a(0),b=a(1),O={bssData:null,leagueData:null,gwsData:[],selectedGw:""},x=Object(d.createContext)([O,function(){return O}]),h=function(e){var t=e.reducer,a=e.children,n=Object(d.useReducer)(t,O),r=Object(o.a)(n,2),c=r[0],s=r[1];return Object(b.jsx)(x.Provider,{value:[c,s],children:a})},p=function(){return Object(d.useContext)(x)},g=a(28),f=a.n(g),m=a(44),v=a(197),y=a(209),w=a(210),D=a(204),_=a(205),k=a(199),S=a(202),E=a(214),C=a(191),T=a(78),P=a.n(T),A="/api",G=function(){var e=Object(m.a)(f.a.mark((function e(){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,P.a.get("".concat(A,"/data"));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),L=function(){var e=Object(m.a)(f.a.mark((function e(t){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,P.a.post("".concat(A,"/league"),t);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),I=a(100),B=a.n(I),F=function(){var e=p(),t=Object(o.a)(e,2),a=t[0],n=a.gwsData,r=a.selectedGw,c=t[1],s=Object(d.useState)(!1),i=Object(o.a)(s,2),l=i[0],j=i[1],u=Object(d.useState)(""),O=Object(o.a)(u,2),x=O[0],h=O[1],g=Object(d.useState)(r),v=Object(o.a)(g,2),y=v[0],T=v[1],P=function(){var e=Object(m.a)(f.a.mark((function e(t,a){var n,r,s;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t&&a){e.next=2;break}return e.abrupt("return");case 2:return n={gw:t.toString(),leagueId:a},e.next=5,L(n);case 5:200==(r=e.sent).status&&r.data&&(s=r.data,c({type:"SET_LEAGUE_DATA",payload:s}),c({type:"SET_SELECTED_GW",payload:y}),window.localStorage.setItem("usersPreviousLeagueID",a));case 7:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}();return Object(d.useEffect)((function(){var e=window.localStorage.getItem("usersPreviousLeagueID");e&&h(e)}),[]),Object(d.useEffect)((function(){return T(r)}),[r]),Object(b.jsxs)(b.Fragment,{children:[Object(b.jsx)(C.a,{sx:{my:4},style:{display:"flex",marginTop:"10%"},children:Object(b.jsx)("img",{src:"logo512.png",alt:"logo",style:{margin:"auto",maxWidth:"500px",width:"75%"}})}),Object(b.jsxs)(C.a,{sx:{my:4},style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[Object(b.jsx)(C.a,{style:{width:300,height:20},children:l?Object(b.jsx)("img",{src:"urlpic.png",alt:"urlpic",style:{maxWidth:300}}):null}),Object(b.jsx)(w.a,{margin:"normal",variant:"filled",style:{width:300},children:Object(b.jsx)(D.a,{InputProps:{endAdornment:Object(b.jsx)(C.a,{children:Object(b.jsx)(B.a,{style:{cursor:"pointer"},onClick:function(){return j(!l)}})})},id:"leagueId",value:x,label:"League ID",onChange:function(e){return h(e.target.value)}})}),Object(b.jsxs)(w.a,{margin:"normal",variant:"outlined",style:{width:300},children:[Object(b.jsx)(_.a,{id:"gw",children:"Gameweek"}),Object(b.jsx)(k.a,{labelId:"gw",id:"gw",label:"Gameweek",value:y.toString(),defaultValue:"",onChange:function(e){return T(e.target.value)},children:n.map((function(e){return Object(b.jsxs)(S.a,{value:e.id,children:[" ",e.id," "]},e.id)}))})]}),Object(b.jsx)(E.a,{style:{marginTop:15},size:"large",variant:"contained",onClick:function(){return P(parseInt(y),x)},children:"Go!"})]})]})},M=a(219),W=a(221),R=a(222),U=a(223),J=a(224),N=a(215),q=a(216),z=a(217),H=a(218),K=function(e){var t=e.children,a=e.header,n=void 0===a?null:a;return Object(b.jsx)(N.a,{variant:"elevation",style:{marginBottom:"20px",borderRadius:"5px"},children:Object(b.jsxs)(q.a,{children:[n,Object(b.jsx)(z.a,{children:Object(b.jsx)(H.a,{children:t})})]})})},V=function(){var e=p(),t=Object(o.a)(e,1)[0],a=t.bssData,n=t.leagueData;return a&&(null===n||void 0===n?void 0:n.parsedData)?Object(b.jsxs)(K,{header:Object(b.jsx)(M.a,{title:"Captains",style:{textAlign:"center"}}),children:[Object(b.jsx)(W.a,{children:Object(b.jsxs)(R.a,{children:[Object(b.jsx)(U.a,{children:"Captain"}),Object(b.jsx)(U.a,{children:"Owners"}),Object(b.jsx)(U.a,{children:"#"})]})}),Object(b.jsx)(J.a,{children:n.parsedData.captains.map((function(e){return Object(b.jsxs)(R.a,{children:[Object(b.jsx)(U.a,{children:"".concat(a.elements[e.captain].first_name," ").concat(a.elements[e.captain].web_name)}),Object(b.jsx)(U.a,{children:e.captainedBy.join(", ")}),Object(b.jsxs)(U.a,{children:[e.captainedBy.length," "]})]},e.captain)}))})]}):null},Q=function(){var e=p(),t=Object(o.a)(e,1)[0],a=t.bssData,n=t.leagueData;if(!a||!(null===n||void 0===n?void 0:n.parsedData)||n.parsedData.chips.length<1)return null;var r=function(e){switch(e){case"wildcard":return"Wildcard";case"3xc":return"Triple Captain";case"freehit":return"Freehit";case"bboost":return"Bench Boost";default:return""}};return Object(b.jsxs)(K,{header:Object(b.jsx)(M.a,{title:"Chips played",style:{textAlign:"center"}}),children:[Object(b.jsx)(W.a,{children:Object(b.jsxs)(R.a,{children:[Object(b.jsx)(U.a,{children:"Chip"}),Object(b.jsx)(U.a,{children:"Used by"})]})}),Object(b.jsx)(J.a,{children:n.parsedData.chips.map((function(e){return Object(b.jsxs)(R.a,{children:[Object(b.jsx)(U.a,{children:r(e.chip)}),Object(b.jsx)(U.a,{children:e.usedBy.join(", ")})]},e.chip)}))})]})},X=a(225),Y=a(226),Z=a(201),$=a(227),ee=a(220),te=a(229),ae=a(228),ne=a(101),re=a.n(ne),ce=a(104),se=a.n(ce),ie=a(103),le=a.n(ie),je=a(102),ue=a.n(je),oe={margin:"auto"},de=[{icon:Object(b.jsx)(re.a,{style:oe}),text:"Main"},{icon:Object(b.jsx)(ue.a,{style:oe}),text:"Transfers"},{icon:Object(b.jsx)(le.a,{style:oe}),text:"Standings"},{icon:Object(b.jsx)(se.a,{style:oe}),text:"Data"}],be=function(e){var t=e.page,a=e.setPage,n=p(),r=Object(o.a)(n,2),c=r[0],s=c.leagueData,i=c.selectedGw,l=r[1];return(null===s||void 0===s?void 0:s.league_curr.managers)?Object(b.jsxs)(b.Fragment,{children:[Object(b.jsx)(X.a,{position:"fixed",children:Object(b.jsxs)(Y.a,{style:{background:"#203248"},children:[Object(b.jsx)("img",{onClick:function(){return l({type:"RESET_LEAGUE_DATA",payload:null})},src:"logo192.png",alt:"logo",style:{maxHeight:"75%",maxWidth:80,paddingBlock:5,cursor:"pointer"}}),Object(b.jsx)(v.a,{display:{xs:"none",md:"flex"},children:Object(b.jsx)(Z.a,{style:{marginLeft:15},value:t,onChange:function(e,t){a(t)},children:de.map((function(e){return Object(b.jsx)($.a,{value:e.text.toLowerCase(),icon:e.icon,label:e.text},e.text)}))})}),Object(b.jsx)(ee.a,{style:{marginLeft:"auto"},variant:"h5",children:"".concat(null===s||void 0===s?void 0:s.league_curr.league.name).concat((null===s||void 0===s?void 0:s.league_curr.managers.length)>49?" (Top 50)":"",", Gameweek ").concat(i)})]})}),Object(b.jsx)(v.a,{display:{md:"none"},children:Object(b.jsx)(ae.a,{style:{background:"#203248",position:"fixed",bottom:0,left:0,right:0},value:t,onChange:function(e,t){a(t)},showLabels:!0,children:de.map((function(e){return Object(b.jsx)(te.a,{value:e.text.toLowerCase(),label:e.text,icon:e.icon},e.text)}))})})]}):null},Oe=function(){var e=p(),t=Object(o.a)(e,1)[0],a=t.bssData,n=t.leagueData;if(!a||!n)return null;var r=Object(d.useState)(""),c=Object(o.a)(r,2),s=c[0],i=c[1];return Object(b.jsxs)(K,{header:Object(b.jsx)(b.Fragment,{children:Object(b.jsx)(D.a,{fullWidth:!0,value:s||"",InputProps:{endAdornment:Object(b.jsx)(E.a,{variant:"text",onClick:function(){return i("")},children:"Clear"})},label:"Search from ".concat(n.parsedData.players.length," players..."),onChange:function(e){return i(e.target.value.toLowerCase())}})}),children:[Object(b.jsx)(W.a,{children:Object(b.jsxs)(R.a,{children:[Object(b.jsx)(U.a,{children:"Player"}),Object(b.jsx)(U.a,{children:"Owners"}),Object(b.jsx)(U.a,{children:"#"})]})}),Object(b.jsx)(J.a,{children:function(e,t){return""==e?t:t.filter((function(t){return j(a.elements[t.player]).toLowerCase().includes(e)}))}(s,n.parsedData.players).map((function(e){return Object(b.jsxs)(R.a,{children:[Object(b.jsx)(U.a,{children:"".concat(a.elements[e.player].first_name," ").concat(a.elements[e.player].web_name)}),Object(b.jsx)(U.a,{children:e.ownedBy.join(", ")}),Object(b.jsx)(U.a,{children:e.ownedBy.length})]},e.player)}))})]})},xe=a(207),he=function(e){var t=e.manager,a=e.setManagerPage,n=p(),r=Object(o.a)(n,1)[0].bssData;return(null===r||void 0===r?void 0:r.elements)?Object(b.jsxs)(K,{header:Object(b.jsxs)(xe.a,{container:!0,children:[Object(b.jsx)(xe.a,{item:!0,xs:3,display:"flex",justifyContent:"left",alignItems:"center",children:Object(b.jsx)(E.a,{onClick:function(){return a(null)},variant:"contained",children:"Back"})}),Object(b.jsx)(xe.a,{item:!0,xs:6,children:Object(b.jsx)(M.a,{title:t.manager.player_name,style:{textAlign:"center"}})}),Object(b.jsx)(xe.a,{item:!0,xs:3,children:Object(b.jsx)(M.a,{title:"".concat(t.points,"p")})})]}),children:[Object(b.jsx)(W.a,{children:Object(b.jsxs)(R.a,{children:[Object(b.jsx)(U.a,{children:"Player"}),Object(b.jsx)(U.a,{children:"Team"}),Object(b.jsx)(U.a,{children:"Position"}),Object(b.jsx)(U.a,{children:"Points"})]})}),Object(b.jsx)(J.a,{children:t.manager.gw_team.picks.filter((function(e){return e.multiplier>0})).map((function(e){return Object(b.jsxs)(R.a,{children:[Object(b.jsxs)(U.a,{children:[j(r.elements[e.element]),e.is_captain?" (C)":""]}),Object(b.jsx)(U.a,{children:(t=r.elements[e.element],a=r.teams,a[t.team-1].name||"no")}),Object(b.jsx)(U.a,{children:u(r.elements[e.element])}),Object(b.jsx)(U.a,{children:r.elements[e.element].event_points*e.multiplier})]},e.element);var t,a}))})]}):null},pe=a(107),ge=a.n(pe),fe=a(105),me=a.n(fe),ve=a(106),ye=a.n(ve),we=function(e){var t=e.gwPoints,a=e.totalPoints,n=e.manager,r=e.setManagerPage,c=e.i,s=void 0===c?1:c;return Object(b.jsxs)(R.a,{style:{cursor:"pointer"},onClick:function(){return r(n?{manager:n,points:a}:null)},children:[Object(b.jsx)(U.a,{children:function(){var e=n.last_rank<s?0:n.last_rank>s?2:1,t={marginRight:5,marginBlock:"auto"},a={marginBlock:"auto"},r=function(e,a){return Object(b.jsxs)(v.a,{display:"flex",children:[Object(b.jsx)(ee.a,{style:t,variant:"button",children:e}),a]})};return r(s,0==e?Object(b.jsx)(me.a,{color:"primary",style:a}):1==e?Object(b.jsx)(ye.a,{color:"disabled",style:a}):Object(b.jsx)(ge.a,{color:"error",style:a}))}()}),Object(b.jsx)(U.a,{children:n.player_name}),Object(b.jsx)(U.a,{children:t}),Object(b.jsx)(U.a,{children:a})]},s)},De=function(e){var t=e.managers,a=e.setManagerPage,n=p(),r=Object(o.a)(n,1)[0].bssData;if(!r)return null;var c,s=[],j=Object(l.a)(t);try{for(j.s();!(c=j.n()).done;){var u,d=c.value,O=d.manager.gw_team,x=O.entry_history.total_points-O.entry_history.points,h=0,g=Object(l.a)(d.parsedPicks.active);try{for(g.s();!(u=g.n()).done;){var f=u.value;h+=r.elements[f.element].event_points*f.multiplier}}catch(m){g.e(m)}finally{g.f()}s.push({manager:d.manager,gwPoints:h,totalPoints:x+h,setManagerPage:a})}}catch(m){j.e(m)}finally{j.f()}return s.sort((function(e,t){return t.totalPoints-e.totalPoints})),Object(b.jsx)(b.Fragment,{children:s.map((function(e,t){return Object(b.jsx)(we,Object(i.a)(Object(i.a)({},e),{},{i:t+1}),t)}))})},_e=function(){var e=p(),t=Object(o.a)(e,1)[0],a=t.bssData,n=t.leagueData;if(!(null===n||void 0===n?void 0:n.parsedData)||!a)return null;var r=Object(d.useState)(null),c=Object(o.a)(r,2),s=c[0],i=c[1];return s?Object(b.jsx)(he,{setManagerPage:i,manager:s}):Object(b.jsx)(b.Fragment,{children:Object(b.jsxs)(K,{header:Object(b.jsx)(M.a,{title:"Standings",style:{textAlign:"center"}}),children:[Object(b.jsx)(W.a,{children:Object(b.jsxs)(R.a,{children:[Object(b.jsx)(U.a,{children:"Rank"}),Object(b.jsx)(U.a,{children:"Manager"}),Object(b.jsx)(U.a,{children:"GW"}),Object(b.jsx)(U.a,{children:"Tot"})]})}),Object(b.jsx)(J.a,{children:Object(b.jsx)(De,{setManagerPage:i,managers:n.parsedData.managers})})]})})},ke=function(){var e,t=p(),a=Object(o.a)(t,1)[0],n=a.bssData,r=a.leagueData;return n&&(null===r||void 0===r||null===(e=r.parsedData)||void 0===e?void 0:e.transfers)?Object(b.jsxs)(K,{children:[Object(b.jsx)(W.a,{children:Object(b.jsxs)(R.a,{children:[Object(b.jsx)(U.a,{children:"Manager"}),Object(b.jsx)(U.a,{children:"Transfers in"}),Object(b.jsx)(U.a,{children:"Transfers out"})]})}),Object(b.jsx)(J.a,{children:r.parsedData.transfers.map((function(e){var t,a;return Object(b.jsxs)(R.a,{children:[Object(b.jsx)(U.a,{children:e.managerName}),Object(b.jsx)(U.a,{children:null!==(t=e.chip)&&void 0!==t?t:e.transfersIn.map((function(e){return j(n.elements[e])})).join(", ")}),Object(b.jsx)(U.a,{children:null!==(a=e.chip)&&void 0!==a?a:e.transfersOut.map((function(e){return j(n.elements[e])})).join(", ")})]},e.managerName)}))})]}):null},Se=function(){var e=Object(d.useState)("main"),t=Object(o.a)(e,2),a=t[0],n=t[1];return Object(b.jsxs)(b.Fragment,{children:[Object(b.jsx)(be,{page:a,setPage:n}),Object(b.jsx)(v.a,{marginTop:20,children:function(e){switch(e){case"main":return Object(b.jsxs)(b.Fragment,{children:[Object(b.jsx)(Q,{}),Object(b.jsx)(V,{}),Object(b.jsx)(Oe,{})]});case"transfers":return Object(b.jsx)(ke,{});case"standings":return Object(b.jsx)(_e,{});default:return null}}(a)})]})};function Ee(){var e=p(),t=Object(o.a)(e,2),a=t[0],n=(a.bssData,a.leagueData),r=t[1];return Object(d.useEffect)((function(){(function(){var e=Object(m.a)(f.a.mark((function e(){var t,a;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,G();case 2:200==(t=e.sent).status&&t.data?(a=t.data,r({type:"SET_BSS_DATA",payload:a})):alert("The game is being updated.");case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()()}),[]),Object(b.jsx)(y.a,{maxWidth:"lg",children:Object(b.jsx)(v.a,{height:"100vh",children:n?Object(b.jsx)(Se,{}):Object(b.jsx)(F,{})})})}var Ce=a(83),Te=a(47),Pe=Object(Ce.a)({palette:{mode:"dark",background:{default:"#171c24",paper:"#222b36"},primary:{main:"#556cd6"},secondary:{main:"#19857b"},error:{main:Te.a.A400}}});s.a.render(Object(b.jsxs)(r.a,{theme:Pe,children:[Object(b.jsx)(n.a,{}),Object(b.jsx)(h,{reducer:function(e,t){switch(t.type){case"SET_BSS_DATA":var a=function(e){var t,a=e.filter((function(e){return e.finished})),n=Object(l.a)(e);try{for(n.s();!(t=n.n()).done;){var r=t.value,c=new Date-new Date(r.deadline_time);!r.finished&&c>12e5&&a.push(r)}}catch(s){n.e(s)}finally{n.f()}return a.reverse()}(t.payload.events);return Object(i.a)(Object(i.a)({},e),{},{bssData:Object(i.a)({},t.payload),gwsData:a,selectedGw:a[0].id.toString()});case"SET_LEAGUE_DATA":return Object(i.a)(Object(i.a)({},e),{},{leagueData:Object(i.a)({},t.payload)});case"RESET_LEAGUE_DATA":return Object(i.a)(Object(i.a)({},e),{},{leagueData:null});case"SET_SELECTED_GW":return Object(i.a)(Object(i.a)({},e),{},{selectedGw:t.payload});default:return e}},children:Object(b.jsx)(Ee,{})})]}),document.querySelector("#root"))}},[[150,1,2]]]);
//# sourceMappingURL=main.5739ab7a.chunk.js.map