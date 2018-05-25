import { Flex  } from 'antd-mobile';
import './List.less'; 


//--- data 数组（必填）用于渲染liebiao----
//--- wrapHeight 数字（必填） 用于定义滚动区域的高度----
//--- isShowHeader 布尔值（默认false） 用于定义是否显示fixed顶部----
//--- headerDate 数组（渲染fixed顶部，如果isShowHeader为false也不会渲染----
//--- renderList 方法（data作为返回）渲染list----
//--- slideLast 方法（ ）监控组件是否滑动到底部----

class List extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data:this.props.data,
            wrapHeight:this.props.wrapHeight,
            isShowHeader:this.props.isShowHeader,
            headerDate:this.props.headerDate
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            data:nextProps.data,
            wrapHeight:nextProps.wrapHeight
        });
    }

    _renderHeader(){
        const { headerDate, isShowHeader, data  } = this.state;

        if(!isShowHeader && data.length!==0 ) return false
    
        return(
            <Flex className='ht-list-header'>
                {
                    headerDate.length==5?
                    headerDate.map((item,index) => {
                        return(
                            <Flex.Item key={'header'+index}  style={{width:index==0?'18%':index==3?'25%':index==1?'20%':index==2?'19%':'18%' }} >{item}</Flex.Item>
                        );
                    })
                    :
                     headerDate.map((item,index) => {
                        return(
                            <Flex.Item key={'header'+index}>{item}</Flex.Item>
                        );
                    })
                }
            </Flex>
        )
    }

    _renderListItem(){
        const { data } = this.state;
        this.props.renderList(data);
        return this.props.renderList(data);
    }

    _scrollContain(){
        const { wrapHeight } = this.state;
        const contain = this.refs.contain;
        const wrap = this.refs.wrap;
        if(contain.scrollTop+wrapHeight+65>wrap.clientHeight ){
            this.props.slideLast();
        }
    }

    render(){
        const { wrapHeight, isShowHeader, data } = this.state;
    
        return (  
            <div className='ht-list-view'>       
                {
                    isShowHeader && 
                    this._renderHeader()
                }
                <div className='ht-list-contain' ref='contain' onScroll={() => this._scrollContain()} style={{height:wrapHeight}}>
                <div className='ht-list-wrap' ref='wrap'>
                {
                    data.length !==0 &&
                    this._renderListItem()
                }
                {
                    data.length ==0 &&
                    <p className="noData">暂无数据</p>
                }
                </div>
                </div>
            </div>  
        )
    }
}

List.defaultProps = {
    renderList:() => {return },
    slideLast:() => {return },
    wrapHeight:document.documentElement.clientHeight || document.body.clientHeight,
    isShowHeader:false,
    headerDate:[],
    data:[]
};

module.exports = List;
