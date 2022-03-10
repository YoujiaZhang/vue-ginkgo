import Mock from 'mockjs';
import CONST from '../assets/const'

// MockJS 用于模拟后端接口

Mock.mock(CONST.URL+'/user/get', { //输出数据
    'name': '@name', //随机生成姓名
    //还可以自定义其他数据
});