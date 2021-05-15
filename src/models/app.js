import config from "../config";
import moment from "moment";
const { prefix } = config;
import {
  loginOut,
  queryInitData,
  accountRolesAppmodulesApi,
  queryLoactionCityApi,
} from "../services/login";
import _ from "lodash";
import { removeUserInfo, getOrgIds } from "../utils";
import { currentTermYear } from "../utils/helperValue";

const getCollegeData = (collegeInfo) => {
  const obj = {
    id: 0,
    name: "",
    college: [],
    profession: [],
  };
  let collegeObj = {};
  let professionObj = {};
  _.map(collegeInfo, (value) => {
    switch (value.level) {
      case 0:
        obj.name = value.orgName;
        obj.id = value.orgId;
        break;
      case 1:
        collegeObj = {
          id: value.orgId,
          name: value.orgName,
          isDisabled: false,
          isDefault: false,
        };
        obj.college.push(collegeObj);
        break;
      case 2:
        professionObj = {
          id: value.orgId,
          name: value.orgName,
          pId: value.pId,
          isDisabled: false,
          isDefault: false,
        };
        obj.profession.push(professionObj);
        break;
      default:
        break;
    }
  });
  return obj;
};

const getInfoData = (collegeInfo) => {
  const data = getCollegeData(collegeInfo);
  const collegeData = {
    id: data.id,
    name: data.name,
  };
  const collegeTree = collegeInfo.filter((v) => v.pid !== 0);
  collegeData.college = collegeTree;
  return collegeData;
};

const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
const termYearCookie = JSON.parse(
  window.localStorage.getItem("currentTermYear")
);
if (termYearCookie) {
  currentTermYear.currentTerm = termYearCookie.currentTerm;
  currentTermYear.currentYear = termYearCookie.currentYear;
  currentTermYear.startDate = termYearCookie.startDate;
}

export default {
  namespace: "app",
  state: {
    user: userInfo,
    collegeOrgId: userInfo ? parseInt(getOrgIds().collegeOrgId, 10) : null,
    fstOrgId: userInfo ? getOrgIds().fstOrgId : null,
    secOrgId: userInfo ? getOrgIds().secOrgId : null,
    menuPopoverVisible: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === "true",
    darkTheme: true, // localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    logoutSuccess: false,
    startDate: moment().subtract(30, "days").format("YYYY-MM-DD"),
    endDate: moment().format("YYYY-MM-DD"),
    collapsed: false,
    initOrgListStatus: false,
    loactionCity: {},
    weather: {},
    currentTermYear: currentTermYear,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      let tid;
      window.onresize = () => {
        clearTimeout(tid);
        tid = setTimeout(() => {
          dispatch({ type: "changeNavbar" });
        }, 300);
      };
      history.listen((location) => {
        if (location.pathname === "/v2-time-board") {
          const user = JSON.parse(window.localStorage.getItem("userInfo"));
          if (user) {
            dispatch({ type: "user", user: user });
          }
        }
      });
    },
  },
  effects: {
    *queryInitData(action, { call, put }) {
      const initOrgList = yield call(queryInitData);
      const collegeData = getInfoData(initOrgList.data.userOrgList);
      yield put({
        type: "initOrgListSuccess",
        data: initOrgList.data,
        collegeData: collegeData,
      });
    },
    *changeNavbar({ payload }, { put, select }) {
      const { app } = yield select();
      const isNavbar = document.body.clientWidth < 769;
      if (isNavbar !== app.isNavbar) {
        yield put({ type: "handleNavbar", payload: isNavbar });
      }
    },
    *logout(action, { call, put }) {
      yield call(loginOut);
      yield put({ type: "loginOutSuccess" });
    },
    // /* 查询用户权限数据 */
    // * accountRolesAppmodules(action, { call, put }) {
    //   const res = yield call(accountRolesAppmodulesApi)
    //   yield put({
    //     type: 'accountRolesAppmodulesSuccess',
    //     data: res.data,
    //   })
    // }
  },
  reducers: {
    user(state, action) {
      return {
        ...state,
        user: action.user,
        loginOutSuccess: false,
      };
    },
    switchSider(state) {
      localStorage.setItem(`${prefix}siderFold`, !state.siderFold);
      return {
        ...state,
        siderFold: !state.siderFold,
      };
    },

    switchTheme(state) {
      localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme);
      return {
        ...state,
        darkTheme: !state.darkTheme,
      };
    },

    switchMenuPopver(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      };
    },

    handleNavbar(state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      };
    },

    handleNavOpenKeys(state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      };
    },

    // 注销
    loginOutSuccess(state) {
      removeUserInfo();
      return {
        ...state,
        user: null,
        logoutSuccess: true,
      };
    },

    // 设置登录人的Ids
    setCollegeIds(state, action) {
      return {
        ...state,
        collegeOrgId: action.paramIds.collegeOrgId,
        fstOrgId: action.paramIds.fstOrgId,
        secOrgId: action.paramIds.secOrgId,
      };
    },
    // 选择学院信息
    collegeChange(state, action) {
      return {
        ...state,
        fstOrgId: action.id,
      };
    },
    // 更换开始时间
    changeStartDate(state, action) {
      return {
        ...state,
        startDate: action.startDate,
      };
    },
    // 更换结束时间
    changeEndDate(state, action) {
      return {
        ...state,
        endDate: action.endDate,
      };
    },
    // 更换导航状态
    setCollapsedStatus(state, action) {
      return {
        ...state,
        collapsed: action.param.collapsed,
      };
    },
    // 查询机构数据成功
    initOrgListSuccess(state, action) {
      const { data } = action;
      const initUserInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      const userSource = {
        ...initUserInfo,
        userOrgList: action.collegeData,
        orgSpecialties: data.orgSpecialties,
        orglist: data.userOrgList,
      };
      if (data.courseTerm) {
        if (data.courseTerm.term) {
          currentTermYear.currentTerm = data.courseTerm.term;
        }
        if (data.courseTerm.year) {
          currentTermYear.currentYear = data.courseTerm.year;
        }
        if (data.courseTerm.startDate) {
          currentTermYear.startDate = data.courseTerm.startDate;
        }
      }
      window.localStorage.setItem("userInfo", JSON.stringify(userSource));
      window.localStorage.setItem(
        "currentTermYear",
        JSON.stringify(currentTermYear)
      );
      return {
        ...state,
        initOrgListStatus: true,
        user: userSource,
        collegeOrgId: initUserInfo
          ? parseInt(getOrgIds().collegeOrgId, 10)
          : null,
        fstOrgId: initUserInfo ? getOrgIds().fstOrgId : null,
        secOrgId: initUserInfo ? getOrgIds().secOrgId : null,
        initCourseTerm: data.courseTerm,
      };
    },
    savaLocationAndWeather(state, action) {
      const {
        loactionCity,
        weather: { lives },
      } = action.data;
      return {
        ...state,
        loactionCity,
        weather: lives && lives[0],
      };
    },
    // /* 查询用户权限数据成功 */
    // accountRolesAppmodulesSuccess(state, action) {
    //   const {
    //     data,
    //   } = action
    //   const initUserInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    //   const userSource = {
    //     ...initUserInfo,
    //     role: {
    //       ...initUserInfo.role,
    //       rules: data
    //     }
    //   }
    //   window.localStorage.setItem('userInfo', JSON.stringify(userSource))
    //   return {
    //     ...state,
    //     user: userSource
    //   }
    // }
  },
};
