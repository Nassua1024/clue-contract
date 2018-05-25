
import { Flex, Button, Toast } from 'antd-mobile';
import * as action from '../../../../redux/action/action'

import './FreezeContract.less'; 

const Http = Base
const {Api:URL} = Http.url
const { connect } = ReactRedux


class FreezeContract extends React.Component {
	constructor(props) {
    	super(props);
	    this.state = {
	    	dataTime:['一个月','二个月','三个月','四个月','五个月','六个月','七个月','八个月','九个月'],
	    	selectTime:'', //选择的冻结时常
	    	contractId:props.match.params.contractId, //合同id
	    	selectData:''
	    };
  	}
  	
   	handleClick(item,index){
   		this.setState({
   			selectTime:item,
   			selectData:index+1
   		});
   	}

   	commit(){
   		const { selectTime,contractId,selectData} = this.state;
   		if(selectTime === ''){
   			Toast.info('请选择冻结时常',1);
   			return false;
   		}else if(contractId==null){
            Toast.info('无效合同',1);
            return false;
        }else{
			const promes={
				method:'post',
				formData:true,
				data:{
					month:selectData,
					contractId:contractId
				}
			}
			Http.ajax(`${URL}/contracts/freeze-contract`,promes).then((res)=>{
				 if(res.code==0){
				   this.props.history.push(`/ContractDetail/${contractId}`)
				  }
			})
   		}
   	}

	render(){
		const { dataTime, selectTime } = this.state;
		return(
			<div id='freeze-contract' className="base-css">
				<div className="title"><i></i><h3>申请冻结</h3></div>
				<p className="type">冻结时长</p>
				<Flex wrap="wrap" className="single-select">
					{
						dataTime.map((item,index) => {
							var active = selectTime === item ? 'active' : '';
							return(
								<div key={ index } onClick={ () => this.handleClick(item,index) } className={ active }>{ item }</div>
							)
						})
					}
				</Flex>
				<Button className="btn-css" onClick={ () => this.commit() }>确认</Button>
			</div>
		)
	}
}
const mapStateToProps = (state) => ({
    ConcernLabels: state.ConcernLabels
})

const FREEzeContract = connect(
    mapStateToProps,
    action
)(FreezeContract)
export default  FREEzeContract;