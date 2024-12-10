//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G38489-2023 三浦悠樹
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { GUI } from "ili-gui";

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    axes: true, // 座標軸
    rotation: 1,
    bosslife: 20,
    playerlife: 3    
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "axes").name("座標軸");
  gui.add(param, "rotation", -10, 10);
  gui.add(param, "bosslife", 20);
  
  


  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);

  // カメラの作成
  const camera = new THREE.PerspectiveCamera(
    50, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0,0,20);
  camera.lookAt(0,0,0);

  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, innerHeight);
  renderer.setClearColor(0x305070);
    document.getElementById("output").appendChild(renderer.domElement);

   // 光源の設定
   const light = new THREE.SpotLight(0xffffff, 1000);
   light.position.set(0, -5, 20);
   scene.add(light);
    
  //内部作成 
  //画面内テキスト 
  
  //壁
  const wallside = 20;
  const wallupdown = 15;
  const wallwidth = 0.5;
  const wallhigh = 1;
  
  const wall = new THREE.Group();

  const WallSide = new THREE.Mesh(
    new THREE.BoxGeometry(wallwidth, wallside, wallhigh),
    new THREE.MeshPhongMaterial({color: 0xB3B3B3})
  )
  const WallSideR = WallSide.clone();
  WallSideR.position.x = wallupdown / 2 + wallwidth / 2;
  wall.add(WallSideR);

  const WallSideL = WallSide.clone();
  WallSideL.position.x = - wallupdown / 2 - wallwidth / 2;
  wall.add(WallSideL);
  
  const WallUpDown = new THREE.Mesh(
    new THREE.BoxGeometry(wallupdown, wallwidth, wallhigh),
    new THREE.MeshPhongMaterial({color: 0xB3B3B3})
  )
  const WallDown = WallUpDown.clone();
  WallDown.position.y = wallside / 2 - wallwidth / 2;
  wall.add(WallDown);

  const WallUp = WallUpDown.clone();
  WallUp.position.y = - wallside / 2 + wallwidth / 2;
  wall.add(WallUp);

  scene.add(wall);
  

  //ボス 
    const boss = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.2,0),
      new THREE.MeshPhongMaterial({ color: 0xffa0ff })
    );
    boss.position.y = 6;
    scene.add(boss);
  
  //玉1
  const Eattack = [];
  for(let n = 0; n < 30; n++){
    Eattack.push(0);
    Eattack [n] = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 1, 4),
      new THREE.MeshPhongMaterial({ color: 0xaa40ff })
    );
    Eattack [n].position.y = 10;
    scene.add(Eattack[n]);
  };

  //玉2
  const Eattack2 = [];
  for(let n = 0; n < 60; n++){
    Eattack2.push(0);
    Eattack2 [n] = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshPhongMaterial({ color: 0xa4eeff })
    );
    Eattack2 [n].position.y = -10;
    scene.add(Eattack2[n]);
  };

  //player当たり判定の確認
  
  const nSeg = 24;
  const ballR = 0.3;

  const player =new THREE.Mesh(
    new THREE.SphereGeometry(ballR, nSeg, nSeg),
    new THREE.MeshPhongMaterial({ color: 0xff0038 })
  );
  player.position.y = -6;
  scene.add(player);


  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const intersects = new THREE.Vector3();

    function playerMove(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, intersects);

      const offsetX = wallupdown / 2  - ballR;
      if(intersects.x < -offsetX){
        intersects.x = -offsetX;
      }else if(intersects.x > offsetX){
        intersects.x = offsetX;
      }

      const offsetY = wallside / 2 - wallwidth / 2 - ballR * 2;
      if (intersects.y < -offsetY) {
        intersects.y = -offsetY;
      } else if (intersects.y > offsetY) {
        intersects.y = offsetY;
      }

      player.position.x = intersects.x;
      player.position.y = intersects.y;
    }

  window.addEventListener("mousemove", playerMove, false);


  //攻撃
  const PattackR = 0.2;
  const Pattack = [];
  for(let n = 0; n < 5; n++){
    Pattack.push(0);
    Pattack [n] = new THREE.Mesh(
      new THREE.SphereGeometry(PattackR, nSeg, nSeg),
      new THREE.MeshPhongMaterial({ color: 0xff0088 })
    );
    Pattack [n].position.y = 10;
    scene.add(Pattack[n]);
  };

  // キーが押されたときの処理
  document.addEventListener('keydown', (event) => {
    if (event.key === ' ') { // スペースキーが押されたとき
        shoot(); 
    }
  });

  // キーが離されたときの処理
  document.addEventListener('keyup', (event) => {
    if (event.key === ' ') { // スペースキーが離されたとき
    }
  });

  let count = 0;
  let time = 0;

  function shoot(){
    time += 1;
    console.log("shoot");
    if(time%2 == 0){
      Pattack [count].position.x = player.position.x;
      Pattack [count].position.y = player.position.y + 2;     
      count += 1;
      if(count == 5){
        count = 0;
      }   
    }
  }
  


  // 描画処理
  let bossTime = 0;
  let bossCount1 = 0;
  let bossCount2 = 0;
  let checkangle2 = true;
  let angle = 0;
  let angle2 = 0;
  let rad = [];
  let wallcheck = [];
  let rad2 = [];
  let wallcheck2 = [];

  for(let n = 0; n < 30; n++){
    rad.push(180);
    wallcheck.push(0);
  };

  for(let n = 0; n < 60; n++){
    rad2.push(180);
    wallcheck2.push(0);
  };




  

  // 描画関数
  function render() {
    // 座標軸の表示
    axes.visible = param.axes;
    // 描画
    renderer.render(scene, camera);

    //bossアクション
    boss.rotation.x += 0.01 * param.rotation;
    boss.rotation.y += 0.04 * param.rotation; 

    //敵攻撃初期情報
    //敵攻撃1
    if(bossTime% 4 == 0){
      angle = Math.random() * 90 - 45;
      rad [bossCount1]= angle * (Math.PI / 180);
      Eattack [bossCount1].rotation.z =Math.PI;
      Eattack [bossCount1].rotation.z += rad[bossCount1];
      wallcheck[bossCount1] = 0;
      Eattack [bossCount1].position.x = boss.position.x;
      Eattack [bossCount1].position.y = boss.position.y;  
      
      bossCount1 += 1;
      if(bossCount1 == 30){
        bossCount1 = 0;
      }
    }

    //敵攻撃2
    if(bossTime% 10 == 0){
      Eattack2 [bossCount2].position.x = boss.position.x + 1;
      Eattack2 [60 - bossCount2 - 1].position.x = boss.position.x - 1;
      wallcheck2[bossCount2] = 0;
      Eattack2 [bossCount2].position.y = boss.position.y;
      Eattack2 [60 - bossCount2 - 1].position.y = boss.position.y;
      wallcheck2[60 - bossCount2 - 1] = 0;

      if(checkangle2){
        angle2 += 5;
        if(angle2 == 90){
          checkangle2 = false;
        }
      }else{
        angle2 -= 5;
        if(angle2 == 0){
          checkangle2 = true;
        }
      }

      rad2 [bossCount2]= (225 + angle2) * (Math.PI / 180);
      bossCount2 += 1;
      if(bossCount2 == 30){
        bossCount2 = 0;
      }
    }

    //敵攻撃移動
    //敵攻撃1
    for(let n = 0; n < 30; n ++){
      Eattack [n].position.y += Math.sin(rad[n] + Math.PI * 3 / 2) / 5;
      
      // 玉1反射     
      if(wallcheck[n] == 1){
        Eattack [n].position.x -= Math.cos(rad[n] + Math.PI * 3 / 2) / 5;         
      }else if(-wallupdown / 2 < Eattack [n].position.x && Eattack [n].position.x < wallupdown / 2){
        Eattack [n].position.x += Math.cos(rad[n] + Math.PI * 3 / 2) / 5;
      }else{
        Eattack [n].rotation.z -= 2 * rad[n];  
        wallcheck[n] = 1;              
      }
      if(Eattack [n].position.x + 0.25 > player.position.x && Eattack [n].position.x - 0.25 < player.position.x && Eattack [n].position.y + 0.25 > player.position.y && Eattack [n].position.y - 0.25 < player.position.y){
        player.visible = false;
        Pattack[0].visible = false;
        Pattack[1].visible = false;
        Pattack[2].visible = false;
        Pattack[3].visible = false;
        Pattack[4].visible = false;
      }
    }

    //敵攻撃2
    for(let n = 0; n < 30; n ++){
      Eattack2[n].rotation.x += 0.1 * param.rotation;
      Eattack2[n].rotation.y += 0.4 * param.rotation; 
      Eattack2[n].position.y += Math.sin(rad2 [n]) / 4;
      Eattack2[60 - n - 1].rotation.x += 0.1 * param.rotation;
      Eattack2[60 - n - 1].rotation.y += 0.4 * param.rotation; 
      Eattack2[60 - n - 1].position.y += Math.sin(rad2 [n]) / 4;

      //玉2波状
      if(wallcheck2[n] == 1){
        Eattack2 [n].position.x -= Math.cos(rad2 [n]) / 5;    
        Eattack2 [60 - n - 1].position.x += Math.cos(rad2 [n]) / 5;     
      }else if(-wallupdown / 2 < Eattack2 [n].position.x && Eattack2 [n].position.x < wallupdown / 2){
        Eattack2 [n].position.x += Math.cos(rad2 [n]) / 5; 
        Eattack2 [60 - n - 1].position.x -= Math.cos(rad2 [n]) / 5;  
      }else{
        wallcheck2[n] = 1;              
      }

      if(Eattack2 [n].position.x + 0.25 > player.position.x && Eattack2 [n].position.x - 0.25 < player.position.x && Eattack2 [n].position.y + 0.25 > player.position.y && Eattack2 [n].position.y - 0.25 < player.position.y){
        player.visible = false;
        Pattack[0].visible = false;
        Pattack[1].visible = false;
        Pattack[2].visible = false;
        Pattack[3].visible = false;
        Pattack[4].visible = false;
      }
      if(Eattack2 [60 - n - 1].position.x + 0.25 > player.position.x && Eattack2 [60 - n - 1].position.x - 0.25 < player.position.x && Eattack2 [60 - n - 1].position.y + 0.25 > player.position.y && Eattack2 [60 - n - 1].position.y - 0.25 < player.position.y){
        player.visible = false;
        Pattack[0].visible = false;
        Pattack[1].visible = false;
        Pattack[2].visible = false;
        Pattack[3].visible = false;
        Pattack[4].visible = false;
      }
    }



    
    for(let n = 0; n < 5; n ++){
      Pattack [n].position.y += 0.4;
    }

    bossTime += 1;



    // 次のフレームでの描画要請
    requestAnimationFrame(render); 

    
  }

  // 描画開始
  render();
}

init();