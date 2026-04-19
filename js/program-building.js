(function () {
  'use strict';
  var box = document.getElementById('program-unified');
  if (!box) return;

  /* ══ DATA ══ */
  var FLOORS = [
    { floor:14,label:'14F',name:'Admin',rooms:[{id:'1401',num:'1401',cap:0}]},
    { floor:13,label:'13F',name:'MPLAN / MLA',rooms:[{id:'1301',num:'1301',cap:120},{id:'1305',num:'1305',cap:110}]},
    { floor:12,label:'12F',name:'ARCH FDN',rooms:[{id:'1201',num:'1201',cap:120},{id:'1205',num:'1205',cap:22},{id:'1206',num:'1206',cap:22}]},
    { floor:11,label:'11F',name:'MARCH',rooms:[{id:'1101',num:'1101',cap:126},{id:'1104',num:'1104',cap:110}]},
    { floor:10,label:'10F',name:'GYM',rooms:[]},
    { floor:9,label:'9F',name:'BDCI 4',rooms:[{id:'901',num:'901',cap:220},{id:'904',num:'904',cap:30},{id:'905',num:'905',cap:45}]},
    { floor:8,label:'8F',name:'BDCI 3',rooms:[{id:'801',num:'801',cap:220},{id:'804',num:'804',cap:22},{id:'806',num:'806',cap:30}]},
    { floor:7,label:'7F',name:'Research',rooms:[]},
    { floor:6,label:'6F',name:'BDCI 2',rooms:[{id:'601',num:'601',cap:220},{id:'605',num:'605',cap:110}]},
    { floor:5,label:'5F',name:'BDCI 1',rooms:[{id:'501',num:'501',cap:220},{id:'505',num:'505',cap:22},{id:'506',num:'506',cap:22}]},
    { floor:2,label:'2F',name:'Workshops / +15',rooms:[]},
    { floor:0,label:'G',name:'Ground',rooms:[{id:'Atrium',num:'Atrium',cap:200}]},
  ];

  var EV = [
    {d:1,s:'09:00',e:'09:30',l:'Opening Remark',t:'ceremony',r:['605']},
    {d:1,s:'09:30',e:'12:00',l:'Workshop Sessions 1',t:'workshop',r:['501','601','801','901']},
    {d:1,s:'12:00',e:'13:30',l:'Lunch — Explore Downtown',t:'break',r:[]},
    {d:1,s:'13:30',e:'15:30',l:'Workshop Sessions 2',t:'workshop',r:['501','601','801','901']},
    {d:1,s:'15:30',e:'16:00',l:'Coffee Break',t:'break',r:['Atrium']},
    {d:2,s:'09:00',e:'12:00',l:'Workshop Sessions 3',t:'workshop',r:['501','601','801','901']},
    {d:2,s:'12:00',e:'13:30',l:'Catered Lunch — Social',t:'break',r:[]},
    {d:2,s:'13:30',e:'15:30',l:'Workshop Sessions 4',t:'workshop',r:['501','601','801','901']},
    {d:2,s:'15:30',e:'17:00',l:'Workshop Exchange',t:'workshop',r:['605','905']},
    {d:2,s:'18:00',e:'20:00',l:'Welcome Reception',t:'social',r:['Atrium']},
    {d:3,s:'09:00',e:'09:30',l:"Deans' Welcome",t:'ceremony',r:['605']},
    {d:3,s:'09:30',e:'10:30',l:'Keynote 1',t:'keynote',r:['605']},
    {d:3,s:'10:30',e:'12:00',l:'Paper Sessions 1',t:'paper',r:['605','1104','1305','905']},
    {d:3,s:'12:00',e:'13:30',l:'Lunch — Explore Downtown',t:'break',r:[]},
    {d:3,s:'13:30',e:'15:30',l:'Paper Sessions 2',t:'paper',r:['605','1104','1305','905']},
    {d:3,s:'15:30',e:'16:00',l:'Coffee Break',t:'break',r:['Atrium']},
    {d:4,s:'08:30',e:'09:00',l:'Morning Coffee',t:'break',r:['Atrium']},
    {d:4,s:'09:00',e:'12:00',l:'Paper Sessions 3',t:'paper',r:['605','1104','1305','905']},
    {d:4,s:'12:00',e:'13:30',l:'Catered Lunch',t:'break',r:[]},
    {d:4,s:'13:30',e:'15:30',l:'Paper Sessions 4',t:'paper',r:['605','1104','1305','905']},
    {d:4,s:'15:30',e:'16:00',l:'Coffee Break',t:'break',r:['Atrium']},
    {d:4,s:'17:00',e:'18:00',l:'Keynote 2',t:'keynote',r:['605']},
    {d:4,s:'18:00',e:'18:30',l:'Workshop Outcomes',t:'workshop',r:['605']},
    {d:4,s:'19:00',e:'21:00',l:'Conference Banquet',t:'social',r:['Atrium']},
    {d:5,s:'08:30',e:'09:00',l:'Morning Coffee',t:'break',r:['Atrium']},
    {d:5,s:'09:00',e:'10:00',l:'Keynote 3',t:'keynote',r:['605']},
    {d:5,s:'10:00',e:'12:00',l:'Paper Sessions 5',t:'paper',r:['605','1104','1305','905']},
    {d:5,s:'12:00',e:'13:00',l:'Catered Lunch',t:'break',r:[]},
    {d:5,s:'13:00',e:'14:00',l:'Keynote 4',t:'keynote',r:['605']},
    {d:5,s:'14:00',e:'16:00',l:'Paper Sessions 6',t:'paper',r:['605','1104','1305','905']},
    {d:5,s:'16:30',e:'17:00',l:'Closing Remarks',t:'ceremony',r:['605']},
    {d:6,s:'08:00',e:'11:00',l:'Departure + Lake Louise',t:'trip',r:[]},
    {d:6,s:'11:00',e:'12:30',l:'Lunch (Art Centre)',t:'break',r:[]},
    {d:6,s:'13:00',e:'15:00',l:'Banff Gondola',t:'trip',r:[]},
    {d:6,s:'16:00',e:'19:00',l:'Free Time in Banff',t:'trip',r:[]},
    {d:6,s:'19:00',e:'21:00',l:'Return to Calgary',t:'trip',r:[]},
  ];

  var C = {
    workshop:{bg:'rgba(35,41,122,0.07)',ring:'#23297a',text:'#23297a',active:'rgba(35,41,122,0.15)'},
    paper:{bg:'rgba(46,125,50,0.06)',ring:'#4caf50',text:'#2e7d32',active:'rgba(46,125,50,0.14)'},
    keynote:{bg:'rgba(35,41,122,0.14)',ring:'#23297a',text:'#23297a',active:'rgba(35,41,122,0.22)'},
    ceremony:{bg:'rgba(35,41,122,0.18)',ring:'#23297a',text:'#23297a',active:'rgba(35,41,122,0.25)'},
    social:{bg:'rgba(142,68,173,0.08)',ring:'#9c27b0',text:'#7b1fa2',active:'rgba(142,68,173,0.16)'},
    break:{bg:'rgba(0,0,0,0.025)',ring:'rgba(0,0,0,0.12)',text:'#999',active:'rgba(0,0,0,0.06)'},
    trip:{bg:'rgba(230,126,34,0.07)',ring:'#e67e22',text:'#b5561a',active:'rgba(230,126,34,0.14)'},
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
      b.textContent=ev.l;
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
      lbl.innerHTML='<strong>'+fi.label+'</strong><span>'+fi.name+'</span>';
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

  render();
})();
