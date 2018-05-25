
import { Picker, Flex, Toast, List, WhiteSpace } from 'antd-mobile';

import ListWrap from '../../../component/List.jsx'
const { Link } = ReactRouterDOM;
const Http = Base
const {Api:URL} = Http.url

import './SpecialList.less'; 

// 剩余课时数选择
const seasons = [
    [
        {label: '0',value: '0',},
        {label: '10',value: '10',},
        { label: '20',value: '20',},
        { label: '30',value: '30',},
        { label: '40',value: '40',},
        { label: '50',value: '50',},
        { label: '60',value: '60',},
        { label: '70',value: '70',},
        { label: '80',value: '80',},
        { label: '90',value: '90',},
    ],
    [
         {label: '10',value: '10',},
         { label: '20',value: '20',},
         { label: '30',value: '30',},
         { label: '40',value: '40',},
         { label: '50',value: '50',},
         { label: '60',value: '60',},
         { label: '70',value: '70',},
         { label: '80',value: '80',},
         { label: '90',value: '90',},
         {label: '100',value: '100',},
    ],
];

class DueList extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            page:1,
            perPage:20,
            listItem:[],
            sValue:'',
            ourHeight:0,
            headerDate:['姓名', '合同价格', '总课时', '剩余课时'],
            load:true,
        }
    }
    
    componentDidMount() {
        const outheight = document.body.clientHeight - document.getElementById('hedder').offsetHeight * 1.87;
        this.setState({ ourHeight: outheight });
    }    

    onload() {
       
        const { sValue, page, perPage } = this.state;
        const paramsstu={
            method:'post',
            formData:true,
            data:{
                page,
                perPage,
                minExistCourse:sValue[0],
                maxExistCourse:sValue[1],
            }
        };

        Http.ajax(`${URL}/changgui/contracts/list`,paramsstu).then(res=>{
            if(res.code==0){
                if(res.data.contracts.length>0){
                    if(page==1){
                        this.setState({
                            listItem:res.data.contracts,
                            load:true
                        })
                    } else {
                        this.setState({
                            listItem:this.state.listItem.concat(res.data.contracts),
                            load:true
                        })
                    }
                } else {
                    if(page==1){
                        Toast.info('暂无数据', 1);
                        this.setState({
                            listItem:[]
                        })
                    }else{
                        Toast.info('没有更多数据啦', 1);
                    }
                }
            }
               
          });
    }

    onEndReached(v) { 

        const { sValue, page, perPage } =this.state;
        
        if(Number(v[0]) > Number(v[1])) {
            Toast.info('请选择正确的数据', 1);
            return false;
        }

        this.setState({
            sValue: v,
            page: 1,
            perPage: 20,
        }, () => this.onload() );
    }

    //渲染列表
    _renderList(data){
        return(
            data.map((item,index) => {
                return (
                    <Link key = { 'list' + index } to = { `/ContractDetail/${item.id}` } >
                        <Flex>
                            <Flex.Item>
                                {   
                                      item.studentName.map((name,index) => {
                                        return <span key={ index }>
                                            {
                                                index > 0 && '/'
                                            }
                                            <span>{ name }</span>
                                        </span>
                                    })
                                }
                            </Flex.Item>
                            <Flex.Item>{item.contractAmount}</Flex.Item>
                            <Flex.Item>{item.totalCourse}</Flex.Item>
                            <Flex.Item>{item.existCourse}</Flex.Item>
                        </Flex>
                    </Link>
                )
            })
        )
    }

    //滑到底部
    _slideLast(){
        const {page,load}=this.state
        if(load){
            this.setState({
              page:page+1,
              load:false,
            },()=>{
              this.onload();
            })
        }
    }
  
    render(){
        const { listItem, headerDate, ourHeight } = this.state;
        console.log(ourHeight)
        return(           
            <div id="special-list">
                <div id="hedder">
                    <Picker
                        data={ seasons }
                        title="请选择课时数"
                        cascade={ false }
                        value={ this.state.sValue }
                        onChange={(v)=>this.onEndReached(v)}
                    >
                    <List.Item arrow="horizontal" >请选择课时数</List.Item>
                    </Picker>
                </div>
                <ListWrap
                    wrapHeight={ ourHeight }
                    isShowHeader={ true }
                    data = { listItem }
                    headerDate={ headerDate }
                    renderList={ this._renderList.bind(this) }
                    slideLast={ this._slideLast.bind(this) }
                />
            </div>
        );
    }
}

module.exports = DueList;