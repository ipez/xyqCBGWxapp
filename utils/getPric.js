const schoolSkiGold = require("../data/calcData.js").schoolSkiGold
const exptSkiGold = require("../data/calcData.js").exptSkiGold
const comLifeSkiGold = require("../data/calcData.js").comLifeSkiGold
const daZaoGold = require("../data/calcData.js").daZaoGold
const qiangShenGold = require("../data/calcData.js").qiangShenGold
const lingShiGold = require("../data/calcData.js").lingShiGold
const qiangZhuangGold = require("../data/calcData.js").qiangZhuangGold

// 角色技能修炼消耗计算
let calcPric=(roleObj, coefObj)=>{
  var gold2money = parseFloat(coefObj.gold2money)
  var money2rmb = parseFloat(coefObj.money2rmb)
  var xlgmoney = parseFloat(coefObj.xlgmoney)
  //角色修炼  【gold储备金 money现金 rmb人民币】
  var exptGold = [30000, 20000, 30000, 20000, 30000]; // 攻 防 法 抗法 猎
  var exptSki = [roleObj.iExptSki1, roleObj.iExptSki2, roleObj.iExptSki3, roleObj.iExptSki4, roleObj.iExptSki5];
  var exptSkiGoldSum = 0;
  for (var i = 0; i < 5; i++) exptSkiGoldSum += arrSum(exptSkiGold,exptSki[i]) * exptGold[i];
  //修炼上限
  var exptSkiMaxGoldSum = 0;
  var iMaxExpt = [roleObj.iMaxExpt1, roleObj.iMaxExpt2, roleObj.iMaxExpt3, roleObj.iMaxExpt4];
  for (i = 0; i < 4; i++) exptSkiMaxGoldSum += goldLoss(iMaxExpt[i]) * exptGold[i]

  function goldLoss(maxExpt) {
    var goldLoss = 0;
    switch (maxExpt - 20) {
      case 0: goldLoss = 0; break;
      case 1: goldLoss = exptSkiGold[12]; break; //损失修炼等级13
      case 2: goldLoss = exptSkiGold[12] + exptSkiGold[13]; break;
      case 3: goldLoss = exptSkiGold[13] + exptSkiGold[14] + exptSkiGold[15]; break;
      case 4: goldLoss = exptSkiGold[14] + exptSkiGold[15] + exptSkiGold[16] + exptSkiGold[17]; break;
      case 5: goldLoss = exptSkiGold[14] + exptSkiGold[15] + exptSkiGold[16] + exptSkiGold[17] + exptSkiGold[22]; break;
    }
    return goldLoss;
  }

  //宠物修炼
  var beastSki = [roleObj.iBeastSki1, roleObj.iBeastSki2, roleObj.iBeastSki3, roleObj.iBeastSki4];
  var SumExp = 0;
  for (i = 0; i < 4; i++) SumExp += arrSum(exptSkiGold, beastSki[i]);
  var beastSkiMoney = Math.ceil(SumExp / 15) * xlgmoney * 10000;

  //角色师门
  var schoolSki = [];
  for (i = 1; i < 133; i++) {
    if (typeof (roleObj.all_skills[i]) == "number") {
      var sn = schoolSki.push(Math.min(roleObj.all_skills[i], 180));//技能大于180的为符石加成不考虑，低等级的符石加成暂不处理。
      if (sn == 7) break;  //找到全部7个技能等级跳出循环
    }
  }
  var schoolSkiGoldSum = 0;
  for (i = 0; i < 7; i++) schoolSkiGoldSum += arrSum(schoolSkiGold,schoolSki[i]);
  
  //生活技能 只考虑40级以上  201-218；230//普通，打造技巧，强身，灵石，强壮
  var lifeSki = [];
  //201: "强身术",202: "冥想",203: "暗器技巧",204: "打造技巧",205: "裁缝技巧",206: "中药医理",
  //207: "炼金术",208: "烹饪技巧",209: "追捕技巧",210: "逃离技巧",211: "养生之道",212: "健身术",
  //216: "巧匠之术",217: "熔炼技巧",218: "灵石技巧",230: "强壮",231: "淬灵之术",237: "神速"
  for (i = 201; i < 218; i++) lifeSki.push(typeof (roleObj.all_skills[i.toString()]) === "number" ? roleObj.all_skills[i.toString()] : 0);
  lifeSki.push(typeof (roleObj.all_skills['231']) === "number" ? roleObj.all_skills['231'] : 0);

  lifeSki.push(typeof (roleObj.all_skills['218']) === "number" ? roleObj.all_skills['218'] : 0);
  lifeSki.push(typeof (roleObj.all_skills['230']) === "number" ? roleObj.all_skills['230'] : 0);
  lifeSki.push(typeof (roleObj.all_skills['237']) === "number" ? roleObj.all_skills['237'] : 0);

  //调整顺序 为强身，打造，暗器，冥想...
  var tem = 0;
  tem = lifeSki[1];
  lifeSki[1] = lifeSki[3];
  lifeSki[3] = tem;

  var lifeSkiGoldSum = 0;
  for (i = 2; i < lifeSki.length - 3; i++) lifeSkiGoldSum += arrSum(comLifeSkiGold,lifeSki[i] > 40 ? lifeSki[i] : 0);
  lifeSkiGoldSum += arrSum(qiangShenGold,lifeSki[0] > 40 ? lifeSki[0] : 0);
  lifeSkiGoldSum += arrSum(daZaoGold,lifeSki[1] > 40 ? lifeSki[1] : 0);
  lifeSkiGoldSum += arrSum(lingShiGold,lifeSki[lifeSki.length - 3] > 40 ? lifeSki[lifeSki.length - 3] : 0);
  lifeSkiGoldSum += arrSum(qiangZhuangGold,lifeSki[lifeSki.length - 2]);
  lifeSkiGoldSum += arrSum(qiangZhuangGold,lifeSki[lifeSki.length - 1]);

  var lifeBG = [];
  for (i = 0; i < 160; i++) lifeBG.push(i + 1);
  var lifeSkiBGSum = 0;
  for (i = 0; i < lifeSki.length; i++) lifeSkiBGSum += arrSum(lifeBG,lifeSki[i] > 40 ? lifeSki[i] : 0);

  //返回金钱总消耗
  var rmbPrice = ((exptSkiGoldSum + schoolSkiGoldSum + exptSkiMaxGoldSum + lifeSkiGoldSum) * gold2money + beastSkiMoney) * money2rmb / 3000e4 + lifeSkiBGSum / 50.0;
  return rmbPrice;
}

//数组前 n 项合
let arrSum = function (arr,n) {
  let sum = 0
  for (let i = 0; i < n; i++) sum += parseInt(arr[i]);
  return sum;
};

console.log('x')


module.exports = {
  calcPric
}
