
import { Picker, Flex, Toast, List, WhiteSpace } from 'antd-mobile';

import ListWrap from '../../../component/List.jsx'

const Http = Base;
const { Api:URL } = Http.url;

import './SpecialList.less'; 

const seasons = [
    [
        {label: '0%',value: '0',},
        {label: '10%',value: '0.1',},
        { label: '20%',value: '0.2',},
        { label: '30%',value: '0.3',},
        { label: '40%',value: '0.4',},
        { label: '50%',value: '0.5',},
        { label: '60%',value: '0.6',},
        { label: '70%',value: '0.7',},
        { label: '80%',value: '0.8',},
        { label: '90%',value: '0.9',}
    ],
    [
        {label: '10%',value: '0.1',},
        { label: '20%',value: '0.2',},
        { label: '30%',value: '0.3',},
        { label: '40%',value: '0.4',},
        { label: '50%',value: '0.5',},
        { label: '60%',value: '0.6',},
        { label: '70%',value: '0.7',},
        { label: '80%',value: '0.8',},
        { label: '90%',value: '0.9',},
        {label: '100%',value: '1',}
    ]
];

class SpecialList extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            page:1,
            per_page:20,
            listItem:[],
            sValue:'',
            ourHeight:0,
            headerDate:['姓名','总课时','剩余课时','出勤率']
        }
    }

    componentDidMount(){
        
        const outheight= document.body.clientHeight-document.getElementById('hedder').offsetHeight*1.87;
       
        this.setState({
            ourHeight:outheight
        });
    }

    onload(){

        const {sValue, page, per_page} =this.state;
        const paramsstu={
            method:'post',
            formData:true,
            data:{
                page,
                per_page,
                minRate:sValue[0],
                maxRate:sValue[1],
            }
        };

        Http.ajax(`${URL}/changgui/contracts/attendance-list`,paramsstu).then(res=>{
            if(res.code==0){
                if(res.data.students.length>0){
                    if(page==1){
                        this.setState({
                            listItem:res.data.students
                        });
                    }else{
                        this.setState({
                            listItem:this.state.listItem.concat(res.data.students)
                        });
                    }
                }else{
                    if(page==1){
                        this.setState({
                            listItem:[]
                        });
                    }else{
                        Toast.info('没有更多数据啦', 1);
                    }
                }
            }
        });
    }

    onEndReached(v){

        const {sValue, page, per_page} =this.state;
        
        this.setState({
            sValue:v,
            page:1,
            per_page:20,
        },function() {
            if(v[0] > v[1]){
                Toast.info('请选择正确的方式', 1);
                this.setState({
                    sValue:[],
                    listItem:[]
                })
                return false;
            }else{
                this.onload()
            }
        });
    }

    //渲染列表
    _renderList(data){
        return(
            data.map((item,index) => {
                return (
                    <Link key = { 'list' + index } to = { `/ContractDetail/${item.id}` } >
                        <Flex >
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
                            <Flex.Item> { item.contractDate } </Flex.Item> 
                            <Flex.Item> { item.contractAmount } </Flex.Item> 
                            <Flex.Item> { item.contractStatusName } </Flex.Item> 
                        </Flex> 
                    </Link>
                )
            })
        )
    }

    //滑到底部
    _slideLast(){
        // let { listItem } = this.state;
        // listItem = listItem.concat(listItem)
        this.onload();
        // this.setState({
        //     listItem
        // })
    }
  
    render(){

        const { listItem, headerDate, ourHeight } = this.state;

        return(           
            <div id="special-list">
                <div id="hedder">
                    <Picker
                        data={ seasons }
                        title="请选择出勤率"
                        cascade={ false }
                        value={ this.state.sValue }
                        onChange={(v)=>this.onEndReached(v)}
                    >
                    <List.Item arrow="horizontal" >请选择出勤率</List.Item>
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

module.exports = SpecialList;