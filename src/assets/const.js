import moment from "moment";
moment.locale('zh-cn')

const CONST = {
  Tags: [
    {
      name: "萌新",
      color: "#9E9E9E",
      background: "#FAFAFA",
    },
    {
      name: "幼儿园",
      color: "#26C6DA",
      background: "#e6fffb",
    },
    {
      name: "小学生",
      color: "#66BB6A",
      background: "#f6ffed",
    },
    {
      name: "中学生",
      color: "#42A5F5",
      background: "#e6f7ff",
    },
    {
      name: "学士",
      color: "#FFA726",
      background: "#fff7e6",
    },
    {
      name: "硕士",
      color: "#EF5350",
      background: "#fff1f0",
    },
    {
      name: "博士",
      color: "#AB47BC",
      background: "#f9f0ff",
    },
  ],
  Hots: [
    {
      color: "#FF4500",
    },
    {
      color: "#FF6600",
    },
    {
      color: "#FAA90E",
    },
    {
      color: "#FAA90E",
    },
    {
      color: "#FAA90E",
    },
    {
      color: "#FAA90E",
    },
    {
      color: "#FAA90E",
    },
    {
      color: "#FAA90E",
    },
    {
      color: "#FAA90E",
    },
    {
      color: "#FAA90E",
    },
  ],
  EXP: {
    0: 0,
    1: 200,
    2: 1000,
    3: 2333,
    4: 6666,
    5: 16666,
  },
  // 时间转换函数
  renderTime(date) {
    var dateee = new Date(date).toJSON();
    return new Date(+new Date(dateee) + 8 * 3600 * 1000)
      .toISOString()
      .replace(/T/g, " ")
      .replace(/\.[\d]{3}Z/, "");
  },
  getDiffTime(time) {
    let releaseTime = moment(
      this.renderTime(time),
      "YYYY-MM-DD HH:mm:ss"
    ).fromNow();

    let diffTime = moment(moment(time, "YYYY-MM-DD HH:mm:ss")).diff(
      moment(),
      "days"
    );

    if (diffTime <= -6) {
      var year = "";
      if (
        moment(time, "YYYY-MM-DD HH:mm:ss").get("years") !==
        moment().get("years")
      ) {
        year = moment(time, "YYYY-MM-DD HH:mm:ss").get("years");
      }
      return (
        year +
        (moment(time, "YYYY-MM-DD HH:mm:ss").get("month") + 1) +
        "-" +
        moment(time, "YYYY-MM-DD HH:mm:ss").get("date")
      );
    }
    return releaseTime;
  },
  escape2Html(str) {
    var arrEntities = { lt: "<", gt: ">", nbsp: " ", amp: "&", quot: '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
      return arrEntities[t];
    });
  },

  // 复制文案用
  // 用以去除富文本中所有的HTML标签
  removeHTMLTag(str) {
    str = str.replace(/<\/?[^>]*>/g, ""); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, "\n"); //去除行尾空白
    str = str.replace(/&nbsp;/gi, ""); //去掉&nbsp;
    str = str.replace(/\s/g, ""); //将空格去掉
    return str;
  },

  guid() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  },

  dataURLtoFile(dataurl) {
    //将base64转换为文件
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], "filename", { type: mime });
  },

  GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null) context = decodeURIComponent(r[2]);
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined"
      ? ""
      : context;
  },
};
export default CONST;
