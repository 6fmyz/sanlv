import moment from "moment";

const startYearList = (num) => {
  const currentYear = parseInt(moment().year());
  const n = num || 10;
  const result = "0"
    .repeat(n)
    .split("")
    .map((item, index) => {
      return String(currentYear - index);
    });
  result.unshift(null);
  return result;
};

const getCurrentTerm = () => {
  const currentMonth = moment().month();
  let currentTeam;
  switch (currentMonth) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      currentTeam = "春";
      break;
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 0:
      currentTeam = "秋";
      break;
    default:
      currentTeam = "其他";
  }
  return currentTeam;
};

/* 
  时间时长格式化显示
*/
const formatDuration = (duration) => {
  const daySeconds = 24 * 60 * 60;
  const hourSeconds = 60 * 60;
  const minutesSeconds = 60;
  let day;
  let hour;
  let minutes;
  let seconds;
  if (typeof duration === "number" && duration) {
    day = Math.floor(duration / daySeconds);
    hour = Math.floor((duration - day * daySeconds) / hourSeconds);
    minutes = Math.floor(
      (duration - day * daySeconds - hour * hourSeconds) / minutesSeconds
    );
    seconds =
      duration -
      day * daySeconds -
      hour * hourSeconds -
      minutes * minutesSeconds;
    return `${day ? `${day}天` : ""}${hour ? `${hour}时` : ""}${
      minutes ? `${minutes}分` : ""
    }${seconds ? `${seconds}秒` : ""}`;
  } else {
    return "-";
  }
};

// 输入框onchange方法debounce防抖
const inputDebounce = (func, time) => {
  let duration;
  return function () {
    const ctx = this;
    const args = arguments;
    args[0].persist();
    if (duration) {
      clearTimeout(duration);
    }
    duration = setTimeout(() => {
      func.apply(ctx, args);
    }, time);
  };
};

const statsType = {
  sign: {
    label: "签到",
    color: "#5C62F9",
    bgColor: "rgba(92, 98, 249, 0.25)",
    tagLabel: "签到次数较少",
  },
  answer: {
    label: "答题",
    color: "#83BCFF",
    tagLabel: "答题率较低",
    bgColor: "rgba(131, 188, 255, 0.25)",
  },
  discussion: {
    label: "讨论",
    color: "#86E8C5",
    tagLabel: "讨论参与率较低",
    bgColor: "rgba(134,232,197,0.25)",
  },
  dianda: {
    label: "点答",
    color: "#5CDE80",
    tagLabel: "点答参与率较低",
  },
  studypack: {
    label: "拓展学习",
    color: "#E14D4D",
    tagLabel: "拓展学习参与率较低",
  },
  assessment: {
    label: "互评",
    color: "#E39075",
    tagLabel: "互评参与率较低",
  },
  qa: {
    label: "答疑",
    color: "#FFD360",
    tagLabel: "答疑参与率较低",
    bgColor: "rgba(255,211,96,0.25)",
  },
  weike: {
    label: "微课",
    color: "#FF8A00",
    tagLabel: "微课参与率较低",
  },
  homework: {
    label: "作业",
    color: "#D25CE6",
    tagLabel: "作业完成次数较少",
    bgColor: "rgba(210,92,229,0.25)",
  },
  courseware: {
    label: "课件",
    color: "#FD95F2",
    tagLabel: "课件参与率较低",
  },
  groupDiscussion: {
    label: "分组研讨",
    color: "#C85C46",
    bgColor: "rgba(200, 92, 70, 0.25)",
    tagLabel: "分组研讨参与率较低",
  },
};

// 过滤当前课堂活跃的课堂活动维度
const filterStatsType = (activityStats) => {
  let _statsType = {};
  if (activityStats) {
    Object.keys(statsType).forEach((key) => {
      if (
        activityStats[`${key}Rate`] &&
        parseFloat(activityStats[`${key}Rate`]) !== -1
      ) {
        _statsType[key] = statsType[key];
      }
    });
  }
  return _statsType;
};

const getNumber = (text) => {
  let _text;
  if (!text || parseFloat(text) === -1) {
    _text = "-";
  } else if (parseFloat(text) === 0) {
    _text = "0%";
  } else {
    _text = `${parseFloat(text).toFixed(1)}%`;
  }
  return _text;
};

const currentTermYear = {
  currentTerm: getCurrentTerm(),
  currentYear: moment().year(),
  startDate: moment().format("YYYY-MM-DD"),
};

export default {
  startYearList,
  getCurrentTerm,
  formatDuration,
  inputDebounce,
  statsType,
  getNumber,
  filterStatsType,
  currentTermYear,
};
