import './this.less';
const { parse } = require('rss-to-json');
import React, { PureComponent } from 'react';
import { AutoAvatar } from '../../../components/Avatar';
// import { LightButton } from '../../components/Button';
import { history } from 'umi';
import { Skeleton } from 'antd';
import { LightButton } from '../../../components/Button';


class ViewArticle extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      articleList: [],
    };
    this.onClick = () => { };

  }
  componentDidMount() {
    let Fthis = this;
    let articleList = this.state.articleList;
    this.globalDataUpdater = function (data) {
      let contentPseudoHash = history.location.pathname.split("/")[5]
      try {
        let contentLink = decodeURI(atob(contentPseudoHash));
        let currentArticle = {}
        for (let item of data) {
          if (contentLink === item.link) {
            currentArticle = item
          }
        }
        Fthis.setState({ articleList: data, currentArticle, ts: Math.random() });
      } catch (error) {

      }


    }
    addDataListener(this.globalDataUpdater)
  }
  render() {
    let loading = true
    let title = ""
    let content = <Skeleton avatar paragraph={{ rows: 6 }} />
    let currentItem = {}
    let infobox = ""
    if (typeof (this.state.currentArticle) === "object") {
      loading = false
      if (typeof (this.state.currentArticle.title) === "string") {
        title = this.state.currentArticle.title
        content = <div dangerouslySetInnerHTML={{ __html: this.state.currentArticle.safeHTML }} />
        currentItem = this.state.currentArticle
        infobox = <div className={"ViewArticle-content-infobox"}>
          <div className={"ViewArticle-content-infobox-icon"}>
            <AutoAvatar item={currentItem} size={40} />
          </div>
          <div className={"ViewArticle-content-infobox-data"}>
            <div style={{ fontSize: 14, lineHeight: "18px" }}>{`${currentItem.dataSource} <${currentItem.email}>`}</div>
            <div style={{ fontSize: 12, lineHeight: "15px", marginTop: 2 }}>
              {new Date(currentItem.published).toLocaleString('zh-CN', { weekday: "long" }).replace("星期", "周")}
              {" "}
              {new Date(currentItem.published).toLocaleString('zh-CN', { year: "numeric", month: "numeric", day: "numeric" })}
              {" "}
              {new Date(currentItem.published).toLocaleString('zh-CN', { hour: "numeric", minute: "numeric", hour12: false })}
              {/* {`周一 2021/7/26 19:42`} */}
            </div>
            <div style={{ fontSize: 12, lineHeight: "18px", marginTop: 2 }}>
              <span style={{ fontWeight: 600 }}>{"收件人: "}</span>
              {localStorage.emailAddress || "example@live.com"}

            </div>
          </div>
          <div className={"ViewArticle-content-infobox-action"}>
          </div>
        </div>
      } else {
        title = "出错了"
        content = ""
        currentItem = {}
        infobox = ""
      }
    }
    return (
      <div
        className={'ViewArticle'}
        style={{ width: '100%', height: '100%', verticalAlign: 'top' }}
      >
        <div className={"ViewArticle-topbar"} style={{}}>
          <div className={"ViewArticle-topbar-back"}>
            <LightButton style={{ color: 'var(--neutralSecondary)' }} onClick={() => {
              history.push("/mail/0/inbox")
            }}>{''}</LightButton>


          </div>
          <div className={"ViewArticle-topbar-title"}>{title}</div>
        </div>
        <div className={"ViewArticle-content"} style={{}}>
          {infobox}
          <div className={"ViewArticle-content-html"} style={{ marginLeft: loading ? 0 : undefined }}>
            {content}
          </div>
        </div>


      </div>
    );
  }
}
export default ViewArticle;
