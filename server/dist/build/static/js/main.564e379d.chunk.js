(this["webpackJsonpfpl-basket"]=this["webpackJsonpfpl-basket"]||[]).push([[0],{166:function(e,t,n){"use strict";n.r(t);var a=n(213),r=n(224),c=n(47),i=n.n(c),s=n(19),l=n(65),j=function(e){if(!e)return"";var t=(e.first_name.length<10?e.first_name:e.first_name.split(" ")[0])+" "+e.second_name;return t.length<20?t:e.web_name},o=function(e){return e?e.web_name:""},u=function(e){switch(e.element_type){case 1:return"GKP";case 2:return"DEF";case 3:return"MID";case 4:return"FWD";default:return""}},d=function(e){return e?e.element_type:0},b=function(e,t){return t[e.team-1].short_name||"no"},x=function(e,t){var n=t.elements[e];return n?n.explain.map((function(e){var n=t.fixtures[e.fixture];return(null===n||void 0===n?void 0:n.finished_provisional)?"\ud83c\udfc1":"\ud83c\udfc7"})).join(""):""},O=function(e,t){var n=t.reduce((function(t,n){var a=e.elements[n.element];return!a||n.multiplier<1?t:a.explain.filter((function(t){var n;return!(null===(n=e.fixtures[t.fixture])||void 0===n?void 0:n.finished_provisional)})).length+t}),0),a=t.reduce((function(t,n){var a=e.elements[n.element];return!a||n.multiplier<1?t:a.explain.length+t}),0);return 0===n?"\u2705":n+" / "+a},h=function(e,t){var n;if(!e)return 0;var a=t?0:null!==(n=e.live_bps)&&void 0!==n?n:0;return console.log("minusLiveBonus:",a),e.stats.total_points-a},m=n(9),f=n(1),p=n(0),g={bssData:null,leagueData:null,gwsData:[],selectedGw:"",liveData:null,showLiveBonus:!0,showLiveBonusDisabled:!0},v=Object(f.createContext)([g,function(){return g}]),y=function(e){var t=e.reducer,n=e.children,a=Object(f.useReducer)(t,g),r=Object(m.a)(a,2),c=r[0],i=r[1];return Object(p.jsx)(v.Provider,{value:[c,i],children:n})},_=function(){return Object(f.useContext)(v)},w=n(18),D=n.n(w),k=n(33),S=n(212),E=n(225),B=n(83),C=n(226),P=n(219),T=n(230),L=n(108),A=n.n(L),I=n(206),G=n(69),F=n.n(G),M="/api",W=function(){var e=Object(k.a)(D.a.mark((function e(){return D.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.a.get("".concat(M,"/data"));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),R=function(){var e=Object(k.a)(D.a.mark((function e(t){return D.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.a.post("".concat(M,"/league"),t);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),U=function(){var e=Object(k.a)(D.a.mark((function e(t){return D.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.a.post("".concat(M,"/live"),t);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),V=function(){var e=_(),t=Object(m.a)(e,2),n=t[0].selectedGw,a=t[1],r=Object(f.useState)(!1),c=Object(m.a)(r,2),i=c[0],s=c[1],l=Object(f.useState)(""),j=Object(m.a)(l,2),o=j[0],u=j[1],d=Object(f.useState)(!1),b=Object(m.a)(d,2),x=b[0],O=b[1],h=function(){var e=Object(k.a)(D.a.mark((function e(t,r){var c,i,s,l,j,o;return D.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t&&r){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,c={gw:t.toString()},e.next=6,U(c);case 6:200==(i=e.sent).status&&i.data&&(s=i.data,a({type:"SET_LIVE_ELEMENTS",payload:s})),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(2),console.log("error:",e.t0);case 13:return e.prev=13,O(!0),l={gw:t.toString(),leagueId:r},e.next=18,R(l);case 18:200==(j=e.sent).status&&j.data&&(o=j.data,n&&a({type:"SET_SELECTED_GW",payload:n}),window.localStorage.setItem("usersPreviousLeagueID",r),a({type:"SET_LEAGUE_DATA",payload:o}),O(!1)),e.next=26;break;case 22:e.prev=22,e.t1=e.catch(13),alert("No league found or FPL is being updated"),O(!1);case 26:case"end":return e.stop()}}),e,null,[[2,10],[13,22]])})));return function(t,n){return e.apply(this,arguments)}}();return Object(f.useEffect)((function(){var e=window.localStorage.getItem("usersPreviousLeagueID");e&&u(e)}),[]),Object(f.useEffect)((function(){var e=window.location.pathname.match(/[0-9]/g);e&&h(parseInt(n),e.join("").toString())}),[n]),Object(p.jsxs)(p.Fragment,{children:[Object(p.jsx)(I.a,{sx:{my:4},style:{display:"flex",marginTop:"10%"},children:Object(p.jsx)("img",{src:"/images/logo512.png",alt:"logo",style:{margin:"auto",maxWidth:"500px",width:"75%"}})}),Object(p.jsxs)(I.a,{sx:{my:4},style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[Object(p.jsx)(I.a,{style:{width:300,height:20},children:i?Object(p.jsx)("img",{src:"/images/urlpic.png",alt:"urlpic",style:{maxWidth:300}}):null}),Object(p.jsx)(C.a,{margin:"normal",variant:"filled",style:{width:300},children:Object(p.jsx)(P.a,{InputProps:{endAdornment:Object(p.jsx)(I.a,{children:Object(p.jsx)(A.a,{style:{cursor:"pointer"},onClick:function(){return s(!i)}})})},id:"leagueId",onKeyPress:function(e){"Enter"===e.key&&h(parseInt(n),o)},value:o,label:"League ID",onChange:function(e){return u(e.target.value)}})}),Object(p.jsx)(T.a,{style:{marginTop:15},disabled:x,size:"large",variant:"contained",onClick:function(){return h(parseInt(n),o)},children:x?"Loading...":"Go!"})]})]})},N=n(235),z=n(237),H=n(238),J=n(239),K=n(240),q=n(231),Q=n(232),X=n(233),Y=n(234),Z=function(e){var t=e.children,n=e.header,a=void 0===n?null:n;return Object(p.jsx)(q.a,{variant:"elevation",style:{marginBottom:"20px",borderRadius:"5px"},children:Object(p.jsxs)(Q.a,{children:[a,Object(p.jsx)(X.a,{children:Object(p.jsx)(Y.a,{children:t})})]})})},$=function(){var e=_(),t=Object(m.a)(e,1)[0],n=t.bssData,a=t.leagueData;return n&&(null===a||void 0===a?void 0:a.parsedData)?Object(p.jsxs)(Z,{header:Object(p.jsx)(N.a,{title:"Captains",style:{textAlign:"center"}}),children:[Object(p.jsx)(z.a,{children:Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:"Captain"}),Object(p.jsx)(J.a,{children:"Owners"}),Object(p.jsx)(J.a,{children:"#"})]})}),Object(p.jsx)(K.a,{children:a.parsedData.captains.map((function(e){return Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:o(n.elements[e.captain])}),Object(p.jsx)(J.a,{children:e.captainedBy.join(", ")}),Object(p.jsxs)(J.a,{children:[e.captainedBy.length," "]})]},e.captain)}))})]}):null},ee=function(e){switch(e){case"wildcard":return"Wildcard";case"3xc":return"Triple Captain";case"freehit":return"Freehit";case"bboost":return"Bench Boost";default:return""}},te=function(){var e=_(),t=Object(m.a)(e,1)[0],n=t.bssData,a=t.leagueData;return!n||!(null===a||void 0===a?void 0:a.parsedData)||a.parsedData.chips.length<1?null:Object(p.jsxs)(Z,{header:Object(p.jsx)(N.a,{title:"Chips played",style:{textAlign:"center"}}),children:[Object(p.jsx)(z.a,{children:Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:"Chip"}),Object(p.jsx)(J.a,{children:"Used by"})]})}),Object(p.jsx)(K.a,{children:a.parsedData.chips.map((function(e){return Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:ee(e.chip)}),Object(p.jsx)(J.a,{children:e.usedBy.join(", ")})]},e.chip)}))})]})},ne=function(){var e=_(),t=Object(m.a)(e,1)[0].leagueData;return Object(p.jsxs)(Z,{header:Object(p.jsx)(N.a,{title:"Team values",style:{textAlign:"center"}}),children:[Object(p.jsx)(z.a,{children:Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:"Manager"}),Object(p.jsx)(J.a,{children:"Value"})]})}),Object(p.jsx)(K.a,{children:null===t||void 0===t?void 0:t.parsedData.managers.sort((function(e,t){return t.manager.gw_team.entry_history.value-e.manager.gw_team.entry_history.value})).map((function(e){return Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:e.manager.player_name}),Object(p.jsx)(J.a,{children:(e.manager.gw_team.entry_history.value/10).toFixed(1)})]},e.manager.id)}))})]})},ae=n(241),re=n(242),ce=n(216),ie=n(243),se=n(236),le=n(245),je=n(244),oe=n(109),ue=n.n(oe),de=n(112),be=n.n(de),xe=n(111),Oe=n.n(xe),he=n(110),me=n.n(he),fe=n(17),pe=n(90),ge=n(51),ve="#13181F",ye=Object(pe.a)({palette:{mode:"dark",background:{default:"#171c24",paper:"#222b36"},primary:{main:"#556cd6"},secondary:{main:"#19857b"},error:{main:ge.a.A400}}}),_e={margin:"auto"},we=[{icon:Object(p.jsx)(ue.a,{style:_e}),text:"Main"},{icon:Object(p.jsx)(me.a,{style:_e}),text:"Transfers"},{icon:Object(p.jsx)(Oe.a,{style:_e}),text:"Standings"},{icon:Object(p.jsx)(be.a,{style:_e}),text:"Values"}],De=function(e){var t=e.page,n=e.setPage,a=_(),r=Object(m.a)(a,2),c=r[0],i=c.leagueData,s=c.selectedGw,l=c.gwsData,j=r[1];if(!(null===i||void 0===i?void 0:i.league_curr.managers))return null;var o=l[0].id.toString()==s,u=Object(fe.d)();return Object(p.jsxs)(p.Fragment,{children:[Object(p.jsx)(ae.a,{position:"fixed",children:Object(p.jsxs)(re.a,{style:{background:ve},children:[Object(p.jsx)("img",{onClick:function(){j({type:"RESET_LEAGUE_DATA",payload:null}),u.push("/")},src:"/images/logo192.png",alt:"logo",style:{maxHeight:"75%",maxWidth:80,paddingBlock:7,cursor:"pointer"}}),Object(p.jsx)(S.a,{display:{xs:"none",md:"flex"},children:Object(p.jsx)(ce.a,{style:{marginLeft:15},value:t,onChange:function(e,t){n(t)},children:we.map((function(e){return Object(p.jsx)(ie.a,{value:e.text.toLowerCase(),icon:e.icon,label:e.text,disabled:"Standings"==e.text&&!o},e.text)}))})}),Object(p.jsx)(se.a,{style:{marginLeft:"auto"},variant:"h5",children:"".concat(null===i||void 0===i?void 0:i.league_curr.league.name).concat((null===i||void 0===i?void 0:i.league_curr.managers.length)>49?" (Top 50)":"",", Gameweek ").concat(s)})]})}),Object(p.jsx)(S.a,{display:{md:"none"},children:Object(p.jsx)(je.a,{style:{zIndex:999999999,background:ve,position:"fixed",bottom:0,left:0,right:0},value:t,onChange:function(e,t){n(t)},showLabels:!0,children:we.map((function(e){return Object(p.jsx)(le.a,{value:e.text.toLowerCase(),label:e.text,icon:e.icon},e.text)}))})})]})},ke=function(){var e=_(),t=Object(m.a)(e,1)[0],n=t.bssData,a=t.leagueData;if(!n||!a)return null;var r=Object(f.useState)(""),c=Object(m.a)(r,2),i=c[0],s=c[1];return Object(p.jsxs)(Z,{header:Object(p.jsx)(p.Fragment,{children:Object(p.jsx)(P.a,{fullWidth:!0,value:i||"",InputProps:{endAdornment:Object(p.jsx)(T.a,{variant:"text",onClick:function(){return s("")},children:"Clear"})},label:"Search from ".concat(a.parsedData.players.length," players..."),onChange:function(e){return s(e.target.value.toLowerCase())}})}),children:[Object(p.jsx)(z.a,{children:Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:"Player"}),Object(p.jsx)(J.a,{children:"Owners"}),Object(p.jsx)(J.a,{children:"#"})]})}),Object(p.jsx)(K.a,{children:function(e,t){return""==e?t:t.filter((function(t){return j(n.elements[t.player]).toLowerCase().includes(e)}))}(i,a.parsedData.players).map((function(e){return Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:o(n.elements[e.player])}),Object(p.jsx)(J.a,{children:e.ownedBy.join(", ")}),Object(p.jsx)(J.a,{children:e.ownedBy.length})]},e.player)}))})]})},Se=n(223),Ee=n(249),Be=n(115),Ce=n.n(Be),Pe=n(114),Te=n.n(Pe),Le=n(116),Ae=n.n(Le),Ie=n(117),Ge=n.n(Ie),Fe=n(246),Me=function(e){var t=e.manager,n=_(),a=Object(m.a)(n,1)[0].selectedGw;return Object(p.jsx)(I.a,{children:Object(p.jsxs)(Z,{header:Object(p.jsx)(N.a,{title:"Chips used",style:{textAlign:"center"}}),children:[Object(p.jsx)(z.a,{children:Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:"GW"}),Object(p.jsx)(J.a,{children:"Chip"})]})}),Object(p.jsx)(K.a,{children:t.history.chips.map((function(e){return e.event===parseInt(a)?Object(p.jsxs)(H.a,{style:{backgroundColor:ye.palette.secondary.main},children:[Object(p.jsx)(J.a,{children:e.event}),Object(p.jsx)(J.a,{children:ee(e.name||"")})]},e.event):Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:e.event}),Object(p.jsx)(J.a,{children:ee(e.name||"")})]},e.event)}))})]})})},We=n(220),Re=n(214),Ue=n(217),Ve=function(e){var t=e.headerText,n=e.team1,a=e.team2,r=_(),c=Object(m.a)(r,1)[0].bssData;return Object(p.jsxs)(Se.a,{xs:12,sm:6,md:4,item:!0,direction:"column",children:[Object(p.jsx)(se.a,{variant:"h6",children:t}),n.gw_team.picks.filter((function(e){return e.multiplier>0&&!a.gw_team.picks.filter((function(e){return e.multiplier>0})).map((function(e){return e.element})).includes(e.element)})).sort((function(e,t){return d(null===c||void 0===c?void 0:c.elements[e.element])-d(null===c||void 0===c?void 0:c.elements[t.element])})).map((function(e){return Object(p.jsx)(se.a,{variant:"body2",children:j((null===c||void 0===c?void 0:c.elements[e.element])||null)},e.element)}))]})},Ne=function(e){var t,n=e.manager,a=Object(f.useState)(null),r=Object(m.a)(a,2),c=r[0],i=r[1],s=_(),l=Object(m.a)(s,1)[0],o=l.leagueData,u=l.bssData;return Object(p.jsx)(I.a,{children:Object(p.jsx)(q.a,{variant:"elevation",style:{marginBottom:"20px",borderRadius:"5px"},children:Object(p.jsxs)(Q.a,{children:[Object(p.jsx)(N.a,{title:"Compare to",style:{textAlign:"center"}}),Object(p.jsxs)(C.a,{fullWidth:!0,children:[Object(p.jsx)(We.a,{id:"compare-id",children:"Select another manager"}),Object(p.jsx)(Re.a,{variant:"standard",labelId:"compare-id",id:"compare-select",label:"Compare to",onChange:function(e){var t=parseInt(e.target.value)||0,n=(null===o||void 0===o?void 0:o.parsedData.managers[t].manager)||null;i(n)},children:null===o||void 0===o||null===(t=o.parsedData)||void 0===t?void 0:t.managers.map((function(e,t){return Object(p.jsx)(Ue.a,{value:t,children:e.manager.player_name},t)}))})]}),n&&c?Object(p.jsx)(Se.a,{container:!0,marginTop:5,children:Object(p.jsxs)(Se.a,{item:!0,container:!0,display:"flex",justifyContent:"left",children:[Object(p.jsx)(Ve,{headerText:n.player_name,team1:n,team2:c}),Object(p.jsx)(Ve,{headerText:c.player_name,team1:c,team2:n}),Object(p.jsxs)(Se.a,{xs:12,sm:6,md:4,item:!0,direction:"column",children:[Object(p.jsx)(se.a,{variant:"h6",children:"Mutual"}),c.gw_team.picks.filter((function(e){return n.gw_team.picks.map((function(e){return e.element})).includes(e.element)})).sort((function(e,t){return d(null===u||void 0===u?void 0:u.elements[e.element])-d(null===u||void 0===u?void 0:u.elements[t.element])})).map((function(e){return Object(p.jsx)(se.a,{variant:"body2",children:j((null===u||void 0===u?void 0:u.elements[e.element])||null)},e.element)}))]})]})}):null]})})})},ze=function(e){var t,n,a=e.playerPick,r=e.setPlayerPick,c=_(),i=Object(m.a)(c,1)[0],s=i.bssData,l=i.liveData,j=i.leagueData,o=i.showLiveBonus,u=null===l||void 0===l||null===(t=l.elements[a.element])||void 0===t?void 0:t.explain;return(null===s||void 0===s?void 0:s.elements)&&u?Object(p.jsx)(p.Fragment,{children:Object(p.jsxs)(Z,{header:Object(p.jsxs)(Se.a,{container:!0,children:[Object(p.jsx)(Se.a,{item:!0,xs:3,display:"flex",justifyContent:"left",alignItems:"center",children:Object(p.jsx)(T.a,{onClick:function(){return r(null)},variant:"contained",children:"Back"})}),Object(p.jsx)(Se.a,{item:!0,xs:6,children:Object(p.jsx)(N.a,{title:s.elements[a.element].first_name+" "+s.elements[a.element].second_name,style:{textAlign:"center"}})}),Object(p.jsx)(Se.a,{item:!0,xs:3,display:"flex",direction:"column",justifyContent:"center",alignItems:"center"})]}),children:[u.map((function(e,t){var n=l.fixtures[e.fixture],a=s.teams.find((function(e){return e.id==(null===n||void 0===n?void 0:n.team_h)})),r=s.teams.find((function(e){return e.id==(null===n||void 0===n?void 0:n.team_a)}));return Object(p.jsxs)(K.a,{children:[Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{style:{borderBottom:0},children:Object(p.jsx)(N.a,{title:"".concat(null===a||void 0===a?void 0:a.name," - ").concat(null===r||void 0===r?void 0:r.name),style:{textAlign:"left"}})}),Object(p.jsx)(J.a,{style:{borderBottom:0},children:"Amount"}),Object(p.jsx)(J.a,{style:{borderBottom:0},children:"Points"})]}),e.stats.filter((function(e){return o||"live_bonus"!==e.identifier})).map((function(e){return Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:e.identifier.charAt(0).toUpperCase()+e.identifier.slice(1).replace("_"," ")}),Object(p.jsx)(J.a,{children:e.value}),Object(p.jsx)(J.a,{children:e.points})]},e.identifier)}))]},t)})),Object(p.jsxs)(K.a,{children:[Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{style:{borderBottom:0}}),Object(p.jsx)(J.a,{style:{borderBottom:0}}),Object(p.jsx)(J.a,{style:{borderBottom:0}})]}),Object(p.jsxs)(H.a,{style:{backgroundColor:ve},children:[Object(p.jsx)(J.a,{style:{borderBottom:0},children:"Total"}),Object(p.jsx)(J.a,{style:{borderBottom:0}}),Object(p.jsx)(J.a,{style:{borderBottom:0},children:h(l.elements[a.element],o)})]}),Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{style:{borderBottom:0}}),Object(p.jsx)(J.a,{style:{borderBottom:0}}),Object(p.jsx)(J.a,{style:{borderBottom:0}})]}),Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:"Owned by"}),Object(p.jsx)(J.a,{children:null===j||void 0===j||null===(n=j.parsedData.players.find((function(e){return e.player===a.element})))||void 0===n?void 0:n.ownedBy.join(", ")})]})]})]})}):null},He=function(e){var t=e.manager,n=e.setManagerPage,a=Object(f.useState)(null),r=Object(m.a)(a,2),c=r[0],i=r[1],s=_(),l=Object(m.a)(s,1)[0],o=l.bssData,d=l.liveData,O=l.selectedGw,g=l.showLiveBonus;return(null===o||void 0===o?void 0:o.elements)&&(null===d||void 0===d?void 0:d.elements)?c?Object(p.jsx)(ze,{setPlayerPick:i,playerPick:c}):Object(p.jsxs)(p.Fragment,{children:[Object(p.jsxs)(Z,{header:Object(p.jsxs)(Se.a,{container:!0,children:[Object(p.jsx)(Se.a,{item:!0,xs:3,display:"flex",justifyContent:"left",alignItems:"center",children:Object(p.jsx)(T.a,{onClick:function(){return n(null)},variant:"contained",children:"Back"})}),Object(p.jsx)(Se.a,{item:!0,xs:6,children:Object(p.jsx)(N.a,{title:t.manager.player_name,style:{textAlign:"center"}})}),Object(p.jsx)(Se.a,{item:!0,xs:3,display:"flex",justifyContent:"center",alignItems:"center",children:Object(p.jsx)(Fe.a,{href:"https://fantasy.premierleague.com/entry/".concat(t.manager.entry,"/event/").concat(O,"/"),target:"_blank",rel:"noreferrer",children:Object(p.jsx)(T.a,{variant:"contained",children:"FPL"})})})]}),children:[Object(p.jsx)(z.a,{children:Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:"Player"}),Object(p.jsx)(J.a,{children:"Team"}),Object(p.jsx)(J.a,{children:"Position"}),Object(p.jsx)(J.a,{children:"Points"})]})}),Object(p.jsxs)(K.a,{children:[t.manager.gw_team.picks.filter((function(e){return e.multiplier>0})).map((function(e){return Object(p.jsxs)(H.a,{onClick:function(){return i(e)},style:{cursor:"pointer"},children:[Object(p.jsxs)(J.a,{children:[Object(p.jsx)(Fe.a,{children:j(o.elements[e.element])}),e.is_captain?" \u24b8 ":" ",e.is_vice_captain?" \u24cb ":" ",x(e.element,d)]}),Object(p.jsx)(J.a,{children:b(o.elements[e.element],o.teams)}),Object(p.jsx)(J.a,{children:u(o.elements[e.element])}),Object(p.jsx)(J.a,{children:h(d.elements[e.element],g)*e.multiplier})]},e.element)})),0==t.manager.gw_team.entry_history.event_transfers_cost?null:Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:"Transfers cost"}),Object(p.jsx)(J.a,{}),Object(p.jsx)(J.a,{}),Object(p.jsx)(J.a,{children:-1*t.manager.gw_team.entry_history.event_transfers_cost})]}),Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:"Total"}),Object(p.jsx)(J.a,{}),Object(p.jsx)(J.a,{}),Object(p.jsx)(J.a,{children:t.points})]})]})]}),Object(p.jsxs)(Z,{header:Object(p.jsx)(N.a,{title:"Bench",style:{textAlign:"center"}}),children:[Object(p.jsx)(z.a,{children:Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:"Player"}),Object(p.jsx)(J.a,{children:"Team"}),Object(p.jsx)(J.a,{children:"Position"}),Object(p.jsx)(J.a,{children:"Points"})]})}),Object(p.jsx)(K.a,{children:t.manager.gw_team.picks.filter((function(e){return 0==e.multiplier})).map((function(e){var t;return Object(p.jsxs)(H.a,{children:[Object(p.jsxs)(J.a,{children:[j(o.elements[e.element])," ",x(e.element,d)]}),Object(p.jsx)(J.a,{children:b(o.elements[e.element],o.teams)}),Object(p.jsx)(J.a,{children:u(o.elements[e.element])}),Object(p.jsx)(J.a,{children:null===(t=d.elements[e.element])||void 0===t?void 0:t.stats.total_points})]},e.element)}))})]}),Object(p.jsx)(Me,{manager:t.manager}),Object(p.jsx)(Ne,{manager:t.manager})]}):null},Je=function(e){var t=e.gwPoints,n=e.totalPoints;return Object(p.jsxs)(I.a,{flexDirection:"column",children:[Object(p.jsx)(I.a,{m:"auto",fontWeight:600,children:t}),Object(p.jsx)(I.a,{m:"auto",children:n})]})},Ke=n(247),qe=n(248),Qe=n(221),Xe=function(){var e=_(),t=Object(m.a)(e,2),n=t[0],a=n.showLiveBonus,r=n.showLiveBonusDisabled,c=t[1];return Object(p.jsx)(Ke.a,{children:Object(p.jsx)(qe.a,{control:Object(p.jsx)(Qe.a,{color:"primary",disabled:r,defaultChecked:!r,onChange:function(){return c({type:"SET_SHOW_LIVE_BONUS",payload:!a})}}),label:"LiveBonus",labelPlacement:"bottom"})})},Ye=function(e){var t=e.manager;return Object(p.jsxs)(I.a,{children:[Object(p.jsx)(Fe.a,{children:Object(p.jsx)(I.a,{children:t.entry_name})}),Object(p.jsx)(I.a,{children:t.player_name})]})},Ze=function(e){var t=e.gwPoints,n=e.totalPoints,a=e.manager,r=e.setManagerPage,c=e.old_rank,i=e.managersLength,s=e.i,l=void 0===s?1:s,j=_(),o=Object(m.a)(j,1)[0].liveData;if(!o)return null;return Object(p.jsxs)(H.a,{style:{cursor:"pointer"},onClick:function(){return r(a?{manager:a,points:t}:null)},children:[Object(p.jsx)(J.a,{children:function(){var e=function(e,t,n){return e<t?0:e===t?1:e>t+Math.max(3,Math.ceil(n/5))?3:2}(c,l,null!==i&&void 0!==i?i:0),t={marginRight:5,marginBlock:"auto"},n={marginBlock:"auto"},a=function(e,n){return Object(p.jsxs)(S.a,{display:"flex",children:[Object(p.jsx)(se.a,{style:t,variant:"button",children:e}),n]})};return a(l,0==e?Object(p.jsx)(Te.a,{color:"error",style:n}):1==e?Object(p.jsx)(Ce.a,{color:"disabled",style:n}):3==e?"\ud83d\ude80":Object(p.jsx)(Ae.a,{color:"primary",style:n}))}()}),Object(p.jsx)(J.a,{children:Object(p.jsx)(Ye,{manager:a})}),Object(p.jsx)(J.a,{children:O(o,a.gw_team.picks.filter((function(e){return e.multiplier>0})))}),Object(p.jsx)(J.a,{children:Object(p.jsx)(Je,{gwPoints:t,totalPoints:n})})]},l)},$e=function(e){var t=e.managers,n=e.setManagerPage,a=_(),r=Object(m.a)(a,1)[0],c=r.liveData,i=r.showLiveBonus,j=Object(f.useState)([]),o=Object(m.a)(j,2),u=o[0],d=o[1],b=t.map((function(e){return{id:e.manager.id,prev_points:e.manager.prev_points}})).sort((function(e,t){return t.prev_points-e.prev_points}));return(null===c||void 0===c?void 0:c.elements)?(Object(f.useEffect)((function(){var e,a=[],r=Object(l.a)(t);try{var s=function(){var t,r=e.value,s=r.manager.gw_team,j=r.manager.prev_points,o=-1*s.entry_history.event_transfers_cost,u=Object(l.a)(r.parsedPicks.active);try{for(u.s();!(t=u.n()).done;){var d=t.value;o+=h(c.elements[d.element],i)*d.multiplier}}catch(x){u.e(x)}finally{u.f()}a.push({manager:r.manager,gwPoints:o,totalPoints:j+o,setManagerPage:n,old_rank:1+b.findIndex((function(e){return e.id===r.manager.id}))})};for(r.s();!(e=r.n()).done;)s()}catch(j){r.e(j)}finally{r.f()}a.sort((function(e,t){return t.totalPoints-e.totalPoints})),d(a)}),[c,i]),Object(p.jsxs)(p.Fragment,{children:[u.map((function(e,n){return Object(p.jsx)(Ze,Object(s.a)(Object(s.a)({},e),{},{i:n+1,managersLength:t.length}),n)})),Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:"Average"}),Object(p.jsx)(J.a,{}),Object(p.jsx)(J.a,{}),Object(p.jsx)(J.a,{children:(u.reduce((function(e,t){return e+t.gwPoints}),0)/u.length).toFixed(2)})]})]})):null},et=function(){var e=_(),t=Object(m.a)(e,2),n=t[0],a=n.leagueData,r=n.selectedGw,c=t[1];if(!(null===a||void 0===a?void 0:a.parsedData))return null;var i=Object(f.useState)(null),s=Object(m.a)(i,2),l=s[0],j=s[1],o=Object(f.useState)(!1),u=Object(m.a)(o,2),d=u[0],b=u[1],x=function(){var e=Object(k.a)(D.a.mark((function e(){var t,n,a;return D.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return b(!0),t={gw:r},e.next=4,U(t);case 4:200==(n=e.sent).status&&n.data?(a=n.data,c({type:"SET_LIVE_ELEMENTS",payload:a})):alert("Refresh failed"),b(!1);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return l?Object(p.jsx)(He,{setManagerPage:j,manager:l}):Object(p.jsx)(p.Fragment,{children:Object(p.jsxs)(Z,{header:Object(p.jsxs)(Se.a,{container:!0,alignContent:"space-between",children:[Object(p.jsx)(Se.a,{item:!0,xs:2,children:Object(p.jsx)(Xe,{})}),Object(p.jsx)(Se.a,{item:!0,xs:8,children:Object(p.jsx)(N.a,{title:"Standings",style:{textAlign:"center"}})}),Object(p.jsx)(Se.a,{container:!0,item:!0,xs:2,alignContent:"center",children:Object(p.jsx)(Ee.a,{disabled:d,onClick:function(){return x()},style:{margin:"auto",cursor:"pointer"},children:Object(p.jsx)(Ge.a,{fontSize:"large"})})})]}),children:[Object(p.jsx)(z.a,{children:Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:"Rank"}),Object(p.jsx)(J.a,{children:"Manager"}),Object(p.jsx)(J.a,{children:Object(p.jsx)(S.a,{children:"\ud83c\udfc7"})}),Object(p.jsx)(J.a,{children:Object(p.jsxs)(S.a,{children:[Object(p.jsx)(S.a,{children:"GW "}),Object(p.jsx)(S.a,{children:"Tot "})]})})]})}),Object(p.jsx)(K.a,{children:Object(p.jsx)($e,{setManagerPage:j,managers:a.parsedData.managers})})]})})},tt=function(){var e=_(),t=Object(m.a)(e,1)[0],n=t.bssData,a=t.leagueData,r=t.selectedGw;return n?Object(p.jsxs)(Z,{header:Object(p.jsx)(N.a,{title:"Transfers",style:{textAlign:"center"}}),children:[Object(p.jsx)(z.a,{children:Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:"Manager"}),Object(p.jsx)(J.a,{children:"In"}),Object(p.jsx)(J.a,{children:"Out"}),Object(p.jsx)(J.a,{children:"-"})]})}),Object(p.jsx)(K.a,{children:null===a||void 0===a?void 0:a.league_curr.managers.filter((function(e){return e.transfers.filter((function(e){return e.event===parseInt(r)})).length>0})).map((function(e){return Object(p.jsxs)(H.a,{children:[Object(p.jsx)(J.a,{children:e.player_name}),Object(p.jsx)(J.a,{children:"freehit"===e.gw_team.active_chip?"*Freehit*":"wildcard"===e.gw_team.active_chip?"*Wildcard*":e.transfers.filter((function(e){return e.event===parseInt(r)})).map((function(e){return o(n.elements[e.element_in])})).join(", ")}),Object(p.jsx)(J.a,{children:"freehit"===e.gw_team.active_chip?"*Freehit*":"wildcard"===e.gw_team.active_chip?"*Wildcard*":e.transfers.filter((function(e){return e.event===parseInt(r)})).map((function(e){return o(n.elements[e.element_out])})).join(", ")}),Object(p.jsx)(J.a,{children:0!==e.gw_team.entry_history.event_transfers_cost?e.gw_team.entry_history.event_transfers_cost:null})]},e.id)}))})]}):null},nt=function(){var e=Object(f.useState)("main"),t=Object(m.a)(e,2),n=t[0],a=t[1];return Object(p.jsxs)(p.Fragment,{children:[Object(p.jsx)(De,{page:n,setPage:a}),Object(p.jsx)(S.a,{paddingBottom:10,marginTop:20,children:function(e){switch(e){case"main":return Object(p.jsxs)(p.Fragment,{children:[Object(p.jsx)(te,{}),Object(p.jsx)($,{}),Object(p.jsx)(ke,{})]});case"transfers":return Object(p.jsx)(tt,{});case"standings":return Object(p.jsx)(et,{});case"values":return Object(p.jsx)(ne,{});default:return null}}(n)})]})};function at(){var e=_(),t=Object(m.a)(e,2),n=t[0].leagueData,a=t[1];return Object(f.useEffect)((function(){var e=function(){var e=Object(k.a)(D.a.mark((function e(){var t,n;return D.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,W();case 2:200==(t=e.sent).status&&t.data?(n=t.data,a({type:"SET_BSS_DATA",payload:n})):alert("The game is being updated.");case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}),[]),Object(p.jsx)(B.a,{children:Object(p.jsx)(E.a,{maxWidth:"lg",children:Object(p.jsx)(S.a,{height:"100vh",children:n?Object(p.jsx)(nt,{}):Object(p.jsx)(V,{})})})})}i.a.render(Object(p.jsxs)(r.a,{theme:ye,children:[Object(p.jsx)(a.a,{}),Object(p.jsx)(y,{reducer:function(e,t){switch(t.type){case"SET_BSS_DATA":var n=function(e){var t,n=e.filter((function(e){return e.finished})),a=Object(l.a)(e);try{for(a.s();!(t=a.n()).done;){var r=t.value,c=new Date-new Date(r.deadline_time);!r.finished&&c>12e5&&n.push(r)}}catch(i){a.e(i)}finally{a.f()}return n.reverse()}(t.payload.events);return Object(s.a)(Object(s.a)({},e),{},{bssData:Object(s.a)({},t.payload),gwsData:n,selectedGw:n[0].id.toString()});case"SET_LEAGUE_DATA":return Object(s.a)(Object(s.a)({},e),{},{leagueData:Object(s.a)({},t.payload)});case"RESET_LEAGUE_DATA":return Object(s.a)(Object(s.a)({},e),{},{leagueData:null});case"SET_SELECTED_GW":return Object(s.a)(Object(s.a)({},e),{},{selectedGw:t.payload});case"SET_SHOW_LIVE_BONUS":return Object(s.a)(Object(s.a)({},e),{},{showLiveBonus:t.payload});case"SET_LIVE_ELEMENTS":return Object(s.a)(Object(s.a)({},e),{},{liveData:t.payload,showLiveBonusDisabled:!t.payload.fixtures.some((function(e){return(null===e||void 0===e?void 0:e.started)&&!e.finished}))});default:return e}},children:Object(p.jsx)(at,{})})]}),document.querySelector("#root"))}},[[166,1,2]]]);
//# sourceMappingURL=main.564e379d.chunk.js.map