import Vue from 'vue';

// 导入阿里图标库
import { Icon } from 'ant-design-vue';
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_3157150_s601od41mr.js',
});
Vue.component('MyIcon', IconFont);

// 引入Vant组件库
import '../../static/VantReset.less'
import { Tabbar as VantTabbar, TabbarItem as VantTabbarItem } from "vant";
import { Swipe as VantSwipe, SwipeItem as VantSwipeItem } from 'vant';
import { Grid as VantGrid, GridItem as VantGridItem } from 'vant';
import { Cell as VantCell, CellGroup as VantCellGroup } from 'vant';
import { Collapse as VantCollapse, CollapseItem as VantCollapseItem } from 'vant';

import { 
  Tag as VantTag, 
  Icon as VantIcon,
  Badge as VanBage,
  Image as VanImage,
  Field as vantField,
  Search as VanSearch,
  Dialog as VantDialog,
  Overlay as VantOverlay,
  ActionSheet as VantActionSheet,
} from 'vant';

// 全局注册
Vue.use(VantSwipe);
Vue.use(VantSwipeItem);
Vue.use(VantTabbar);
Vue.use(VantTabbarItem);
Vue.use(VantGrid);
Vue.use(VantGridItem);
Vue.use(VantCell);
Vue.use(VantCellGroup);
Vue.use(VantCollapse);
Vue.use(VantCollapseItem);

Vue.use(VantTag);
Vue.use(VantIcon);
Vue.use(VanBage);
Vue.use(VanImage);
Vue.use(VanSearch);
Vue.use(VantDialog);
Vue.use(vantField);
Vue.use(VantOverlay)
Vue.use(VantActionSheet);

// 引入蚂蚁的组件库
import Antd from 'ant-design-vue';
import '../../static/AntReset.less'
Vue.use(Antd);