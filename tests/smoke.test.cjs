const {test}=require('node:test');const assert=require('node:assert/strict');const {chromium}=require('@playwright/test');
test('role selection, jobs, and live chat between two players',async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{const a=await browser.newPage({viewport:{width:1440,height:1000}}),b=await browser.newPage();const errors=[];a.on('pageerror',e=>errors.push(e.message));await Promise.all([a.goto('http://localhost:3000'),b.goto('http://localhost:3000')]);await a.locator('#connection').filter({hasText:'SERVER ONLINE'}).waitFor();await a.locator('#name').fill('Harbour');await b.locator('#name').fill('Rescue');await b.locator('.role').nth(1).click();await a.locator('#play').click();await b.locator('#play').click();await a.locator('#online').filter({hasText:'2 ONLINE'}).waitFor();await a.locator('#chatInput').fill('Hello Sydney <script>');await a.locator('#chatForm button').click();await b.getByText('Hello Sydney <script>',{exact:true}).waitFor();await a.locator('#phoneToggle').click();await a.locator('#jobs button').first().click();assert.equal(await a.locator('#missionTitle').textContent(),'Traffic collision');await a.locator('#back').click();await a.screenshot({path:'/tmp/sydney-lobby.png'});assert.deepEqual(errors,[]);}finally{await browser.close();}});

test('Enter Sydney works on mobile without WebGL, for every role',async()=>{
  const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  try {
    const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>{const getContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type==='webgl2'||type==='webgl'||type==='experimental-webgl')return null;return getContext.call(this,type,...args);};});
    await page.goto('http://localhost:3000');
    await page.locator('#startupStatus[data-compatibility="true"]').waitFor();
    for(const [index,role] of ['Police','Fire & Rescue','Mechanic','Ambulance','Criminal','SWAT'].entries()){
      await page.locator('.role').nth(index).tap();
      await page.locator('#play').tap();
      assert.equal(await page.locator('#hud').isVisible(),true);
      assert.match(await page.locator('#welcome').textContent(),new RegExp(role.replace('&','&')));
      await page.locator('#phoneToggle').tap();
      assert.equal(await page.locator('#jobs button').count(),3);
      await page.locator('#back').tap();
    }
    assert.deepEqual(errors,[]);
  } finally {await browser.close();}
});

test('startup failures show an actionable message instead of a dead Enter button',async()=>{
  const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  try {
    const page=await browser.newPage();
    await page.route('**/vendor/three.module.js',route=>route.abort());
    await page.goto('http://localhost:3000');
    await page.getByRole('button',{name:'RELOAD GAME'}).waitFor();
    assert.match(await page.locator('#startupStatus').textContent(),/could not load/);
    assert.equal(await page.locator('#play').isEnabled(),true);
  } finally {await browser.close();}
});
