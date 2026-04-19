(function () {
  'use strict';
  var box = document.getElementById('program-unified');
  if (!box) return;

  /* ══ DATA ══ */
  var FLOORS = [
    { floor:14,label:'14F',name:'',rooms:[{id:'1401',num:'1401',cap:0}]},
    { floor:13,label:'13F',name:'',rooms:[{id:'1301',num:'1301',cap:120},{id:'1305',num:'1305',cap:110}]},
    { floor:12,label:'12F',name:'',rooms:[{id:'1201',num:'1201',cap:120},{id:'1205',num:'1205',cap:22},{id:'1206',num:'1206',cap:22}]},
    { floor:11,label:'11F',name:'',rooms:[{id:'1101',num:'1101',cap:126},{id:'1104',num:'1104',cap:110}]},
    { floor:10,label:'10F',name:'GYM',rooms:[]},
    { floor:9,label:'9F',name:'',rooms:[{id:'901',num:'901',cap:220},{id:'904',num:'904',cap:30},{id:'905',num:'905',cap:45}]},
    { floor:8,label:'8F',name:'',rooms:[{id:'801',num:'801',cap:220},{id:'804',num:'804',cap:22},{id:'806',num:'806',cap:30}]},
    { floor:7,label:'7F',name:'',rooms:[{id:'CommonGround',num:'Common Ground',cap:80},{id:'702',num:'702',cap:12},{id:'703',num:'703',cap:10}]},
    { floor:6,label:'6F',name:'',rooms:[{id:'601',num:'601',cap:220},{id:'605',num:'605',cap:110}]},
    { floor:5,label:'5F',name:'',rooms:[{id:'501',num:'501',cap:220},{id:'505',num:'505',cap:22},{id:'506',num:'506',cap:22}]},
    { floor:2,label:'2F',name:'',rooms:[{id:'WkA',num:'Shop Cluster 2F',cap:40},{id:'WkB',num:'Shop Cluster 3F',cap:40},{id:'+15',num:'+15',cap:100}]},
    { floor:0,label:'1F',name:'',rooms:[{id:'Atrium',num:'Atrium',cap:200}]},
  ];

  var EV = [
    {d:1,s:'08:30',e:'09:00',l:'Morning Coffee',t:'break',r:['Atrium']},
    {d:1,s:'09:00',e:'10:00',l:'Opening Remark',t:'ceremony',r:['Atrium']},
    {d:1,s:'10:00',e:'12:00',l:'Workshop A',t:'workshop',r:['WkA'],pc:3,pi:0},
    {d:1,s:'10:00',e:'12:00',l:'Workshop B',t:'workshop',r:['WkB'],pc:3,pi:1},
    {d:1,s:'10:00',e:'12:00',l:'Workshop C',t:'workshop',r:['806'],pc:3,pi:2},
    {d:1,s:'12:00',e:'13:30',l:'Lunch — Explore Downtown',t:'break',r:[]},
    {d:1,s:'13:30',e:'15:30',l:'Workshop A',t:'workshop',r:['WkA'],pc:3,pi:0},
    {d:1,s:'13:30',e:'15:30',l:'Workshop B',t:'workshop',r:['WkB'],pc:3,pi:1},
    {d:1,s:'13:30',e:'15:30',l:'Workshop C',t:'workshop',r:['806'],pc:3,pi:2},
    {d:1,s:'15:30',e:'16:00',l:'Coffee Break',t:'break',r:['CommonGround']},
    {d:1,s:'16:00',e:'16:30',l:'Social Mixer',t:'social',r:['Atrium']},
    {d:2,s:'08:30',e:'09:30',l:'Morning Coffee',t:'break',r:['Atrium']},
    {d:2,s:'09:30',e:'12:00',l:'Workshop A',t:'workshop',r:['WkA'],pc:3,pi:0},
    {d:2,s:'09:30',e:'12:00',l:'Workshop B',t:'workshop',r:['WkB'],pc:3,pi:1},
    {d:2,s:'09:30',e:'12:00',l:'Workshop C',t:'workshop',r:['806'],pc:3,pi:2},
    {d:2,s:'12:00',e:'13:30',l:'Catered Lunch — Social',t:'break',r:['+15','Atrium']},
    {d:2,s:'13:30',e:'15:30',l:'Workshop A',t:'workshop',r:['WkA'],pc:3,pi:0},
    {d:2,s:'13:30',e:'15:30',l:'Workshop B',t:'workshop',r:['WkB'],pc:3,pi:1},
    {d:2,s:'13:30',e:'15:30',l:'Workshop C',t:'workshop',r:['806'],pc:3,pi:2},
    {d:2,s:'15:30',e:'16:00',l:'Coffee Break',t:'break',r:['CommonGround']},
    {d:2,s:'16:00',e:'17:30',l:'Workshop Exchange',t:'workshop',r:['605','905']},
    {d:2,s:'18:00',e:'20:00',l:'Welcome Reception',t:'social',r:['+15','Atrium']},
    {d:3,s:'08:30',e:'09:00',l:'Morning Coffee',t:'break',r:['Atrium']},
    {d:3,s:'09:00',e:'09:30',l:"Deans' Welcome",t:'ceremony',r:['Atrium']},
    {d:3,s:'09:30',e:'10:30',l:'Keynote 1',t:'keynote',r:['Atrium']},
    {d:3,s:'10:30',e:'12:00',l:'Session 1',t:'paper',r:['605'],pc:3,pi:0},
    {d:3,s:'10:30',e:'12:00',l:'Session 2',t:'paper',r:['1104'],pc:3,pi:1},
    {d:3,s:'10:30',e:'12:00',l:'Session 3',t:'paper',r:['1305'],pc:3,pi:2},
    {d:3,s:'12:00',e:'13:30',l:'Lunch — Explore Downtown',t:'break',r:[]},
    {d:3,s:'13:30',e:'15:30',l:'Session 4',t:'paper',r:['605'],pc:3,pi:0},
    {d:3,s:'13:30',e:'15:30',l:'Session 5',t:'paper',r:['1104'],pc:3,pi:1},
    {d:3,s:'13:30',e:'15:30',l:'Session 6',t:'paper',r:['1305'],pc:3,pi:2},
    {d:3,s:'15:30',e:'16:30',l:'Coffee Break',t:'break',r:['CommonGround']},
    {d:3,s:'16:30',e:'17:00',l:'Awards',t:'ceremony',r:['CommonGround']},
    {d:3,s:'17:00',e:'18:30',l:'Keynote 2',t:'keynote',r:['CommonGround']},
    {d:4,s:'08:30',e:'09:30',l:'Morning Coffee',t:'break',r:['Atrium']},
    {d:4,s:'09:30',e:'12:00',l:'Session 7',t:'paper',r:['605'],pc:3,pi:0},
    {d:4,s:'09:30',e:'12:00',l:'Session 8',t:'paper',r:['1104'],pc:3,pi:1},
    {d:4,s:'09:30',e:'12:00',l:'Session 9',t:'paper',r:['1305'],pc:3,pi:2},
    {d:4,s:'12:00',e:'13:30',l:'Catered Lunch',t:'break',r:['+15','Atrium']},
    {d:4,s:'13:30',e:'15:30',l:'Session 10',t:'paper',r:['605'],pc:3,pi:0},
    {d:4,s:'13:30',e:'15:30',l:'Session 11',t:'paper',r:['1104'],pc:3,pi:1},
    {d:4,s:'13:30',e:'15:30',l:'Session 12',t:'paper',r:['1305'],pc:3,pi:2},
    {d:4,s:'15:30',e:'16:30',l:'Coffee Break',t:'break',r:['CommonGround']},
    {d:4,s:'16:30',e:'17:30',l:'Workshop Outcomes',t:'workshop',r:['CommonGround']},
    {d:4,s:'17:30',e:'19:00',l:'Keynote 3/4',t:'keynote',r:['CommonGround']},
    {d:4,s:'19:00',e:'21:00',l:'Conference Banquet (TBD)',t:'social',r:[]},
    {d:5,s:'08:30',e:'09:00',l:'Morning Coffee',t:'break',r:['Atrium']},
    {d:5,s:'09:00',e:'10:00',l:'Keynote 5',t:'keynote',r:['CommonGround']},
    {d:5,s:'10:00',e:'12:00',l:'Session 13',t:'paper',r:['605'],pc:3,pi:0},
    {d:5,s:'10:00',e:'12:00',l:'Session 14',t:'paper',r:['1104'],pc:3,pi:1},
    {d:5,s:'10:00',e:'12:00',l:'Session 15',t:'paper',r:['1305'],pc:3,pi:2},
    {d:5,s:'12:00',e:'13:00',l:'Catered Lunch',t:'break',r:['+15','Atrium']},
    {d:5,s:'13:00',e:'14:00',l:'Keynote 6',t:'keynote',r:['CommonGround']},
    {d:5,s:'14:00',e:'16:00',l:'Session 16',t:'paper',r:['605'],pc:3,pi:0},
    {d:5,s:'14:00',e:'16:00',l:'Session 17',t:'paper',r:['1104'],pc:3,pi:1},
    {d:5,s:'14:00',e:'16:00',l:'Session 18',t:'paper',r:['1305'],pc:3,pi:2},
    {d:5,s:'16:00',e:'16:30',l:'Coffee Break',t:'break',r:['CommonGround']},
    {d:5,s:'16:30',e:'17:30',l:'Closing Remarks',t:'ceremony',r:['605']},
    {d:6,s:'08:00',e:'11:00',l:'Departure + Lake Louise',t:'trip',r:[]},
    {d:6,s:'11:00',e:'12:30',l:'Lunch (Art Centre)',t:'break',r:[]},
    {d:6,s:'13:00',e:'15:00',l:'Banff Gondola',t:'trip',r:[]},
    {d:6,s:'16:00',e:'19:00',l:'Free Time in Banff',t:'trip',r:[]},
    {d:6,s:'19:00',e:'21:00',l:'Return to Calgary',t:'trip',r:[]},
  ];

  var C = {
    workshop:{bg:'rgba(92,107,192,0.07)',ring:'#5c6bc0',text:'#3949ab',active:'rgba(92,107,192,0.15)'},
    paper:{bg:'rgba(35,41,122,0.07)',ring:'#23297a',text:'#23297a',active:'rgba(35,41,122,0.15)'},
    keynote:{bg:'rgba(46,125,50,0.08)',ring:'#4caf50',text:'#2e7d32',active:'rgba(46,125,50,0.16)'},
    ceremony:{bg:'rgba(46,125,50,0.12)',ring:'#388e3c',text:'#2e7d32',active:'rgba(46,125,50,0.20)'},
    social:{bg:'rgba(142,68,173,0.08)',ring:'#9c27b0',text:'#7b1fa2',active:'rgba(142,68,173,0.16)'},
    break:{bg:'rgba(0,0,0,0.025)',ring:'rgba(0,0,0,0.12)',text:'#999',active:'rgba(0,0,0,0.06)'},
    trip:{bg:'rgba(210,140,70,0.06)',ring:'#c9956a',text:'#9a7048',active:'rgba(210,140,70,0.12)'},
  };

  var DAYS = [
    {d:1,sh:'Day 1',dt:'Jun 29',wd:'Sun'},
    {d:2,sh:'Day 2',dt:'Jun 30',wd:'Mon'},
    {d:3,sh:'Day 3',dt:'Jul 1',wd:'Tue'},
    {d:4,sh:'Day 4',dt:'Jul 2',wd:'Wed'},
    {d:5,sh:'Day 5',dt:'Jul 3',wd:'Thu'},
    {d:6,sh:'Day 6',dt:'Jul 4',wd:'Fri'},
  ];

  /* ══ STATE ══ */
  var selDay = 3, selMin = 570;

  /* ══ HELPERS ══ */
  function tm(t){var p=t.split(':');return +p[0]*60+ +p[1];}
  function ft(m){return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');}
  function tr(m){return 2+Math.round((m-480)/30);}
  function mk(tag,cls){var e=document.createElement(tag);if(cls)e.className=cls;return e;}

  /* ══ RENDER ══ */
  function render(){
    box.innerHTML='';

    /* ── 1. TIMETABLE GRID ── */
    var wrap=mk('div','pu-tt-wrap');
    var grid=mk('div','pu-tt');

    // Corner
    grid.appendChild(mk('div','pu-tt-corner'));

    // Day headers
    DAYS.forEach(function(d){
      var h=mk('div','pu-tt-dh'+(d.d===selDay?' pu-tt-dh-sel':''));
      h.style.gridColumn=d.d+1;
      h.innerHTML='<strong>'+d.sh+'</strong><span>'+d.dt+' · '+d.wd+'</span>';
      h.onclick=function(){selDay=d.d;render();};
      grid.appendChild(h);
    });

    // Column highlight
    var hl=mk('div','pu-tt-colhl');
    hl.style.gridColumn=selDay+1;
    hl.style.gridRow='2 / 30';
    grid.appendChild(hl);

    // Gridlines + time labels
    for(var h=8;h<=21;h++){
      var row=2+(h-8)*2;
      var gl=mk('div','pu-tt-gl');gl.style.gridRow=row;grid.appendChild(gl);
      var tl=mk('div','pu-tt-tl');tl.style.gridRow=row;tl.textContent=h+':00';grid.appendChild(tl);
    }

    // Events
    EV.forEach(function(ev){
      var col=ev.d+1, sr=tr(tm(ev.s)), er=tr(tm(ev.e));
      if(er<=sr) er=sr+1;
      var c=C[ev.t]||C.break;
      var b=mk('div','pu-tt-ev');
      b.style.gridColumn=col;
      b.style.gridRow=sr+'/'+er;
      b.style.background=c.bg;
      b.style.borderLeftColor=c.ring;
      b.style.color=c.text;
      if(ev.pc){
        var w=100/ev.pc;
        b.style.width='calc('+w+'% - 1px)';
        b.style.marginLeft=(w*ev.pi)+'%';
        b.innerHTML=ev.l+'<br><small>#'+ev.r[0]+'</small>';
        b.classList.add('pu-tt-ev-par');
      }else if(ev.r&&ev.r.length){
        var dur=tm(ev.e)-tm(ev.s);
        b.innerHTML=dur<=30
          ? ev.l+' <small>#'+ev.r.join(' #')+'</small>'
          : ev.l+'<br><small>#'+ev.r.join(' #')+'</small>';
      }else{
        b.textContent=ev.l;
      }
      b.onclick=function(){selDay=ev.d;selMin=tm(ev.s);render();};
      grid.appendChild(b);
    });

    // Needle
    var nRow=tr(selMin);
    if(nRow>=2&&nRow<=29){
      var needle=mk('div','pu-tt-needle');
      needle.style.gridRow=nRow;
      needle.style.gridColumn='2 / 8';
      grid.appendChild(needle);
    }

    wrap.appendChild(grid);
    box.appendChild(wrap);

    /* ── 2. TIME SLIDER + INFO ── */
    var infoBar=mk('div','pu-info');

    var slRow=mk('div','pu-sl-row');
    var tDisp=mk('span','pu-sl-time');tDisp.textContent=ft(selMin);
    var dayDisp=mk('span','pu-sl-day');
    var dd=DAYS.find(function(x){return x.d===selDay;});
    dayDisp.textContent=dd?dd.sh+' · '+dd.dt+' · '+dd.wd:'';

    var sl=document.createElement('input');
    sl.type='range';sl.className='pu-sl';sl.min=480;sl.max=1290;sl.step=30;sl.value=selMin;
    sl.oninput=function(){selMin=+sl.value;tDisp.textContent=ft(selMin);update();};
    slRow.appendChild(tDisp);
    slRow.appendChild(dayDisp);
    slRow.appendChild(sl);
    infoBar.appendChild(slRow);

    // Active events
    var evList=mk('div','pu-info-evs');evList.id='pu-evs';
    infoBar.appendChild(evList);
    box.appendChild(infoBar);

    /* ── 3. BUILDING ── */
    var bldg=mk('div','pu-bldg');bldg.id='pu-bldg';
    FLOORS.forEach(function(fi){
      var isGym=fi.floor===10,empty=fi.rooms.length===0&&!isGym;
      var row=mk('div','pu-fl'+(isGym?' pu-fl-gym':'')+(empty?' pu-fl-empty':''));
      var lbl=mk('div','pu-fl-lbl');
      lbl.innerHTML='<strong>'+fi.label+'</strong>'+(fi.name?'<span>'+fi.name+'</span>':'');
      row.appendChild(lbl);
      var rms=mk('div','pu-rms');
      if(isGym){rms.innerHTML='<span class="pu-gy">GYM</span>';}
      else if(fi.rooms.length===0){rms.innerHTML='<span class="pu-gy">'+fi.name+'</span>';}
      else{
        fi.rooms.forEach(function(rm){
          var b=mk('div','pu-rm');b.id='pu-rm-'+rm.id;
          b.innerHTML='<span class="pu-rm-n">'+rm.num+'</span><span class="pu-rm-e" id="pu-re-'+rm.id+'"></span>';
          rms.appendChild(b);
        });
      }
      row.appendChild(rms);
      bldg.appendChild(row);
    });
    box.appendChild(bldg);

    /* ── 4. LEGEND ── */
    var leg=mk('div','pu-leg');
    [{l:'Workshop',t:'workshop'},{l:'Paper Session',t:'paper'},{l:'Keynote',t:'keynote'},
     {l:'Social',t:'social'},{l:'Break',t:'break'},{l:'Day Trip',t:'trip'}].forEach(function(it){
      var d=mk('div','pu-leg-i');
      d.innerHTML='<span class="pu-leg-dot" style="background:'+(C[it.t]?C[it.t].ring:'#e67e22')+'"></span>'+it.l;
      leg.appendChild(d);
    });
    box.appendChild(leg);

    update();
  }

  /* ══ UPDATE (no full re-render) ══ */
  function update(){
    var active=EV.filter(function(ev){return ev.d===selDay&&tm(ev.s)<=selMin&&tm(ev.e)>selMin;});
    var rMap={};
    active.forEach(function(ev){ev.r.forEach(function(id){rMap[id]=ev;});});

    // Info events
    var evs=document.getElementById('pu-evs');
    if(evs){
      if(active.length===0){evs.innerHTML='<span class="pu-info-none">No events at this time</span>';}
      else{
        var seen={};
        evs.innerHTML=active.filter(function(e){if(seen[e.l])return false;seen[e.l]=1;return true;}).map(function(e){
          var c=C[e.t]||C.break;
          var rooms=e.r.length?'<small>#'+e.r.join(' #')+'</small>':'';
          return '<span class="pu-info-tag" style="background:'+c.bg+';border-left:3px solid '+c.ring+';color:'+c.text+'">'+e.l+' <small>'+e.s+'–'+e.e+'</small> '+rooms+'</span>';
        }).join('');
      }
    }

    // Building rooms
    FLOORS.forEach(function(fi){
      fi.rooms.forEach(function(rm){
        var b=document.getElementById('pu-rm-'+rm.id);
        var es=document.getElementById('pu-re-'+rm.id);
        if(!b)return;
        var ev=rMap[rm.id];
        if(ev){
          var c=C[ev.t]||C.break;
          b.classList.add('pu-rm-on');
          b.style.background=c.active;
          b.style.boxShadow='inset 0 0 0 2px '+c.ring;
          if(es){es.textContent=ev.l;es.style.color=c.text;}
        }else{
          b.classList.remove('pu-rm-on');
          b.style.background='';b.style.boxShadow='';
          if(es){es.textContent='';es.style.color='';}
        }
      });
    });

    // Needle
    var needles=box.querySelectorAll('.pu-tt-needle');
    needles.forEach(function(n){n.style.gridRow=tr(selMin);});
  }

  /* ══ VEIL (hidden by default, Cmd+Space / Ctrl+Space to reveal) ══ */
  var unveiled = false;
  var veil = mk('div','pu-veil');
  veil.innerHTML =
    '<div class="pu-veil-inner">' +
      '<div class="pu-veil-icon">&#9998;</div>' +
      '<h2 class="pu-veil-heading">Program Details Coming Soon</h2>' +
      '<p class="pu-veil-text">The detailed conference schedule, room allocations, and session information will be announced in early 2027.</p>' +
    '</div>';
  box.parentNode.style.position = 'relative';
  box.parentNode.appendChild(veil);

  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      unveiled = !unveiled;
      veil.classList.toggle('pu-veil-hidden', unveiled);
    }
  });

  render();
})();
