import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, User, Briefcase, Heart, Home, DollarSign, Map, Users, 
  Frown, Smile, BookOpen, Star, Moon, Sun, Flower, Anchor, 
  ChevronDown, Crown, Shield, Zap, RefreshCw, Feather, Flame, Droplets, Mountain, Leaf, Hammer
} from 'lucide-react';

// --- 基础配置 ---

const BRANCHES = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
const ZHI_STD = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']; 
const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];

// 宫位基本顺序 (逆时针)
const PALACE_NAMES_BASE = ['命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄', '迁移', '交友', '官禄', '田宅', '福德', '父母'];

// 五行颜色映射
const WUXING_CONFIG = {
  '金': { color: 'text-yellow-600', bg: 'bg-yellow-400', bar: 'bg-yellow-500', icon: <Hammer className="w-4 h-4"/>, label: '金 (义)' },
  '木': { color: 'text-green-600', bg: 'bg-green-400', bar: 'bg-green-500', icon: <Leaf className="w-4 h-4"/>, label: '木 (仁)' },
  '水': { color: 'text-blue-600', bg: 'bg-blue-400', bar: 'bg-blue-500', icon: <Droplets className="w-4 h-4"/>, label: '水 (智)' },
  '火': { color: 'text-red-600', bg: 'bg-red-400', bar: 'bg-red-500', icon: <Flame className="w-4 h-4"/>, label: '火 (礼)' },
  '土': { color: 'text-amber-700', bg: 'bg-amber-500', bar: 'bg-amber-600', icon: <Mountain className="w-4 h-4"/>, label: '土 (信)' }
};

// 十干四化 (中州派)
const SI_HUA_RULES = {
  '甲': { lu: '廉贞', quan: '破军', ke: '武曲', ji: '太阳' },
  '乙': { lu: '天机', quan: '天梁', ke: '紫微', ji: '太阴' },
  '丙': { lu: '天同', quan: '天机', ke: '文昌', ji: '廉贞' },
  '丁': { lu: '太阴', quan: '天同', ke: '天机', ji: '巨门' },
  '戊': { lu: '贪狼', quan: '太阴', ke: '右弼', ji: '天机' },
  '己': { lu: '武曲', quan: '贪狼', ke: '天梁', ji: '文曲' },
  '庚': { lu: '太阳', quan: '武曲', ke: '太阴', ji: '天同' },
  '辛': { lu: '巨门', quan: '太阳', ke: '文曲', ji: '文昌' },
  '壬': { lu: '天梁', quan: '紫微', ke: '左辅', ji: '武曲' },
  '癸': { lu: '破军', quan: '巨门', ke: '太阴', ji: '贪狼' }
};

// 星曜亮度表 (精简版)
const BRIGHTNESS = {
  '紫微': { '子': '平', '丑': '庙', '寅': '庙', '卯': '平', '辰': '平', '巳': '旺', '午': '庙', '未': '庙', '申': '平', '酉': '平', '戌': '平', '亥': '旺' },
  '天机': { '子': '庙', '丑': '陷', '寅': '旺', '卯': '旺', '辰': '利', '巳': '平', '午': '庙', '未': '陷', '申': '旺', '酉': '旺', '戌': '平', '亥': '平' },
  '太阳': { '子': '陷', '丑': '陷', '寅': '旺', '卯': '庙', '辰': '庙', '巳': '旺', '午': '庙', '未': '平', '申': '平', '酉': '平', '戌': '陷', '亥': '陷' },
  '武曲': { '子': '旺', '丑': '庙', '寅': '平', '卯': '平', '辰': '庙', '巳': '平', '午': '旺', '未': '庙', '申': '平', '酉': '平', '戌': '庙', '亥': '平' },
  '天同': { '子': '旺', '丑': '陷', '寅': '平', '卯': '平', '辰': '平', '巳': '庙', '午': '陷', '未': '陷', '申': '旺', '酉': '平', '戌': '平', '亥': '庙' },
  '廉贞': { '子': '平', '丑': '利', '寅': '庙', '卯': '平', '辰': '利', '巳': '陷', '午': '平', '未': '利', '申': '庙', '酉': '平', '戌': '利', '亥': '陷' },
  '天府': { '子': '庙', '丑': '庙', '寅': '庙', '卯': '平', '辰': '庙', '巳': '平', '午': '旺', '未': '庙', '申': '平', '酉': '平', '戌': '庙', '亥': '平' },
  '太阴': { '子': '庙', '丑': '庙', '寅': '陷', '卯': '陷', '辰': '陷', '巳': '陷', '午': '陷', '未': '平', '申': '平', '酉': '旺', '戌': '旺', '亥': '庙' },
  '贪狼': { '子': '旺', '丑': '庙', '寅': '平', '卯': '平', '辰': '庙', '巳': '陷', '午': '旺', '未': '庙', '申': '平', '酉': '平', '戌': '庙', '亥': '陷' },
  '巨门': { '子': '旺', '丑': '旺', '寅': '庙', '卯': '庙', '辰': '陷', '巳': '平', '午': '旺', '未': '陷', '申': '庙', '酉': '庙', '戌': '陷', '亥': '旺' },
  '天相': { '子': '庙', '丑': '庙', '寅': '庙', '卯': '陷', '辰': '平', '巳': '平', '午': '旺', '未': '平', '申': '庙', '酉': '陷', '戌': '平', '亥': '平' },
  '天梁': { '子': '庙', '丑': '旺', '寅': '庙', '卯': '庙', '辰': '旺', '巳': '陷', '午': '庙', '未': '旺', '申': '陷', '酉': '平', '戌': '旺', '亥': '陷' },
  '七杀': { '子': '旺', '丑': '庙', '寅': '庙', '卯': '平', '辰': '庙', '巳': '平', '午': '旺', '未': '庙', '申': '庙', '酉': '平', '戌': '庙', '亥': '平' },
  '破军': { '子': '庙', '丑': '旺', '寅': '平', '卯': '陷', '辰': '旺', '巳': '平', '午': '庙', '未': '旺', '申': '平', '酉': '陷', '戌': '旺', '亥': '平' },
};

// 宫位图标映射 (水印)
const PALACE_ICONS = {
  '命宫': <User className="w-full h-full text-pink-300 opacity-20" />,
  '兄弟': <Users className="w-full h-full text-blue-300 opacity-20" />,
  '夫妻': <Heart className="w-full h-full text-red-300 opacity-20" />,
  '子女': <Smile className="w-full h-full text-orange-300 opacity-20" />,
  '财帛': <DollarSign className="w-full h-full text-yellow-300 opacity-20" />,
  '疾厄': <Frown className="w-full h-full text-green-300 opacity-20" />,
  '迁移': <Map className="w-full h-full text-purple-300 opacity-20" />,
  '交友': <Users className="w-full h-full text-teal-300 opacity-20" />,
  '官禄': <Briefcase className="w-full h-full text-indigo-300 opacity-20" />,
  '田宅': <Home className="w-full h-full text-amber-300 opacity-20" />,
  '福德': <Flower className="w-full h-full text-rose-300 opacity-20" />,
  '父母': <BookOpen className="w-full h-full text-cyan-300 opacity-20" />,
};

const PRESETS = {
  huhu: { date: '1993-01-13', time: '05:42', gender: '女' },
  qianqian: { date: '1995-11-20', time: '04:50', gender: '男' }
};

// 纳音五行局
const WXJ_MAP = {
  '甲子':4,'乙丑':4,'丙寅':6,'丁卯':6,'戊辰':3,'己巳':3,'庚午':5,'辛未':5,'壬申':4,'癸酉':4,'甲戌':6,'乙亥':6,
  '丙子':2,'丁丑':2,'戊寅':5,'己卯':5,'庚辰':4,'辛巳':4,'壬午':3,'癸未':3,'甲申':2,'乙酉':2,'丙戌':5,'丁亥':5,
  '戊子':6,'己丑':6,'庚寅':3,'辛卯':3,'壬辰':2,'癸巳':2,'甲午':4,'乙未':4,'丙申':6,'丁酉':6,'戊戌':3,'己亥':3,
  '庚子':5,'辛丑':5,'壬寅':4,'癸卯':4,'甲辰':6,'乙巳':6,'丙午':2,'丁未':2,'戊申':5,'己酉':5,'庚戌':4,'辛亥':4,
  '壬子':3,'癸丑':3,'甲寅':2,'乙卯':2,'丙辰':5,'丁巳':5,'戊午':6,'己未':6,'庚申':3,'辛酉':3,'壬戌':2,'癸亥':2
};

const App = () => {
  const [libLoaded, setLibLoaded] = useState(false);
  const [inputDate, setInputDate] = useState('2000-01-01');
  const [inputTime, setInputTime] = useState('12:00');
  const [gender, setGender] = useState('男');
  
  // 视图控制
  const [viewMode, setViewMode] = useState('native'); // native, decade, year, bazi
  const [selectedDecadeIdx, setSelectedDecadeIdx] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [selectedPalaceIndex, setSelectedPalaceIndex] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (window.Solar && window.Lunar) {
      setLibLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/lunar-javascript/lunar.js';
    script.async = true;
    script.onload = () => setLibLoaded(true);
    document.body.appendChild(script);
  }, []);

  const loadPreset = (key) => {
    const p = PRESETS[key];
    setInputDate(p.date);
    setInputTime(p.time);
    setGender(p.gender);
  };

  // --- 核心计算 ---
  useEffect(() => {
    if (!libLoaded || !inputDate || !inputTime) return;

    try {
      const [year, month, day] = inputDate.split('-').map(Number);
      const [hour, minute] = inputTime.split(':').map(Number);
      
      const solar = window.Solar.fromYmdHms(year, month, day, hour, minute, 0);
      const lunar = solar.getLunar();
      const eightChar = lunar.getEightChar();
      
      // 1. 八字数据 (简化计算五行)
      const bazi = {
        year: { gan: eightChar.getYearGan(), zhi: eightChar.getYearZhi() },
        month: { gan: eightChar.getMonthGan(), zhi: eightChar.getMonthZhi() },
        day: { gan: eightChar.getDayGan(), zhi: eightChar.getDayZhi() },
        time: { gan: eightChar.getTimeGan(), zhi: eightChar.getTimeZhi() },
      };
      
      const wxCounts = { '金':0, '木':0, '水':0, '火':0, '土':0 };
      const getWX = (char) => {
          if('甲乙寅卯'.includes(char)) return '木';
          if('丙丁巳午'.includes(char)) return '火';
          if('戊己辰戌丑未'.includes(char)) return '土';
          if('庚辛申酉'.includes(char)) return '金';
          if('壬癸亥子'.includes(char)) return '水';
          return '土';
      };
      [bazi.year, bazi.month, bazi.day, bazi.time].forEach(p => {
          wxCounts[getWX(p.gan)]++;
          wxCounts[getWX(p.zhi)]++;
      });

      const yearGanIndex = lunar.getYearGanIndex(); 
      const yearZhiIndex = lunar.getYearZhiIndex(); 

      // 2. 命身宫
      const lunarMonth = lunar.getMonth();
      const timeZhiIndex = lunar.getTimeZhiIndex(); 
      let mingIndex = ((lunarMonth - 1) - timeZhiIndex + 12) % 12; // 0=寅
      let shenIndex = ((lunarMonth - 1) + timeZhiIndex) % 12;

      // 3. 定局
      const yinGanIndex = (yearGanIndex % 5) * 2 + 2; 
      const mingGanIndex = (yinGanIndex + mingIndex) % 10;
      const mingGan = STEMS[mingGanIndex];
      const mingZhiStd = ZHI_STD[(mingIndex + 2) % 12];
      const wxjVal = WXJ_MAP[mingGan + mingZhiStd] || 2;
      const wuxingName = {2:'水二局',3:'木三局',4:'金四局',5:'土五局',6:'火六局'}[wxjVal];

      // 4. 安星 (紫微系/天府系)
      const lunarDay = lunar.getDay();
      let zwIndex = 0; 
      let remainder = lunarDay % wxjVal;
      let quotient = Math.floor(lunarDay / wxjVal);
      let x = 0;
      if (remainder !== 0) {
         x = wxjVal - remainder;
         quotient = Math.floor((lunarDay + x) / wxjVal);
      }
      let base = (quotient - 1 + 12) % 12;
      zwIndex = (remainder === 0) ? base : ((x % 2 !== 0) ? (base - x + 12) % 12 : (base + x) % 12);
      let tfIndex = (12 - zwIndex) % 12;

      // 5. 大限
      const isYangYear = yearGanIndex % 2 === 0;
      const isMale = gender === '男';
      const goForward = (isYangYear && isMale) || (!isYangYear && !isMale);
      const decadeRanges = [];
      for(let k=0; k<12; k++) {
         const startAge = wxjVal + k * 10;
         const endAge = startAge + 9;
         const pos = goForward ? (mingIndex + k) % 12 : (mingIndex - k + 12) % 12;
         const stemIdx = (yinGanIndex + pos) % 10;
         decadeRanges.push({ start: startAge, end: endAge, index: k, pos, stemIdx });
      }

      let currentDecadeInfo = decadeRanges[0];
      if (selectedDecadeIdx !== null && decadeRanges[selectedDecadeIdx]) {
          currentDecadeInfo = decadeRanges[selectedDecadeIdx];
      } else {
          const currentAge = new Date().getFullYear() - year + 1;
          const found = decadeRanges.find(d => currentAge >= d.start && currentAge <= d.end);
          if (found) currentDecadeInfo = found;
      }

      // 6. 流年
      const currentYearDiff = selectedYear - 2022; // 2022=寅(0)
      const yearZhiInYin = (0 + currentYearDiff + 1200) % 12;
      const yearGanVal = (selectedYear - 4) % 10;

      // 7. 视图与宫位轮转
      let viewMingIndex = mingIndex; 
      let siHuaStemIndex = yearGanIndex;

      if (viewMode === 'decade') {
          viewMingIndex = currentDecadeInfo.pos; // 大限命宫
          siHuaStemIndex = currentDecadeInfo.stemIdx; // 大限宫干
      } else if (viewMode === 'year') {
          viewMingIndex = yearZhiInYin; // 流年命宫 (地支)
          siHuaStemIndex = yearGanVal; // 流年天干
      }

      // 8. 宫位生成
      const palaces = [];
      for (let i = 0; i < 12; i++) {
        // i = 物理位置 (0=寅)
        // 宫名根据视图命宫逆排
        const offset = (viewMingIndex - i + 12) % 12;
        const pName = PALACE_NAMES_BASE[offset];
        const stemIdx = (yinGanIndex + i) % 10;
        
        const mainStars = []; const auxStars = []; const badStars = []; const smallStars = []; const mutagens = []; const liuStars = [];
        const add = (arr, name, type='normal') => {
           const light = BRIGHTNESS[name] ? BRIGHTNESS[name][ZHI_STD[(i+2)%12]] : '';
           arr.push({ name, light, type });
        };

        // 安主星
        const check = (idxRef, off, name) => { if ((idxRef + off + 120) % 12 === i) add(mainStars, name); };
        check(zwIndex, 0, '紫微'); check(zwIndex, -1, '天机'); check(zwIndex, -3, '太阳');
        check(zwIndex, -4, '武曲'); check(zwIndex, -5, '天同'); check(zwIndex, -8, '廉贞');
        check(tfIndex, 0, '天府'); check(tfIndex, 1, '太阴'); check(tfIndex, 2, '贪狼');
        check(tfIndex, 3, '巨门'); check(tfIndex, 4, '天相'); check(tfIndex, 5, '天梁');
        check(tfIndex, 6, '七杀'); check(tfIndex, 10, '破军');

        // 安吉星
        if ((8 - timeZhiIndex + 12) % 12 === i) add(auxStars, '文昌');
        if ((2 + timeZhiIndex) % 12 === i) add(auxStars, '文曲');
        if ((2 + (lunarMonth-1)) % 12 === i) add(auxStars, '左辅');
        if ((8 - (lunarMonth-1) + 12) % 12 === i) add(auxStars, '右弼');
        const kyMap = { 0:[11,5], 1:[10,6], 2:[9,7], 3:[9,7], 4:[11,5], 5:[10,6], 6:[11,5], 7:[4,0], 8:[1,3], 9:[1,3] };
        if (kyMap[yearGanIndex]?.includes(i)) add(auxStars, kyMap[yearGanIndex][0]===i?'天魁':'天钺');
        
        // 禄羊陀 (生年)
        const luMap = { 0:0, 1:1, 2:3, 3:4, 4:3, 5:4, 6:6, 7:7, 8:9, 9:10 };
        const luPos = luMap[yearGanIndex];
        if (luPos === i) add(auxStars, '禄存');
        if ((luPos + 1) % 12 === i) add(badStars, '擎羊');
        if ((luPos - 1 + 12) % 12 === i) add(badStars, '陀罗');

        // 煞星
        const yz = (yearZhiIndex - 2 + 12) % 12;
        let huoBase, lingBase;
        if ([0,4,8].includes(yz)) { huoBase=11; lingBase=1; }
        else if ([6,10,2].includes(yz)) { huoBase=0; lingBase=8; }
        else if ([3,7,11].includes(yz)) { huoBase=1; lingBase=8; }
        else { huoBase=7; lingBase=8; }
        if ((huoBase + timeZhiIndex) % 12 === i) add(badStars, '火星');
        if ((lingBase + timeZhiIndex) % 12 === i) add(badStars, '铃星');
        if ((9 - timeZhiIndex + 12) % 12 === i) add(badStars, '地空');
        if ((9 + timeZhiIndex) % 12 === i) add(badStars, '地劫');

        // 杂曜
        const luanIdx = (1 - yearZhiIndex + 12) % 12; 
        if (luanIdx === i) add(smallStars, '红鸾');
        if ((luanIdx + 6) % 12 === i) add(smallStars, '天喜');

        // --- 流曜计算 (仅在流年模式下显示) ---
        if (viewMode === 'year') {
           const liuLuPos = luMap[yearGanVal]; // 流年禄存位置
           if (liuLuPos === i) add(liuStars, '流禄', 'flow');
           if ((liuLuPos + 1) % 12 === i) add(liuStars, '流羊', 'flow');
           if ((liuLuPos - 1 + 12) % 12 === i) add(liuStars, '流陀', 'flow');
           if (kyMap[yearGanVal]?.includes(i)) add(liuStars, kyMap[yearGanVal][0]===i?'流魁':'流钺', 'flow');
        }

        // 动态四化
        const siHuaGan = STEMS[siHuaStemIndex];
        const rule = SI_HUA_RULES[siHuaGan];
        [...mainStars, ...auxStars].forEach(s => {
           if (s.name === rule.lu) mutagens.push({ name: '禄', color: 'bg-green-500' });
           if (s.name === rule.quan) mutagens.push({ name: '权', color: 'bg-red-500' });
           if (s.name === rule.ke) mutagens.push({ name: '科', color: 'bg-blue-500' });
           if (s.name === rule.ji) mutagens.push({ name: '忌', color: 'bg-pink-500' });
        });

        palaces.push({
          index: i,
          name: pName, 
          stem: STEMS[stemIdx],
          branch: BRANCHES[i],
          mainStars, auxStars, badStars, smallStars, mutagens, liuStars,
          icon: PALACE_ICONS[pName]
        });
      }

      setChartData({
        baziData: bazi,
        wxCounts,
        wuxing: wuxingName,
        mingZhu: ['禄存','文曲','廉贞','武曲','破军','武曲','廉贞','文曲','禄存','巨门','贪狼','巨门'][mingIndex],
        shenZhu: ['火星','天相','天梁','天同','文昌','天机','火星','天相','天梁','天同','文昌','天机'][yearZhiIndex],
        palaces,
        siHuaGan: STEMS[siHuaStemIndex],
        decadeRanges,
        currentDecadeIdx: currentDecadeInfo.index,
        viewMingIndex
      });

    } catch (e) { console.error(e); }
  }, [libLoaded, inputDate, inputTime, gender, viewMode, selectedDecadeIdx, selectedYear]);

  // 三方四正
  const sanFang = useMemo(() => {
    if (selectedPalaceIndex === null || !chartData) return [];
    const idx = selectedPalaceIndex;
    return [idx, (idx+6)%12, (idx+4)%12, (idx+8)%12];
  }, [selectedPalaceIndex, chartData]);

  // AI Prompt 生成
  const generatePrompt = () => {
    if (selectedPalaceIndex === null || !chartData) return '';
    const p = chartData.palaces[selectedPalaceIndex];
    const tri = sanFang.map(k => chartData.palaces[k]);
    
    let context = "【先天本命】";
    let extra = "";
    if (viewMode === 'decade') {
       const d = chartData.decadeRanges.find(r => r.index === chartData.currentDecadeIdx);
       context = `【大限运势 (${d.start}-${d.end}岁)】`;
       extra = `大限四化：${chartData.siHuaGan}干。大限命宫在${chartData.palaces[chartData.viewMingIndex].branch}。`;
    } else if (viewMode === 'year') {
       context = `【流年运势 (${selectedYear}年)】`;
       extra = `流年四化：${chartData.siHuaGan}干。流年命宫在${chartData.palaces[chartData.viewMingIndex].branch}。包含流禄/流羊/流陀等流动星曜。`;
    }

    const fmt = list => list.map(s => `${s.name}${s.light?`(${s.light})`:''}`).join(' ');
    const fmtMut = list => list.map(m => `[化${m.name}]`).join(' ');
    const getAll = pl => {
       const base = [...pl.mainStars, ...pl.auxStars, ...pl.badStars, ...pl.smallStars];
       const flow = viewMode === 'year' ? pl.liuStars : [];
       return [...base, ...flow];
    };
    
    const fmtFull = pl => {
        const stars = getAll(pl);
        const starsStr = stars.map(s => {
           // 查找该星是否有四化
           const mut = pl.mutagens.find(m => {
               // 简易匹配逻辑，实际四化规则已在前面计算并分配给 mutagens
               // 但 mutagens 是独立的列表，这里为了文本展示，尝试关联
               // 这里简化处理，直接列出所有四化
               return false; 
           });
           return `${s.name}${s.light?`(${s.light})`:''}`;
        }).join(' ');
        const mutStr = pl.mutagens.map(m => `[${m.name}]`).join('');
        return `星曜: ${starsStr} ${mutStr}`;
    };

    let text = `请作为紫微斗数专家，分析${context}下的【${p.name}】（${p.stem}${p.branch}位）。\n`;
    text += `基本信息：${gender}命，${chartData.wuxing}，命主${chartData.mingZhu}。\n`;
    text += `${extra}\n\n`;
    text += `【本宫】：${fmtFull(p)}\n`;
    text += `【对宫】：${fmtFull(tri[1])}\n`;
    text += `【三合】：${fmtFull(tri[2])} | ${fmtFull(tri[3])}\n\n`;
    text += `分析要求：\n1. 结合本宫及三方四正的星曜组合（主星、吉煞、四化、流曜）。\n2. 识别格局（如杀破狼、机月同梁、昌曲同宫、禄马交驰等）。\n3. 针对${context}给出具体吉凶判断和建议。`;
    return text;
  };

  const visualGrid = [3,4,5,6, 2,-1,-1,7, 1,-1,-1,8, 0,11,10,9];

  if (!libLoaded) return <div className="min-h-screen flex items-center justify-center bg-pink-50 text-pink-400 font-bold"><Sparkles className="animate-spin mr-2"/> 星盘计算中...</div>;

  return (
    <div className="min-h-screen bg-pink-50 text-slate-700 font-sans p-3 md:p-6 select-none overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 shadow-xl shadow-pink-100 border border-white mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-pink-400 to-rose-400 p-2.5 rounded-2xl shadow-lg shadow-pink-200 text-white">
                 <Moon className="w-6 h-6" />
              </div>
              <div>
                 <h1 className="text-xl font-bold text-slate-800 tracking-tight">紫微全能排盘 <span className="text-pink-400 text-xs border border-pink-200 px-1 rounded">Pro Max</span></h1>
              </div>
           </div>
           <div className="flex gap-2">
              <button onClick={()=>loadPreset('huhu')} className="px-3 py-1.5 text-xs font-bold text-pink-600 bg-white border border-pink-100 rounded-lg hover:bg-pink-50">糊糊 (女)</button>
              <button onClick={()=>loadPreset('qianqian')} className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-white border border-blue-100 rounded-lg hover:bg-blue-50">乾乾 (男)</button>
           </div>
           <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl shadow-inner border border-slate-100">
              <input type="date" value={inputDate} onChange={e=>setInputDate(e.target.value)} className="bg-transparent text-sm text-slate-600 outline-none font-medium w-28" />
              <input type="time" value={inputTime} onChange={e=>setInputTime(e.target.value)} className="bg-transparent text-sm text-slate-600 outline-none font-medium w-16" />
              <select value={gender} onChange={e=>setGender(e.target.value)} className="bg-transparent text-sm text-slate-600 outline-none font-medium cursor-pointer">
                 <option>男</option>
                 <option>女</option>
              </select>
           </div>
        </div>

        {/* View Switcher */}
        <div className="flex flex-col items-center gap-4 mb-6">
           <div className="bg-white p-1 rounded-full shadow-md flex gap-1 border border-pink-50">
              {['native', 'decade', 'year', 'bazi'].map(mode => (
                 <button 
                   key={mode} onClick={() => setViewMode(mode)}
                   className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode===mode ? 'bg-pink-400 text-white shadow-md shadow-pink-200' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {mode==='native' && <Anchor className="w-3 h-3"/>}
                   {mode==='decade' && <Map className="w-3 h-3"/>}
                   {mode==='year' && <Sun className="w-3 h-3"/>}
                   {mode==='bazi' && <Flame className="w-3 h-3"/>}
                   {mode==='native'?'先天':mode==='decade'?'大限':mode==='year'?'流年':'八字'}
                 </button>
              ))}
           </div>

           <div className="h-8">
              {viewMode === 'decade' && chartData && (
                 <div className="relative group animate-in fade-in slide-in-from-top-2">
                    <select 
                      value={selectedDecadeIdx ?? chartData.currentDecadeIdx} 
                      onChange={(e) => setSelectedDecadeIdx(Number(e.target.value))}
                      className="appearance-none pl-4 pr-8 py-1.5 bg-white border-2 border-pink-200 text-pink-500 font-bold rounded-xl text-xs outline-none cursor-pointer shadow-sm"
                    >
                       {chartData.decadeRanges.map((r) => (
                          <option key={r.index} value={r.index}>{r.start} - {r.end} 岁 ({STEMS[r.stemIdx]}干)</option>
                       ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-pink-400 absolute right-2.5 top-2.5 pointer-events-none" />
                 </div>
              )}
              {viewMode === 'year' && (
                 <div className="relative group animate-in fade-in slide-in-from-top-2">
                    <select 
                      value={selectedYear} 
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="appearance-none pl-4 pr-8 py-1.5 bg-white border-2 border-blue-200 text-blue-500 font-bold rounded-xl text-xs outline-none cursor-pointer shadow-sm"
                    >
                       {Array.from({length: 80}, (_, i) => new Date().getFullYear() - 60 + i).map(y => (
                          <option key={y} value={y}>{y} 年</option>
                       ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-blue-400 absolute right-2.5 top-2.5 pointer-events-none" />
                 </div>
              )}
           </div>
        </div>

        {/* Content Area */}
        {viewMode === 'bazi' && chartData ? (
           <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-xl shadow-pink-50 animate-in fade-in zoom-in-95 duration-300">
               <h2 className="text-center text-xl font-bold text-slate-800 mb-8 flex items-center justify-center gap-2">
                   <Flame className="w-5 h-5 text-red-500"/> 八字五行分析
               </h2>
               
               <div className="grid grid-cols-4 gap-3 mb-8">
                   {['年柱','月柱','日柱','时柱'].map((label, i) => {
                       const key = ['year','month','day','time'][i];
                       const col = chartData.baziData[key];
                       return (
                           <div key={i} className="flex flex-col items-center">
                               <span className="text-xs text-slate-400 mb-2">{label}</span>
                               <div className="bg-slate-50 w-full rounded-2xl p-4 flex flex-col items-center gap-2 border border-slate-100 shadow-inner">
                                   <span className="text-xl font-black text-slate-700">{col.gan}</span>
                                   <span className="text-xl font-black text-slate-700">{col.zhi}</span>
                               </div>
                           </div>
                       )
                   })}
               </div>

               <div className="space-y-4">
                   <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">五行能量分布</h3>
                   {Object.keys(WUXING_CONFIG).map(wx => {
                       const count = chartData.wxCounts[wx];
                       const percent = Math.min((count / 8) * 100, 100);
                       return (
                           <div key={wx} className="flex items-center gap-4 group">
                               <div className={`w-20 flex items-center gap-2 text-xs font-bold ${WUXING_CONFIG[wx].color}`}>
                                   {WUXING_CONFIG[wx].icon} {WUXING_CONFIG[wx].label}
                               </div>
                               <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                   <div className={`h-full ${WUXING_CONFIG[wx].bar} transition-all duration-1000 group-hover:opacity-80`} style={{width: `${percent}%`}}></div>
                               </div>
                               <span className="text-xs font-bold text-slate-400 w-4 text-right">{count}</span>
                           </div>
                       )
                   })}
               </div>
           </div>
        ) : (
           /* Zi Wei Chart */
           <div className="relative aspect-square max-w-[600px] mx-auto mb-8">
              <div className="grid grid-cols-4 grid-rows-4 gap-2 h-full">
                 {visualGrid.map((idx, k) => {
                    if (idx === -1) {
                       if (k === 5 && chartData) {
                          return (
                             <div key={k} className="col-span-2 row-span-2 relative z-0">
                                <div className="absolute inset-0 m-1 bg-white/60 backdrop-blur-md rounded-[2rem] border-2 border-white flex flex-col items-center justify-center text-center shadow-[inset_0_0_20px_rgba(255,255,255,0.6)]">
                                   <div className="text-3xl font-serif text-slate-800 mb-1">{chartData.baziData.year.gan}{chartData.baziData.year.zhi}</div>
                                   <div className="text-[10px] font-bold text-pink-400 tracking-widest uppercase mb-3 bg-pink-50 px-2 py-0.5 rounded-md">
                                      {chartData.wuxing}局 · 命主{chartData.mingZhu}
                                   </div>
                                   <div className="flex flex-col items-center">
                                      <div className="text-[9px] text-slate-400 mb-0.5">四化天干</div>
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-pink-200">
                                         {chartData.siHuaGan}
                                      </div>
                                   </div>
                                </div>
                             </div>
                          )
                       }
                       return null;
                    }

                    const p = chartData?.palaces[idx];
                    if (!p) return <div key={k}></div>;
                    
                    const isSel = selectedPalaceIndex === idx;
                    const isTri = sanFang.includes(idx) && !isSel;
                    const isMing = p.name === '命宫';

                    return (
                       <div 
                         key={k} // Use K (grid index) to avoid key collision
                         onClick={() => setSelectedPalaceIndex(idx)}
                         className={`
                            relative p-1.5 flex flex-col cursor-pointer transition-all duration-300 rounded-xl overflow-hidden border-[1.5px]
                            ${isSel ? 'bg-white border-pink-400 scale-[1.05] z-20 shadow-xl' : 
                              isTri ? 'bg-pink-50/60 border-pink-200' : 
                              'bg-white/50 border-white hover:bg-white hover:border-pink-100'}
                            ${isMing ? 'ring-2 ring-yellow-300 ring-offset-1 z-10' : ''}
                         `}
                       >
                          <div className="absolute right-0 bottom-0 w-10 h-10 transform translate-x-2 translate-y-2 rotate-[-15deg] pointer-events-none opacity-80">
                             {p.icon}
                          </div>

                          <div className="flex justify-between items-start mb-1 relative z-10">
                             <div className="flex flex-col items-center bg-slate-100/80 px-1 rounded-md">
                                <span className="text-[9px] text-slate-400 font-bold scale-90">{p.stem}</span>
                                <span className="text-[10px] text-slate-600 font-black">{p.branch}</span>
                             </div>
                             <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${isMing ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-600' : 'bg-slate-100/80 text-slate-500'}`}>
                                {p.name}
                             </span>
                          </div>

                          <div className="flex-1 flex flex-col gap-0 relative z-10 pl-0.5">
                             <div className="flex flex-wrap gap-x-1 gap-y-0 leading-none mb-0.5 min-h-[14px]">
                                {p.mainStars.map((s, i) => (
                                   <span key={i} className={`text-[11px] font-black flex items-baseline ${['紫微','天府','太阳','太阴'].includes(s.name) ? 'text-amber-500' : 'text-purple-600'}`}>
                                      {s.name}<span className={`text-[8px] font-normal scale-75 ml-[-1px] ${s.light==='庙'||s.light==='旺'?'text-red-500 font-bold':'text-slate-400'}`}>{s.light}</span>
                                   </span>
                                ))}
                             </div>
                             <div className="flex flex-wrap gap-x-1 leading-none mb-0.5">
                                {p.auxStars.map((s,i)=><span key={i} className="text-[9px] text-blue-500 font-bold scale-[0.95] origin-left">{s.name}</span>)}
                                {p.badStars.map((s,i)=><span key={i} className="text-[9px] text-rose-400 font-bold scale-[0.95] origin-left">{s.name}</span>)}
                             </div>
                             <div className="flex flex-wrap gap-x-1 leading-none opacity-60">
                                {p.smallStars.map((s,i)=><span key={i} className="text-[8px] text-slate-500 scale-90 origin-left">{s.name}</span>)}
                                {p.liuStars.map((s,i)=><span key={i} className="text-[8px] text-indigo-500 scale-90 origin-left font-bold">{s.name}</span>)}
                             </div>
                          </div>

                          <div className="flex justify-end gap-0.5 mt-auto relative z-10 pt-1">
                             {p.mutagens.map((m,i)=>(
                                <span key={i} className={`${m.color} text-white text-[8px] w-3 h-3 flex items-center justify-center rounded-[2px] font-bold shadow-sm`}>{m.name}</span>
                             ))}
                          </div>
                       </div>
                    )
                 })}
              </div>
           </div>
        )}

        {/* Bottom Details */}
        {viewMode !== 'bazi' && chartData && selectedPalaceIndex !== null && (
           <div className="grid md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-6 duration-500 pb-8">
              <div className="bg-white rounded-3xl p-5 shadow-xl shadow-slate-100 border border-slate-50">
                 <h3 className="text-pink-500 font-bold mb-3 flex items-center gap-2 text-sm">
                    <RefreshCw className="w-4 h-4" /> 三方四正全星详情
                 </h3>
                 <div className="space-y-2">
                    {sanFang.map((idx, i) => {
                       const p = chartData.palaces[idx];
                       return (
                          <div key={idx} className={`p-2.5 rounded-2xl flex flex-col gap-1 ${i===0 ? 'bg-pink-50/50 border border-pink-100' : 'bg-slate-50/50 border border-slate-100'}`}>
                             <div className="flex items-center gap-2">
                                 <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${i===0?'bg-pink-200 text-pink-700':'bg-slate-200 text-slate-500'}`}>{i===0?'本宫':i===1?'对宫':'三合'}</span>
                                 <span className="text-xs font-bold text-slate-700">{p.name} ({p.branch})</span>
                             </div>
                             <div className="flex flex-wrap gap-1.5 text-[10px] items-center">
                                {p.mainStars.map(s=><span key={s.name} className="font-bold text-purple-600">{s.name}{s.light&&<span className="text-[8px] text-slate-400 font-normal">({s.light})</span>}</span>)}
                                {p.auxStars.map(s=><span key={s.name} className="text-blue-500">{s.name}</span>)}
                                {p.badStars.map(s=><span key={s.name} className="text-rose-400">{s.name}</span>)}
                                {p.smallStars.map(s=><span key={s.name} className="text-slate-400 scale-90">{s.name}</span>)}
                                {p.liuStars.map(s=><span key={s.name} className="text-indigo-500 font-bold">{s.name}</span>)}
                                {p.mutagens.map(m=><span key={m.name} className={`px-1 rounded text-white ${m.color}`}>化{m.name}</span>)}
                             </div>
                          </div>
                       )
                    })}
                 </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-5 shadow-xl shadow-blue-50 border border-white flex flex-col relative overflow-hidden">
                 <h3 className="text-blue-500 font-bold mb-3 flex items-center gap-2 text-sm z-10">
                    <Sparkles className="w-4 h-4" /> AI 专业命理解析
                 </h3>
                 <div className="flex-1 bg-white/60 border border-blue-100 rounded-2xl p-1 z-10 flex flex-col">
                    <textarea 
                      value={generatePrompt()}
                      readOnly
                      className="flex-1 bg-transparent p-3 text-[10px] text-slate-500 font-mono resize-none outline-none mb-2 min-h-[100px]"
                    />
                    <button 
                      onClick={() => navigator.clipboard.writeText(generatePrompt())}
                      className="mx-3 mb-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Zap className="w-3 h-3" /> 复制专业提示词
                    </button>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default App;