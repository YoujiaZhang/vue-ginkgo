<template>
  <div>
    <a-card class="community-norms" :bordered="false">
      <a-card-meta>
        <div class="community-norms-title" slot="title">社区规范</div>
        <div slot="description">
          <van-collapse v-model="activeNames">
            <van-collapse-item name="1">
              <span class="community-norms-item-title" slot="title">
                一、价值观
              </span>
              <p>本平台倡导用户发布符合当代社会主流价值观的内容。</p>
              <ul>
                <li>遵守宪法和法律法规</li>
                <li>践行社会主义核心价值观</li>
                <li>弘扬爱国主义、集体主义和社会主义</li>
                <li>传播正确的历史观、民族观、国家观和文化观</li>
                <li>弘扬中华民族优秀传统文化</li>
                <li>弘扬社会公德、职业道德、家庭和个人美德，尊重公序良俗</li>
                <li>弘扬科学精神、普及科学知识</li>
                <li>提倡积极健康向上的时代风尚和生活方式</li>
              </ul>
            </van-collapse-item>
            <van-collapse-item name="2">
              <span class="community-norms-item-title" slot="title">
                二、法律法规
              </span>
              <p>
                本平台对于社区内违反法律法规、危害国家及社会安全的行为，将采用最严格的管理办法，予以杜绝。
              </p>
              <p><strong>(一) 遵守基本准则</strong></p>
              <p>平台禁止发布和传播包含下列信息的内容：</p>
              <ul>
                <li>违反宪法所确定的基本原则的</li>
                <li>
                  危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的
                </li>
                <li>损害国家荣誉和利益的，如损害国旗国徽形象的</li>
                <li>煽动民族仇恨、民族歧视，破坏民族团结的</li>
                <li>破坏国家宗教政策，宣扬邪教和封建迷信的</li>
                <li>散布谣言，扰乱社会秩序，破坏社会稳定的</li>
                <li>散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的</li>
                <li>侮辱或者诽谤他人，侵害他人合法权益的</li>
                <li>
                  宣扬恐怖主义、极端主义或者煽动实施恐怖活动、极端主义活动的
                </li>
                <li>
                  侮辱滥用英烈形象，否定歪曲英烈事迹，美化或粉饰侵略者和侵略战争行为的
                </li>
                <li>
                  攻击诋毁党和国家领导人，捏造领导人负面信息，滥用领导人形象的
                </li>
                <li>
                  违背公序良俗的内容，如低俗婚闹等·含有法律、行政法规禁止的其他内容的
                </li>
              </ul>
              <p><strong>(二) 抵制一切违法信息</strong></p>
              <ul>
                <li>禁止传播违法内容</li>
              </ul>
              <ol>
                <li class="ql-indent-1">
                  涉及违禁物品，包括但不限于:毒品、违禁药物、违法工具等，如大麻、鸦片、处方药物、投资理财产品、假币、枪支、烟草、爆炸物、翻墙软件、外挂程序等其他内容
                </li>
                <li class="ql-indent-1">
                  涉及违禁活动，包括但不限于:有关传销、胎儿性别鉴定、售卖假货等其他内容
                </li>
              </ol>
              <ul>
                <li>禁止发布欺诈或赌博信息</li>
              </ul>
              <ol>
                <li class="ql-indent-1">
                  发布欺诈信息，如假冒官方客服、正规网站，以短信、站内私信或链接等形式提示虚假中奖信息，设计“杀猪盘"类欺诈行为等
                </li>
                <li class="ql-indent-1">
                  提供赌博交易平台信息或赌博性质类服务，如赌博平台链接、币商、中介、游戏币回收等
                </li>
                <li class="ql-indent-1">
                  涉及赌博技巧、赌博器具等赌博内容，如老虎机、透视扑克等
                </li>
              </ol>

              <p><strong>(三) 抵制一切色情低俗内容</strong></p>
              <p>禁止发布、传播的信息包括但不限于:</p>
              <ul>
                <li>直接暴露和描写人体性部位的内容</li>
                <li>表现或隐晦表现性行为、具有挑逗性或者侮辱性的内容</li>
                <li>
                  以带有性暗示、性挑逗的语言描述性行为、性过程、性方式的内容
                </li>
                <li>全身或者隐私部位未着衣物，仅用肢体掩盖隐私部位的内容</li>
                <li>
                  带有侵犯个人隐私性质的走光、偷拍、漏点等内容·以庸俗和挑逗性标题吸引点击的内容
                </li>
                <li>
                  相关部门禁止传播的色情和有伤社会风化的文字、音视频内容，包括一些电影的删节片段
                </li>
                <li>传播一夜情、换妻、性虐待等的有害信息</li>
                <li>情色动漫、小说</li>
                <li>宣扬暴力、恶意谩骂、侮辱他人等的内容</li>
                <li>非法的性药品广告和性病治疗广告等相关内容</li>
                <li>恶意传播侵害他人隐私的内容</li>
                <li>推介淫秽色情网站和网上低俗信息的链接、图片、文字等内容</li>
              </ul>
            </van-collapse-item>
            <van-collapse-item name="3">
              <span class="community-norms-item-title" slot="title">
                三、不当行为
              </span>
              <p>
                本平台不鼓励发布不友好、欺骗或危险行为的内容，禁止任何作弊信息及行为，包括但不限于以下内容:
              </p>
              <p><strong>(一) 不友好/不合适的内容</strong></p>
              <ul>
                <li>
                  发布含人身攻击、骚扰他人的内容，如辱骂、侮辱、恶意引战、故意骚扰等
                </li>
                <li>
                  发布含不文明的行为，如禁烟场所吸烟、妨碍导盲犬、随地吐痰等
                </li>
                <li>
                  发布严重影响用户体验的内容，如首图血腥恐怖、标题党、图文不符等
                </li>
                <li>
                  分享的产品和内容无相关性、无真实体验经历、未还原真实感受、过分参照商家指引或使用过多官方宣传语句
                </li>
                <li>发布其他不符合大众审美的内容</li>
              </ul>
              <p><strong>(二) 欺骗行为</strong></p>
              <ul>
                <li>
                  编造公众人物的社会谣言，如绝症、去世或其他有违事实的信息
                </li>
                <li>
                  发布违背科学常识的内容，如在食品安全、健康养生等领域发布已被官方或权威机构辟谣的内容
                </li>
              </ul>
              <p><strong>(三) 危险行为</strong></p>
              <ul>
                <li>
                  易引人模仿的危险行为，如危险驾驶车辆，不当使用明火、干扰电梯等
                </li>
                <li>
                  无安全提示、无防护措施的危险行为，如无提示的极限运动、无防护措施的高空行为等
                </li>
              </ul>
            </van-collapse-item>
            <van-collapse-item name="4">
              <span class="community-norms-item-title" slot="title">
                四、违规处理
              </span>
              <p><strong>(一) 认定标准</strong></p>
              <p>人工排查发现违反本规范情形的</p>
              <p><strong>(二) 违规处理措施</strong></p>
              <ol>
                <li>
                  内容处理：扣除作弊数据、限制展示范围、禁止展示、依法追究法律责任
                </li>
                <li>
                  账号处理：限制账号功能、限制展示范围、账号禁言、账号封禁、依法追究法律责任
                </li>
              </ol>
            </van-collapse-item>
          </van-collapse>

          <div class="foot">
            <p>当用户违反社区规范，平台将对违规内容和用户做相应处理及通知。对处理结果有任何异议，均可通过账号申诉进行反馈。</p>
            <p><br></p>
            <p>同时，维护社区环境离不开各位用户的共同努力，我们欢迎用户们对任何可能违规的内容进行一键举报。</p>
            <p><br></p>
            <p>平台将根据法律法规和社区管理经验，不断调整和修改社区规范。为维护社区良好氛围，任何有违社区规范或扰乱社区生态秩序的行为，平台有权依据社区规范进行处理。</p>
            <div style="text-align: center;margin-top:25px;">
                <span style="color:#888888;font-size: 12px"> - THE END - </span>
            </div>
          </div>
        </div>
      </a-card-meta>
    </a-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeNames: ["1",'2','3','4'],
    };
  },
};
</script>

<style scoped>
.community-norms {
  width: 100%;
}
.community-norms-title {
  font-size: 18px;
  font-weight: 800;
  padding: 10px;
  text-align: center;
}
.community-norms-item-title {
  font-size: 16px;
  font-weight: 600;
}
.foot {
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 150px;
  margin-top: 20px;
  color: #666;
}
</style>