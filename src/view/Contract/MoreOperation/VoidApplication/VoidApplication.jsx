
import { Button, List, TextareaItem,  Modal, WhiteSpace, WingBlank, Toast} from 'antd-mobile';
import * as action from '../../../../redux/action/action';
import './VoidApplication.less';

const alert=Modal.alert;
const { connect } = ReactRedux;

const Http = Base;
const {Api:URL}=Http.url;

class ApplyRefund extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			marginTop:'',
			contractId:props.match.params.contractId,
			inputVal:'' //合同作废理由 
		};
	}

	componentDidMount(){
		let { marginTop } = this.state;
		console.log(document.getElementById('cont').height)
		marginTop = document.body.clientHeight - document.getElementById('cont').offsetHeight - 186;
		this.setState({
			marginTop
		});		
	}

	alertok(){
		
		const { contractId } = this.state;

		alert('', '合同作废提交成功', [
	        { 
	           text: '查看详情', onPress: () => this.props.history.push(`/ContractDetail/${contractId}`)
	        },
	        {
	           text: '返回列表',onPress: () => this.props.history.push(`/NormalList/all`)
	        },
	    ]);
	};

	commit(){
		
		const { inputVal,contractId } = this.state;
		
		if( inputVal === ''){
			Toast.info('请输入合同作废理由',1);
			return false;
		}else if(contractId==null){
            Toast.info('无效合同',1);
            return false;
        } 

		const promes={
			method:'post',
			formData:true,
			data:{
				contractId:contractId,
				reason:inputVal
			}
		};

		Http.ajax(`${URL}/contracts/abort-contract`,promes).then((res)=>{
			if(res.code==0){
			   if(res.code == 0){
			   		this.alertok();
			   }
			}
		});
	}

	render(){

		const { marginTop } = this.state;
 		
 		return(
			<div className="void-application base-css">
				<div id="cont">
					<div className="title"><i></i><h3>合同申请作废</h3></div>
					<List>
						<TextareaItem
				            placeholder="请输入作废理由"
				            data-seed="logId"
				            autoFocus
				            autoHeight
				            onChange = { (e) => this.setState({ inputVal:e }) } //e表示输入的内容
				        />
			        </List>
				</div>
		        <Button onClick={ () => this.commit() } style={{ marginTop:marginTop }}>提交</Button>
			</div>	
		);
	}
}


const mapStateToProps = (state) => ({
    ConcernLabels: state.ConcernLabels
})

const APPLYRefund = connect(
    mapStateToProps,
    action
)(ApplyRefund)

export default APPLYRefund;