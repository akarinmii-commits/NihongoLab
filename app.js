const M=window.MATERI;let S={};try{S=JSON.parse(localStorage.getItem('n3bl')||'{}')}catch(e){}
S.done=S.done||{};S.fav=S.fav||{};S.score=S.score||{};
const save=()=>{try{localStorage.setItem('n3bl',JSON.stringify(S))}catch(e){}};
const rb=t=>String(t).replace(/([一-龥々]+)\[([^\]]+)\]/g,'<ruby>$1<rt>$2</rt></ruby>').replace(/\*\*(.+?)\*\*/g,'<span class="focus">$1</span>');
const $=s=>document.querySelector(s),app=$('#app');let F={q:'',m:'all'};
function flags(){document.body.classList.toggle('hide-tr',!!S.hTr);document.body.classList.toggle('hide-fg',!!S.hFg);document.body.classList.toggle('dark',!!S.dark);
$('#bTr').classList.toggle('on',!S.hTr);$('#bFg').classList.toggle('on',!S.hFg);$('#bTh').textContent=S.dark?'Terang':'Gelap'}
$('#bTr').onclick=()=>{S.hTr=!S.hTr;save();flags()};$('#bFg').onclick=()=>{S.hFg=!S.hFg;save();flags()};$('#bTh').onclick=()=>{S.dark=!S.dark;save();flags()};
const ready=M.filter(m=>m.ready);
function grid(){const q=F.q.toLowerCase();const l=M.filter(m=>(m.title+m.reading+(m.ringkas||'')).toLowerCase().includes(q)&&(F.m==='all'||(F.m==='fav'&&S.fav[m.id])||(F.m==='done'&&S.done[m.id])||(F.m==='todo'&&!S.done[m.id])));
$('#grid').innerHTML=l.map(m=>`<a class="cd ${m.ready?'':'soon'}" href="#/m/${m.id}"><h3>${S.fav[m.id]?'★ ':''}${rb(m.title)}</h3><small>${m.ready?(S.done[m.id]?'✅ Selesai':'Belum selesai')+(S.score[m.id]?` · Tes: ${S.score[m.id].p}%`:''):'Belum diisi'}</small></a>`).join('')||'<p class="mu">Tidak ada materi yang cocok. Coba kata kunci lain.</p>'}
function home(){const d=ready.filter(m=>S.done[m.id]).length,p=ready.length?Math.round(d/ready.length*100):0;
app.innerHTML=`<h1>N3 文法 Lab</h1><p class="mu">Belajar bunpou JLPT N3 pelan-pelan, pakai bahasa Indonesia.</p><div class="box"><b>Progres: ${d} dari ${ready.length} materi siap selesai (${p}%)</b><div class="bar"><i style="width:${p}%"></i></div><small class="mu">${M.length-ready.length} materi lain masih kerangka, belum diisi.</small></div>
<div class="tools"><input id="sq" placeholder="Cari bunpou…" value="${F.q}"><select id="sf"><option value="all">Semua</option><option value="fav">Favorit</option><option value="done">Selesai</option><option value="todo">Belum selesai</option></select></div><div class="grid" id="grid"></div>`;
$('#sf').value=F.m;$('#sq').oninput=e=>{F.q=e.target.value;grid()};$('#sf').onchange=e=>{F.m=e.target.value;grid()};grid()}
const T=(jp,id,cls='')=>`<p class="jp ${cls}">${rb(jp)}</p><p class="tr">${id}</p>`;
const quiz=(qs,k)=>qs.map((x,i)=>`<div class="q" data-k="${k}" data-i="${i}"><p><b>${i+1}.</b> ${rb(x.q)}</p><p class="tr">${x.t}</p>${x.o.map((o,j)=>`<button class="opt" data-j="${j}">${rb(o)}</button>`).join('')}<div class="fb" hidden></div></div>`).join('');
let cur;
function detail(id){const m=cur=M.find(x=>x.id===id);if(!m)return home();
if(!m.ready){app.innerHTML=`<a href="#/">← Kembali</a><h1>${rb(m.title)}</h1><div class="box">Materi ini belum diisi. ${m.note||''}</div>`;return}
const sc=S.score[id];
app.innerHTML=`<a href="#/">← Kembali</a><h1>${rb(m.title)}</h1>
<div class="act"><button class="btn" id="fav">${S.fav[id]?'★ Favorit':'☆ Tambah favorit'}</button><button class="btn ${S.done[id]?'pri':''}" id="done">${S.done[id]?'✅ Sudah selesai':'Tandai selesai'}</button></div>
<h2>導入 — Pengenalan</h2><div class="box"><p>${m.intro.situasi}</p>${T(m.intro.jp,m.intro.id)}<p><b>Pertanyaan:</b> ${m.intro.tanya}</p><p>${m.intro.kaitan}</p></div>
<h2>意味 — Arti dan fungsi</h2>${m.arti.map(a=>`<div class="box"><b>${a.j}</b><p>${rb(a.isi)}</p></div>`).join('')}
<h2>接続 — Rumus</h2><table><tr><th>Bentuk sebelum bunpou</th><th>Rumus</th><th>Contoh</th><th>Penjelasan</th></tr>${m.rumus.map(r=>`<tr>${r.map(c=>`<td>${rb(c)}</td>`).join('')}</tr>`).join('')}</table><p class="mu">${m.istilah}</p>
<h2>例文 — Contoh kalimat</h2>${m.contoh.map(c=>`<div class="box">${T(c[0],c[1])}<small class="mu">${c[2]}</small></div>`).join('')}
<h2>使い分け — Perbedaan pola</h2><div class="box">${m.beda.intro}<table><tr>${m.beda.h.map(h=>`<th>${h}</th>`).join('')}</tr>${m.beda.rows.map(r=>`<tr>${r.map(c=>`<td>${rb(c)}</td>`).join('')}</tr>`).join('')}</table>${m.beda.ex.map(e=>T(e[0],e[1])).join('')}</div>
<h2>会話 — Percakapan</h2><div class="box">${m.kaiwa.map(l=>`<p class="jp"><b>${l[0]}:</b> ${rb(l[1])}</p><p class="tr">${l[2]}</p>`).join('')}<p><b>Cek pemahaman:</b> ${m.kaiwaTanya}</p></div>
<h2>よくある間違い — Kesalahan umum</h2>${m.salah.map(s=>`<div class="box"><p class="bad jp">❌ ${rb(s[0])}</p><p><b>Penjelasan:</b> ${s[1]}</p><p class="good jp">✅ ${rb(s[2])}</p><p class="tr">Arti: ${s[3]}</p></div>`).join('')}
<h2>練習 — Latihan</h2><p class="mu">Pilih jawaban. Pembahasan muncul setelah kamu menjawab.</p><div id="lat">${quiz(m.latihan,'l')}</div>
<h2>まとめ — Ringkasan</h2><div class="box">${m.ringkas}</div>
<h2>確認テスト — Tes pemahaman</h2><p id="last" class="mu">${sc?`Nilai terakhir: ${sc.s}/${sc.n} (${sc.p}%)`:'Belum pernah mengerjakan tes.'}</p><div id="tes">${quiz(m.tes,'t')}</div><div class="act"><button class="btn pri" id="sub">Lihat skor</button><button class="btn" id="rst">Ulangi tes</button></div><div id="res"></div>`;
$('#fav').onclick=()=>{S.fav[id]=!S.fav[id];save();detail(id)};$('#done').onclick=()=>{S.done[id]=!S.done[id];save();detail(id)};
$('#sub').onclick=()=>{const qs=[...document.querySelectorAll('#tes .q')];if(qs.some(q=>q.dataset.sel===undefined))return alert('Jawab semua soal dulu ya.');
let s=0;qs.forEach((q,i)=>{const x=m.tes[i],ok=+q.dataset.sel===x.a;s+=ok;const bs=q.querySelectorAll('.opt');bs[x.a].classList.add('ok');if(!ok)bs[+q.dataset.sel].classList.add('bad');const f=q.querySelector('.fb');f.hidden=false;f.innerHTML=(ok?'✅ Benar. ':'❌ Salah. ')+x.w;q.dataset.lock=1});
const p=Math.round(s/qs.length*100);S.score[id]={s,n:qs.length,p};save();$('#last').textContent=`Nilai terakhir: ${s}/${qs.length} (${p}%)`;$('#res').innerHTML=`<div class="box"><b>Skor: ${s}/${qs.length} — ${p}% benar</b><p>${p>=80?'Bagus! Kalau sudah yakin, tekan "Tandai selesai" di atas.':'Baca lagi bagian 意味 dan 使い分け, lalu ulangi tesnya.'}</p></div>`};
$('#rst').onclick=()=>{$('#tes').innerHTML=quiz(m.tes,'t');$('#res').innerHTML=''}}
document.addEventListener('click',e=>{const b=e.target.closest('.opt');if(!b)return;const q=b.closest('.q'),m=cur;
if(q.dataset.k==='l'){if(q.dataset.done)return;q.dataset.done=1;const x=m.latihan[q.dataset.i],ok=+b.dataset.j===x.a;b.classList.add(ok?'ok':'bad');q.querySelectorAll('.opt')[x.a].classList.add('ok');const f=q.querySelector('.fb');f.hidden=false;f.innerHTML=(ok?'✅ Benar! ':'❌ Salah. ')+'Jawaban: <b>'+rb(x.o[x.a])+'</b><br>'+x.w}
else{if(q.dataset.lock)return;q.querySelectorAll('.opt').forEach(o=>o.classList.remove('sel'));b.classList.add('sel');q.dataset.sel=b.dataset.j}});
function route(){const h=location.hash.match(/^#\/m\/(.+)$/);h?detail(h[1]):home();window.scrollTo(0,0)}
window.addEventListener('hashchange',route);flags();route();
