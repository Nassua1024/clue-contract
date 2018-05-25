
import React from 'react';
import { Flex } from 'antd-mobile';

import ListWrap from '../../../../component/List.jsx';
import './SpecialContract.less';

const { Link } = ReactRouterDOM;
const Http = Base;
const api = Base.url.Api;

class SpecialContract extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			listData: [], //列表数据
			scrollHeight: 0, //滚动区域高度
			iNow: 0, //tab切换索引
			page: 1, //页数
			per_page: 20, //每页条数
			total: 0, //总条数 
			load: true
		}
	}

	componentWillMount() {
		this.initList(true);	
	}

	/*列表*/
	initList(v) {
		
		const { listData, page, per_page } = this.state;

		const params={
            data: {
            	page,
            	per_page,
            	auditing: v
            }
        };

		Http.ajax(`${api}/changgui/list-contract-specials`,params).then(res => {
			if(res.code == 0) { 
				
				const data = res.data.contractSpecials;

				if(data.length > 0){
                   
                    if(page == 1)
                        this.setState({
                            listData: data,
                            total: res.data.total,
                            load: true
                        });

                    else
                        this.setState({
                            listData: listData.concat(data),
                            load: true
                        });
                    
                }else{
                    
                    if(page == 1)
                        this.setState({
                            listItem:[],
                            load: true
                        });

                    else
                        Toast.info('没有更多数据啦', 1);
                }
			}
		});
	}

	/*tab切换*/
	tabClick(v) {

		const auditing = v == 0 ? true : false 

		this.initList(auditing);

		this.setState({
			iNow: v
		})
	}

	/*计算滚动区域高度*/
	componentDidMount() {
		const scrollHeight = document.body.clientHeight - document.getElementById('tab').offsetHeight - document.getElementById('list-header').offsetHeight;
		this.setState({
			scrollHeight
		});
	}

	/*渲染数据*/
	_renderList(data) {
        return (
            data.map((item, index) => {
                return (
                   <Link key={ index } to={`HandleSpecial`}>
                   		<p>{ item.staffName }</p>
                   		<p>{ item.storeName }</p>
                   		<p>{ item.specialDiscount/10 + '折' }</p>
                   		<p>{ item.specialGiftHour }</p>
                   		<p>{ new Date(item.createTime).Format('yyyy/MM/dd') }</p>
                   </Link>
                )
            })
        );
    }

    /*加载更多*/
    _slideLast() {

        const { total, page, per_page, load }=this.state;
        let pages = Math.ceil(total/per_page);
        
        if(load && page <= pages){
            
            let pagenow = page + 1;
            this.setState({
                page: pagenow,
                load: false
            });

            this.initList();
        }
    }

	render() {

		const { listData, scrollHeight, iNow } = this.state;

		return(
			<div className="special-contract">
				<ul id="tab" className="tab">
					<li className={ iNow == 0 ? 'active' : '' } onClick={ () => this.tabClick(0) }>待处理</li>
					<li className={ iNow == 1 ? 'active' : '' } onClick={ () => this.tabClick(1) } >已处理</li>
				</ul>
				<ul id="list-header" className="list-header">
					<li>cc</li>
					<li>分馆</li>
					<li>金额</li>
					<li>课时</li>
					<li>日期</li>
				</ul>
				<ListWrap 
                    wrapHeight = { scrollHeight } 
                    isShowHeader = { false }
                    data = { listData } 
                    renderList = { this._renderList.bind(this) }
                    slideLast = { this._slideLast.bind(this) }
                /> 
			</div>
		);
	}
}

export default SpecialContract;