// masu = 000000  上位3bit 先手のコマ、下位3bit 後手のコマ
// hand = 000(3)  DAI CHU SHO,  3進数
const MASUBIT = {
  SAKIDAI: 1<<5,  //100000
  SAKICHU: 1<<4,  //010000
  SAKISHO: 1<<3,  //001000
  ATODAI: 1<<2,  //000100
  ATOCHU: 1<<1,  //000010
  ATOSHO: 1<<0,  //000001
};
const HANDBIT = {
  DAI: Math.pow(3,2), // 100
  CHU: Math.pow(3,1), // 010
  SHO: Math.pow(3,0), // 001
};
const TURN={
  SAKI:1, ATO: 2,
}
function masuStr(masu){
  return ("000000"+masu.toString(2)).slice(-6);
}
function printMap(map){
  for(var i=0;i<3;i++){
    console.log(""+masuStr(map[i*3])+","+masuStr(map[i*3+1])+","+masuStr(map[i*3+2]));
  }
}
function getTurnMasu(turn){
  if(turn == TURN.SAKI){
    return [MASUBIT.SAKIDAI,MASUBIT.SAKICHU,MASUBIT.SAKISHO];
  }else{
    return [MASUBIT.ATODAI,MASUBIT.ATOCHU,MASUBIT.ATOSHO];
  }
}
// 現在の手にあるコマを検索
function getHands(map, turn){
  var myhands = Math.pow(3,3)-1;  // 222
  var [MASUDAI,MASUCHU,MASUSHO] = getTurnMasu(turn);
  map.forEach(v=>{
    if(v&MASUDAI) myhands-=HANDBIT.DAI;
    else if(v&MASUCHU) myhands-=HANDBIT.CHU;
    else if(v&MASUSHO) myhands-=HANDBIT.SHO;
  });
  return myhands;
}
// mapを右回転させる
kaitenMap.migiRotate = [6,3,0, 7,4,1, 8,5,2];
kaitenMap.jougeHantenRotate = [6,7,8, 3,4,5, 0,1,2];
kaitenMap.sayuuHantenRotate = [2,1,0, 5,4,3, 8,7,6];
kaitenMap.jougeSayuuHantenRotate = [8,7,6, 5,4,3, 2,1,0];
function kaitenMap(map, rotate){
  return map.map((v,i)=>{
    return map[rotate[i]];
  });
}

// マスから動かせるコマを取得する
function gettableFromMasu(masu){
  if(masu&MASUBIT.SAKIDAI) return MASUBIT.SAKIDAI;
  if(masu&MASUBIT.ATODAI) return MASUBIT.ATODAI;
  if(masu&MASUBIT.SAKICHU) return MASUBIT.SAKICHU;
  if(masu&MASUBIT.ATOCHU) return MASUBIT.ATOCHU;
  if(masu&MASUBIT.SAKISHO) return MASUBIT.SAKISHO;
  if(masu&MASUBIT.ATOSHO) return MASUBIT.ATOSHO;
  return 0;
}
// マスに置けるかどうか判定する
function canPutOnMasu(masu, koma){
  if(masu&(MASUBIT.SAKIDAI|MASUBIT.ATODAI)){
    // 大が置いてある場合は置けない
    return false;
  }else if(masu&(MASUBIT.SAKICHU|MASUBIT.ATOCHU)){
    // 中が置いてある場合は大だけ置ける
    return !!(koma&(MASUBIT.SAKIDAI|MASUBIT.ATODAI));
  }else if(masu&(MASUBIT.SAKISHO|MASUBIT.ATOSHO)){
    // 小が置いてある場合は小以外は置ける
    return !(koma&(MASUBIT.SAKISHO|MASUBIT.ATOSHO));
  }else{
    // 何も置いてない場合はなんでも置ける
    return true;
  }
}
// マスにコマを置いたときのマスを取得する
function putMasu(masu, koma){
  return masu|koma;
}
// mapをコピーする
function cloneMap(map){
  return map.map(v=>v);
}

// 先手と後手どっちのマスか判定
function getMasuColor(masu){
  var masuColor = gettableFromMasu(masu);
  if(masuColor==0) return 0;
  if(masuColor&MASUBIT.SAKIDAI) return TURN.SAKI;
  if(masuColor&MASUBIT.SAKICHU) return TURN.SAKI;
  if(masuColor&MASUBIT.SAKISHO) return TURN.SAKI;
  return TURN.ATO;
}

// 勝敗判定
function checkWinner(map){
  var masuColorMap=map.map(masu=>getMasuColor(masu));
  for(var i=0;i<3;i++){
    // 横方向チェック
    if(masuColorMap[i] && masuColorMap[i]==masuColorMap[i+3]&&masuColorMap[i]==masuColorMap[i+6]){
      return masuColorMap[i];
    }
    // 縦方向チェック
    if(masuColorMap[i*3] && masuColorMap[i*3]==masuColorMap[i*3+1] && masuColorMap[i*3]==masuColorMap[i*3+2]){
      return masuColorMap[i*3];
    }
  }
  // 斜めチェック
  if(masuColorMap[0] && masuColorMap[0]==masuColorMap[4] && masuColorMap[0]==masuColorMap[8]){
    return masuColorMap[0];
  }
  if(masuColorMap[2] && masuColorMap[2]==masuColorMap[4] && masuColorMap[2]==masuColorMap[6]){
    return masuColorMap[2];
  }
}

function addMemo(memo, map){
  var tmpmap = cloneMap(map);
  memo[tmpmap] = true; // 右に1回転

  tmpmap = kaitenMap(map, kaitenMap.migiRotate);
  memo[tmpmap] = true; // 右に1回転

  tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate);
  memo[tmpmap] = true; // 右に1回転

  tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate);
  memo[tmpmap] = true; // 右に1回転

  tmpmap = kaitenMap(map, kaitenMap.jougeHantenRotate);
  memo[tmpmap] = true; //  上下反転

  tmpmap = kaitenMap(map, kaitenMap.migiRotate);
  memo[tmpmap] = true; // 右に1回転

  tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate);
  memo[tmpmap] = true; // 右に1回転

  tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate);
  memo[tmpmap] = true; // 右に1回転


  tmpmap = kaitenMap(map, kaitenMap.sayuuHantenRotate);
  memo[tmpmap] = true; // 左右反転

  tmpmap = kaitenMap(map, kaitenMap.migiRotate);
  memo[tmpmap] = true; // 右に1回転

  tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate);
  memo[tmpmap] = true; // 右に1回転

  tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate);
  memo[tmpmap] = true; // 右に1回転

  tmpmap = kaitenMap(map, kaitenMap.jougeSayuuHantenRotate);
  memo[tmpmap] = true; // 上下左右反転

  tmpmap = kaitenMap(map, kaitenMap.migiRotate);
  memo[tmpmap] = true; // 右に1回転

  tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate);
  memo[tmpmap] = true; // 右に1回転

  tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate);
  memo[tmpmap] = true; // 右に1回転

}
// メモに含まれているマップかどうか判定
isMemoContain.times = 0;
isMemoContain.count = 0;
function isMemoContain(memo, map){
  isMemoContain.count++;
  var start = new Date();
  var containFlg = false;
  var tmpmap = cloneMap(map);
  var checkedMap = [];
  if(memo[tmpmap])return true;

  checkedMap.push(tmpmap = kaitenMap(map, kaitenMap.migiRotate));
  if(memo[tmpmap])containFlg = true; // 右に1回転

  checkedMap.push(tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate));
  if(memo[tmpmap])containFlg = true; // 右に2回転

  checkedMap.push(tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate));
  if(memo[tmpmap])containFlg = true; // 右に3回転

  checkedMap.push(tmpmap = kaitenMap(map, kaitenMap.jougeHantenRotate));
  if(memo[tmpmap])containFlg = true; // 上下反転

  checkedMap.push(tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate));
  if(memo[tmpmap])containFlg = true; // 右に1回転

  checkedMap.push(tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate));
  if(memo[tmpmap])containFlg = true; // 右に2回転

  checkedMap.push(tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate));
  if(memo[tmpmap])containFlg = true; // 右に3回転


  checkedMap.push(tmpmap = kaitenMap(map, kaitenMap.sayuuHantenRotate));
  if(memo[tmpmap])containFlg = true; // 左右反転

  checkedMap.push(tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate));
  if(memo[tmpmap])containFlg = true; // 右に1回転

  checkedMap.push(tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate));
  if(memo[tmpmap])containFlg = true; // 右に2回転

  checkedMap.push(tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate));
  if(memo[tmpmap])containFlg = true; // 右に3回転

  checkedMap.push(tmpmap = kaitenMap(map, kaitenMap.jougeSayuuHantenRotate));
  if(memo[tmpmap])containFlg = true; // 上下左右反転

  checkedMap.push(tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate));
  if(memo[tmpmap])containFlg = true; // 右に1回転

  checkedMap.push(tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate));
  if(memo[tmpmap])containFlg = true; // 右に2回転

  checkedMap.push(tmpmap = kaitenMap(tmpmap, kaitenMap.migiRotate));
  if(memo[tmpmap])containFlg = true; // 右に3回転

  if(containFlg){
    checkedMap.forEach(map=>{
      memo[map] = true;
    });
  }
  isMemoContain.times += new Date()-start;
  return containFlg;
}

// 次の１手の一覧を取得(反転回転して同じ場合は取得しない)
// 勝てる手があるときは勝てる手だけ取得
function nextMap(map, turn){
  var [MASUDAI,MASUCHU,MASUSHO] = getTurnMasu(turn);
  var maps = [];
  var mapMemo = {};
  var hands = getHands(map, turn);
  // 手から出して置ける場所を全取得
  if(hands>=HANDBIT.DAI){
    // 大を持ってる場合
    for(var i=0;i<map.length;i++){
      var v = map[v];
      if(canPutOnMasu(v, MASUDAI)){
        var cMap = cloneMap(map);
        cMap[i] = putMasu(cMap[i], MASUDAI);
        //if(!isMemoContain(mapMemo, cMap)){
          if(checkWinner(cMap)){
            return [cMap];
          }
          maps.push(cMap);
          mapMemo[cMap] = true;
        //}
      }
    }
  }
  if(hands%HANDBIT.DAI>=HANDBIT.CHU){
    // 中を持ってる場合
    for(var i=0;i<map.length;i++){
      var v = map[v];
      if(canPutOnMasu(v, MASUCHU)){
        var cMap = cloneMap(map);
        cMap[i] = putMasu(cMap[i], MASUCHU);
        //if(!isMemoContain(mapMemo, cMap)){
          if(checkWinner(cMap)){
            return [cMap];
          }
          maps.push(cMap);
          mapMemo[cMap] = true;
        //}
      }
    }
  }
  if(hands%HANDBIT.DAI%HANDBIT.CHU>=HANDBIT.SHO){
    // 小を持ってる場合
    for(var i=0;i<map.length;i++){
      var v = map[v];
      if(canPutOnMasu(v, MASUSHO)){
        var cMap = cloneMap(map);
        cMap[i] = putMasu(cMap[i], MASUSHO);
        //if(!isMemoContain(mapMemo, cMap)){
          if(checkWinner(cMap)){
            return [cMap];
          }
          maps.push(cMap);
          mapMemo[cMap] = true;
        //}
      }
    }
  }

  // 持ち上げて移動パターン

  return maps;

}


var map = [
  0,0,0,
  0,0,0,
  0,0,0,
];
var cnt = 0;
var mapMemo = {};
var start = new Date();
nextMap(map, TURN.SAKI).forEach((map, i)=>{
  if(checkWinner(map) || isMemoContain(mapMemo, map)) return;
  else addMemo(mapMemo, map);
  nextMap(map, TURN.ATO).forEach((map, j)=>{
    if(checkWinner(map) || isMemoContain(mapMemo, map)) return;
    else addMemo(mapMemo, map);
    nextMap(map, TURN.SAKI).forEach((map, k)=>{
      if(checkWinner(map) || isMemoContain(mapMemo, map)) return;
      else addMemo(mapMemo, map);
      nextMap(map, TURN.ATO).forEach((map, k)=>{
        if(checkWinner(map) || isMemoContain(mapMemo, map)) return;
        else addMemo(mapMemo, map);
        nextMap(map, TURN.SAKI).forEach((map, k)=>{
          if(checkWinner(map) || isMemoContain(mapMemo, map)) return;
          else addMemo(mapMemo, map);
          nextMap(map, TURN.ATO).forEach((map, k)=>{
            if(checkWinner(map) || isMemoContain(mapMemo, map)) return;
            else addMemo(mapMemo, map);
            cnt++;
          });
        });
      });
    });
  });
});
console.log(cnt);
console.log(new Date() - start);
console.log("isMemoContain.times", isMemoContain.times);
console.log("isMemoContain.count", isMemoContain.count);
console.log("kaitenMap.count", kaitenMap.count);
console.log("kaitenMap.times", kaitenMap.times);
