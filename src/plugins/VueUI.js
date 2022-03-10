import Vue from 'vue';

// 导入阿里图标库
import { Icon } from 'ant-design-vue';
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_3157150_yr0uc9cw6d.js',
});
Vue.component('MyIcon', IconFont);

// 引入Vant组件库
import '../../static/vantReset.less'
import { Tabbar as VantTabbar, TabbarItem as VantTabbarItem } from "vant";
import { Grid as VantGrid, GridItem as VantGridItem } from 'vant';
import { Image as VanImage } from 'vant';
import { Tag as VantTag, ActionSheet as VantActionSheet } from 'vant';
import { Swipe as VantSwipe, SwipeItem as VantSwipeItem } from 'vant';
import { NoticeBar as VantNoticeBar } from 'vant';
import { Dialog as VantDialog } from "vant";
import { Field as vantField } from 'vant';
import { Divider, Overlay as VantOverlay  } from "vant";
import { Area as VantArea } from 'vant';
import { SwipeCell as VantSwipeCell } from 'vant';
import { Icon as VantIcon } from 'vant';
import { Badge as VanBage } from 'vant';
import { Search } from 'vant';
import { PullRefresh } from 'vant';


Vue.use(Search);
Vue.use(PullRefresh);
Vue.use(VantIcon);

// 全局注册
Vue.use(VantSwipe);
Vue.use(VantSwipeItem);
Vue.use(VantNoticeBar);
Vue.use(VantTag);
Vue.use(VantTabbar);
Vue.use(VantTabbarItem);
Vue.use(VantGridItem);
Vue.use(VantGrid);
Vue.use(VanImage);
Vue.use(VantActionSheet);
Vue.use(VantDialog);
Vue.use(vantField);
Vue.use(Divider);
Vue.use(VantOverlay)
Vue.use(VantArea)
Vue.use(VantSwipeCell);
Vue.use(VanBage);

// 引入蚂蚁的组件库
import Antd from 'ant-design-vue';
import '../../static/reset.less'
Vue.use(Antd);