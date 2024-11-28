//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G38489-2023 三浦悠樹
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { GUI } from "ili-gui";
import { MeshPhongMaterial } from 'three';

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    axes: true, // 座標軸
    rotation: 2,
    
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "axes").name("座標軸");
  gui.add(param, "rotation").name("座標軸");


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
  
  //壁
  const wallside = 20;
  const wallupdown = 15;
  const wallwidth = 0.5;
  const wallhigh = 1;
  {
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
  }

  //玉1

  {

    const boss = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1,0),
      new THREE.MeshPhongMaterial({ color: 0xffa0ff })
    );
    boss.position.y = 4;
    boss.rotation.x += 0.1 * param.rotation;
    boss.rotation.y += 0.4 * param.rotation;
    scene.add(boss);

  }






  //当たり判定の確認
  {
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

    
  }

  // 描画処理
  

  // 描画関数
  function render() {
    // 座標軸の表示
    axes.visible = param.axes;
    // 描画
    renderer.render(scene, camera);
    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }

  // 描画開始
  render();
}

init();